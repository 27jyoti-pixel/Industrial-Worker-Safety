const Hospital = require('../models/hospitalModel');
const ApiError = require('../utils/ApiError');
const axios = require('axios');


class HospitalService {


    /**
     * Create a new hospital record
     */
    async createHospital(hospitalData) {

        const { registrationNumber } = hospitalData;


        if (registrationNumber) {

            const existing =
            await Hospital.findOne({
                registrationNumber
            });


            if(existing){

                throw new ApiError(
                    409,
                    `Hospital with registration number '${registrationNumber}' already exists`
                );

            }

        }


        const hospital =
        await Hospital.create(hospitalData);


        return hospital;

    }




    /**
     * Get all hospitals with search and pagination
     */
    async getAllHospitals(queryParams) {


        const {
            city,
            search,
            facility,
            page = 1,
            limit = 10
        } = queryParams;



        const filter = {
            isActive:true
        };



        if(city){

            filter['address.city'] = {
                $regex:city,
                $options:'i'
            };

        }



        if(facility){

            filter.facilities = {
                $regex:facility,
                $options:'i'
            };

        }



        if(search){

            filter.$or = [

                {
                    name:{
                        $regex:search,
                        $options:'i'
                    }
                },

                {
                    'address.city':{
                        $regex:search,
                        $options:'i'
                    }
                },

                {
                    'address.street':{
                        $regex:search,
                        $options:'i'
                    }
                }

            ];

        }



        const pageNum =
        parseInt(page,10);


        const limitNum =
        parseInt(limit,10);


        const skip =
        (pageNum-1)*limitNum;



        const hospitals =
        await Hospital.find(filter)
        .sort({name:1})
        .skip(skip)
        .limit(limitNum);



        const total =
        await Hospital.countDocuments(filter);



        return {

            hospitals,

            pagination:{

                total,

                page:pageNum,

                limit:limitNum,

                totalPages:
                Math.ceil(total/limitNum)

            }

        };


    }







    /**
     * Get live nearby hospitals
     * Using OpenStreetMap Overpass API
     */
    async getNearbyHospitals(
        latitude,
        longitude,
        radiusInKm = 10
    ){
        if(!latitude || !longitude){

            throw new ApiError(
                400,
                "Latitude and longitude required"
            );

        }
const query = `

[out:json][timeout:15];

(
node["amenity"="hospital"]
(around:${radiusInKm*1000},${latitude},${longitude});

way["amenity"="hospital"]
(around:${radiusInKm*1000},${latitude},${longitude});

);

out center tags;

`;
        try{
            const response =
            await axios.get(
               "https://overpass-api.de/api/interpreter",
                {
                    params:{
                        data:query
                    },
                    timeout:30000,
                    headers:{
                        "User-Agent":
                        "Industrial-Worker-Safety-App"
                    }
                }
            );

            const hospitals =

            response.data.elements.map(
            hospital=>{


                const lat =
                hospital.lat ||
                hospital.center?.lat;



                const lng =
                hospital.lon ||
                hospital.center?.lon;




                return {


                    id:hospital.id,



                    name:
                    hospital.tags?.name ||
                    "Unnamed Hospital",


                  phone:
                  hospital.tags?.phone ||
                  hospital.tags?.["contact:phone"] ||
                  hospital.tags?.["contact:mobile"] ||
                  hospital.tags?.mobile ||
                  "Not available",




                    speciality:
                    hospital.tags?.healthcare ||
                    hospital.tags?.["healthcare:speciality"] ||
                    hospital.tags?.speciality ||
                    "General Hospital",


                  address:
                  hospital.tags?.["addr:full"] ||
                  [
                  hospital.tags?.["addr:housenumber"],
                  hospital.tags?.["addr:street"],
                  hospital.tags?.["addr:city"],
                  hospital.tags?.["addr:state"]
                  ]
                  .filter(Boolean)
                  .join(", ")
                  ||
                  hospital.tags?.["is_in"]
                  ||
                  "Address not available",

                  openingHours:
                  hospital.tags?.opening_hours ||
                  hospital.tags?.["opening_hours:covid19"] ||
                  "Timing unavailable",

                  latitude:lat,
                  longitude:lng
                };



            });

            const validHospitals = hospitals.filter(
    hospital =>
    hospital.latitude &&
    hospital.longitude
);


return validHospitals.slice(0,10);





        }

        catch(error){


            console.log(

                "OSM ERROR:",

                error.response?.data ||
                error.message

            );



            throw new ApiError(

                500,

                "Unable to fetch live nearby hospitals"

            );


        }



    }








    /**
     * Get hospital by ID
     */
    async getHospitalById(hospitalId){


        const hospital =
        await Hospital.findById(hospitalId);



        if(!hospital){

            throw new ApiError(
                404,
                "Hospital not found"
            );

        }


        return hospital;


    }








    /**
     * Emergency contacts
     */
    async getEmergencyContacts(hospitalId){


        const hospital =
        await Hospital.findById(hospitalId)
        .select(
            'name phone emergencyContacts ambulanceNumbers address'
        );



        if(!hospital){

            throw new ApiError(
                404,
                "Hospital not found"
            );

        }



        return {


            hospitalName:hospital.name,

            primaryPhone:hospital.phone,

            emergencyContacts:
            hospital.emergencyContacts,


            ambulanceNumbers:
            hospital.ambulanceNumbers,


            address:
            hospital.address


        };


    }








    /**
     * Update hospital
     */
    async updateHospital(
        hospitalId,
        updateData
    ){


        const hospital =
        await Hospital.findByIdAndUpdate(

            hospitalId,

            updateData,

            {
                new:true,
                runValidators:true
            }

        );



        if(!hospital){

            throw new ApiError(
                404,
                "Hospital not found"
            );

        }



        return hospital;


    }







    /**
     * Delete hospital
     */
    async deleteHospital(hospitalId){


        const hospital =
        await Hospital.findByIdAndDelete(hospitalId);



        if(!hospital){

            throw new ApiError(
                404,
                "Hospital not found"
            );

        }



        return {

            message:
            "Hospital profile deleted successfully"

        };


    }



}


module.exports = new HospitalService();
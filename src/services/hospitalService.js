const Hospital = require('../models/hospitalModel');
const ApiError = require('../utils/ApiError');
const axios = require('axios');
require('dotenv').config();

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
 * Using Geoapify Places API
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


    try{

        const response = await axios.get(
            "https://api.geoapify.com/v2/places",
            {
                params:{
                    categories:"healthcare.hospital",
                    filter:`circle:${longitude},${latitude},${radiusInKm * 1000}`,
                    limit:10,
                    apiKey:process.env.GEOAPIFY_API_KEY
                }
            }
        );


        const hospitals = response.data.features.map(
            hospital=>{

                const properties = hospital.properties;
                console.log("PLACE ID:", properties.place_id);
                const coordinates = hospital.geometry.coordinates;


                return {

                    id: properties.place_id,

                    name:
                    properties.name ||
                    "Unnamed Hospital",


                    address:
                    properties.formatted ||
                    "Address not available",


                    latitude:
                    coordinates[1],


                    longitude:
                    coordinates[0],


                    speciality:
                    properties.categories?.join(", ") ||
                    "Hospital",


                    phone:
                    properties.contact?.phone ||
                    "Not available",


                    openingHours:
                    properties.opening_hours ||
                    "Timing unavailable"

                };

            }
        );


        return hospitals;


    }
    catch(error){

        console.log(
            "GEOAPIFY ERROR:",
            error.response?.data ||
            error.message
        );


        throw new ApiError(
            500,
            "Unable to fetch nearby hospitals"
        );

    }

}


/**
 * Get detailed hospital information from Geoapify
 */
async getHospitalDetails(placeId){

    try{
        console.log("DETAIL PLACE ID:", placeId);

        const response = await axios.get(
            "https://api.geoapify.com/v2/place-details",
            {
                params:{
                    id: placeId,
                    apiKey: process.env.GEOAPIFY_API_KEY
                }
            }
        );


        const properties = response.data.features[0].properties;


        return {

            name: properties.name,

            address:
            properties.formatted ||
            "Address not available",

            phone:
            properties.contact?.phone ||
            "Phone not available",

            openingHours:
            properties.opening_hours ||
            "Timing unavailable"

        };


    }
    catch(error){

        console.log(
            "GEOAPIFY DETAILS ERROR:",
            error.response?.data ||
            error.message
        );


        throw new ApiError(
            500,
            "Unable to fetch hospital details"
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
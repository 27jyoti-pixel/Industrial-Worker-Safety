import React, { useState, useEffect } from "react";

import GoogleMapComponent from "../components/GoogleMapComponent";

import { useToast } from "../context/ToastContext";
import hospitalService from "../services/hospitalService";

import { Compass } from "lucide-react";

import Card from "../components/common/Card";
import Button from "../components/common/Button";
import SearchBar from "../components/common/SearchBar";
import Breadcrumb from "../components/common/Breadcrumb";


const Hospitals = () => {

  const { showSuccess, showError } = useToast();


  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");

  const [currentPage, setCurrentPage] = useState(1);


  const [nearbyActive, setNearbyActive] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyHospitals, setNearbyHospitals] = useState([]);



  useEffect(() => {
    fetchHospitals();
  }, [currentPage, searchQuery]);



  const fetchHospitals = async () => {

    setLoading(true);

    try {

      const response = await hospitalService.getAllHospitals({

        search: searchQuery,
        page: currentPage,
        limit: 10

      });


      const dataList =
        response.hospitals ||
        response.data ||
        [];


      setHospitals(dataList);


    } catch(error){

      showError(
        error.message || "Failed to fetch hospitals"
      );

    }
    finally{

      setLoading(false);

    }

  };



  const handleNearbySearch = () => {


    if(!navigator.geolocation){

      showError("Geolocation not supported");
      return;

    }


    setLoading(true);



    navigator.geolocation.getCurrentPosition(

      async(position)=>{


        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;


        setUserLocation({
          latitude,
          longitude
        });



        try{


          const response =
            await hospitalService.getNearbyHospitals(
              latitude,
              longitude,
              10
            );


          const nearby =
            response.hospitals ||
            response.data ||
            [];



          setNearbyHospitals(nearby);

          setNearbyActive(true);


          showSuccess(
            "Loaded nearby emergency hospitals"
          );


        }
        catch(error){

          showError(
            error.message ||
            "Failed to load nearby hospitals"
          );

        }
        finally{

          setLoading(false);

        }

      },


      ()=>{

        showError(
          "Unable to get GPS location"
        );

        setLoading(false);

      }

    );

  };



  return (

    <div className="space-y-6">


      <Breadcrumb 
        items={[
          {label:"Hospitals"}
        ]}
      />


      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-2xl font-bold text-slate-900">
            Industrial Hospitals Directory
          </h1>


          <p className="text-sm text-slate-500 mt-1">
            Find nearby emergency hospitals, trauma centers, and ambulance services
          </p>

        </div>


        <Button
          variant="primary"
          icon={Compass}
          onClick={handleNearbySearch}
        >

          Find Nearby Hospitals

        </Button>


      </div>



      <SearchBar

        value={searchQuery}

        onChange={(e)=>
          setSearchQuery(e.target.value)
        }

        placeholder="Search hospitals by name, city, or specialization..."

      />



      <GoogleMapComponent

        hospitals={hospitals}

        userLocation={userLocation}

        showNearby={nearbyActive}

        nearbyHospitals={nearbyHospitals}

      />





      {
        nearbyActive &&
        nearbyHospitals.length > 0 && (


          <Card
            title="Nearby Emergency Hospitals"
            className="mt-6"
          >


          <div className="space-y-4">


          {
            nearbyHospitals.map((hospital)=>(


              <div
                key={hospital.id}
                className="border border-slate-200 rounded-lg p-4"
              >


                <h3 className="font-semibold text-slate-800">

                  🏥 {hospital.name}

                </h3>



                <p className="text-sm text-slate-600 mt-2">

                  📍 {hospital.address || "Address not available"}

                </p>


                <p className="text-sm text-slate-600">

                  ☎️ {hospital.phone || "Phone not available"}

                </p>


               <div className="flex items-center gap-3 mt-5">

<Button
  variant="primary"
  size="sm"
  className="px-5 py-2"
  onClick={()=>{
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${hospital.latitude},${hospital.longitude}`,
      "_blank"
    );
  }}
>
   Get Directions
</Button>


<Button
  variant="primary"
  size="sm"
  className="px-5 py-2"
  onClick={()=>{
    
    const message =
`🚨 Emergency Hospital Location

🏥 Hospital:
${hospital.name}

📍 Address:
${hospital.address}

🗺️ Navigation:
https://www.google.com/maps/dir/?api=1&destination=${hospital.latitude},${hospital.longitude}`;


    window.open(
      `https://wa.me/?text=${encodeURIComponent(message)}`,
      "_blank"
    );

  }}
>
   Share Location
</Button>


</div>


              </div>


            ))
          }


          </div>


          </Card>


        )
      }


    </div>

  );

};


export default Hospitals;
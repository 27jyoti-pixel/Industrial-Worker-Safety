import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap
} from "react-leaflet";

import "leaflet/dist/leaflet.css";
import { Tooltip } from "react-leaflet";
import { useEffect } from "react";


// Auto zoom when nearby hospitals are loaded
const FitBounds = ({ hospitals }) => {

  const map = useMap();

  useEffect(() => {

    if (!hospitals || hospitals.length === 0) return;


    const positions = hospitals
      .map((hospital) => {

        const lat =
          hospital.latitude ??
          hospital.location?.coordinates?.[1];

        const lng =
          hospital.longitude ??
          hospital.location?.coordinates?.[0];


        if (!lat || !lng) return null;


        return [
          Number(lat),
          Number(lng)
        ];

      })
      .filter(Boolean);



    if (positions.length > 0) {

      map.fitBounds(
        positions,
        {
          padding: [50, 50],
          maxZoom: 15
        }
      );

    }


  }, [hospitals, map]);


  return null;

};




const GoogleMapComponent = ({
  hospitals = [],
  nearbyHospitals = [],
  userLocation
}) => {


  const center = userLocation
    ? [
        userLocation.latitude,
        userLocation.longitude
      ]
    : [
        22.3072,
        73.1812
      ];



  return (

    <MapContainer

      center={center}

      zoom={13}

      style={{
        height:"500px",
        width:"100%"
      }}

    >


      <TileLayer

        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"

      />



      {/* USER LOCATION */}

      {
        userLocation && (

          <Marker

            position={[
              userLocation.latitude,
              userLocation.longitude
            ]}

          >

            <Popup>
              Your Current Location
            </Popup>


          </Marker>

        )
      }





      {/* DATABASE HOSPITALS */}

      {
        hospitals.map((hospital)=>{


          const lat =
            hospital.location?.coordinates?.[1];


          const lng =
            hospital.location?.coordinates?.[0];



          if(!lat || !lng)
            return null;



          return (

            <Marker

              key={hospital._id}

              position={[
                Number(lat),
                Number(lng)
              ]}

            >

            <Tooltip permanent direction="top">
            {hospital.name}
            </Tooltip>

              <Popup>

                <h3>
                  🏥 {hospital.name}
                </h3>


                <p>
                  ☎️ {hospital.phone}
                </p>


                <p>
                  📍 {hospital.address?.city},
                  {" "}
                  {hospital.address?.state}
                </p>


              </Popup>


            </Marker>

          );


        })

      }






      {/* LIVE NEARBY HOSPITALS */}

      {
        nearbyHospitals.slice(0,10).map((hospital)=>{


          const lat =
            hospital.latitude ??
            hospital.location?.coordinates?.[1];


          const lng =
            hospital.longitude ??
            hospital.location?.coordinates?.[0];



          if(!lat || !lng)
            return null;



          return (

            <Marker

              key={hospital.id || hospital._id}

              position={[
                Number(lat),
                Number(lng)
              ]}

            >

              <Popup>

                <h3>
                  🏥 {hospital.name}
                </h3>


                <p>
                  📍
                  {
                    typeof hospital.address === "object"
                    ?
                    `${hospital.address.street || ""},
                    ${hospital.address.city || ""},
                    ${hospital.address.state || ""}`
                    :
                    hospital.address || "Address unavailable"
                  }
                </p>


                <p>
                  ☎️
                  {
                    hospital.phone ||
                    "Phone unavailable"
                  }
                </p>


                <p>
                  🩺
                  {
                    hospital.speciality ||
                    "General Hospital"
                  }
                </p>


                <p>
                  🕒
                  {
                    hospital.openingHours ||
                    "Timing unavailable"
                  }
                </p>


              </Popup>


            </Marker>


          );


        })

      }





      {/* AUTO ZOOM */}

      <FitBounds
        hospitals={nearbyHospitals}
      />


    </MapContainer>


  );

};


export default GoogleMapComponent;
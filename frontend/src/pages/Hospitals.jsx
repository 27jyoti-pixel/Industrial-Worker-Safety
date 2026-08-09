import React, { useState, useEffect } from "react";

import GoogleMapComponent from "../components/GoogleMapComponent";

import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

import hospitalService from "../services/hospitalService";

import {
  Compass
} from "lucide-react";

import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Table from "../components/common/Table";
import SearchBar from "../components/common/SearchBar";
import Breadcrumb from "../components/common/Breadcrumb";


const Hospitals = () => {


const {
  showSuccess,
  showError
} = useToast();



// Hospital data

const [hospitals,setHospitals] =
useState([]);

const [loading,setLoading] =
useState(true);

const [searchQuery,setSearchQuery] =
useState("");

const [currentPage,setCurrentPage] =
useState(1);

const [totalPages,setTotalPages] =
useState(1);

const [totalItems,setTotalItems] =
useState(0);



// Nearby hospitals

const [nearbyActive,setNearbyActive] =
useState(false);

const [userLocation,setUserLocation] =
useState(null);

const [nearbyHospitals,setNearbyHospitals] =
useState([]);





useEffect(()=>{

fetchHospitals();

},[
currentPage,
searchQuery
]);





const fetchHospitals = async()=>{

setLoading(true);

try{


const response =
await hospitalService.getAllHospitals({

search:searchQuery,

page:currentPage,

limit:10

});


const dataList =
response.hospitals ||
response.data ||
[];



setHospitals(dataList);


setTotalPages(
response.pages ||
response.totalPages ||
1
);


setTotalItems(
response.total ||
dataList.length
);



}

catch(error){

showError(
error.message ||
"Failed to fetch hospitals"
);

}

finally{

setLoading(false);

}

};







// FIND NEARBY HOSPITALS

const handleNearbySearch = ()=>{


if(!navigator.geolocation){

showError(
"Geolocation not supported"
);

return;

}



setLoading(true);



navigator.geolocation.getCurrentPosition(

async(position)=>{


const latitude =
position.coords.latitude;


const longitude =
position.coords.longitude;



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




setNearbyHospitals(
nearby
);



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

<div>


<Breadcrumb />



<div className="flex justify-between items-center mb-6">


<div>

<h1 className="text-2xl font-bold">

Industrial Hospitals Directory

</h1>


<p className="text-gray-500">

Emergency trauma centers, burn units, and 24/7 ambulance dispatch numbers

</p>


</div>



<Button
onClick={handleNearbySearch}
>

<Compass size={18}/>

Find Nearby (GPS)

</Button>


</div>





<SearchBar

value={searchQuery}

onChange={(e)=>
setSearchQuery(e.target.value)
}

placeholder="Search hospitals by name, city, or registration..."

 />







<div className="mt-6">


<GoogleMapComponent


hospitals={hospitals}


userLocation={userLocation}


showNearby={nearbyActive}


nearbyHospitals={nearbyHospitals}


/>


</div>









{
nearbyActive &&
nearbyHospitals.length > 0 && (


<div className="mt-8">


<h2 className="text-xl font-bold mb-4">

Nearby Emergency Hospitals

</h2>





{
nearbyHospitals.map((hospital)=>(


<Card

key={hospital.id}

className="mb-4 p-4"

>



<h3 className="font-bold text-lg">

🏥 {hospital.name}

</h3>




<p>

📍 {hospital.address || "Address not available"}

</p>




<p>

☎️ {

hospital.phone ||

"Phone not available"

}

</p>





<p>

🩺 {

hospital.speciality ||

"General Hospital"

}

</p>





<p>

🕒 {

hospital.openingHours ||

"Timing unavailable"

}

</p>




<div className="flex gap-3 mt-4">

  <Button
    variant="primary"
    size="sm"
    onClick={() =>
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${hospital.latitude},${hospital.longitude}`,
        "_blank"
      )
    }
  >
    📍 Get Directions
  </Button>



  <Button

    variant="primary"

    size="sm"

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
    📲 Share Location
  </Button>


</div>





</Card>


))

}



</div>


)

}







<div className="mt-8">


<Table

data={hospitals}

/>


</div>





</div>


);


};


export default Hospitals;
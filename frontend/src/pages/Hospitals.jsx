import React, { useState, useEffect } from "react";

import GoogleMapComponent from "../components/GoogleMapComponent";

import { useToast } from "../context/ToastContext";
import hospitalService from "../services/hospitalService";
import { NavLink } from "react-router-dom";
import {
  Compass,
  Hospital,
  Home,
  MapPin,
  Phone,
  Navigation,
  Share2,
  Loader2,
} from "lucide-react";

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

  // Separate loading state for the "Find Nearby Hospitals" action
  const [nearbyLoading, setNearbyLoading] = useState(false);


  useEffect(() => {
    fetchHospitals();
  }, [currentPage, searchQuery]);


  const fetchHospitals = async () => {
    setLoading(true);

    try {
      const response = await hospitalService.getAllHospitals({
        search: searchQuery,
        page: currentPage,
        limit: 10,
      });

      const dataList =
        response?.hospitals ||
        response?.data ||
        [];

      setHospitals(Array.isArray(dataList) ? dataList : []);

    } catch (error) {
      showError(
        error?.message || "Failed to fetch hospitals"
      );
    } finally {
      setLoading(false);
    }
  };


  /*
   * Converts both possible address formats into
   * something React can safely render.
   *
   * Example object:
   * {
   *   street: "MG Road",
   *   city: "Vadodara",
   *   state: "Gujarat",
   *   pincode: "390001"
   * }
   *
   * becomes:
   * MG Road, Vadodara, Gujarat, 390001
   */
  const formatAddress = (address) => {
    if (!address) {
      return "Address not available";
    }

    // If backend already returns a string
    if (typeof address === "string") {
      return address;
    }

    // If backend returns an object
    if (typeof address === "object") {
      const parts = [
        address.street,
        address.city,
        address.state,
        address.pincode,
      ].filter(
        (value) =>
          value !== undefined &&
          value !== null &&
          String(value).trim() !== ""
      );

      return parts.length > 0
        ? parts.join(", ")
        : "Address not available";
    }

    return "Address not available";
  };


  const getHospitalLatitude = (hospital) => {
    return (
      hospital?.latitude ??
      hospital?.location?.coordinates?.[1] ??
      null
    );
  };


  const getHospitalLongitude = (hospital) => {
    return (
      hospital?.longitude ??
      hospital?.location?.coordinates?.[0] ??
      null
    );
  };


  const handleNearbySearch = () => {
    if (!navigator.geolocation) {
      showError("Geolocation not supported");
      return;
    }

    setNearbyLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        setUserLocation({
          latitude,
          longitude,
        });

        try {
          const response =
            await hospitalService.getNearbyHospitals(
              latitude,
              longitude,
              10
            );

          const nearby =
            response?.hospitals ||
            response?.data ||
            [];

          const safeNearbyHospitals = Array.isArray(nearby)
            ? nearby
            : [];

          setNearbyHospitals(safeNearbyHospitals);

          /*
           * This makes the nearby-result layout appear
           * after the API response is received.
           */
          setNearbyActive(true);

          showSuccess(
            "Loaded nearby emergency hospitals"
          );

        } catch (error) {
          showError(
            error?.message ||
              "Failed to load nearby hospitals"
          );

          setNearbyHospitals([]);
          setNearbyActive(false);

        } finally {
          setNearbyLoading(false);
        }
      },

      () => {
        showError(
          "Unable to get GPS location"
        );

        setNearbyLoading(false);
      }
    );
  };


  const handleGetDirections = (hospital) => {
    const latitude = getHospitalLatitude(hospital);
    const longitude = getHospitalLongitude(hospital);

    if (
      latitude === null ||
      longitude === null
    ) {
      showError(
        "Location is not available for this hospital"
      );
      return;
    }

    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`,
      "_blank"
    );
  };


  const handleShareLocation = (hospital) => {
    const latitude = getHospitalLatitude(hospital);
    const longitude = getHospitalLongitude(hospital);

    const address = formatAddress(
      hospital?.address
    );

    const name =
      hospital?.name ||
      "Emergency Hospital";

    let navigationText = "Location unavailable";

    if (
      latitude !== null &&
      longitude !== null
    ) {
      navigationText =
        `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    }

    const message =
`🚨 Emergency Hospital Location

🏥 Hospital:
${name}

📍 Address:
${address}

🗺️ Navigation:
${navigationText}`;

    window.open(
      `https://wa.me/?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };


  return (
    <>
      <style>{`
        .hospitals-page-enter {
          animation: hospitalsPageEnter 520ms cubic-bezier(.22,1,.36,1) both;
        }
        .hospitals-breadcrumb {
          animation: hospitalsFadeUp 420ms ease-out 40ms both;
        }
        .hospitals-header {
          animation: hospitalsFadeUp 520ms cubic-bezier(.22,1,.36,1) 90ms both;
        }
        .hospitals-search {
          animation: hospitalsFadeUp 520ms cubic-bezier(.22,1,.36,1) 150ms both;
        }
        .hospitals-content {
          animation: hospitalsFadeUp 560ms cubic-bezier(.22,1,.36,1) 210ms both;
        }
        .hospital-card {
          animation: hospitalsCardEnter 420ms cubic-bezier(.22,1,.36,1) both;
        }
        .hospitals-header,
        .hospitals-search {
          transition: box-shadow 220ms ease, transform 220ms ease, border-color 220ms ease;
        }
        .hospitals-header:hover,
        .hospitals-search:hover {
          border-color: #B9C9C3;
        }
        .hospitals-content button {
          transition: transform 180ms ease, box-shadow 180ms ease,
            background-color 180ms ease, color 180ms ease, border-color 180ms ease;
        }
        .hospitals-content button:hover {
          transform: translateY(-1px);
        }
        @keyframes hospitalsPageEnter {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes hospitalsFadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes hospitalsCardEnter {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .hospitals-page-enter,
          .hospitals-breadcrumb,
          .hospitals-header,
          .hospitals-search,
          .hospitals-content,
          .hospital-card {
            animation: none !important;
          }
          .hospitals-header,
          .hospitals-search,
          .hospitals-content button {
            transition: none !important;
          }
        }
      `}</style>
    <div className="space-y-6 hospitals-page-enter">

      {/* Breadcrumb */}
      <div className="hospitals-breadcrumb">
        <div className="flex items-center gap-2 text-sm">
          {/* <Home className="w-4 h-4 text-[#6C757D]" /> */}

          <NavLink
            to="/dashboard"
            className="text-[#6C757D] hover:text-[#3E5C54] transition-colors duration-200"
          >
            Dashboard
          </NavLink>

          <span className="text-[#D0D0D0] text-base leading-none">/</span>

          <span className="font-medium text-[#3E5C54]">
            Hospitals
          </span>
        </div>
      </div>


      {/* ================================
          PAGE HEADER
      ================================= */}
      <div className="bg-white border border-[#E0E0E0] rounded-[24px] px-6 sm:px-7 py-5 sm:py-4 shadow-[0_8px_24px_rgba(24,35,29,.035)] hospitals-header">

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">

          <div className="flex items-center gap-3.5">

            <div className="w-10 h-10 rounded-xl bg-[#EEF2F0] border border-[#B9C9C3] text-[#3E5C54] flex items-center justify-center shrink-0">
              <Hospital className="w-5 h-5" />
            </div>

            <div>

              <h1
                className="text-xl sm:text-[32px] font-medium text-[#3E5C54] leading-tight"
                style={{ letterSpacing: "0em" }}
              >
                Emergency Care & Hospitals
              </h1>

              <div
                className="w-[48px] h-[3px] rounded-full mt-2"
                style={{ backgroundColor: "#3E5C54" }}
              />

              <p className="text-sm text-[#6C757D] mt-1 max-w-xl">
                Find nearby hospitals, trauma centres, and emergency medical services
              </p>

            </div>

          </div>


          {/* Find Nearby Hospitals */}
          <Button
            variant="primary"
            icon={Compass}
            loading={nearbyLoading}
            onClick={handleNearbySearch}
            disabled={nearbyLoading}
          >
            {nearbyLoading
              ? "Finding Hospitals..."
              : "Find Nearby Hospitals"}
          </Button>

        </div>

      </div>


      {/* ================================
          SEARCH
      ================================= */}
      <div className="bg-white border border-[#E0E0E0] rounded-[20px] p-3 shadow-[0_8px_24px_rgba(24,35,29,.025)] hospitals-search">

        <SearchBar
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Search hospitals by name, city, or specialization..."
        />

      </div>


      <div className="hospitals-content">

      {/* ==========================================================
          NEARBY HOSPITALS
      ========================================================== */}
      {nearbyActive ? (

        <div className="grid grid-cols-1 xl:grid-cols-[1.15fr_.85fr] gap-5 items-start">

          {/* ================================
              LEFT — MAP
          ================================= */}
          <div className="bg-white border border-[#E0E0E0] rounded-[24px] overflow-hidden shadow-[0_8px_24px_rgba(24,35,29,.035)]">

            <div className="px-5 py-4 border-b border-[#E0E0E0] flex items-center justify-between gap-4">

              <div>

                <h2 className="text-[15px] font-semibold text-[#3E5C54]">
                  Hospital Map
                </h2>

                <p className="text-xs text-[#6C757D] mt-1">
                  Emergency hospitals within your nearby search area
                </p>

              </div>


              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EEF2F0] border border-[#B9C9C3] text-[#3E5C54] text-xs font-medium shrink-0">

                <Hospital className="w-3.5 h-3.5" />

                {nearbyHospitals.length} nearby

              </div>

            </div>


            {/* Map height */}
            <div className="h-[500px] overflow-hidden">

              <GoogleMapComponent
                hospitals={hospitals}
                userLocation={userLocation}
                showNearby={nearbyActive}
                nearbyHospitals={nearbyHospitals}
              />

            </div>

          </div>


          {/* ================================
              RIGHT — HOSPITAL LIST
          ================================= */}
          <div className="min-w-0">

            {/* List Header */}
            <div className="flex items-end justify-between gap-4 px-1 mb-4">

              <div>

                <h2 className="text-xl font-semibold text-[#3E5C54] tracking-tight">
                  Nearby Emergency Hospitals
                </h2>

                <p className="text-sm text-[#6C757D] mt-1">
                  Choose a hospital for directions or quick location sharing.
                </p>

              </div>


              <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-[#3E5C54] bg-[#EEF2F0] border border-[#B9C9C3] rounded-full px-3 py-1.5 shrink-0">

                <Hospital className="w-3.5 h-3.5" />

                {nearbyHospitals.length} found

              </div>

            </div>


            {/* ==================================================
                SCROLLABLE HOSPITAL LIST

                Same 500px content height as map.
            ================================================== */}
            <div
              className="
                h-[500px]
                overflow-y-auto
                pr-2
                space-y-4
                hospital-list-scroll
              "
            >

              {/* Loading state */}
              {nearbyLoading && (

                <div className="h-full bg-white border border-[#E0E0E0] rounded-[24px] flex flex-col items-center justify-center">

                  <Loader2 className="w-7 h-7 text-[#3E5C54] animate-spin" />

                  <p className="text-sm font-medium text-[#6C757D] mt-3">
                    Finding nearby hospitals...
                  </p>

                  <p className="text-xs text-[#6C757D] mt-1">
                    Getting hospitals near your location
                  </p>

                </div>

              )}


              {/* No hospitals */}
              {!nearbyLoading &&
                nearbyHospitals.length === 0 && (

                  <div className="h-full bg-white border border-[#E0E0E0] rounded-[24px] flex flex-col items-center justify-center px-6 text-center">

                    <Hospital className="w-8 h-8 text-[#6C757D]" />

                    <p className="text-sm font-medium text-[#6C757D] mt-3">
                      No nearby hospitals found
                    </p>

                    <p className="text-xs text-[#6C757D] mt-1">
                      Try searching again from a different location.
                    </p>

                  </div>

                )}


              {/* Hospital Cards */}
              {!nearbyLoading &&
                nearbyHospitals.map((hospital, index) => {

                  const address = formatAddress(
                    hospital?.address
                  );

                  const phone =
                    hospital?.phone ||
                    "Phone not available";

                  const hospitalKey =
                    hospital?._id ||
                    hospital?.id ||
                    `${hospital?.name || "hospital"}-${index}`;

                  return (

                    <div
                      key={hospitalKey}
                      className="
                        group
                        bg-white
                        border
                        border-[#E0E0E0]
                        rounded-[24px]
                        p-5
                        shadow-[0_8px_24px_rgba(24,35,29,.025)]
                        transition-all
                        duration-200
                        hover:-translate-y-0.5
                        hover:shadow-[0_12px_28px_rgba(24,35,29,.06)]
                        hospital-card
                      "
                    >

                      <div className="flex items-start gap-3.5">

                        {/* Hospital Icon */}
                        <div className="w-12 h-12 rounded-[15px] bg-[#EEF2F0] border border-[#B9C9C3] text-[#3E5C54] flex items-center justify-center shrink-0">

                          <Hospital className="w-6 h-6" />

                        </div>


                        <div className="min-w-0 flex-1">

                          {/* Hospital Name */}
                          <h3 className="text-[17px] sm:text-[18px] font-semibold text-[#3E5C54] leading-snug">

                            {hospital?.name ||
                              "Emergency Hospital"}

                          </h3>


                          {/* Details */}
                          <div className="mt-4 space-y-3">

                            {/* Address */}
                            <div className="flex items-start gap-3 text-[15px] text-[#6C757D]">

                              <MapPin className="w-[19px] h-[19px] text-[#6C757D] shrink-0 mt-0.5" />

                              <span className="leading-6">
                                {address}
                              </span>

                            </div>


                            {/* Phone */}
                            <div className="flex items-center gap-3 text-[15px] text-[#6C757D]">

                              <Phone className="w-[19px] h-[19px] text-[#6C757D] shrink-0" />

                              <span>
                                {phone}
                              </span>

                            </div>

                          </div>


                          {/* Buttons */}
                          <div className="flex flex-wrap items-center gap-2.5 mt-5">

                            {/* Get Directions */}
                            <Button
                              variant="primary"
                              size="sm"
                              className="px-4 py-2"
                              onClick={() =>
                                handleGetDirections(
                                  hospital
                                )
                              }
                            >

                              <Navigation className="w-3.5 h-3.5" />

                              Get Directions

                            </Button>


                            {/* Share Location */}
                            <Button
                              variant="outline"
                              size="sm"
                              className="px-4 py-2"
                              onClick={() =>
                                handleShareLocation(
                                  hospital
                                )
                              }
                            >

                              <Share2 className="w-3.5 h-3.5" />

                              Share Location

                            </Button>

                          </div>

                        </div>

                      </div>

                    </div>

                  );
                })}

            </div>

          </div>

        </div>

      ) : (

        /* ==========================================================
           DEFAULT — ALL HOSPITALS MAP
        ========================================================== */
        <div className="bg-white border border-[#E0E0E0] rounded-[24px] overflow-hidden shadow-[0_8px_24px_rgba(24,35,29,.035)]">

          <div className="px-5 py-4 border-b border-[#E0E0E0]">

            <h2 className="text-[15px] font-semibold text-[#3E5C54]">
              Hospital Locations
            </h2>

            <p className="text-xs text-[#6C757D] mt-1">
              Browse hospitals on the map or use Find Nearby Hospitals to locate emergency care.
            </p>

          </div>


          <div className="h-[520px] overflow-hidden">

            <GoogleMapComponent
              hospitals={hospitals}
              userLocation={userLocation}
              showNearby={nearbyActive}
              nearbyHospitals={nearbyHospitals}
            />

          </div>

        </div>

      )}

      </div>
    </div>
    </>
  );
};


export default Hospitals;
import React, { useState, useEffect } from "react";
import SearchFilterSelect from "../components/common/SearchFilterSelect";

import GoogleMapComponent from "../components/GoogleMapComponent";
import hospitalHero from "../assets/wide_panoramic_ultra_realistic_exterior_scene_of.png";

import { useToast } from "../context/ToastContext";
import hospitalService from "../services/hospitalService";
import {
  Hospital,
  MapPin,
  Phone,
  Navigation,
  Share2,
  Loader2,
} from "lucide-react";

import Button from "../components/common/Button";
import SearchBar from "../components/common/SearchBar";


const Hospitals = () => {
  const { showSuccess, showError } = useToast();

  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [cityFilter, setCityFilter] = useState("");
  const [facilityFilter, setFacilityFilter] = useState("");
  const [searchRadius, setSearchRadius] = useState("10");
  const [cityOptions, setCityOptions] = useState([]);
  const [facilityOptions, setFacilityOptions] = useState([]);
  const [hospitalCount, setHospitalCount] = useState(0);

  const [nearbyActive, setNearbyActive] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyHospitals, setNearbyHospitals] = useState([]);

  // Separate loading state for the "Find Nearby Hospitals" action
  const [nearbyLoading, setNearbyLoading] = useState(false);


  useEffect(() => {
    fetchHospitals();
  }, [currentPage, searchQuery, cityFilter, facilityFilter]);


  const fetchHospitals = async () => {
    setLoading(true);

    try {
      const response = await hospitalService.getAllHospitals({
        search: searchQuery,
        city: cityFilter,
        facility: facilityFilter,
        page: currentPage,
        limit: 10,
      });

      const dataList =
        response?.hospitals ||
        response?.data ||
        [];
      const safeHospitals = Array.isArray(dataList) ? dataList : [];

      setHospitals(safeHospitals);
      setHospitalCount(response?.pagination?.total ?? response?.total ?? safeHospitals.length);
      setCityOptions((current) => [...new Set([
        ...current,
        ...safeHospitals.map((hospital) => hospital?.address?.city).filter(Boolean),
      ])].sort((a, b) => a.localeCompare(b)));
      setFacilityOptions((current) => [...new Set([
        ...current,
        ...safeHospitals.flatMap((hospital) => Array.isArray(hospital?.facilities) ? hospital.facilities : []),
      ])].sort((a, b) => a.localeCompare(b)));

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
              Number(searchRadius)
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


  const displayedHospitals = nearbyActive ? nearbyHospitals : hospitals;
  const displayedCount = nearbyActive ? nearbyHospitals.length : hospitalCount;

  return (
    <>
      <style>{`
        #hospitals-page .hospital-hero-art {
          right: -6px;
          background-size: calc(100% + 6px) auto;
          background-position: right 60%;
          background-repeat: no-repeat;
        }
        #hospitals-page .hospital-hero::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          background: linear-gradient(90deg, #f7f8f8 0%, #f7f8f8 30%, rgba(247, 248, 248, .96) 42%, rgba(247, 248, 248, .68) 55%, rgba(247, 248, 248, .24) 68%, rgba(247, 248, 248, 0) 82%);
        }
        #hospitals-page .hospital-search input,
        #hospitals-page .hospital-search select {
          height: 48px;
          min-height: 48px;
          border: 1px solid #e1e4e8 !important;
          border-radius: 8px !important;
          background-color: #fff !important;
          box-shadow: none !important;
          color: #222 !important;
          font-size: 16px !important;
        }
        #hospitals-page .hospital-search .search-filter-trigger {
          font-size: 14px !important;
          font-weight: 600 !important;
        }
        #hospitals-page .hospital-search .search-filter-field input {
          font-size: 16px !important;
        }
        #hospitals-page .hospital-search select {
          padding-left: 14px !important;
          padding-right: 36px !important;
          appearance: none;
          -webkit-appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none' stroke='%2359626d' stroke-width='1.8'%3E%3Cpath d='m5 7 5 5 5-5'/%3E%3C/svg%3E") !important;
          background-position: right 12px center !important;
          background-repeat: no-repeat !important;
          background-size: 16px !important;
        }
        #hospitals-page .hospital-search select option {
          background: #fff;
          color: #222;
        }
        #hospitals-page .hospital-search select option:checked {
          background: #f3f4f5;
          color: #111;
        }
        #hospitals-page .hospital-search input:focus,
        #hospitals-page .hospital-search select:focus,
        #hospitals-page .hospital-search .search-filter-trigger:focus,
        #hospitals-page .hospital-search button:focus {
          border-color: #e1e4e8 !important;
          outline: 1px solid rgba(232, 117, 50, .38) !important;
          outline-offset: -2px !important;
          box-shadow: none !important;
        }
        #hospitals-page .hospital-search {
          position: relative;
          overflow: visible;
          margin-top: 22px !important;
        }
        #hospitals-page .hospital-search:has(.hospital-filter-menu) {
          isolation: isolate;
          z-index: 60;
        }
        #hospitals-page .hospital-results {
          position: relative;
          z-index: 0;
          margin-top: 30px !important;
        }
        #hospitals-page .hospital-search .search-filter-trigger[data-icon-type="specialization"] .search-filter-selected-icon,
        #hospitals-page .hospital-search .hospital-specialization-menu .search-filter-option-icon {
          width: 18px;
          height: 18px;
        }
        #hospitals-page .hospital-search .hospital-filter-menu {
          top: calc(100% + 5px);
          z-index: 70;
          border-radius: 11px;
          padding: 5px;
          box-shadow: 0 8px 20px rgba(17, 17, 17, .10);
          max-height: min(320px, calc(100dvh - 180px));
          overflow-y: auto;
        }
        #hospitals-page .hospital-search .hospital-filter-menu .search-filter-option {
          min-height: 36px;
          border-radius: 7px;
          padding: 7px 10px;
          color: #252525;
          font-size: 14px;
          line-height: 1.3;
          transition: background-color 140ms ease;
        }
        #hospitals-page .hospital-search .hospital-filter-menu .search-filter-option:hover,
        #hospitals-page .hospital-search .hospital-filter-menu .search-filter-option:focus-visible {
          background: #f5f5f5;
        }
        #hospitals-page .hospital-search .hospital-filter-menu .search-filter-option.is-selected {
          background: #fff7f2;
        }
        #hospitals-page .hospital-map .leaflet-container {
          height: 440px !important;
          aspect-ratio: auto;
        }
        @media (max-width: 1279px) {
          #hospitals-page .hospital-map .leaflet-container { height: 390px !important; aspect-ratio: auto; }
        }
        #hospitals-page .hospital-direction-button {
          background-color: #111111 !important;
          color: #fff !important;
          border-radius: 7px !important;
          box-shadow: none !important;
          transform: none !important;
          min-height: 36px;
        }
        #hospitals-page .hospital-direction-button:hover:not(:disabled) {
          background-color: #2b2b2b !important;
        }
        #hospitals-page button.midc-primary-cta {
          background-color: #111111 !important;
          color: #ffffff !important;
          box-shadow: none !important;
        }
        #hospitals-page button.midc-primary-cta:hover:not(:disabled) {
          background-color: #2b2b2b !important;
        }
        #hospitals-page .hospital-share-button {
          background: #fff !important;
          border-color: #dedede !important;
          border-radius: 7px !important;
          color: #333 !important;
          box-shadow: none !important;
          transform: none !important;
          min-height: 36px;
        }
        #hospitals-page .hospital-share-button:hover:not(:disabled) {
          background: #f5f5f5 !important;
          border-color: #cfd3d8 !important;
          color: #111 !important;
        }
        #hospitals-page .hospital-share-button > svg,
        #hospitals-page .hospital-direction-button > svg {
          width: 16px;
          height: 16px;
        }
        @media (prefers-reduced-motion: reduce) {
          #hospitals-page *,
          #hospitals-page *::before,
          #hospitals-page *::after { animation: none !important; transition: none !important; }
        }
      `}</style>

      <main id="hospitals-page" className="space-y-3 hospitals-page-enter">
        <section
          className="hospital-hero relative isolate -mx-4 -mt-4 min-h-[278px] w-[calc(100%+2rem)] overflow-hidden bg-[#F7F8F8] sm:-mx-6 sm:-mt-6 sm:w-[calc(100%+3rem)] lg:-mx-8 lg:-mt-8 lg:w-[calc(100%+4rem)]"
          aria-labelledby="hospitals-title"
        >
          <div
            aria-hidden="true"
            className="hospital-hero-art absolute inset-0 z-0"
            style={{ backgroundImage: `url(${hospitalHero})` }}
          />
          <div className="relative z-10 flex min-h-[278px] items-center px-4 py-7 sm:px-6 lg:px-8">
            <div className="w-full max-w-[740px] lg:w-[52%]">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[.12em] text-[#777]">Medical support</p>
              <h1 id="hospitals-title" className="!mb-0 !text-[30px] !font-semibold !leading-tight !tracking-[-.035em] !text-[#111] sm:!text-[42px] lg:!text-[44px]">
                Emergency Care &amp; Hospitals
              </h1>
              <p className="mt-2 max-w-[520px] text-[18px] leading-[1.5] text-[#6b6b6b]">
                Find nearby hospitals, trauma centres, and emergency medical services.
              </p>
            </div>
          </div>
        </section>

        <section className="hospital-search search-filter-controls grid grid-cols-1 items-center gap-3 bg-transparent p-0 sm:grid-cols-2 xl:grid-cols-[minmax(230px,1.7fr)_minmax(150px,.72fr)_minmax(125px,.56fr)_minmax(155px,.78fr)_auto]" aria-label="Search and filter hospitals">
          <SearchBar
            className="search-filter-field sm:col-span-2 xl:col-span-1"
            value={searchQuery}
            onChange={(value) => {
              setSearchQuery(value);
              setCurrentPage(1);
              setNearbyActive(false);
            }}
            onClear={() => {
              setSearchQuery("");
              setCurrentPage(1);
              setNearbyActive(false);
            }}
            placeholder="Search hospitals by name, city, or specialization..."
          />

          <SearchFilterSelect
            label="Near my location"
            value={cityFilter}
            onValueChange={(value) => {
              setCityFilter(value);
              setCurrentPage(1);
              setNearbyActive(false);
            }}
            options={cityOptions.map((city) => ({ value: city, label: city }))}
            menuClassName="hospital-filter-menu"
            iconType="location"
          />

          <SearchFilterSelect
            label="Search radius"
            value={searchRadius}
            allowClear={false}
            onValueChange={(value) => setSearchRadius(value)}
            options={[
              { value: "10", label: "Within 10 km" },
              { value: "25", label: "Within 25 km" },
              { value: "50", label: "Within 50 km" },
            ]}
            menuClassName="hospital-filter-menu"
            iconType="distance"
          />

          <SearchFilterSelect
            label="All Specializations"
            value={facilityFilter}
            onValueChange={(value) => {
              setFacilityFilter(value);
              setCurrentPage(1);
              setNearbyActive(false);
            }}
            options={facilityOptions.map((facility) => ({ value: facility, label: facility }))}
            menuClassName="hospital-filter-menu hospital-specialization-menu"
            iconType="specialization"
          />

          <Button
            variant="primary"
            size="sm"
            loading={nearbyLoading}
            onClick={handleNearbySearch}
            disabled={nearbyLoading}
            className="h-12 whitespace-nowrap !rounded-[8px] !bg-[#111111] !px-4 !text-[15px] !font-semibold !shadow-none hover:!bg-[#2b2b2b]"
          >
            {nearbyLoading ? "Finding hospitals..." : "Find Nearby Hospitals"}
          </Button>
        </section>

        <section className="hospital-results relative z-0 grid grid-cols-1 items-start gap-4 xl:grid-cols-[minmax(0,1.13fr)_minmax(0,1fr)]" aria-label="Hospital results and map">
          <div className="min-w-0 px-4 pt-3">
            <div className="flex items-center justify-between gap-3 border-b border-[#e5e7eb] pb-2">
              <div>
                <h2 className="text-[22px] font-semibold leading-6 text-[#111] lg:text-[24px]">Nearby Hospitals</h2>
                <p className="mt-1 text-[15px] font-normal leading-5 text-[#737b84]">Showing hospitals and trauma centres from your search.</p>
              </div>
              <span className="shrink-0 text-[15px] font-medium text-[#62666b]">
                {loading && !nearbyActive ? "Loading hospitals..." : `${displayedCount} hospitals found`}
              </span>
            </div>

            <div className="mt-3 space-y-3">
              {loading && !nearbyActive ? (
                <div className="flex min-h-[180px] items-center justify-center gap-2 text-sm text-[#737b84]" aria-live="polite">
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading hospitals...
                </div>
              ) : displayedHospitals.length === 0 ? (
                <div className="flex min-h-[220px] flex-col items-center justify-center px-5 text-center" aria-live="polite">
                  <Hospital className="h-7 w-7 text-[#9aa1a9]" aria-hidden="true" />
                  <p className="mt-3 text-sm font-medium text-[#222]">
                    {nearbyActive ? "No nearby hospitals found" : "No hospitals found"}
                  </p>
                  <p className="mt-1 max-w-sm text-xs leading-5 text-[#737b84]">
                    {nearbyActive ? "Try searching again from a different location." : "Hospitals matching your search will appear here."}
                  </p>
                </div>
              ) : (
                displayedHospitals.map((hospital, index) => {
                  const address = formatAddress(hospital?.address);
                  const phone = hospital?.phone;
                  const hospitalKey = hospital?._id || hospital?.id || `${hospital?.name || "hospital"}-${index}`;
                  const facilities = Array.isArray(hospital?.facilities) ? hospital.facilities : [];
                  const specialization = hospital?.speciality || facilities.slice(0, 2).join(", ");
                  const hasOpeningHours = Boolean(hospital?.openingHours);

                  return (
                    <article
                      key={hospitalKey}
                      className={`grid min-h-[180px] grid-cols-1 gap-3 rounded-lg border border-[#e5e7eb] bg-white p-5 sm:grid-cols-[56px_minmax(0,1fr)] lg:grid-cols-[56px_minmax(0,1fr)_minmax(350px,auto)] lg:gap-x-4 lg:p-6 ${nearbyActive && index === 0 ? "border-l-2 border-l-[#E87532]" : ""}`}
                    >
                      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-[#f2f3f4] text-[#42484f] sm:mt-0.5">
                        <Hospital className="h-6 w-6" aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <h3 className="truncate text-[18px] font-semibold leading-5 text-[#17191c]">{hospital?.name || "Hospital"}</h3>
                        {specialization && <p className="mt-1 inline-flex max-w-full truncate rounded-md bg-[#f2f3f4] px-2 py-1 text-[14px] leading-4 text-[#62666b]">{specialization}</p>}
                        <div className="mt-2 flex flex-col items-start gap-1.5 text-[14px] font-normal leading-5 text-[#62666b]">
                          <span className="inline-flex min-w-0 items-start gap-1.5"><MapPin className="mt-0.5 h-4 w-4 shrink-0" />{address}</span>
                          {phone && <span className="inline-flex items-center gap-1.5"><Phone className="h-4 w-4 shrink-0" />{phone}</span>}
                        </div>
                      </div>

                      <div className="flex min-w-0 flex-wrap items-end justify-start gap-2 sm:col-start-2 lg:col-start-3 lg:flex-col lg:flex-nowrap lg:items-end lg:justify-between">
                        {hasOpeningHours ? (
                          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-[#f3f4f5] px-3 py-2 text-[13px] font-medium text-[#525860]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#525860]" aria-hidden="true" />
                            {hospital.openingHours}
                          </span>
                        ) : <span aria-hidden="true" />}
                        <div className="flex flex-wrap items-center justify-end gap-1.5">
                          <Button
                            variant="outline"
                            size="sm"
                            icon={Share2}
                            className="hospital-share-button !h-[38px] !px-3 !text-[14px] !font-semibold"
                            onClick={() => handleShareLocation(hospital)}
                          >
                            Share Location
                          </Button>
                          <Button
                            variant="primary"
                            size="sm"
                            className="hospital-direction-button !h-[38px] !px-3 !text-[14px] !font-semibold"
                            onClick={() => handleGetDirections(hospital)}
                          >
                            <Navigation className="h-4 w-4" aria-hidden="true" />
                            Get Directions
                          </Button>
                        </div>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </div>

          <div className="hospital-map min-w-0 overflow-hidden rounded-lg">
            <GoogleMapComponent
              hospitals={hospitals}
              userLocation={userLocation}
              showNearby={nearbyActive}
              nearbyHospitals={nearbyActive ? nearbyHospitals : []}
            />
          </div>
        </section>
      </main>
    </>
  );
};

export default Hospitals;

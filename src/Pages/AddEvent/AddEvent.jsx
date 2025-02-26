import React, { useState, useEffect, useRef } from "react";
import CustomInputShadow from "../../Components/CustomInput/CustomInput";
import { Box, Typography } from "@mui/material";
import CustomButton from "../../Components/CustomButton/CustomButton";
import axios from "axios";
import CustomSelect from "../../Components/CustomSelect/CustomSelect";
import Heading from "../../Components/Heading/Heading";
import SnackAlert from "../../Components/SnackAlert/SnackAlert";
import { useSelector } from "react-redux";
import MenuBar from "../../Components/MenuBar/MenuBar";
import NavigateBack from "../../Components/NavigateBackButton/NavigateBack";
import { useNavigate } from "react-router-dom";
import { Loader } from "@googlemaps/js-api-loader";
import { useLocation } from "react-router-dom";
import VirtualizedCustomSelect from "../../Components/VirtualzedCustomSelect/VirtualizedCustomSelect";

const appUrl = import.meta.env.VITE_REACT_APP_API_URL;

const AddSEvent = () => {
  const [snackAlertData, setSnackAlertData] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const { state } = useLocation();
  const auth = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const requiredFields = {
    eventName: "Event name is required",
    venueAddress: "Event address is required",
    date: "Event start date is required",
    details: "Event details are required",
    bannerImage:"Image is required"
  };

  const [formData, setFormData] = useState({
    eventName: state?.eventName || "",
    organizedBy: state?.owner?.name || "",
    ownerId: state?.owner?._id || "",
    date: state?.eventDate
      ? new Date(state?.eventDate).toLocaleDateString("en-CA") // Local date format (YYYY-MM-DD)
      : "",
    time: state?.eventDate
      ? new Date(state?.eventDate).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }) // Local time format (HH:MM) for 24-hour input
      : "",

    endDate: state?.eventEndDate
      ? new Date(state?.eventEndDate).toLocaleDateString("en-CA") // Local date format (YYYY-MM-DD)
      : "",
    endTime: state?.eventEndDate
      ? new Date(state?.eventEndDate).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }) // Local time format (HH:MM) for 24-hour input
      : "",
    // description: state?.venueDescription || "",
    details: state?.eventDetails || "",
    destination: "",
    bannerImage: null,
    latitude: state?.venueLocation?.latitude || "",
    longitude: state?.venueLocation?.longitude || "",
    // venueAddress: state?.venueAddress || "",
    websiteLink: state?.websiteLink || "",
    facebookLink: state?.facebookLink || "",
  });

  const [errors, setErrors] = useState({});
  const [allBrands, setAllBrands] = useState([]);
  const [selectedBannerFileName, setSelectedBannerFileName] = useState("");
  const mapRef = useRef(null); // To store the map instance
  const autocompleteRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null)
  const [mapLoaded, setMapLoaded] = useState(false);
  let [marker, setMarker] = useState(null); // State to store marker instance

  const loader = new Loader({
    apiKey: "AIzaSyAkJ06-4A1fY1ekldJUZMldHa5QJioBTlY",
    version: "weekly",
    libraries: ["places"],
  });

  const mapOptions = {
    center: { lat: 0, lng: 0 },
    zoom: 4,
  };

  const loadMap = async () => {
    if (!mapLoaded) {
      loader
        .load()
        .then((google) => {
          const initialCenter =
            state?.venueLocation?.latitude && state?.venueLocation?.longitude
              ? {
                  lat: parseFloat(state.venueLocation.latitude),
                  lng: parseFloat(state.venueLocation.longitude),
                }
              : { lat: 0, lng: 0 };

          const map = new google.maps.Map(document.getElementById("map"), {
            center: initialCenter,
            zoom:
              state?.venueLocation?.latitude && state?.venueLocation?.longitude
                ? 15
                : 4,
          });
          mapRef.current = map;

          // Add autocomplete search box
          const input = document.getElementById("autocomplete");
          const autocomplete = new google.maps.places.Autocomplete(input, {
            fields: ["place_id", "geometry", "formatted_address"],
          });
          autocompleteRef.current = autocomplete;

          // If latitude and longitude exist in the state, place a marker
          if (
            state?.venueLocation?.latitude &&
            state?.venueLocation?.longitude
          ) {
            marker = new google.maps.Marker({
              position: initialCenter,
              map,
            });
            setMarker(marker);
          }

          // Update coordinates on place change
          autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace();
            if (place.geometry) {
              const lat = place.geometry.location.lat();
              const lng = place.geometry.location.lng();

              // Center map on the selected place
              map.setCenter({ lat, lng });
              map.setZoom(15);

              setFormData((prev) => ({
                ...prev,
                latitude: lat.toString(),
                longitude: lng.toString(),
              }));

              // Set marker
              // setMapMarker(map, lat, lng);
            }
          });
          // Set latitude and longitude on map click

          map.addListener("click", (event) => {
            const lat = event.latLng.lat();
            const lng = event.latLng.lng();
            setFormData((prev) => ({
              ...prev,
              latitude: lat.toString(),
              longitude: lng.toString(),
            }));

            // Check if a marker exists and remove it
            if (marker && marker.setMap) {
              marker.setMap(null);
            }

            marker = new google.maps.Marker({
              position: { lat, lng },
              map,
            });
            setMarker(marker);

            console.log(
              `Coordinates selected: Latitude: ${lat}, Longitude: ${lng}`
            );
          });

          setMapLoaded(true); // Mark map as loaded
        })
        .catch((e) => {
          console.error("Error loading Google Maps:", e);
        });
    }
  };

  useEffect(() => {
    loadMap();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      const file = files[0];
      setPreviewImage(URL.createObjectURL(files[0]))
      setFormData({
        ...formData,
        [name]: file,
      });
      setSelectedBannerFileName(file?.name || ""); // Update selected file name
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // const handleDetailChange = (index, value) => {
  //   const updatedDetails = formData.details.map((detail, i) =>
  //     i === index ? value : detail
  //   );
  //   setFormData({
  //     ...formData,
  //     details: updatedDetails,
  //   });
  // };

  // const addBullet = (field) => {
  //   setFormData({
  //     ...formData,
  //     [field]: [...formData[field], ""],
  //   });
  // };

  // const removeBullet = (field, index) => {
  //   if (formData[field].length > 1) {
  //     const updatedField = formData[field].filter((_, i) => i !== index);
  //     setFormData({
  //       ...formData,
  //       [field]: updatedField,
  //     });
  //   }
  // };

  const handleSubmit = async () => {
 
    let validationErrors = {};

    // Check file size
    if (formData.bannerImage && formData.bannerImage.size > 4 * 1024 * 1024) {
      validationErrors.bannerImage = "Banner image size exceeds 4MB.";
    }
 
    Object.entries(requiredFields).forEach(([field, message]) => {
      if (!formData[field]) {
        validationErrors[field] = message;
      }
    });
    if (!formData.latitude || !formData.longitude) {
      validationErrors.location = "Event location is required";
    }    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    console.log(formData);
    const formattedDate = new Date(formData.date).toISOString();

    const eventDateTime = new Date(
      `${formData.date}T${formData.time || "00:00"}`
    ).toISOString();
    
    const eventDateEndTime = formData.endDate
    ? new Date(`${formData.endDate}T${formData.endTime || "00:00"}`).toISOString()
    : null;
    try {
      setLoading(true);
      const data = new FormData();
      data.append("eventName", formData?.eventName);
      

      data.append("eventDate", eventDateTime);
      eventDateEndTime&&   data.append("eventEndDate", eventDateEndTime);

      // data.append("venueDescription", formData?.description);
      // data.append("venueName", formData?.destination);
      data.append("owner", formData?.ownerId);
      data.append("bannerImage", formData?.bannerImage);
      data.append("eventDetails", formData?.details);
      data.append("websiteLink", formData?.websiteLink);
      data.append("facebookLink", formData?.facebookLink);
      data.append("venueAddress", formData?.venueAddress);
      data.append("venueLocation.longitude", formData?.longitude);
      data.append("venueLocation.latitude", formData?.latitude);
      setErrors({})
    

      const response = await axios({
        url: `${appUrl}/admin/add-event`,
        method: "post",
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
          "Content-Type": "multipart/form-data",
        },
        data: data,
      });
      setPreviewImage(null)
      setFormData({
        eventName: "",
        organizedBy: "",
        ownerId: "",
        date: "",
        time: "",
        // description: "",
        details: "", // Initialize with one bullet point
        destination: "",
        bannerImage: null,
        latitude: "",
        longitude: "",
        // venueAddress: "",
        facebookLink: "",
        websiteLink: "",
      });
      setLoading(false);
      setSelectedBannerFileName(""); // Reset file name
      setSnackAlertData({
        open: true,
        message: response?.data?.message,
        severity: "success",
      });
    } catch (error) {
      console.error("Error submitting event:", error);
      setSnackAlertData({
        open: true,
        message: error?.response?.data?.message,
        severity: "error",
      });
      setLoading(false);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await axios({
        url: `${appUrl}/admin/get-all-active-users`,
        method: "get",
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
        },
        params: {
          limit: 8,
          searchTerm: searchQuery,
        },
      });
      console.log(response);
      setAllBrands(response?.data?.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, [searchQuery]);

  const handleBrandChange = (ownerId) => {
    setFormData((prev) => ({ ...prev, ownerId }));
  };
    useEffect(() => {
      if (Object.keys(errors).length > 0) {
        const errorIds = [
          'uploadBannerImage',
          'eventName',
          'start_date',
          'details',
          'address',
          'location',
        ];
        const firstErrorField = errorIds.find(field => errors[field]);
        if (firstErrorField) {
          let element = document.getElementById(firstErrorField);
          console.log(element)
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      }
    }, [errors]);

  return (
    <Box
      className="hide-scrollbar"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
        padding: "0px 21px",
      }}
    >
      <Box
        sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}
      >
        <Typography
          sx={{
            color: "white",
            fontWeight: "600",
            fontSize: {
              sm: "45px",
              xs: "30px",
            },
            fontFamily: "Fira Sans !important",
          }}
        >
          Add Event
        </Typography>
        <Typography
          sx={{ display: "flex", alignItems: "center", gap: ".3rem" }}
        >
          <MenuBar /> <NavigateBack />
        </Typography>
      </Box>
      <Box

        sx={{
          display: "flex",
          flexDirection: { lg: "row",
            xs:"column"
          },
          gap: "1.5rem",
          // height: {  xs: "170px",  },
        }}
      >
        {previewImage ? (
                            <img
                              src={previewImage}
                              alt="Selected Badge"
                              style={{
                                width: "auto",
                                height: "190px",
                                borderRadius: "12px",
                                objectFit: "contain",
                              }}
                            />
                          ) : (
                            <Box sx={{
                              height:"100%",
                              border: "2px dashed #FFA100",
                              backgroundColor: "#2E210A",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              borderRadius: "12px",
                              padding:{
                                xs:"20px",
                                md:"70px"
                              }
                            }}>
        
                            <Typography
                              sx={{
                                color: "#FFA100",
                                fontSize: "18px",
                                fontWeight: "600",
                                textAlign:"center"
                                
                              }}
                            >
                              Image Preview
                            </Typography>
                            </Box>
        
                          )}
        <label
          htmlFor="uploadBannerImage"
          style={{
            flexBasis: "100%",
            backgroundColor: "#2E210A",
            border: "2px dashed #FFA100",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "12px",
            cursor: "pointer",
          }}
        >
          <input
            type="file"
            id="uploadBannerImage"
            name="bannerImage"
            style={{ display: "none" }}
            onChange={handleChange}
            accept="image/png, image/jpg, image/jpeg, image/webp"
          />
          <Typography
            sx={{
              color: "white",
              textAlign: "center",
              fontSize: "22px",
              fontWeight: "600",
              padding:{
                xs:"20px",
                md:"70px"
              }

            }}
          >
            {selectedBannerFileName
              ? `Selected File: ${selectedBannerFileName}`
              : "Upload Banner Image"}
          </Typography>
        </label>
      </Box>
      <Box>
     { errors.bannerImage  && (
                  <Typography sx={{
                    background: "#2e210a",
                    p: "10px",
                    color: "red",
                    mt: "8px",
                    wordBreak: "break-word",
                    borderRadius: "5px"
                  }}>
                    {errors.bannerImage}
                  </Typography>
                )}
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: {
            md: "row",
            xs: "column",
          },
          gap: "1.5rem",
        }}
      >
        <Box
          sx={{
            flexBasis: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "0.3rem",
          }}
        >
          <Typography
          id="eventName"
            sx={{
              color: "#FFA100",
              fontWeight: "500",
              fontSize: {
                sm: "16px",
                xs: "16px",
              },
              fontFamily: "Montserrat !important",
            }}
          >
            Event Name*
          </Typography>
          <CustomInputShadow
          ref={{}}
            placeholder="Event Name"
            name="eventName"
            value={formData.eventName}
            onChange={handleChange}
            error={errors.eventName}
          />
        </Box>
     
      </Box>

      {state ? (
        ""
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
          <Typography
            sx={{
              color: "#FFA100",
              fontWeight: "500",
              fontSize: {
                sm: "16px",
                xs: "16px",
              },
              fontFamily: "Montserrat !important",
            }}
          >
           Select Organizer

          </Typography>

          <VirtualizedCustomSelect
            data={allBrands}
            handleChange={handleBrandChange}
            label="Select Brand"
            isMultiSelect={false} // Set to true if you need multi-select
            setSearchQuery={setSearchQuery}
            searchQuery={searchQuery}
          />
        </Box>
      )}


      <Box
        sx={{
          display: "flex",
          flexDirection: {
            md: "row",
            xs: "column",
          },
          gap: "1.5rem",
        }}
      >
        <Box
          sx={{
            flexBasis: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: "1.5rem",
              flexDirection: { md: "row", xs: "column" },
            }}
          >
            <Box
              sx={{
                flexBasis: "50%",
                display: "flex",
                flexDirection: "column",
                gap: "0.3rem",
              }}
            >
              <Typography
              id="start_date"
                sx={{
                  color: "#FFA100",
                  fontWeight: "500",
                  fontSize: {
                    sm: "16px",
                    xs: "16px",
                  },
                  fontFamily: "Montserrat !important",
                }}
              >
                Start Date*
              </Typography>
              <CustomInputShadow
                placeholder="Event start date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                error={errors.date}
                type={"date"} // Date input
              />
            </Box>

            <Box
              sx={{
                flexBasis: "50%",
                display: "flex",
                flexDirection: "column",
                gap: "0.3rem",
              }}
            >
              <Typography
                sx={{
                  color: "#FFA100",
                  fontWeight: "500",
                  fontSize: {
                    sm: "16px",
                    xs: "16px",
                  },
                  fontFamily: "Montserrat !important",
                }}
              >
                Start Time
              </Typography>
              <CustomInputShadow
                placeholder="Event start time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                error={errors.time}
                type={"time"} // Time input
              />
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              gap: "1.5rem",
              flexDirection: { md: "row", xs: "column" },
            }}
          >
            <Box
              sx={{
                flexBasis: "50%",
                display: "flex",
                flexDirection: "column",
                gap: "0.3rem",
              }}
            >
              <Typography
                sx={{
                  color: "#FFA100",
                  fontWeight: "500",
                  fontSize: {
                    sm: "16px",
                    xs: "16px",
                  },
                  fontFamily: "Montserrat !important",
                }}
              >
                End Date
              </Typography>
              <CustomInputShadow
                placeholder="Event end date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                error={errors.endDate}
                type={"date"} // Date input
              />
            </Box>

            <Box
              sx={{
                flexBasis: "50%",
                display: "flex",
                flexDirection: "column",
                gap: "0.3rem",
              }}
            >
              <Typography
                sx={{
                  color: "#FFA100",
                  fontWeight: "500",
                  fontSize: {
                    sm: "16px",
                    xs: "16px",
                  },
                  fontFamily: "Montserrat !important",
                }}
              >
                End Time
              </Typography>
              <CustomInputShadow
                placeholder="Event end time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                error={errors.endTime}
                type={"time"} // Time input
              />
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              gap: "1.5rem",
              flexDirection: { md: "row", xs: "column" },
            }}
          >
            <Box
              sx={{
                flexBasis: "50%",
                display: "flex",
                flexDirection: "column",
                gap: "0.3rem",
              }}
            >
              <Typography
                sx={{
                  color: "#FFA100",
                  fontWeight: "500",
                  fontSize: {
                    sm: "16px",
                    xs: "16px",
                  },
                  fontFamily: "Montserrat !important",
                }}
              >
                Website Link
              </Typography>
              <CustomInputShadow
                placeholder="https://example.com"
                name="websiteLink"
                value={formData.websiteLink}
                onChange={handleChange}
                error={errors.websiteLink}
              />
            </Box>

            <Box
              sx={{
                flexBasis: "50%",
                display: "flex",
                flexDirection: "column",
                gap: "0.3rem",
              }}
            >
              <Typography
                sx={{
                  color: "#FFA100",
                  fontWeight: "500",
                  fontSize: {
                    sm: "16px",
                    xs: "16px",
                  },
                  fontFamily: "Montserrat !important",
                }}
              >
                Facebook Link
              </Typography>
              <CustomInputShadow
                placeholder="https://example.com"
                name="facebookLink"
                value={formData.facebookLink}
                onChange={handleChange}
                error={errors.facebookLink}
              />
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              gap: "1.5rem",
              flexDirection: { md: "row", xs: "column" },
            }}
          >
            <Box
              sx={{
                flexBasis: "50%",
                display: "flex",
                flexDirection: "column",
                gap: "0.3rem",
              }}
            >
              <Typography
              id="address"
                sx={{
                  color: "#FFA100",
                  fontWeight: "500",
                  fontSize: {
                    sm: "16px",
                    xs: "16px",
                  },
                  fontFamily: "Montserrat !important",
                }}
              >
                Venue Address *
              </Typography>
              <CustomInputShadow
                placeholder="Venue Address"
                name="venueAddress"
                value={formData.venueAddress}
                onChange={handleChange}
                error={errors.venueAddress}
              />
            </Box>

            {/* <Box
              sx={{
                flexBasis: "50%",
                display: "flex",
                flexDirection: "column",
                gap: "0.3rem",
              }}
            >
              <Typography
                sx={{
                  color: "#FFA100",
                  fontWeight: "500",
                  fontSize: {
                    sm: "16px",
                    xs: "16px",
                  },
                  fontFamily: "Montserrat !important",
                }}
              >
                Destination
              </Typography>
              <CustomInputShadow
                placeholder="Destination"
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                error={errors.destination}
              />
            </Box> */}
          <Box 
          id="details"
          sx={{
            flexBasis:"50%"
          }}
          >
          <Typography
          sx={{
            color: "#FFA100",
            fontWeight: "500",
            fontSize: {
              sm: "16px",
              xs: "16px",
            },
            fontFamily: "Montserrat !important",
          }}
        >
          Details*
        </Typography>

        <CustomInputShadow
          placeholder="Event Details"
          name="details"
          value={formData.details}
          onChange={handleChange}
          error={errors.details}
        />
          </Box>
          </Box>


          {/* <Box
            sx={{
              flexBasis: "50%",
              display: "flex",
              flexDirection: "column",
              gap: "0.3rem",
            }}
          >
            <Typography
              sx={{
                color: "#FFA100",
                fontWeight: "500",
                fontSize: {
                  sm: "16px",
                  xs: "16px",
                },
                fontFamily: "Montserrat !important",
              }}
            >
              Description
            </Typography>
            <CustomInputShadow
              placeholder="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              error={errors.description}
            />
          </Box> */}
        </Box>
      </Box>

  
      <Box
        sx={{
          flexBasis: "50%",
          display: "flex",
          flexDirection: "column",
          gap: "0.3rem",
        }}
      >
        {/* <Typography
          sx={{
            color: "#FFA100",
            fontWeight: "500",
            fontSize: {
              sm: "16px",
              xs: "16px",
            },
            fontFamily: "Montserrat !important",
          }}
        >
          Details
        </Typography>

        <CustomInputShadow
          placeholder="Event Details"
          name="details"
          value={formData.details}
          onChange={handleChange}
          error={errors.details}
        /> */}

        {/* {formData.details.map((detail, index) => (
          <Box
            key={index}
            sx={{ display: "flex", alignItems: "center", gap: "1rem" }}
          >
            <Box sx={{ width: "100%" }}>
              <CustomInputShadow
                name={`details-${index}`}
                value={detail}
                onChange={(e) => handleDetailChange(index, e.target.value)}
                error={errors.details}
              />
            </Box>
            {formData.details.length > 1 && (
              <CustomButton
                border="1px solid #FFA100"
                ButtonText={"Remove"}
                color="white"
                height="100px"
                width={"98px"}
                borderRadius="6px"
                buttonStyle={{
                  height: { sm: "75px", xs: "68px" },
                  mt: "-16px",
                }}
                onClick={() => removeBullet("details", index)}
              />
            )}
          </Box>
        ))} */}
        {/* <CustomButton
          border="1px solid #FFA100"
          ButtonText={"Add Bullet"}
          color="white"
          height="100px"
          width={"100%"}
          borderRadius="6px"
          buttonStyle={{ height: "75px" }}
          onClick={() => addBullet("details")}
          fontSize="20px"
        /> */}

        <Box
          sx={{
            flexBasis: "33%",
            display: "flex",
            flexDirection: "column",
            gap: "0.3rem",
            mt: "30px",
          }}
        >
          <Typography
          id="location"
            sx={{
              color: "#FFA100",
              fontWeight: "500",
              fontSize: {
                sm: "16px",
                xs: "16px",
              },
              fontFamily: "Montserrat !important",
            }}
          >
            Search Location*
          </Typography>
          <input
            id="autocomplete"
            type="text"
            placeholder="Search for a place"
            style={{
              width: "100%",
              padding: "0px 20px",
              borderRadius: "10px",
              border: "1px solid #FFA100",
              fontSize: "22px",
              background: "#2e210a",

              height: "75px",
              color: "white",
              fontFamily: "poppins",
            }}
            className="inputCustom"
          />
             {errors.location  && (
                  <Typography sx={{
                    background: "#2e210a",
                    p: "10px",
                    color: "red",
                    mt: "8px",
                    wordBreak: "break-word",
                    borderRadius: "5px"
                  }}>
                    {errors.location}
                  </Typography>
                )}
        </Box>
      </Box>

      {/* Map for selecting location */}
      {/* <CustomButton
          border='1px solid #FFA100'
          ButtonText={"Load Map"}
          color='white'
          width={"178px"}
          borderRadius='8px'
          background='linear-gradient(90deg, #FFA100 0%, #FF7B00 100%)'
          padding='10px 0px'
          fontSize='18px'
          fontWeight='600'
          onClick={loadMap}
        /> */}
      <Box sx={{ width: "100%", height: "500px" }}>
        <div
          style={{ width: "100%", height: "100%", borderRadius: "12px" }}
          id="map"
        ></div>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 0 }}>
        <CustomButton
          border="1px solid #FFA100"
          ButtonText={loading ? "Adding" : "Add"}
          color="white"
          borderRadius="8px"
          background={
            loading ? "" : "linear-gradient(90deg, #FFA100 0%, #FF7B00 100%)"
          }
          fontSize="18px"
          fontWeight="600"
          onClick={handleSubmit}
          width={"208px"}
          padding="25px 0px"
        />
      </Box>
      <SnackAlert
        severity={snackAlertData.severity}
        message={snackAlertData.message}
        open={snackAlertData.open}
        handleClose={() => {
          setSnackAlertData((prev) => ({ ...prev, open: false }));
        }}
      />
    </Box>
  );
};

export default AddSEvent;

import React, { useState, useEffect, useRef, useCallback } from "react";
import CustomInputShadow from "../../Components/CustomInput/CustomInput";
import { Box, Typography } from "@mui/material";
import CustomButton from "../../Components/CustomButton/CustomButton";
import axios from "axios";
import Heading from "../../Components/Heading/Heading";
import SnackAlert from "../../Components/SnackAlert/SnackAlert";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import MenuBar from "../../Components/MenuBar/MenuBar";
import NavigateBack from "../../Components/NavigateBackButton/NavigateBack";
const appUrl = import.meta.env.VITE_REACT_APP_API_URL;
import { Loader } from "@googlemaps/js-api-loader";
import CustomSelect from "../../Components/CustomSelect/CustomSelect";
import debounce from "lodash";



const EditEvents = () => {
  const auth = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const [allBrands, setAllBrands] = useState([]);

  const [searchTerm, setSearchTerm] = useState("")
  

  const [snackAlertData, setSnackAlertData] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [formData, setFormData] = useState({
    eventName: "",
    organizedBy: "",
    ownerId: "",
    date: "",
    time: "",
    endDate: "",
    endTime: "",
    description: "",
    details: "",
    destination: "",
    bannerImage: null,
    coordinates: { lat: null, lng: null }, // Coordinates for latitude and longitude
    venueAddress:"",
    facebookLink: "",
    websiteLink:""
  });
  const [errors, setErrors] = useState({});
  const [selectedBannerFileName, setSelectedBannerFileName] = useState("");
  let [marker, setMarker] = useState(null); // State to store marker
  const [mapLoaded, setMapLoaded] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const mapRef = useRef(null); // To store the map instance
  const autocompleteRef = useRef(null);
  const loader = new Loader({
    apiKey: "AIzaSyAkJ06-4A1fY1ekldJUZMldHa5QJioBTlY", // Replace with your Google Maps API key
    version: "weekly",
    libraries: ["places"],
  });

  const mapOptions = {
    center: { lat: 0, lng: 0 },
    zoom: 4,
  };

  const loadMapWithMarker = async (lat, lng) => {
    loader
      .load()
      .then((google) => {
        const map = new google.maps.Map(document.getElementById("map"), {
          ...mapOptions,
          center: { lat, lng },
          zoom: 15,
        });

        // Add autocomplete search box
        const input = document.getElementById("autocomplete");
        const autocomplete = new google.maps.places.Autocomplete(input, {
          fields: ["place_id", "geometry", "formatted_address"],
        });
        autocompleteRef.current = autocomplete;

        // Listener for autocomplete place selection
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
              coordinates: { lat, lng },
            }));

            // Remove the existing marker if it exists
            if (marker) {
              marker.setMap(null);
            }

            // Add a new marker for the selected place
            marker = new google.maps.Marker({
              position: { lat, lng },
              map,
            });

            setMarker(marker);
          }
        });

        // Listener for map click to add a new marker
        map.addListener("click", (event) => {
          const newLat = event.latLng.lat();
          const newLng = event.latLng.lng();

          setFormData((prev) => ({
            ...prev,
            coordinates: { lat: newLat, lng: newLng },
          }));

          // Remove the previous marker if it exists
          if (marker) {
            marker.setMap(null);
          }

          // Add the new marker
          marker = new google.maps.Marker({
            position: { lat: newLat, lng: newLng },
            map,
          });

          setMarker(marker);
          console.log(
            `Coordinates selected: Latitude: ${newLat}, Longitude: ${newLng}`
          );
        });

        // If lat/lng are provided, add an initial marker
        if (lat && lng) {
          if (marker) {
            marker.setMap(null); // Remove the existing marker if present
          }

          marker = new google.maps.Marker({
            position: { lat, lng },
            map,
          });

          setMarker(marker);
        }
      })
      .catch((e) => {
        console.error("Error loading Google Maps:", e);
      });
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      const file = files[0];
      setFormData({
        ...formData,
        [name]: file, // Save the file
      });
      setPreviewImage(URL.createObjectURL(file)); // Show the new selected image as a preview
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleDetailChange = (index, value) => {
    const updatedDetails = formData.details.map((detail, i) =>
      i === index ? value : detail
    );
    setFormData({
      ...formData,
      details: updatedDetails,
    });
  };

  const addBullet = (field) => {
    setFormData({
      ...formData,
      [field]: [...formData[field], ""],
    });
  };

  const removeBullet = (field, index) => {
    if (formData[field].length > 1) {
      const updatedField = formData[field].filter((_, i) => i !== index);
      setFormData({
        ...formData,
        [field]: updatedField,
      });
    }
  };

  const handleSubmit = async () => {
    console.log("Form data submitted:", formData);

    // Check for file size
    if (formData.bannerImage && formData.bannerImage.size > 4 * 1024 * 1024) {
      setSnackAlertData({
        open: true,
        message: "Selected banner image size exceeds 4MB.",
        severity: "error",
      });
      return;
    }
    const formattedDate = new Date(formData.date).toISOString();
    const eventDateTime = new Date(
      `${formData.date}T${formData.time}`
    ).toISOString();

    const eventDateEndTime = new Date(
      `${formData.endDate}T${formData.endTime}`
    ).toISOString();

    const formDataToSend = new FormData();
    formDataToSend.append("eventName", formData.eventName);
    formDataToSend.append("organizedBy", formData.organizedBy);
    formDataToSend.append("eventDate", eventDateTime);
    formDataToSend.append("eventEndDate", eventDateEndTime);
    formDataToSend.append("ownerId", formData.ownerId);



    formDataToSend.append("venueDescription", formData.description);
    formDataToSend.append("venueName", formData.destination);
    formDataToSend.append("bannerImage", formData.bannerImage);
    formDataToSend.append("venueLocation.latitude", formData.coordinates.lat);
    formDataToSend.append("venueLocation.longitude", formData.coordinates.lng);
    formDataToSend.append("details", formData.details);



    formDataToSend.append("venueAddress", formData.venueAddress);
    formDataToSend.append("websiteLink", formData.websiteLink);
    formDataToSend.append("facebookLink", formData.facebookLink);


    try {
      setLoading(true);
      const response = await axios({
        url: `${appUrl}/admin/update-event/${id}`,
        method: "put",
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
          "Content-Type": "multipart/form-data",
        },

        data: formDataToSend,
      });

      setSelectedBannerFileName(""); // Reset file name
      setSnackAlertData({
        open: true,
        message: response?.data?.message,
        severity: "success",
      });
      console.log(response.data);
      setLoading(false);
      // navigate(-1)
      fetchEvent();
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

  const fetchEvent = async () => {
    try {
      const response = await axios({
        url: `${appUrl}/admin/get-event/${id}`,
        method: "get",
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
        },
      });
      console.log(response.data);
      const eventData = response?.data?.event;
      console.log(eventData.eventDate);
      const utcDate = new Date(eventData?.eventDate);
      const localDate = new Date(utcDate.getTime() - utcDate.getTimezoneOffset() * 60000);

      setFormData({
        eventName: eventData?.eventName,
        organizedBy: eventData?.owner?.name,
        ownerId: eventData?.owner?._id,

        venueAddress: eventData?.venueAddress,
        websiteLink: eventData?.websiteLink,
        facebookLink: eventData?.facebookLink,
        date: new Date(eventData?.eventDate).toLocaleDateString("en-CA"), // Local date format (YYYY-MM-DD)
        time: new Date(eventData?.eventDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }), 
        endDate: new Date(eventData?.eventEndDate).toLocaleDateString("en-CA"), // Local date format (YYYY-MM-DD)
        endTime: new Date(eventData?.eventEndDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }), 
        description: eventData?.venueDescription,
        details: eventData?.eventDetails || "", 
        destination: eventData?.venueName,
        bannerImage: eventData.bannerImage,
        coordinates: {
          lat: parseFloat(eventData?.venueLocation?.latitude),
          lng: parseFloat(eventData?.venueLocation?.longitude),
        },
      });
      // Set the preview image from the existing banner image URL
     
      
      setPreviewImage(eventData.bannerImage);

      // Load the map with the initial marker
      loadMapWithMarker(
        parseFloat(eventData?.venueLocation?.latitude),
        parseFloat(eventData?.venueLocation?.longitude)
      );
    } catch (error) {
      console.error("Error fetching event:", error);
    }
  };

  useEffect(() => {
    fetchEvent();
    loadMapWithMarker();
  }, []);

  const fetchBrands = async () => {
    try {
      const response = await axios({
        url: `${appUrl}/admin/get-all-users`,
        method: "get",
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
        },
        params: {
          limit: 10,
          searchTerm: searchTerm
        },
      });
      setAllBrands(response?.data?.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchBrands();
    }, 1000); // Set the debounce delay (300ms in this example)
  
    // Cleanup function to cancel the timeout if searchTerm changes or component unmounts
    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]); 
  const handleBrandChange = (ownerId) => {
    setFormData((prev) => ({ ...prev, ownerId }));

    console.log(ownerId)
  };

  return (
    <Box
      className="hide-scrollbar"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
        padding: "0px 10px 25px 30px",
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
          Edit Event
        </Typography>
        <Typography
          sx={{ display: "flex", alignItems: "center", gap: ".3rem" }}
        >
          <MenuBar /> <NavigateBack />
        </Typography>
      </Box>
      {/* Image Preview and Upload Section */}
      <Box sx={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
        {/* Image Preview */}
        <Box
          sx={{
            width: "100%",
            height: "165px",
            flexBasis: "50%",
            display: "flex",
            justifyContent: "center  ",
          }}
        >
          {previewImage ? (
            <img
              src={previewImage}
              alt="Event Banner"
              style={{
                width: "200px",
                height: "100%",
                objectFit: "cover",
                borderRadius: "12px",
              }}
            />
          ) : (
            <Typography
              sx={{
                color: "white",
                textAlign: "center",
                fontSize: { sm: "22px", xs: "15px" },
                fontWeight: "600",
              }}
            >
              No Image
            </Typography>
          )}
        </Box>

        {/* File Input */}
        <label
          htmlFor="uploadBannerImage"
          style={{
            cursor: "pointer",
            color: "#FFA100",
            textAlign: "center",
            border: "2px dashed #FFA100",
            flexBasis: "50%",
            height: "165px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#2E210A",
            borderRadius: "8px",
          }}
        >
          <input
            type="file"
            id="uploadBannerImage"
            name="bannerImage"
            style={{ display: "none" }}
            onChange={handleChange}
          />
          <Typography
            sx={{ fontSize: { sm: "22px", xs: "15px" }, fontWeight: "600" }}
          >
            {selectedBannerFileName
              ? `${selectedBannerFileName}`
              : "Upload Image"}
          </Typography>
        </label>
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
            Event Name
          </Typography>
          <CustomInputShadow
            placeholder="Event Name"
            name="eventName"
            value={formData.eventName}
            onChange={handleChange}
            error={errors.eventName}
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
            Organized By
          </Typography>
          <CustomInputShadow
            placeholder="Organized By"
            name="organizedBy"
            value={formData.organizedBy}
            onChange={handleChange}
            error={errors.organizedBy}
          />
        </Box>
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
               Start  Date
              </Typography>
              <CustomInputShadow
                placeholder="Date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                error={errors.date}
                type={"date"}
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
                  fontSize: { sm: "16px", xs: "16px" },
                  fontFamily: "Montserrat !important",
                }}
              >
               Start Time
              </Typography>
              <CustomInputShadow
                placeholder="Time"
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
                placeholder="Date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                error={errors.endDate}
                type={"date"}
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
                  fontSize: { sm: "16px", xs: "16px" },
                  fontFamily: "Montserrat !important",
                }}
              >
               End Time
              </Typography>
              <CustomInputShadow
                placeholder="Time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                error={errors.endTime}
                type={"time"} 
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
                placeholder="Website Link"
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
                placeholder="Facebook Link"
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
                Venue Address
              </Typography>
              <CustomInputShadow
                placeholder="Venue Address"
                name="venueAddress"
                value={formData.venueAddress}
                onChange={handleChange}
                error={errors.venueAddress}
                
              />
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
              type={"text"}
            />
          </Box>
        
        </Box>
      </Box>
      <Box
        sx={{
          flexBasis: "100%",
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
          Details
        </Typography>
        <CustomInputShadow
              placeholder="Event Details"
              name="details"
              value={formData.details}
              onChange={handleChange}
              error={errors.details}
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
          Search Brand
        </Typography>
        <CustomInputShadow
          placeholder="Search Brand"
          name="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>
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
            Brand
          </Typography>

          <CustomSelect data={allBrands} handleChange={handleBrandChange} />
        </Box>
      <Box
        sx={{
          flexBasis: "33%",
          display: "flex",
          flexDirection: "column",
          gap: "0.3rem",
          mt: "0px",
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
          Search Location
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
      </Box>
      {/* Map for showing and selecting location */}
      <Box sx={{ width: "100%", height: "500px" }}>
        <div
          style={{ width: "100%", height: "100%", borderRadius: "12px" }}
          id="map"
        ></div>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 0 }}>
        <CustomButton
          border="1px solid #FFA100"
          ButtonText={loading ? "Updating" : "Update"}
          color="white"
          width={"178px"}
          borderRadius="8px"
          background={
            loading ? "" : "linear-gradient(90deg, #FFA100 0%, #FF7B00 100%)"
          }
          padding="10px 0px"
          fontSize="18px"
          fontWeight="600"
          onClick={handleSubmit}
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

export default EditEvents;

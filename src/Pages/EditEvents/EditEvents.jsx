import React, { useState, useEffect } from 'react';
import CustomInputShadow from '../../Components/CustomInput/CustomInput';
import { Box, Typography } from '@mui/material';
import CustomButton from '../../Components/CustomButton/CustomButton';
import axios from 'axios';
import Heading from '../../Components/Heading/Heading';
import SnackAlert from '../../Components/SnackAlert/SnackAlert';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import MenuBar from '../../Components/MenuBar/MenuBar';
import NavigateBack from '../../Components/NavigateBackButton/NavigateBack';
const appUrl = import.meta.env.VITE_REACT_APP_API_URL;
import { Loader } from '@googlemaps/js-api-loader';

const EditEvents = () => {
  const auth = useSelector((state) => state.auth);
  const [loading, setLoading]= useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const [snackAlertData, setSnackAlertData] = useState({
    open: false,
    message: "",
    severity: "success"
  });
  const [formData, setFormData] = useState({
    eventName: '',
    organizedBy: '',
    ownerId: "",
    date: '',
    description: '',
    details: [''],
    destination: '',
    bannerImage: null,
    coordinates: { lat: null, lng: null }, // Coordinates for latitude and longitude
  });
  const [errors, setErrors] = useState({});
  const [selectedBannerFileName, setSelectedBannerFileName] = useState("");
  const [marker, setMarker] = useState(null); // State to store marker
  const [mapLoaded, setMapLoaded] = useState(false);
  const [previewImage, setPreviewImage] = useState(""); 
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
    loader.load()
      .then((google) => {
        const map = new google.maps.Map(document.getElementById("map"), {
          ...mapOptions,
          center: { lat, lng },
          zoom: 15,
        });

       map.addListener('click', (event) => {
          const newLat = event.latLng.lat();
          const newLng = event.latLng.lng();
          setFormData((prev) => ({
            ...prev,
            coordinates: { lat: newLat, lng: newLng },
          }));

          // Remove the previous marker if it exists
          if (marker) {
            marker.setMap(null);
            setMarker(null);
          }

          // Add the new marker
          const newMarker = new google.maps.Marker({
            position: { lat: newLat, lng: newLng },
            map,
          });

          setMarker(newMarker);
          console.log(`Coordinates selected: Latitude: ${newLat}, Longitude: ${newLng}`); 
        });

        const initialMarker = new google.maps.Marker({
          position: { lat, lng },
          map,
        });
        setMarker(initialMarker);
      })
      .catch((e) => {
        console.error("Error loading Google Maps:", e);
      });
  };


  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      const file = files[0];
      setFormData({
        ...formData,
        [name]: file // Save the file
      });
      setPreviewImage(URL.createObjectURL(file)); // Show the new selected image as a preview
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleDetailChange = (index, value) => {
    const updatedDetails = formData.details.map((detail, i) =>
      i === index ? value : detail
    );
    setFormData({
      ...formData,
      details: updatedDetails
    });
  };

  const addBullet = (field) => {
    setFormData({
      ...formData,
      [field]: [...formData[field], '']
    });
  };

  const removeBullet = (field, index) => {
    if (formData[field].length > 1) {
      const updatedField = formData[field].filter((_, i) => i !== index);
      setFormData({
        ...formData,
        [field]: updatedField
      });
    }
  };

  const handleSubmit = async () => {
    console.log('Form data submitted:', formData);

    // Check for file size
    if (formData.bannerImage && formData.bannerImage.size > 4 * 1024 * 1024) {
      setSnackAlertData({
        open: true,
        message: "Selected banner image size exceeds 4MB.",
        severity: "error",
      });
      return;
    }


    const formDataToSend = new FormData();
    formDataToSend.append('eventName', formData.eventName);
    formDataToSend.append('organizedBy', formData.organizedBy);
    formDataToSend.append('eventDate', Math.floor(new Date(formData.date).getTime() / 1000));
    formDataToSend.append('venueDescription', formData.description);
    formDataToSend.append('venueName', formData.destination);
    formDataToSend.append('bannerImage', formData.bannerImage);
    formDataToSend.append('venueLocation.latitude', formData.coordinates.lat);
    formDataToSend.append('venueLocation.longitude', formData.coordinates.lng);
    formData.details.forEach((detail, index) => {
      formDataToSend.append(`eventDetails[${index}]`, detail);  
    });

   
    try {
      setLoading(true)
      const response = await axios({
        url: `${appUrl}/admin/update-event/${id}`,
        method: "put",
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
          'Content-Type': 'multipart/form-data'
        },
       
        data: formDataToSend
      });

      setSelectedBannerFileName(""); // Reset file name
      setSnackAlertData({
        open: true,
        message: response?.data?.message,
        severity: "success",
      });
      console.log(response.data);
      setLoading(false)
      // navigate(-1)
      fetchEvent()
     
    } catch (error) {
      console.error('Error submitting event:', error);
      setSnackAlertData({
        open: true,
        message: error?.response?.data?.message,
        severity: "error",
      });
      setLoading(false)

    }
  };

  const fetchEvent = async () => {
    try {
      const response = await axios({
        url: `${appUrl}/admin/get-event/${id}`,
        method: "get",
        headers: {
          Authorization: `Bearer ${auth.accessToken}`
        },
      });
      console.log(response.data);
      const eventData = response?.data?.event;
      setFormData({
        eventName: eventData?.eventName,
        organizedBy: eventData?.owner.name,
        date: new Date(eventData?.eventDate * 1000).toISOString().split('T')[0], // Convert Unix timestamp to 'YYYY-MM-DD' format
        description: eventData?.venueDescription,
        details: eventData?.eventDetails || [''], // Ensure details is an array
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
      console.error('Error fetching event:', error);
    }
  };

  useEffect(() => {
    fetchEvent();
    loadMapWithMarker();
    
  }, []);

  return (
    <Box
      className="hide-scrollbar"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
        padding: "0px 10px 25px 10px"
      }}
    >
      <Box sx={{display:"flex", justifyContent:"space-between", width:"100%"}} >
        <Typography sx={{
            color: "white",
            fontWeight: "600",
            fontSize: {
                sm: "45px",
                xs: "30px"
            },
            fontFamily: "Fira Sans !important",
        }}>
            Edit Event
        </Typography>
        <Typography sx={{display:"flex", alignItems:"center", gap:".3rem"}}>
          <MenuBar/>  <NavigateBack /> 
        </Typography>
      </Box>
         {/* Image Preview and Upload Section */}
         <Box sx={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
        {/* Image Preview */}
        <Box sx={{ width: "200px", height: "165px" }}>
          {previewImage ? (
            <img
              src={formData.bannerImage}
              alt="Event Banner"
              style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "12px" }}
            />
          ) : (
            <Typography sx={{ color: "white", textAlign: "center", fontSize: { sm: "22px", xs: "15px" }, fontWeight: "600" }}>
              No Image
            </Typography>
          )}
        </Box>

        {/* File Input */}
        <label htmlFor="uploadBannerImage" style={{ cursor: "pointer", color: "#FFA100", textAlign: "center" , border:"2px solid yellow"}}>
          <input type="file" id="uploadBannerImage" name="bannerImage" style={{ display: 'none' }} onChange={handleChange} />
          <Typography sx={{ fontSize: { sm: "22px", xs: "15px" }, fontWeight: "600" }}>
            {selectedBannerFileName ? `Click to change Image` : "Upload Image"}
          </Typography>
        </label>
      </Box>
      <Box sx={{
        display: "flex",
        flexDirection: {
          md: "row",
          xs: "column"
        },
        gap: "1.5rem",
      }}>
        <Box sx={{ flexBasis: "50%", display: "flex",
            flexDirection: "column",
            gap: "0.3rem",   }}>
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
        <Box sx={{ flexBasis: "50%", display: "flex",
            flexDirection: "column",
            gap: "0.3rem",   }}>
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
      <Box sx={{
        display: "flex",
        flexDirection: {
          md: "row",
          xs: "column"
        },
        gap: "1.5rem",
      }}>
        <Box sx={{ flexBasis: "100%", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <Box sx={{ display: "flex", gap: "1.5rem", flexDirection: { md: "row", xs: "column" } }}>
            <Box sx={{flexBasis: "50%", display: "flex",
            flexDirection: "column",
            gap: "0.3rem", }}>
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
          Date
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
            <Box sx={{flexBasis:"50%",  display: "flex",
            flexDirection: "column",
            gap: "0.3rem",}}>
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
          Date
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
          <Box sx={{display: "flex",
            flexDirection: "column",
            gap: "0.3rem",}} >
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
        </Box>
      </Box>
      <Box sx={{ flexBasis: "100%", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
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
        {formData.details.map((detail, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
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
                border='1px solid #FFA100'
                ButtonText={"Remove"}
                color='white'
                height="100px"
                width={"98px"}
                borderRadius='8px'
                buttonStyle={{ height: "75px" , mb:"18px" }}
                onClick={() => removeBullet('details', index)}
              />
            )}
          </Box>
        ))}
        <CustomButton
          border='1px solid #FFA100'
          ButtonText={"Add Bullet"}
          color='white'
          height="100px"
          width={"100%"}
          borderRadius='6px'
          buttonStyle={{ height: "75px" }}
          onClick={() => addBullet('details')}
          fontSize='20px'
          fontWeight='600'
        />
      </Box>
       {/* Map for showing and selecting location */}
       <Box sx={{ width: "100%", height: "500px" }}>
        <div style={{ width: "100%", height: "100%", borderRadius: "12px" }} id="map"></div>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 0 }}>
        <CustomButton
          border='1px solid #FFA100'
          ButtonText={loading ? "Saving": "Save"}
          color='white'
          width={"178px"}
          borderRadius='8px'
          background= {loading? "" :  'linear-gradient(90deg, #FFA100 0%, #FF7B00 100%)'}
          padding='10px 0px'
          fontSize='18px'
          fontWeight='600'
          onClick={handleSubmit}
        />
      </Box>
      <SnackAlert
        severity={snackAlertData.severity}
        message={snackAlertData.message}
        open={snackAlertData.open}
        handleClose={() => { setSnackAlertData(prev => ({ ...prev, open: false })) }}
      />
    </Box>
  );
};

export default EditEvents;

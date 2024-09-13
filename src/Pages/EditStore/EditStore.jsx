import React, { useState, useEffect } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import CustomInputShadow from '../../Components/CustomInput/CustomInput';
import { Box, Typography } from '@mui/material';
import CustomButton from '../../Components/CustomButton/CustomButton';
import axios from 'axios';
import SnackAlert from '../../Components/SnackAlert/SnackAlert';
import MenuBar from '../../Components/MenuBar/MenuBar';
import NavigateBack from '../../Components/NavigateBackButton/NavigateBack';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

const appUrl = import.meta.env.VITE_REACT_APP_API_URL;

const EditStore = () => {
  const auth = useSelector((state) => state.auth);
  const [snackAlertData, setSnackAlertData] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [formData, setFormData] = useState({
    storeName: '',
    coordinates: { lat: null, lng: null }, // Coordinates for latitude and longitude
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const [marker, setMarker] = useState(null); // State to store marker
  const [mapLoaded, setMapLoaded] = useState(false);
  const { id } = useParams(); // Store ID from the URL parameters

  const loader = new Loader({
    apiKey: "AIzaSyAkJ06-4A1fY1ekldJUZMldHa5QJioBTlY", // Replace with your Google Maps API key
    version: "weekly",
    libraries: ["places"],
  });

  const mapOptions = {
    center: { lat: 0, lng: 0 },
    zoom: 4,
  };

  // Load the map and add a marker
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

  // Fetch the store details from the API and populate the form
  const fetchStoreDetails = async () => {
    try {
      const response = await axios({
        url: `${appUrl}/admin/get-specific-store/${id}`,
        method: 'get',
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
        },
      });

      const { store } = response.data;
      setFormData({
        storeName: store.storeName,
        coordinates: {
          lat: parseFloat(store.storeLocation.latitude),
          lng: parseFloat(store.storeLocation.longitude),
        },
      });

      // Load the map with the marker for the retrieved location
      loadMapWithMarker(
        parseFloat(store.storeLocation.latitude),
        parseFloat(store.storeLocation.longitude)
      );

    } catch (error) {
      console.error('Error fetching store details:', error);
      setSnackAlertData({
        open: true,
        message: 'Failed to fetch store details.',
        severity: 'error',
      });
    }
  };

  useEffect(() => {
    fetchStoreDetails(); // Fetch store details on component mount
    loadMapWithMarker();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "lat" || name === "lng") {
      setFormData({
        ...formData,
        coordinates: { ...formData.coordinates, [name]: value },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Handle submitting updated store details
  const handleSubmit = async () => {
    console.log(id)
    try {
      setLoading(true);
      const response = await axios({
        url: `${appUrl}/admin/edit-store/${id}`,
        method: 'patch',
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
          'Content-Type': 'application/json',
        },
        data: {
          storeName: formData.storeName,
          latitude: formData.coordinates.lat.toString(),
          longitude: formData.coordinates.lng.toString(),
        },
      });

      setSnackAlertData({
        open: true,
        message: 'Store updated successfully!',
        severity: 'success',
      });

      setLoading(false);
      fetchStoreDetails();
    } catch (error) {
      console.error('Error updating store:', error);
      setSnackAlertData({
        open: true,
        message: 'Failed to update store.',
        severity: 'error',
      });
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '0px 21px' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <Typography
          sx={{
            color: 'white',
            fontWeight: '600',
            fontSize: {
              lg: '45px',
              sm: '40px',
              xs: '30px',
            },
            fontFamily: 'Fira Sans !important',
          }}
        >
          Edit Store
        </Typography>
        <Typography sx={{ display: 'flex', alignItems: 'center', gap: '.3rem' }}>
          <MenuBar /> <NavigateBack />
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: { md: 'column', xs: 'column' }, gap: '1.5rem' }}>
        <Box sx={{ flexBasis: '33%', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          <Typography
            sx={{
              color: '#FFA100',
              fontWeight: '500',
              fontSize: {
                sm: '16px',
                xs: '16px',
              },
              fontFamily: 'Montserrat !important',
            }}
          >
            Store Name
          </Typography>
          <CustomInputShadow
            placeholder="Store Name"
            name="storeName"
            value={formData.storeName}
            onChange={handleChange}
            error={errors.storeName}
          />
        </Box>
      </Box>

      {/* Map for selecting store location */}
      <Box sx={{ width: "100%", height: "500px" }}>
        <div style={{ width: "100%", height: "100%", borderRadius: "12px" }} id="map"></div>
      </Box>


<Box sx={{
  display:"flex",
  justifyContent:"end"
}} >
      <CustomButton
        border="1px solid #FFA100"
        ButtonText={loading ? 'Updating...' : 'Update Store'}
        color="white"
        width="178px"
        borderRadius="8px"
        background={loading ? '' : 'linear-gradient(90deg, #FFA100 0%, #FF7B00 100%)'}
        padding="10px 0px"
        fontSize="18px"
        fontWeight="600"
        onClick={handleSubmit}
        disabled={loading}
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

export default EditStore;
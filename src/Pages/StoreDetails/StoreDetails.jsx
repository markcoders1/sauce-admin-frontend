import React, { useState, useEffect } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Box, Typography } from '@mui/material';
import axios from 'axios';
import SnackAlert from '../../Components/SnackAlert/SnackAlert';
import MenuBar from '../../Components/MenuBar/MenuBar';
import NavigateBack from '../../Components/NavigateBackButton/NavigateBack';
import CustomInputShadow from '../../Components/CustomInput/CustomInput'; // Assuming you're using CustomInputShadow for input fields
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const appUrl = import.meta.env.VITE_REACT_APP_API_URL;

const StoreDetails = () => {
  const auth = useSelector((state) => state.auth);
  const [snackAlertData, setSnackAlertData] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [storeData, setStoreData] = useState({
    storeName: '',
    coordinates: { lat: null, lng: null },
  });
  const [mapLoaded, setMapLoaded] = useState(false);
  const [marker, setMarker] = useState(null); // To store the marker instance
  const { id } = useParams(); // Store ID from the URL parameters

  const loader = new Loader({
    apiKey: "AIzaSyAkJ06-4A1fY1ekldJUZMldHa5QJioBTlY", // Replace with your own API key
    version: "weekly",
    libraries: ["places"],
  });

  const mapOptions = {
    center: { lat: 0, lng: 0 },
    zoom: 4,
  };

  // Function to load the map and set the marker for the coordinates from the API
  const loadMapWithMarker = async (lat, lng) => {
    loader.load()
      .then((google) => {
        const map = new google.maps.Map(document.getElementById("map"), {
          ...mapOptions,
          center: { lat, lng },
          zoom: 15, // Adjust zoom to focus on the location
        });

        // Create a marker and set it to the given coordinates
        const marker = new google.maps.Marker({
          position: { lat, lng },
          map,
        });

        setMarker(marker); // Save the marker instance
      })
      .catch((e) => {
        console.error("Error loading Google Maps:", e);
      });
  };

  // Fetch the store details from the API and display them
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
      setStoreData({
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
  }, []);

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
          Store Details
        </Typography>
        <Typography sx={{ display: 'flex', alignItems: 'center', gap: '.3rem' }}>
          <MenuBar /> <NavigateBack />
        </Typography>
      </Box>

      {/* Display Store Name in a disabled input field */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
          inputStyle={{color:"white"}}
          name="storeName"
          value={storeData.storeName}
        //  disabled // Make the input field disabled to prevent editing
        />
      </Box>

      {/* Map for showing the location */}
      <Box sx={{ width: "100%", height: "500px" }}>
        <div style={{ width: "100%", height: "100%" , borderRadius:"12px"}} id='map'>Map</div>
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

export default StoreDetails;

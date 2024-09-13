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
  const [mapLoaded, setMapLoaded] = useState(false);
  const navigate = useNavigate();
  const [marker, setMarker] = useState(null); // State to store the marker
  const { id } = useParams(); // Store ID from the URL parameters

  const loader = new Loader({
    apiKey: "AIzaSyAkJ06-4A1fY1ekldJUZMldHa5QJioBTlY",
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
          latitude: formData.coordinates.lat,
          longitude: formData.coordinates.lng,
        },
      });

      setSnackAlertData({
        open: true,
        message: 'Store updated successfully!',
        severity: 'success',
      });

      setLoading(false);
      navigate('/admin/store-management'); // Redirect to store management after success
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
            Latitude
          </Typography>
          <CustomInputShadow
            placeholder="Latitude"
            name="lat"
            value={formData.coordinates.lat}
            onChange={handleChange}
            error={errors.latitude}
          />
        </Box>
      </Box>

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
          Longitude
        </Typography>
        <CustomInputShadow
          placeholder="Longitude"
          name="lng"
          value={formData.coordinates.lng}
          onChange={handleChange}
          error={errors.longitude}
        />
      </Box>

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

      <Box sx={{ width: "100%", height: "500px" }}>
        <div style={{ width: "100%", height: "100%" }} id='map'>Map</div>
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

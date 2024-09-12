import React, { useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import CustomInputShadow from '../../Components/CustomInput/CustomInput';
import { Box, Typography } from '@mui/material';
import CustomButton from '../../Components/CustomButton/CustomButton';
import axios from 'axios';
import SnackAlert from '../../Components/SnackAlert/SnackAlert';
import MenuBar from '../../Components/MenuBar/MenuBar';
import NavigateBack from '../../Components/NavigateBackButton/NavigateBack';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const appUrl = import.meta.env.VITE_REACT_APP_API_URL;

const AddStore = () => {
  const auth = useSelector((state) => state.auth);
//   console.log(auth)
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

  const loader = new Loader({
    apiKey: "AIzaSyAkJ06-4A1fY1ekldJUZMldHa5QJioBTlY",
    version: "weekly",
    libraries: ["places"],
  });

  const mapOptions = {
    center: { lat: 0, lng: 0 },
    zoom: 4,
  };

  // Function to load the map and set the coordinates on click
  const loadMap = async () => {
    if (!mapLoaded) {
      loader.load()
        .then((google) => {
          const map = new google.maps.Map(document.getElementById("map"), mapOptions);

          // Set latitude and longitude on map click
          map.addListener('click', (event) => {
            const lat = event.latLng.lat();
            const lng = event.latLng.lng();
            setFormData((prev) => ({
              ...prev,
              coordinates: { lat, lng },
            }));
            console.log(`Coordinates selected: Latitude: ${lat}, Longitude: ${lng}`);
          });

          setMapLoaded(true); // Mark map as loaded
        })
        .catch((e) => {
          console.error("Error loading Google Maps:", e);
        });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    console.log(`Store Name Input: ${value}`);
  };

  const handleSubmit = async () => {
    console.log('Form data submitted:', formData);

    if (!formData.storeName) {
      setSnackAlertData({
        open: true,
        message: 'Store Name is required',
        severity: 'error',
      });
      return;
    }

    if (!formData.coordinates.lat || !formData.coordinates.lng) {
      setSnackAlertData({
        open: true,
        message: 'Please select a location on the map',
        severity: 'error',
      });
      return;
    }

    const data = {
      storeName: formData.storeName,
      latitude: formData.coordinates.lat.toString(), // Send latitude
      longitude: formData.coordinates.lng.toString(), // Send longitude
      postedBy : auth._id
    };

    try {
      setLoading(true);
      const response = await axios({
        url: `${appUrl}/admin/add-store`,
        method: 'post',
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
          'Content-Type': 'application/json',
        },
        data: data,
      });

      setFormData({ storeName: '', coordinates: { lat: null, lng: null } });
      setLoading(false);

      setSnackAlertData({
        open: true,
        message: response?.data?.message,
        severity: 'success',
      });

      console.log(response.data);
    } catch (error) {
      console.error('Error submitting store:', error);
      setSnackAlertData({
        open: true,
        message: error?.response?.data?.error?.message || error?.response?.data?.message,
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
          Add New Store
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

      <CustomButton
        border="1px solid #FFA100"
        ButtonText={"Open Map"}
        color="white"
        width="178px"
        borderRadius="8px"
        background={loading ? '' : 'linear-gradient(90deg, #FFA100 0%, #FF7B00 100%)'}
        padding="10px 0px"
        fontSize="18px"
        fontWeight="600"
        onClick={loadMap}
      />

      <Box sx={{ width: "100%", height: "500px" }}>
        <div style={{ width: "100%", height: "100%" }} id='map'>Map</div>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 0 }}>
        <CustomButton
          border="1px solid #FFA100"
          ButtonText={loading ? 'Saving' : 'Save'}
          color="white"
          width="178px"
          borderRadius="8px"
          background={loading ? '' : 'linear-gradient(90deg, #FFA100 0%, #FF7B00 100%)'}
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

export default AddStore;

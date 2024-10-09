import React, { useEffect, useState, useRef } from 'react';
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
import './AddStore.css'


import {
  setKey,
  setDefaults,
  setLanguage,
  setRegion,
  fromAddress,
  fromLatLng,
  fromPlaceId,
  setLocationType,
  geocode,
  RequestType,
} from "react-geocode";

const appUrl = import.meta.env.VITE_REACT_APP_API_URL;

const AddStore = () => {
  const auth = useSelector((state) => state.auth);
  const [snackAlertData, setSnackAlertData] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  setDefaults({
    key: "AIzaSyAkJ06-4A1fY1ekldJUZMldHa5QJioBTlY", // Your API key here.
    language: "en", // Default language for responses.
    region: "es", // Default region for responses.
  });
  const [formData, setFormData] = useState({
    storeName: '',
    zip:'',
    place_Id: '',
    coordinates: { lat: null, lng: null }, // Coordinates for latitude and longitude
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef(null); // To store the map instance
  const autocompleteRef = useRef(null);
  const navigate = useNavigate();
  let [marker, setMarker] = useState(); // State to store the marker

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
          mapRef.current = map;

           // Add autocomplete search box
           const input = document.getElementById('autocomplete');
           const autocomplete = new google.maps.places.Autocomplete(input, {
             fields: ['place_id', 'geometry', 'formatted_address'],
           });
           autocompleteRef.current = autocomplete;

           autocomplete.addListener('place_changed', () => {
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

              // Set marker
              setMapMarker(map, lat, lng);
            }
          });


          // Set latitude and longitude on map click
          map.addListener('click', (event) => {
            const lat = event.latLng.lat();
            const lng = event.latLng.lng();

            
            getPostalCodeAndPlaceId(lat, lng)
            .then(data => console.log(data))
            .catch(error => console.error(error));

             // Listen for place selection in autocomplete
        

           
           

            setFormData((prev) => ({
              ...prev,
              coordinates: { lat, lng },
            }));

            // Check if a marker exists and remove it
            if (marker && marker.setMap) {
              marker.setMap(null);
            }

            // Create a new marker and add it to the map
            marker = new google.maps.Marker({
              position: { lat, lng },
              map,
            });
            // console.log(marker)

            setMarker(marker);

            console.log(`Coordinates selected: Latitude: ${lat}, Longitude: ${lng}`);
          });

          setMapLoaded(true); // Mark map as loaded
        })
        .catch((e) => {
          console.error("Error loading Google Maps:", e);
        });
    }
  };

  const setMapMarker = (map, lat, lng) => {
    if (marker) {
      marker.setMap(null); // Remove the previous marker
    }
    const newMarker = new google.maps.Marker({
      position: { lat, lng },
      map,
    });
    setMarker(newMarker);
  };

  useEffect(()=>{
    loadMap()
  },[])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    console.log(`Store Name Input: ${value}`);
  };
  // fromLatLng(formData.coordinates.lat, formData.coordinates.lng)
  // fromLatLng(formData.coordinates.lat, formData.coordinates.lng).then(({ results }) => {
  //   const response = results;
  //   console.log("hello world",response);
  // })
  // .catch(console.error);


  async function getPostalCodeAndPlaceId(latitude, longitude) {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyAkJ06-4A1fY1ekldJUZMldHa5QJioBTlY`;
  
    try {
      const response = await axios.get(url);
      const results = response.data.results;
      console.log(response)
  
      if (results.length > 0) {
        const addressComponents = results[0].address_components;
        let postalCode = null;
        let placeId = results[0].place_id;
  
        // Extract postal code from address components
        addressComponents.forEach(component => {
          if (component.types.includes('postal_code')) {
            postalCode = component.long_name;
          }
        });
  
        setFormData((prev)=>({
          ...prev,
          place_Id : placeId,
          zip : postalCode,
          
          }))
        return { postalCode, placeId };
      } else {
        return { error: 'No results found' };
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      return { error: error.message };
    }
  }

  const handleSubmit = async () => {
    console.log('Form data submitted:============================', formData);


    if (!formData.storeName) {
      setSnackAlertData({
        open: true,
        message: 'Store Name is required',
        severity: 'error',
      });
      return;
    }

    if (!formData?.coordinates?.lat || !formData?.coordinates?.lng) {
      setSnackAlertData({
        open: true,
        message: 'Please select a location on the map',
        severity: 'error',
      });
      return;
    }

    const data = {
      storeName: formData.storeName,
      zip: formData.zip,
      place_id: formData.place_Id,

      latitude: formData.coordinates.lat.toString(), // Send latitude
      longitude: formData.coordinates.lng.toString(), // Send longitude
      // postedBy : auth._id
    };

    console.log(data)
    console.log('hello worl')
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

      <Box sx={{ display: 'flex', flexDirection: { md: 'column', xs: 'column' }, gap: '1.3rem' }}>
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
        <Box sx={{ flexBasis: '33%', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          <Typography sx={{ color: '#FFA100', fontWeight: '500', fontSize: '16px', fontFamily: 'Montserrat !important' }}>
            Search Location
          </Typography>
          <input
    id="autocomplete"
    type="text"
    placeholder="Search for a place"
    style={{
      width: '100%',
      padding: '0px 20px',
      borderRadius: '10px',
    border:"1px solid #FFA100",
      fontSize: '22px',
      background: "#2e210a",
      
      height:"75px",
      color:"white",
      fontFamily: "poppins",

    
      
      
    }}
    className='inputCustom'
  />
        </Box>
       
      </Box>
      <Box sx={{ width: "100%", height: "500px" }}>
        <div style={{ width: "100%", height: "100%", borderRadius:"12px" }} id='map'></div>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 0 }}>
        <CustomButton
          border="1px solid #FFA100"
          ButtonText={loading ? 'Adding' : 'Add'}
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

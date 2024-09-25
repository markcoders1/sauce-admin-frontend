import React, { useState, useEffect , useRef} from 'react';
import CustomInputShadow from '../../Components/CustomInput/CustomInput';
import { Box, Typography } from '@mui/material';
import CustomButton from '../../Components/CustomButton/CustomButton';
import axios from 'axios';
import CustomSelect from '../../Components/CustomSelect/CustomSelect';
import Heading from '../../Components/Heading/Heading';
import SnackAlert from '../../Components/SnackAlert/SnackAlert';
import { useSelector } from 'react-redux';
import MenuBar from '../../Components/MenuBar/MenuBar';
import NavigateBack from '../../Components/NavigateBackButton/NavigateBack';
import { useNavigate } from 'react-router-dom';
import { Loader } from '@googlemaps/js-api-loader';

const appUrl = import.meta.env.VITE_REACT_APP_API_URL;

const AddSEvent = () => {
  const [snackAlertData, setSnackAlertData] = useState({
    open: false,
    message: "",
    severity: "success"
  });
  const auth = useSelector(state => state.auth);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    eventName: '',
    organizedBy: '',
    ownerId: "",
    date: '',
    description: '',
    details: [''], 
    destination: '',
    bannerImage: null,
    latitude: "",
    longitude: "",
  });
  const [errors, setErrors] = useState({});
  const [allBrands, setAllBrands] = useState([]);
  const [selectedBannerFileName, setSelectedBannerFileName] = useState("");
  const mapRef = useRef(null); // To store the map instance
  const autocompleteRef = useRef(null);

  const [mapLoaded, setMapLoaded] = useState(false);
  let [marker, setMarker] = useState(null); // State to store marker instance

  const loader = new Loader({
    apiKey: "AIzaSyAkJ06-4A1fY1ekldJUZMldHa5QJioBTlY", // Replace with your own API key
    version: "weekly",
    libraries: ["places"],
  });


  const mapOptions = {
    center: { lat: 0, lng: 0 },
    zoom: 4,
  };

  const loadMap = async () => {
    if (!mapLoaded) {
      loader.load().then((google) => {
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
          console.log(`Coordinates selected: Latitude: ${lat}, Longitude: ${lng}`);

        });

        setMapLoaded(true); // Mark map as loaded
      }).catch((e) => {
        console.error("Error loading Google Maps:", e);
      });
    }
  };

  useEffect(()=>{
loadMap()
  },[])


  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      const file = files[0];
      setFormData({
        ...formData,
        [name]: file 
      });
      setSelectedBannerFileName(file?.name || ""); // Update selected file name
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
    let validationErrors = {};

    // Check file size
    if (formData.bannerImage && formData.bannerImage.size > 4 * 1024 * 1024) {
      validationErrors.bannerImage = "Banner image size exceeds 4MB.";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSnackAlertData({
        open: true,
        message: `${Object.values(validationErrors).join(" ")}`,
        severity: "error",
      });
      return;
    }
    console.log(formData)

    try {
      setLoading(true);
      const data = new FormData();
      data.append('eventName', formData?.eventName);
      data.append('organizedBy', formData?.organizedBy);
      // Convert the date to Unix timestamp in milliseconds
      data.append('eventDate', new Date(formData?.date).getTime());
      data.append('venueDescription', formData?.description);
      data.append('venueName', formData?.destination);
      data.append('owner', formData?.ownerId);
      data.append('bannerImage', formData?.bannerImage);
      data.append('eventDetails', JSON.stringify(formData?.details));
      data.append('venueLocation.longitude', formData?.longitude);
      data.append('venueLocation.latitude', formData?.latitude);

      const response = await axios({
        url: `${appUrl}/admin/add-event`,
        method: "post",
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
          'Content-Type': 'multipart/form-data'
        },
        data: data
      });

   
      setFormData({
        eventName: '',
        organizedBy: '',
        ownerId: "",
        date: '',
        description: '',
        details: [''], // Initialize with one bullet point
        destination: '',
        bannerImage: null,
        latitude: "",
        longitude: "",
      });
      setLoading(false);

      setSelectedBannerFileName(""); // Reset file name
      setSnackAlertData({
        open: true,
        message: response?.data?.message,
        severity: "success",
      });
    } catch (error) {
      console.error('Error submitting event:', error);
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
        url: `${appUrl}/admin/get-all-users?type=brand`,
        method: "get",
        headers: {
          Authorization: `Bearer ${auth.accessToken}`
        }
      });
      setAllBrands(response?.data?.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleBrandChange = (ownerId) => {
    setFormData(prev => ({ ...prev, ownerId }));
  };

  return (
    <Box 
      className="hide-scrollbar"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
        padding: "0px 21px"
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
          Add Event
        </Typography>
        <Typography sx={{display:"flex", alignItems:"center", gap:".3rem"}}>
          <MenuBar/>  <NavigateBack /> 
        </Typography>
      </Box>
      <Box sx={{ display: "flex", flexDirection: { lg: "row", xs: "column" }, gap: "1.5rem", height: { lg: "100%", xs: "170px" } }}>
        <label htmlFor="uploadBannerImage" style={{ flexBasis: "100%", height: "165px", backgroundColor: "#2E210A", border: "2px dashed #FFA100", display: "flex", justifyContent: "center", alignItems: "center", borderRadius: "12px", cursor: "pointer" }}>
          <input type="file" id="uploadBannerImage" name="bannerImage" style={{ display: 'none' }} onChange={handleChange} />
          <Typography sx={{ color: "white", textAlign: "center", fontSize: "22px", fontWeight: "600" }}>
            {selectedBannerFileName ? `Selected File: ${selectedBannerFileName}` : "Upload Banner Image"}
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
        <Box sx={{ flexBasis: "50%", display:"flex", flexDirection:"column", gap:"0.3rem" }}>
          
        <Typography sx={{
                            color: "#FFA100",
                            fontWeight: "500",
                            fontSize: {
                                sm: "16px",
                                xs: "16px"
                            },
                            fontFamily: "Montserrat !important",
                        }}>
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
        <Box sx={{ flexBasis: "50%"  ,  display:"flex", flexDirection:"column", gap:"0.3rem" }}>
              
        <Typography sx={{
                            color: "#FFA100",
                            fontWeight: "500",
                            fontSize: {
                                sm: "16px",
                                xs: "16px"
                            },
                            fontFamily: "Montserrat !important",
                        }}>
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
        display: "none",
        flexDirection: {
          md: "row",
          xs: "column"
        },
        gap: "1.5rem",

      }}>
        <Box sx={{ flexBasis: "50%" ,  display:"flex", flexDirection:"column", gap:"0.3rem" }}>
        <Typography sx={{
                            color: "#FFA100",
                            fontWeight: "500",
                            fontSize: {
                                sm: "16px",
                                xs: "16px"
                            },
                            fontFamily: "Montserrat !important",
                        }}>
                            Longitude
                        </Typography>
          <CustomInputShadow
            placeholder="Longitude"
            name="longitude"
            value={formData.longitude}
            onChange={handleChange}
            error={errors.longitude}
          />
        </Box>
        <Box sx={{ flexBasis: "50%" ,  display:"flex", flexDirection:"column", gap:"0.3rem" }}>
        <Typography sx={{
                            color: "#FFA100",
                            fontWeight: "500",
                            fontSize: {
                                sm: "16px",
                                xs: "16px"
                            },
                            fontFamily: "Montserrat !important",
                        }}>
                            Latitude
                        </Typography>
          <CustomInputShadow
            placeholder="Latitude"
            name="latitude"
            value={formData.latitude}
            onChange={handleChange}
            error={errors.latitude}
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
            <Box sx={{flexBasis:"50%", display:"flex", flexDirection:"column", gap:"0.3rem"}} >
            <Typography sx={{
                            color: "#FFA100",
                            fontWeight: "500",
                            fontSize: {
                                sm: "16px",
                                xs: "16px"
                            },
                            fontFamily: "Montserrat !important",
                        }}>
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
            <Box sx={{flexBasis:"50%",  display:"flex", flexDirection:"column", gap:"0.3rem" }}>
            <Typography sx={{
                            color: "#FFA100",
                            fontWeight: "500",
                            fontSize: {
                                sm: "16px",
                                xs: "16px"
                            },
                            fontFamily: "Montserrat !important",
                        }}>
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
          <Box sx={{ display:"flex", flexDirection:"column", gap:"0.3rem"}} >
          <Typography sx={{
                            color: "#FFA100",
                            fontWeight: "500",
                            fontSize: {
                                sm: "16px",
                                xs: "16px"
                            },
                            fontFamily: "Montserrat !important",
                        }}>
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
      <Box sx={{ display:"flex", flexDirection:"column", gap:"0.3rem"}} >
      <Typography sx={{
                            color: "#FFA100",
                            fontWeight: "500",
                            fontSize: {
                                sm: "16px",
                                xs: "16px"
                            },
                            fontFamily: "Montserrat !important",
                        }}>
                            Brand
                        </Typography>
        
        <CustomSelect data={allBrands} handleChange={handleBrandChange} />
      </Box>
      <Box sx={{ flexBasis: "100%", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
      <Typography sx={{
                            color: "#FFA100",
                            fontWeight: "500",
                            fontSize: {
                                sm: "16px",
                                xs: "16px"
                            },
                            fontFamily: "Montserrat !important",
                        }}>
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
                borderRadius='6px'
                buttonStyle={{ height:  {sm:"75px", xs:"68px"}, mt:"-16px"}}
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
        />

<Box sx={{ flexBasis: '33%', display: 'flex', flexDirection: 'column', gap: '0.3rem', mt:"30px" }}>
        <Typography sx={{
                            color: "#FFA100",
                            fontWeight: "500",
                            fontSize: {
                                sm: "16px",
                                xs: "16px"
                            },
                            fontFamily: "Montserrat !important",
                        }}>
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
      color:"black",
      height:"75px",
      color:"white",
      fontFamily: "poppins",

    
      
      
    }}
    className='inputCustom'
  />
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
        <div style={{ width: "100%", height: "100%", borderRadius:"12px" }} id='map'></div>
       
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

export default AddSEvent;

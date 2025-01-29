import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import MenuBar from '../../Components/MenuBar/MenuBar';
import NavigateBack from '../../Components/NavigateBackButton/NavigateBack';
import CustomInputShadow from '../../Components/CustomInput/CustomInput';
import Heading from '../../Components/Heading/Heading';
import CustomTextAreaShadow from '../../Components/CustomTextAreaShadow/CustomTextAreaShadow';

const appUrl = import.meta.env.VITE_REACT_APP_API_URL;


const SeeEventDetail = () => {
  const auth = useSelector((state) => state.auth);
  const { id } = useParams();
  const [formData, setFormData] = useState({
    eventName: '',
    organizedBy: '',
    date: '',
    description: '',
    details: '',
    destination: '',
    bannerImage: null,
  });
  const [selectedBannerFileName, setSelectedBannerFileName] = useState("");

  const fetchEvent = async () => {
    try {
      const response = await axios({
        url: `${appUrl}/admin/get-event/${id}`,
        method: "get",
        headers: {
          Authorization: `Bearer ${auth.accessToken}`
        },
      });
      console.log(response)
      const eventData = response?.data?.event;
      setFormData({
        eventName: eventData?.eventName,
        // organizedBy: eventData?.owner.name,
        date: new Date(eventData?.eventDate).toISOString().split('T')[0],

        description: eventData?.venueDescription,
        details: eventData?.eventDetails,
        destination: eventData?.venueName,
        bannerImage: eventData?.bannerImage,
      });
      setSelectedBannerFileName(eventData?.bannerImage);
    } catch (error) {
      console.error('Error fetching event:', error);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [id]);

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
      <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }} >
        <Typography sx={{
          color: "white",
          fontWeight: "600",
          fontSize: {
            sm: "45px",
            xs: "30px"
          },
          fontFamily: "Fira Sans !important",
        }}>
          Event Detail
        </Typography>
        <Typography sx={{ display: "flex", alignItems: "center", gap: ".3rem" }}>
          <MenuBar />  <NavigateBack />
        </Typography>
      </Box>
      <Box sx={{ display: "flex", flexDirection: { lg: "row", xs: "column" }, gap: "1.5rem", }}>
        {selectedBannerFileName && (
          <Box sx={{ width: "100%", textAlign: "center", marginBottom: "1rem" , height:"200px"}}>
            <img src={selectedBannerFileName} alt="Banner" style={{ maxWidth: "100%",height:"100%", borderRadius: "12px" }} />
          </Box>
        )}
      </Box>
      <Box sx={{
        display: "flex",
        flexDirection: {
          md: "row",
          xs: "column"
        },
        gap: "1.5rem",
      }}>
        <Box sx={{ flexBasis: "50%" }}>
        <Typography sx={{
            color: "#FFA100",
            fontWeight: "500",
            fontSize: {
                sm: "16px",
                xs: "16px"
            },
            fontFamily: "Montserrat !important",
            marginBottom: "0.4rem"
          }}>
            Event Name
          </Typography>
          <CustomInputShadow
            placeholder="Event Name"
            name="eventName"
            value={formData.eventName}
            readOnly
          />
        </Box>
        <Box sx={{ flexBasis: "50%" }}>
        <Typography sx={{
            color: "#FFA100",
            fontWeight: "500",
            fontSize: {
                sm: "16px",
                xs: "16px"
            },
            fontFamily: "Montserrat !important",
            marginBottom: "0.4rem"
          }}>
            Organized By
          </Typography>
          <CustomInputShadow
            placeholder="Organized By"
            name="organizedBy"
            value={formData.organizedBy}
            readOnly
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
        <Box sx={{ flexBasis: "100%" }}>
        <Typography sx={{
            color: "#FFA100",
            fontWeight: "500",
            fontSize: {
                sm: "16px",
                xs: "16px"
            },
            fontFamily: "Montserrat !important",
            marginBottom: "0.4rem"
          }}>
            Event Date
          </Typography>
          <CustomInputShadow
            placeholder="Date"
            name="date"
            value={formData.date}
            type="date"
            readOnly
          />
        </Box>
        
      </Box>
      <Box>
      <Typography sx={{
            color: "#FFA100",
            fontWeight: "500",
            fontSize: {
                sm: "16px",
                xs: "16px"
            },
            fontFamily: "Montserrat !important",
            marginBottom: "0.4rem"
          }}>
            Event Destination
          </Typography>
        <CustomInputShadow
          placeholder="Destination"
          name="destination"
          value={formData.destination}
          readOnly
        />
      </Box>
      <Box sx={{ flexBasis: "100%", display: "flex", flexDirection: "column", gap: "8px" }}>
      <Typography sx={{
            color: "#FFA100",
            fontWeight: "500",
            fontSize: {
                sm: "16px",
                xs: "16px"
            },
            fontFamily: "Montserrat !important",
            marginBottom: "0.4rem"
          }}>
          Event Description
          </Typography>
          <CustomTextAreaShadow
          placeholder="Enter brand details..."
          name="about"
          value={formData.details}
          
          
          rows={6} // You can adjust the number of rows as needed
        />
      </Box>
   
    </Box>
  );
};

export default SeeEventDetail;

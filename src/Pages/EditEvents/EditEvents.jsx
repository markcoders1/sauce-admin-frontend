import React, { useState, useEffect } from 'react';
import CustomInputShadow from '../../Components/CustomInput/CustomInput';
import { Box, Typography } from '@mui/material';
import CustomButton from '../../Components/CustomButton/CustomButton';
import axios from 'axios';
import Heading from '../../Components/Heading/Heading';
import SnackAlert from '../../Components/SnackAlert/SnackAlert';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const EditEvents = () => {
  const auth = useSelector((state) => state.auth);
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
    details: ['',],
    destination: '',
    bannerImage: null,
  });
  const [errors, setErrors] = useState({});
  const [selectedBannerFileName, setSelectedBannerFileName] = useState("");

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      const file = files[0];
      setFormData({
        ...formData,
        [name]: file // Save the file
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
    console.log('Form data submitted:', formData);

    const convertToBase64 = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    };

    let imageBase64 = null;
    if (formData.bannerImage) {
      imageBase64 = await convertToBase64(formData.bannerImage);
    }

    const data = {
      eventName: formData.eventName,
      organizedBy: formData.organizedBy,
      eventDate: Math.floor(new Date(formData.date).getTime() / 1000),
      venueDescription: formData.description,
      venueName: formData.destination,
      owner: formData.ownerId,
      bannerImage: imageBase64,
      eventDetails: formData.details,
      eventId: id,
    };

    try {
      const response = await axios({
        url: `https://aws.markcoders.com/sauced-backend/api/admin/edit-event`,
        method: "post",
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
          'Content-Type': 'application/json'
        },
        data: data
      });
      setFormData({
        eventName: '',
        organizedBy: '',
        ownerId: "",
        date: '',
        description: '',
        details: ['',],
        destination: '',
        bannerImage: null,
      });
      setSelectedBannerFileName(""); // Reset file name
      setSnackAlertData({
        open: true,
        message: response?.data?.message,
        severity: "success",
      });
      console.log(response);
    } catch (error) {
      console.error('Error submitting event:', error);
      setSnackAlertData({
        open: true,
        message: error?.response?.data?.message,
        severity: "error",
      });
    }
  };

  const fetchEvent = async () => {
    try {
      const response = await axios({
        url: `https://aws.markcoders.com/sauced-backend/api/admin/get-event/${id}`,
        method: "get",
        headers: {
          Authorization: `Bearer ${auth.accessToken}`
        },
      });
      console.log(response);
      const eventData = response?.data?.event;
      setFormData({
        eventName: eventData.eventName,
        organizedBy: eventData.organizedBy,
        ownerId: eventData.owner?._id,
        date: new Date(eventData.date).toISOString().split('T')[0],
        description: eventData.venueDescription,
        details: eventData.eventDetails,
        destination: eventData.venueName,
        bannerImage: null,
      });
      setSelectedBannerFileName(eventData.bannerImage);
    } catch (error) {
      console.error('Error fetching event:', error);
    }
  };

  useEffect(() => {
    fetchEvent();
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
      <Typography sx={{
        color: "white",
        fontWeight: "600",
        fontSize: {
          sm: "45px",
          xs: "26px"
        },
        fontFamily: "Fira Sans !important",
      }}>
        Edit Event
      </Typography>
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
        <Box sx={{ flexBasis: "50%" }}>
          <CustomInputShadow
            placeholder="Event Name"
            name="eventName"
            value={formData.eventName}
            onChange={handleChange}
            error={errors.eventName}
          />
        </Box>
        <Box sx={{ flexBasis: "50%" }}>
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
            <Box flexBasis={"50%"}>
              <CustomInputShadow
                placeholder="Date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                error={errors.date}
                type={"date"}
              />
            </Box>
            <Box flexBasis={"50%"}>
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
          <Box>
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
      <Box sx={{ flexBasis: "100%", display: "flex", flexDirection: "column", gap: "8px" }}>
        <Heading Heading='Details' />
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
                buttonStyle={{ height: "39px" }}
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
        />
      </Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 0 }}>
        <CustomButton
          border='1px solid #FFA100'
          ButtonText='Save'
          color='white'
          width={"178px"}
          borderRadius='8px'
          background='linear-gradient(90deg, #FFA100 0%, #FF7B00 100%)'
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

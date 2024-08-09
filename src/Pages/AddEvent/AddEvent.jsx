import React, { useState } from 'react';
import CustomInputShadow from '../../Components/CustomInput/CustomInput';
import { Box, Typography, Button } from '@mui/material';
import CustomButton from '../../Components/CustomButton/CustomButton';
import axios from 'axios';

const AddSEvent = () => {
  const [formData, setFormData] = useState({
    eventName: '',
    organizedBy: '',
    day: '',
    date: '',
    time: '',
    details: ['', ''], // Initialize with two bullet points
    destination: '',
    bannerImage: null,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData({
        ...formData,
        [name]: files[0] // Save the file
      });
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

  const addBullet = () => {
    setFormData({
      ...formData,
      details: [...formData.details, '']
    });
  };

  const removeBullet = (index) => {
    if (formData.details.length > 2) {
      const updatedDetails = formData.details.filter((_, i) => i !== index);
      setFormData({
        ...formData,
        details: updatedDetails
      });
    }
  };

  const handleSubmit = async () => {
    let validationErrors = {};
    Object.keys(formData).forEach(field => {
      if (!formData[field]) {
        validationErrors[field] = `${field} is required`;
      }
    });
    if (Object.keys(validationErrors).length > 4) {
      setErrors(validationErrors);
      return;
    }
    console.log('Form data submitted:', formData);

    try {
      const response = await axios({
        url: "https://aws.markcoders.com/sauced-backend/api/admin/add-event",
        method: "post",
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmEzZTgyYTVkY2FlY2IyNGI4Nzc4YjkiLCJpYXQiOjE3MjIwMTc4MzQsImV4cCI6MTcyNzIwMTgzNH0.jAigSu6rrFjBiJjBKlvShm0--WNo-0YgaJXq6eW_QlU`,
          'Content-Type': 'multipart/form-data'
        },
        data: {
          eventName: formData.eventName,
          owner: formData.organizedBy,
          eventDate: new Date(formData.date).getTime(),
          venueName: formData.destination,
          eventDetails: formData.details,
          bannerImage: formData.bannerImage
        }
      });
      console.log(response);
    } catch (error) {
      console.error('Error submitting event:', error);
    }
  };

  return (
    <Box
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
        Add Event
      </Typography>
      <Box sx={{ display: "flex", flexDirection: { lg: "row", xs: "column" }, gap: "1.5rem", height:{lg:"100%", xs:"370px"} }}>
        
        <label htmlFor="uploadBannerImage" style={{ flexBasis: "50%", height: "165px", backgroundColor: "#2E210A", border: "2px dashed #FFA100", display: "flex", justifyContent: "center", alignItems: "center", borderRadius: "12px", cursor: "pointer" }}>
          <input type="file" id="uploadBannerImage" name="bannerImage" style={{ display: 'none' }} onChange={handleChange} />
          <Typography sx={{ color: "white", textAlign: "center", fontSize: "22px", fontWeight: "600" }}>Upload Banner Image</Typography>
        </label>

        <Box sx={{ display: "flex", gap: "1rem", alignItems: "start", justifyContent: "center", flexWrap: { sm: "nowrap", xs: "wrap" } }} >
          <Box>
            <Box sx={{ display: "flex", gap: "1rem" }}>
              <Box >
                <CustomInputShadow
                  inputStyle={{ width: { md: "49px", xs: "30px" }, height: { md: "93px", xs: "50px" } }}
                  name="hours"
                  multiline={true}
                  value={formData.chiliPapers}
                  onChange={handleChange}
                />
              </Box>
              <Box >
                <CustomInputShadow
                  inputStyle={{ width: { md: "49px", xs: "30px" }, height: { md: "93px", xs: "50px" } }}
                  name="hours"
                  multiline={true}
                  value={formData.chiliPapers}
                  onChange={handleChange}
                />
              </Box>
            </Box>
            <Typography sx={{ fontSize: "22px", textAlign: "center", fontWeight: "600" }}>Hour</Typography>
          </Box>
          <Typography sx={{ mt: "20px", fontSize: "40px", fontWeight: "600" }}>:</Typography>
          <Box>
            <Box sx={{ display: "flex", gap: "1rem" }}>
              <Box >
                <CustomInputShadow
                  inputStyle={{ width: { md: "49px", xs: "30px" }, height: { md: "93px", xs: "50px" } }}
                  name="hours"
                  value={formData.chiliPapers}
                  onChange={handleChange}
                />
              </Box>
              <Box >
                <CustomInputShadow
                  inputStyle={{ width: { md: "49px", xs: "30px" }, height: { md: "93px", xs: "50px" } }}
                  name="hours"
                  multiline={true}
                  value={formData.chiliPapers}
                  onChange={handleChange}
                />
              </Box>
            </Box>
            <Typography sx={{ fontSize: "22px", textAlign: "center", fontWeight: "600" }}>Minutes</Typography>
          </Box>
          <Typography sx={{ mt: { md: "20px", xs: "14px" }, fontSize: "40px", fontWeight: "600" }}>:</Typography>
          <Box>
            <Box sx={{ display: "flex", gap: "1rem" }}>
              <Box >
                <CustomInputShadow
                  inputStyle={{ width: { md: "49px", xs: "30px" }, height: { md: "93px", xs: "50px" } }}
                  name="hours"
                  multiline={true}
                  value={formData.chiliPapers}
                  onChange={handleChange}
                />
              </Box>
              <Box >
                <CustomInputShadow
                  inputStyle={{ width: { md: "49px", xs: "30px" }, height: { md: "93px", xs: "50px" } }}
                  name="hours"
                  multiline={true}
                  value={formData.chiliPapers}
                  onChange={handleChange}
                />
              </Box>
            </Box>
            <Typography sx={{ fontSize: "22px", textAlign: "center", fontWeight: "600" }}>Seconds</Typography>
          </Box>
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
        <Box sx={{ flexBasis: "33%" }}>
          <CustomInputShadow
            placeholder="Event Name"
            name="eventName"
            value={formData.eventName}
            onChange={handleChange}
            error={errors.eventName}
          />
        </Box>
        <Box sx={{ flexBasis: "33%" }}>
          <CustomInputShadow
            placeholder="Organized By"
            name="organizedBy"
            value={formData.organizedBy}
            onChange={handleChange}
            error={errors.organizedBy}
          />
        </Box>
        <Box sx={{ flexBasis: "33%" }}>
          <CustomInputShadow
            placeholder="Day"
            name="day"
            value={formData.day}
            onChange={handleChange}
            error={errors.day}
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
                placeholder="Time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                error={errors.time}
                type={"number"}
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
      <Box sx={{ flexBasis: "33%" }}>
        <Typography>Details</Typography>
        {formData.details.map((detail, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <CustomInputShadow
              name={`details-${index}`}
              multiline={true}
              value={detail}
              onChange={(e) => handleDetailChange(index, e.target.value)}
              error={errors.details}
            />
            {formData.details.length > 2 && (
              <Button variant="contained" color="error" onClick={() => removeBullet(index)}>
                Remove
              </Button>
            )}
          </Box>
        ))}
        <Button variant="contained" color="primary" onClick={addBullet}>
          Add Bullet
        </Button>
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
          onClick={() => handleSubmit()}
        />
      </Box>
    </Box>
  );
};

export default AddSEvent;

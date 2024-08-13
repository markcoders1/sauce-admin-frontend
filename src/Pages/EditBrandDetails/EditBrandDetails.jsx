import React, { useState } from 'react';
import CustomInputShadow from '../../Components/CustomInput/CustomInput';
import { Box, Typography, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import CustomButton from '../../Components/CustomButton/CustomButton';
import CustomSelectForType from '../../Components/CustomSelectForType/CustomSelectForType';
import axios from 'axios';
import SnackAlert from '../../Components/SnackAlert/SnackAlert';
import { useParams } from 'react-router-dom';

const EditBrandDetails = () => {
  const { id } = useParams();
  const [snackAlertData, setSnackAlertData] = useState({
    open: false,
    message: "",
    severity: "success"
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bannerImage: null,
    type: '', // select field
    status: '', // radio input
    points: '' // number input
  });
  const [errors, setErrors] = useState({});
  const [selectedFileName, setSelectedFileName] = useState("");

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: files[0]
      }));
      setSelectedFileName(files[0]?.name || ""); // Update selected file name
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value
      }));
    }
  };

  const handleTypeChange = (selectedType) => {
    setFormData((prevFormData) => ({ ...prevFormData, type: selectedType }));
  };

  const handleSubmit = async () => {
    console.log('Form data submitted:', formData);

    // const data = new FormData();
    // data.append('name', formData.name);
    // data.append('email', formData.email);
    // data.append('bannerImage', formData.bannerImage); // Append the file
    // data.append('type', formData.type);
    // data.append('status', formData.status);
    // data.append('points', formData.points);

    try {
      // console.log("data going", data);
      const response = await axios({
        url: `https://aws.markcoders.com/sauced-backend/api/admin/edit-user`,
        method: "post",
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmEzZTgyYTVkY2FlY2IyNGI4Nzc4YjkiLCJpYXQiOjE3MjIwMTc4MzQsImV4cCI6MTcyNzIwMTgzNH0.jAigSu6rrFjBiJjBKlvShm0--WNo-0YgaJXq6eW_QlU`,
          'Content-Type': 'multipart/form-data'
        },

        data: {
          email : formData.email,
          name : formData.name
        }
      });
      console.log(formData.email)

      setFormData({
        name: '',
        email: '',
        bannerImage: null,
        type: '',
        status: '',
        points: ''
      });

      setSelectedFileName(""); // Reset file name

      setSnackAlertData({
        open: true,
        message: response?.data?.message,
        severity: "success",
      });

      console.log(response);
    } catch (error) {
      console.error('Error submitting brand induction:', error);
      console.log(formData.email)

      setSnackAlertData({
        open: true,
        message: error?.response?.data?.error?.message || error?.response?.data?.message,
        severity: "error",
      });
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
        Edit Brand
      </Typography>
      <Box sx={{ display: "flex", flexDirection: { lg: "row", xs: "column" }, gap: "1.5rem", height: { lg: "100%", xs: "370px" } }}>
        <label htmlFor="uploadBannerImage" style={{ flexBasis: "100%", height: "165px", backgroundColor: "#2E210A", border: "2px dashed #FFA100", display: "flex", justifyContent: "center", alignItems: "center", borderRadius: "12px", cursor: "pointer" }}>
          <input type="file" id="uploadBannerImage" name="bannerImage" style={{ display: 'none' }} onChange={handleChange} />
          <Typography sx={{ color: "white", textAlign: "center", fontSize: "22px", fontWeight: "600" }}>{selectedFileName ? `Selected File  ${selectedFileName}` : ("Upload Banner Image")}</Typography>
        </label>
      </Box>

      <Box sx={{
        display: "flex",
        flexDirection: {
          md: "column",
          xs: "column"
        },
        gap: "1.5rem",
      }}>
        <Box sx={{ flexBasis: "33%" }}>
          <CustomInputShadow
            placeholder="Enter Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
          />
        </Box>
        <Box sx={{ flexBasis: "33%" }}>
          <CustomInputShadow
          placeholder="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          />
        </Box>
        <Box sx={{ flexBasis: "33%" }}>
          <CustomSelectForType
            handleChange={handleTypeChange}
            typeError={errors.type}
          />
        </Box>
        <Box sx={{ flexBasis: "33%" }}>
          <RadioGroup
            row
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <FormControlLabel value="active" control={<Radio />} label="Active" />
            <FormControlLabel value="inactive" control={<Radio />} label="Inactive" />
          </RadioGroup>
        </Box>
        <Box sx={{ flexBasis: "33%" }}>
          <CustomInputShadow
            placeholder="Points"
            name="points"
            type="number"
            value={formData.points}
            onChange={handleChange}
            error={errors.points}
          />
        </Box>
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
        handleClose={() => { setSnackAlertData((prev) => ({ ...prev, open: false })) }}
      />
    </Box>
  );
};

export default EditBrandDetails;

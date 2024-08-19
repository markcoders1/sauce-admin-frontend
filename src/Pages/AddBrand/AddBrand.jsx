import React, { useState } from 'react';
import CustomInputShadow from '../../Components/CustomInput/CustomInput';
import { Box, Typography } from '@mui/material';
import CustomButton from '../../Components/CustomButton/CustomButton';
import axios from 'axios';
import SnackAlert from '../../Components/SnackAlert/SnackAlert';
import MenuBar from '../../Components/MenuBar/MenuBar';

const AddBrand = () => {
  const [snackAlertData, setSnackAlertData] = useState({
    open: false,
    message: "",
    severity: "success"
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    bannerImage: null,
  });
  const [errors, setErrors] = useState({});
  const [selectedFileName, setSelectedFileName] = useState("");
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData({
        ...formData,
        [name]: files[0] 
      });
      setSelectedFileName(files[0]?.name || ""); // Update selected file name
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async () => {
    console.log('Form data submitted:', formData);

    let validationErrors = {};

    // Check file size for bannerImage
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

    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('password', formData.password);
    data.append('image', formData.bannerImage); // Append the file

    try {
      setLoading(true)
      const response = await axios({
        url: "https://aws.markcoders.com/sauced-backend/api/admin/create-brand",
        method: "post",
        headers: {
          Authorization: `Bearer YOUR_ACCESS_TOKEN`,
          'Content-Type': 'multipart/form-data' 
        },
        data: data
      });

      setFormData({
        name: '',
        email: '',
        password: '',
        bannerImage: null,
      });

      setSelectedFileName(""); // Reset file name
      setLoading(false)

      setSnackAlertData({
        open: true,
        message: response?.data?.message,
        severity: "success",
      })

      console.log(response);
    } catch (error) {
      console.error('Error submitting brand induction:', error);
      setSnackAlertData({
        open: true,
        message: error?.response?.data?.error?.message || error?.response?.data?.message,
        severity: "error",
      })
      setLoading(false)
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
      <Box sx={{display:"flex", justifyContent:"space-between", width:"100%"}} >
        <Typography sx={{
          color: "white",
          fontWeight: "600",
          fontSize: {
            lg: "45px",
            sm:"40px",
            xs: "30px"
          },
          fontFamily: "Fira Sans !important",
        }}>
          Add New Brand
        </Typography>
        <Typography>
          <MenuBar/>
        </Typography>
      </Box>
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
            placeholder="Brand Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
          />
        </Box>
        <Box sx={{ flexBasis: "33%" }}>
          <CustomInputShadow
            placeholder="Brand Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
          />
        </Box>
        <Box sx={{ flexBasis: "33%" }}>
          <CustomInputShadow
            placeholder="Brand Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            type={"password"}
          />
        </Box>
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
          onClick={() => handleSubmit()}
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

export default AddBrand;

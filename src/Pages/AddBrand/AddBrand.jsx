import React, { useState } from 'react';
import CustomInputShadow from '../../Components/CustomInput/CustomInput';
import { Box, Typography } from '@mui/material';
import CustomButton from '../../Components/CustomButton/CustomButton';
import axios from 'axios';
import SnackAlert from '../../Components/SnackAlert/SnackAlert';
import MenuBar from '../../Components/MenuBar/MenuBar';
import Heading from '../../Components/Heading/Heading';
import { useSelector } from 'react-redux';
import NavigateBack from '../../Components/NavigateBackButton/NavigateBack';
import { useNavigate } from 'react-router-dom';
import CustomSelectForType from '../../Components/CustomSelectForType/CustomSelectForType';

const appUrl = import.meta.env.VITE_REACT_APP_API_URL;

const AddBrand = () => {
  const auth = useSelector(state => state.auth)
  const [snackAlertData, setSnackAlertData] = useState({
    open: false,
    message: "",
    severity: "success"
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    websiteLink: '',

    bannerImage: null,
    about: ['','','','','',''], // Initialize an array of 6 empty strings
    isTopRated: false
  });
  const [errors, setErrors] = useState({});
  const [selectedFileName, setSelectedFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
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

  const handleAboutChange = (index, value) => {
    const newAbout = [...formData.about];
    newAbout[index] = value;
    setFormData({ ...formData, about: newAbout });
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
    data.append("isTopRated", formData.isTopRated);

    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('websiteLink', formData.websiteLink);
    data.append('password', formData.password);
    data.append('image', formData.bannerImage); // Append the file
    data.append('about',  JSON.stringify(formData.about)); // Serialize the array to JSON
  
    console.log(data)
    try {
      setLoading(true);
      const response = await axios({
        url: `${appUrl}/admin/create-brand`,
        method: "post",
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
          'Content-Type': 'multipart/form-data' 
        },
        data: data
      });
  
      setFormData({
        name: '',
        email: '',
        password: '',
        websiteLink:'',
        bannerImage: null,
        about: Array(6).fill(''), // Reset about
        isTopRated: false
      });
      // navigate(-1)
  
      setSelectedFileName(""); // Reset file name
      setLoading(false);
  
      setSnackAlertData({
        open: true,
        message: response?.data?.message,
        severity: "success",
      });
  
      console.log(response.data);
    } catch (error) {
      console.error('Error submitting brand induction:', error);
      setSnackAlertData({
        open: true,
        message: error?.response?.data?.error?.message || error?.response?.data?.message,
        severity: "error",
      });
      setLoading(false);
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
        <Typography sx={{display:"flex", alignItems:"center", gap:".3rem"}}>
          <MenuBar/>  <NavigateBack /> 
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
        <Box sx={{ flexBasis: "33%",  display:"flex", flexDirection:"column", gap:"0.3rem"  }}>
        <Typography sx={{
                            color: "#FFA100",
                            fontWeight: "500",
                            fontSize: {
                                sm: "16px",
                                xs: "16px"
                            },
                            fontFamily: "Montserrat !important",
                        }}>
                           Brand Name
                        </Typography>
          <CustomInputShadow
            placeholder="Brand Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
          />
        </Box>
        <Box sx={{ flexBasis: "33%" , display:"flex", flexDirection:"column", gap:"0.3rem"}}>
        <Typography sx={{
                            color: "#FFA100",
                            fontWeight: "500",
                            fontSize: {
                                sm: "16px",
                                xs: "16px"
                            },
                            fontFamily: "Montserrat !important",
                        }}>
                            Brand Email
                        </Typography>
          <CustomInputShadow
            placeholder="Brand Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
          />
        </Box>
        <Box sx={{ flexBasis: "33%" , display:"flex", flexDirection:"column", gap:"0.3rem"}}>
        <Typography sx={{
                            color: "#FFA100",
                            fontWeight: "500",
                            fontSize: {
                                sm: "16px",
                                xs: "16px"
                            },
                            fontFamily: "Montserrat !important",
                        }}>
                            Brand Website
                        </Typography>
          <CustomInputShadow
            placeholder="Brand Website"
            name="websiteLink"
            value={formData.websiteLink}
            onChange={handleChange}
            error={errors.websiteLink}
          />
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
                            Brand Type
                        </Typography>
      <CustomSelectForType
        label={"Brand Type"}
        options={[
          { label: "None", value: false },
          { label: "Top Rated", value: true },
        ]}
        handleChange={(selectedValue) =>
          setFormData({ ...formData, isTopRated: selectedValue })
        }
        labelField="label"
        valueField="value"
      />
      </Box>
        <Box sx={{ flexBasis: "33%",  display:"flex", flexDirection:"column", gap:"0.3rem" }}>
        <Typography sx={{
                            color: "#FFA100",
                            fontWeight: "500",
                            fontSize: {
                                sm: "16px",
                                xs: "16px"
                            },
                            fontFamily: "Montserrat !important",
                        }}>
                            Brand Password
                        </Typography>
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

      <Box sx={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
      <Typography sx={{
                            color: "#FFA100",
                            fontWeight: "500",
                            fontSize: {
                                sm: "16px",
                                xs: "16px"
                            },
                            fontFamily: "Montserrat !important",
                        }}>
                            About
                        </Typography>
        {formData.about.map((about, index) => (
          <CustomInputShadow
            key={index}
            placeholder={`About ${index + 1}`}
            name={`about${index + 1}`}
            value={formData.about[index]} // Corrected the value reference
            onChange={(e) => handleAboutChange(index, e.target.value)} // Changed to handleAboutChange
            error={errors[`about${index + 1}`]}
          />
        ))}
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 0 }}>
        <CustomButton
          border='1px solid #FFA100'
          ButtonText={loading ? "Saving": "Save"}
          color='white'
          width={"178px"}
          borderRadius='8px'
          background={loading ? "" : 'linear-gradient(90deg, #FFA100 0%, #FF7B00 100%)'}
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

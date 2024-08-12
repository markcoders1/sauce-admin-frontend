import React, { useState } from 'react';
import CustomInputShadow from '../../Components/CustomInput/CustomInput';
import { Box, Typography } from '@mui/material';
import CustomButton from '../../Components/CustomButton/CustomButton';
import axios from 'axios';
import Heading from '../../Components/Heading/Heading';
import SnackAlert from '../../Components/SnackAlert/SnackAlert';

const AddSauce = () => {
  const [snackAlertData, setSnackAlertData] = useState({
    open: false,
    message: "",
    severity: "success"
  });
  const [formData, setFormData] = useState({
    sauceName: '',
    websiteLink: '',
    productLink: '',
    details: '',
    ingredients: [''],
    email: '',
    type: '',
    title: ""
  });
  const [sauceImage, setSauceImage] = useState(null);
  const [bannerImage, setBannerImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [selectedSauceFileName, setSelectedSauceFileName] = useState("");
  const [selectedBannerFileName, setSelectedBannerFileName] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDetailChange = (field, index, value) => {
    const updatedField = formData[field].map((item, i) =>
      i === index ? value : item
    );
    setFormData({
      ...formData,
      [field]: updatedField
    });
  };

  const handleImageChange = (e) => {
    if (e.target.id === "uploadSauceImage") {
      setSauceImage(e.target.files[0]);
      setSelectedSauceFileName(e.target.files[0]?.name || ""); // Update selected file name
    } else if (e.target.id === "uploadBannerImage") {
      setBannerImage(e.target.files[0]);
      setSelectedBannerFileName(e.target.files[0]?.name || ""); // Update selected file name
    }
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
    const data = new FormData();
    data.append('image', sauceImage);
    data.append('bannerImage', bannerImage);
    data.append('name', formData.sauceName);
    data.append('description', formData.details);
    data.append('ingredients', formData.ingredients);
    data.append('productLink', formData.productLink);
    data.append('websiteLink', formData.websiteLink);
    data.append('email', formData.email);
    data.append('type', formData.type);
    data.append('title', formData.title);

    try {
      console.log(formData)
      const response = await axios({
        url: "https://aws.markcoders.com/sauced-backend/api/admin/add-sauce",
        method: "post",
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmEzZTgyYTVkY2FlY2IyNGI4Nzc4YjkiLCJpYXQiOjE3MjIwMTc4MzQsImV4cCI6MTcyNzIwMTgzNH0.jAigSu6rrFjBiJjBKlvShm0--WNo-0YgaJXq6eW_QlU`,
          'Content-Type': 'multipart/form-data'
        },
        data: data
      });
      console.log(response);
      setSnackAlertData({
        open: true,
        message: response?.data?.message,
        severity: "success",
      })
    } catch (error) {
      console.error('Error submitting sauce:', error);
      setSnackAlertData({
        open: true,
        message: error?.response?.data?.message,
        severity: "error",
      })
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
        Add Sauce
      </Typography>
      <Box sx={{ display: "flex", flexDirection: { md: "row", xs: "column" }, gap: "1.5rem", height: { md: "100%", xs: "370px" } }}>
        <label htmlFor="uploadSauceImage" style={{ flexBasis: "50%", height: "165px", backgroundColor: "#2E210A", border: "2px dashed #FFA100", display: "flex", justifyContent: "center", alignItems: "center", borderRadius: "12px", cursor: "pointer" }}>
          <input type="file" id="uploadSauceImage" style={{ display: 'none' }} onChange={handleImageChange} />
          <Typography sx={{ color: "white", textAlign: "center", fontSize: "22px", fontWeight: "600" }}>
            {selectedSauceFileName ? `Selected File: ${selectedSauceFileName}` : "Upload Sauce Image"}
          </Typography>
        </label>
        <label htmlFor="uploadBannerImage" style={{ flexBasis: "50%", height: "165px", backgroundColor: "#2E210A", border: "2px dashed #FFA100", display: "flex", justifyContent: "center", alignItems: "center", borderRadius: "12px", cursor: "pointer" }}>
          <input type="file" id="uploadBannerImage" style={{ display: 'none' }} onChange={handleImageChange} />
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
        <Box sx={{ flexBasis: "33%" }}>
          <CustomInputShadow
            placeholder="Sauce Name"
            name="sauceName"
            value={formData.sauceName}
            onChange={handleChange}
            error={errors.sauceName}
          />
        </Box>
        <Box sx={{ flexBasis: "33%" }}>
          <CustomInputShadow
            placeholder="Website Link"
            name="websiteLink"
            value={formData.websiteLink}
            onChange={handleChange}
            error={errors.websiteLink}
          />
        </Box>
        <Box sx={{ flexBasis: "33%" }}>
          <CustomInputShadow
            placeholder="Product Link"
            name="productLink"
            value={formData.productLink}
            onChange={handleChange}
            error={errors.productLink}
          />
        </Box>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "row", gap: "1.5rem" }}>
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
          <CustomInputShadow
            placeholder="Type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            error={errors.type}
          />
        </Box>
        <Box sx={{ flexBasis: "33%" }}>
          <CustomInputShadow
            placeholder="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            error={errors.title}
          />
        </Box>
      </Box>
      <Box sx={{ flexBasis: "100%", display:"flex", flexDirection:"column", gap:"8px" }}>
        <Heading Heading='Details' />
        <CustomInputShadow
          name="details"
          multiline={true}
          value={formData.details}
          onChange={handleChange}
          error={errors.details}
          height="160px"
        />
      </Box>
      <Box sx={{ flexBasis: "100%", display:"flex", flexDirection:"column", gap:"8px" }}>
        <Heading Heading='Ingredients' />
        {formData.ingredients.map((ingredient, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Box sx={{width:"100%"}} >
              <CustomInputShadow
                name={`ingredients-${index}`}
                multiline={true}
                value={ingredient}
                onChange={(e) => handleDetailChange('ingredients', index, e.target.value)}
                error={errors.ingredients}
              />
            </Box>
            {formData.ingredients.length > 1 && (
              <CustomButton
                border='1px solid #FFA100'
                ButtonText={"Remove"}
                color='white'
                height="100px"
                width={"98px"}
                borderRadius='6px'
                buttonStyle={{ height: "39px" }}
                onClick={() => removeBullet('ingredients', index)}
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
          onClick={() => addBullet('ingredients')}
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

export default AddSauce;

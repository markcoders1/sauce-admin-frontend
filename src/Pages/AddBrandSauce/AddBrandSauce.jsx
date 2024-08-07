import React, { useState } from 'react';
import CustomInputShadow from '../../Components/CustomInput/CustomInput';
import { Box, Typography, Button } from '@mui/material';
import CustomButton from '../../Components/CustomButton/CustomButton';
import BrandImg from '../../assets/brandimage.png'; // Adjust path as needed

const AddSauce = () => {
  const [formData, setFormData] = useState({
    sauceName: '',
    websiteLink: '',
    productLink: '',
    details: '',
    chiliPapers: '',
    ingredients: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {
    let validationErrors = {};
    Object.keys(formData).forEach(field => {
      if (!formData[field]) {
        validationErrors[field] = `${field} is required`;
      }
    });
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    console.log('Form data submitted:', formData);
    // Handle form submission here
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
         padding:"0px 21px"
      }}
    >
        <Box
        sx={{
            display:"flex",
            justifyContent:"space-between"
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
        Add ---- Brand Sauce
      </Typography>

      <Typography sx={{
          color: "white",
          fontWeight: "600",
          fontSize: {
              sm: "45px",
              xs: "26px"
            },
            fontFamily: "Fira Sans !important",
        }}>
      <img src={BrandImg} alt="Sauce" style={{ width: '112px', height: '62px', borderRadius: '8px', }} />
      </Typography>
          </Box>
      <Box sx={{ display: "flex", flexDirection: { md: "row", xs: "column" }, gap: "1.5rem" , height:{md:"100%", xs:"350px"}}}>
        <label htmlFor="uploadSauceImage" style={{ flexBasis: "50%", height: "165px", backgroundColor: "#2E210A", border: "2px dashed #FFA100", display: "flex", justifyContent: "center", alignItems: "center", borderRadius: "12px", cursor: "pointer" }}>
          <input type="file" id="uploadSauceImage" style={{ display: 'none' }} />
          <Typography sx={{ color: "white", textAlign: "center", fontSize: "22px", fontWeight: "600" }}>Upload Sauce Image</Typography>
        </label>
        <label htmlFor="uploadBannerImage" style={{ flexBasis: "50%", height: "165px", backgroundColor: "#2E210A", border: "2px dashed #FFA100", display: "flex", justifyContent: "center", alignItems: "center", borderRadius: "12px", cursor: "pointer" }}>
          <input type="file" id="uploadBannerImage" style={{ display: 'none' }} />
          <Typography sx={{ color: "white", textAlign: "center", fontSize: "22px", fontWeight: "600" }}>Upload Banner Image</Typography>
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
            placeholder="Details"
            name="details"
            multiline={true}
            height="323px"
            value={formData.details}
            onChange={handleChange}
            error={errors.details}
          />
        </Box>
        <Box sx={{ flexBasis: "33%" }}>
          <CustomInputShadow
            placeholder="Chili Papers"
            name="chiliPapers"
            multiline={true}
            height="323px"
            value={formData.chiliPapers}
            onChange={handleChange}
            error={errors.chiliPapers}
          />
        </Box>
        <Box sx={{ flexBasis: "33%" }}>
          <CustomInputShadow
            placeholder="Ingredients"
            name="ingredients"
            multiline={true}
            height="323px"
            value={formData.ingredients}
            onChange={handleChange}
            error={errors.ingredients}
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
          onClick={() => handleSubmit()}
        />
      </Box>
    </Box>
  );
};

export default AddSauce;

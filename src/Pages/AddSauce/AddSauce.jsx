import React, { useState } from 'react';
import CustomInputShadow from '../../Components/CustomInput/CustomInput';
import { Box, Typography, Button } from '@mui/material';
import CustomButton from '../../Components/CustomButton/CustomButton';
import axios from 'axios';

const AddSauce = () => {
  const [formData, setFormData] = useState({
    sauceName: '',
    websiteLink: '',
    productLink: '',
    details: ['', ''], // Initialize with two bullet points
    ingredients: ['', ''], // Initialize with two bullet points
    email: '',
    type: '',
    title : ""
  });
  const [sauceImage, setSauceImage] = useState(null);
  const [bannerImage, setBannerImage] = useState(null);
  const [errors, setErrors] = useState({});

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

  const addBullet = (field) => {
    setFormData({
      ...formData,
      [field]: [...formData[field], '']
    });
  };

  const removeBullet = (field, index) => {
    if (formData[field].length > 2) {
      const updatedField = formData[field].filter((_, i) => i !== index);
      setFormData({
        ...formData,
        [field]: updatedField
      });
    }
  };

  const handleImageChange = (e) => {
    if (e.target.id === "uploadSauceImage") {
      setSauceImage(e.target.files[0]);
    } else if (e.target.id === "uploadBannerImage") {
      setBannerImage(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    // let validationErrors = {};
    // Object.keys(formData).forEach(field => {
    //   if (!formData[field] || formData[field].some(item => item === '')) {
    //     validationErrors[field] = `${field} is required`;
    //   }
    // });
    // if (!sauceImage) validationErrors.sauceImage = 'Sauce image is required';
    // if (!bannerImage) validationErrors.bannerImage = 'Banner image is required';

    // if (Object.keys(validationErrors).length > 0) {
    //   setErrors(validationErrors);
    //   return;
    // }

    // const data = new FormData();
    // data.append('image', sauceImage);
    // data.append('bannerImage', bannerImage);
    // data.append('name', formData.sauceName);
    // data.append('description', JSON.stringify(formData.details)); // Convert array to JSON string
    // data.append('ingredients', JSON.stringify([...formData.chiliPapers, ...formData.ingredients])); // Combine and convert array to JSON string
    // data.append('productLink', formData.productLink);
    // data.append('websiteLink', formData.websiteLink);

    try {
      console.log(formData)
      const response = await axios({
        url: "=https://aws.markcoders.com/sauced-backend/api/admin/add-sauce",
        method: "post",
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmEzZTgyYTVkY2FlY2IyNGI4Nzc4YjkiLCJpYXQiOjE3MjIwMTc4MzQsImV4cCI6MTcyNzIwMTgzNH0.jAigSu6rrFjBiJjBKlvShm0--WNo-0YgaJXq6eW_QlU`,
          'Content-Type': 'multipart/form-data'
        },
        data : {
          image : sauceImage,
          bannerImage : bannerImage,
          name : formData.sauceName,
          title : formData.title,
          type : formData.type,
          description : formData.details,
          ingredients : formData.ingredients,
          email : formData.email,
          title : formData.title
        }
      });
      console.log(response);
      // handle successful response
    } catch (error) {
      console.error('Error submitting sauce:', error);
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
          <Typography sx={{ color: "white", textAlign: "center", fontSize: "22px", fontWeight: "600" }}>Upload Sauce Image</Typography>
        </label>
        <label htmlFor="uploadBannerImage" style={{ flexBasis: "50%", height: "165px", backgroundColor: "#2E210A", border: "2px dashed #FFA100", display: "flex", justifyContent: "center", alignItems: "center", borderRadius: "12px", cursor: "pointer" }}>
          <input type="file" id="uploadBannerImage" style={{ display: 'none' }} onChange={handleImageChange} />
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
      <Box sx={{ flexBasis: "33%" }}>
        <Typography>Details</Typography>
        {formData.details.map((detail, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <CustomInputShadow
              name={`details-${index}`}
              multiline={true}
              value={detail}
              onChange={(e) => handleDetailChange('details', index, e.target.value)}
              error={errors.details}
            />
            {formData.details.length > 2 && (
              <Button variant="contained" color="error" onClick={() => removeBullet('details', index)}>
                Remove
              </Button>
            )}
          </Box>
        ))}
        <Button variant="contained" color="primary" onClick={() => addBullet('details')}>
          Add Bullet
        </Button>
      </Box>
     
      <Box sx={{ flexBasis: "33%" }}>
        <Typography>Ingredients</Typography>
        {formData.ingredients.map((ingredient, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <CustomInputShadow
              name={`ingredients-${index}`}
              multiline={true}
              value={ingredient}
              onChange={(e) => handleDetailChange('ingredients', index, e.target.value)}
              error={errors.ingredients}
            />
            {formData.ingredients.length > 2 && (
              <Button variant="contained" color="error" onClick={() => removeBullet('ingredients', index)}>
                Remove
              </Button>
            )}
          </Box>
        ))}
        <Button variant="contained" color="primary" onClick={() => addBullet('ingredients')}>
          Add Bullet
        </Button>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
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
            placeholder="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            error={errors.title}
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
    </Box>
  );
};

export default AddSauce;

import React, { useState, useEffect } from 'react';
import CustomInputShadow from '../../Components/CustomInput/CustomInput';
import { Box, Typography } from '@mui/material';
import CustomButton from '../../Components/CustomButton/CustomButton';
import axios from 'axios';
import Heading from '../../Components/Heading/Heading';
import SnackAlert from '../../Components/SnackAlert/SnackAlert';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import MenuBar from '../../Components/MenuBar/MenuBar';

const EditSauce = () => {
  const auth = useSelector(state => state.auth);
  const { id } = useParams();
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

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageChange = async (e) => {

    const file = e.target.files[0];
    const {name} = e.target
    if(name=="bannerImage"){
      setBannerImage(file)
    }
    else{
      setSauceImage(file)
    }
    if (file && file.size > 4 * 1024 * 1024) {
      setSnackAlertData({
        open: true,
        message: `Selected ${e.target.id === 'uploadSauceImage' ? 'sauce' : 'banner'} image size exceeds 4MB.`,
        severity: "error",
      });
      return;
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
    const formDataToSend = new FormData();
  
    // Append all the form fields
    formDataToSend.append('name', formData.sauceName);
    formDataToSend.append('description', formData.details);
    formDataToSend.append('ingredients', JSON.stringify(formData.ingredients)); // Convert array to string
    formDataToSend.append('productLink', formData.productLink);
    formDataToSend.append('websiteLink', formData.websiteLink);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('type', formData.type);
    formDataToSend.append('title', formData.title);
    formDataToSend.append('sauceId', id);
  
    // Check and append the sauce image file if it exists
    if (sauceImage) {
      formDataToSend.append('image', sauceImage); // Adding sauce image as binary
    }
  
    // Check and append the banner image file if it exists
    if (bannerImage) {
      formDataToSend.append('bannerImage', bannerImage); // Adding banner image as binary
    }
    console.log(bannerImage)
    try {
      const response = await axios({
        url: `https://aws.markcoders.com/sauced-backend/api/admin/edit-sauce`, // Replace with your actual endpoint
        method: "post",
        headers: {
          Authorization: `Bearer ${auth.accessToken}`, // Assuming you have a Bearer token
          'Content-Type': 'multipart/form-data' // Important for file uploads
        },
        data: formDataToSend
      });
      console.log(response);
      setSnackAlertData({
        open: true,
        message: response?.data?.message,
        severity: "success",
      });
    } catch (error) {
      console.error('Error submitting sauce:', error);
      setSnackAlertData({
        open: true,
        message: error?.response?.data?.message,
        severity: "error",
      });
    }
  };
  
  

  const fetchSauce = async () => {
    try {
      const response = await axios({
        url: `https://aws.markcoders.com/sauced-backend/api/admin/get-sauce/${id}`,
        method: "get",
        headers: {
          Authorization: `Bearer ${auth.accessToken}`
        }
      });
      console.log(response)
      console.log("hello edit sauce")
      const sauceData = response?.data?.sauce;
      setFormData({
        sauceName: sauceData.name,
        websiteLink: sauceData.websiteLink,
        productLink: sauceData.productLink,
        details: sauceData.description,
        ingredients: sauceData.ingredients,
        email: sauceData.email,
        type: sauceData.type,
        title: sauceData.title
      });
      setSauceImage(sauceData.image);
      setBannerImage(sauceData.bannerImage);
    } catch (error) {
      console.error('Error fetching sauce data:', error);
    }
  };

  useEffect(() => {
    fetchSauce();
  }, [id]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
        padding: {
          sm:"0px 21px",
          xs:"0px 15px"
        }
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
          Edit Sauce
        </Typography>
        <Typography>
          <MenuBar/>
        </Typography>
      </Box>
      <Box sx={{ display: "flex", flexDirection: { md: "row", xs: "column" }, gap: "1.5rem", height: { md: "100%", xs: "370px" } }}>
        <label htmlFor="uploadSauceImage" style={{ flexBasis: "50%", height: "165px", backgroundColor: "#2E210A", border: "2px dashed #FFA100", display: "flex", justifyContent: "center", alignItems: "center", borderRadius: "12px", cursor: "pointer" }}>
          <input type="file" id="uploadSauceImage" style={{ display: 'none' }} onChange={handleImageChange} />
          <Typography sx={{ color: "white", textAlign: "center", fontSize: "22px", fontWeight: "600" }}>
            {selectedSauceFileName ? `Selected File: ${selectedSauceFileName}` : "Upload Sauce Image"}
          </Typography>
        </label>
        <label htmlFor="uploadBannerImage" style={{ flexBasis: "50%", height: "165px", backgroundColor: "#2E210A", border: "2px dashed #FFA100", display: "flex", justifyContent: "center", alignItems: "center", borderRadius: "12px", cursor: "pointer" }}>
          <input type="file" name="bannerImage" id="uploadBannerImage" style={{ display: 'none' }} onChange={handleImageChange} />
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
            Sauce Name
          </Typography>
          <CustomInputShadow
            placeholder="Sauce Name"
            name="sauceName"
            value={formData.sauceName}
            onChange={handleChange}
            error={errors.sauceName}
          />
        </Box>
        <Box sx={{ flexBasis: "33%" }}>
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
            Website Link
          </Typography>
          <CustomInputShadow
            placeholder="Website Link"
            name="websiteLink"
            value={formData.websiteLink}
            onChange={handleChange}
            error={errors.websiteLink}
          />
        </Box>
        <Box sx={{ flexBasis: "33%" }}>
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
            Product Link
          </Typography>
          <CustomInputShadow
            placeholder="Product Link"
            name="productLink"
            value={formData.productLink}
            onChange={handleChange}
            error={errors.productLink}
          />
        </Box>
      </Box>
      <Box sx={{ display: "flex", flexDirection: {md:"row", xs:"column"}, gap: "1.5rem" }}>
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
            Type
          </Typography>
          <CustomInputShadow
            placeholder="Type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            error={errors.type}
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
            Title
          </Typography>
          <CustomInputShadow
            placeholder="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            error={errors.title}
          />
        </Box>
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
          Details
        </Typography>
        <CustomInputShadow
          name="details"
          multiline={true}
          value={formData.details}
          onChange={handleChange}
          error={errors.details}
          height="160px"
        />
      </Box>
      <Box sx={{ flexBasis: "100%", display: "flex", flexDirection: "column", gap: "8px" }}>
        {formData.ingredients.map((ingredient, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Box sx={{ width: "100%" }}>
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
                Ingredient {index + 1}
              </Typography>
              <CustomInputShadow
                name={`ingredients-${index}`}
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
                borderRadius='8px'
                buttonStyle={{ height: {sm:"75px", xs:"68px"},mt:"13px" }}
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
          fontSize='20px'
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

export default EditSauce;

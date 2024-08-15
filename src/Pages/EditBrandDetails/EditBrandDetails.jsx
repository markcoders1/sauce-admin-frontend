import React, { useState, useEffect } from 'react';
import CustomInputShadow from '../../Components/CustomInput/CustomInput';
import { Box, Typography } from '@mui/material';
import CustomButton from '../../Components/CustomButton/CustomButton';
import axios from 'axios';
import SnackAlert from '../../Components/SnackAlert/SnackAlert';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import CustomSelectForType from '../../Components/CustomSelectForType/CustomSelectForType';

const EditBrandDetails = () => {
  const { id } = useParams();
  const [snackAlertData, setSnackAlertData] = useState({
    open: false,
    message: "",
    severity: "success"
  });
  const [formData, setFormData] = useState({
    name: '',
    image: null,
    type: '', // input field
    status: '', // input field
    points: '' // number input
  });
  const [errors, setErrors] = useState({});
  const [selectedFileName, setSelectedFileName] = useState("");
  const [currentImage, setCurrentImage] = useState("");
  const auth = useSelector(state => state.auth);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      const file = files[0];
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: file
      }));
      setSelectedFileName(file?.name || ""); // Update selected file name
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value
      }));
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const fetchUser = async () => {
    try {
      const response = await axios({
        url: `https://aws.markcoders.com/sauced-backend/api/admin/get-user/${id}`,
        method: "get",
        headers: {
          Authorization: `Bearer ${auth.accessToken}`
        },
      });
      const userData = response?.data?.user;
      console.log('Fetched user data:', userData); // Add this line to verify data
      setFormData({
        name: userData?.name || '',
        image: null,
        type: userData?.type || '', // Ensure this is being set correctly
        status: userData?.status || '', // Ensure this is being set correctly
        points: userData?.points || 0
      });
      setCurrentImage(userData.image); // Assuming the API returns the image URL
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

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
    if (formData.image) {
      imageBase64 = await convertToBase64(formData.image);
    }

    const data = {
      name: formData.name,
      image: imageBase64,
      type: formData.type,
      status: formData.status,
      points: formData.points,
      userId: id
    };

    try {
      const response = await axios({
        url: `https://aws.markcoders.com/sauced-backend/api/admin/edit-user`,
        method: "post",
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
          'Content-Type': 'application/json'
        },
        data: data
      });

    
      setSelectedFileName(""); // Reset file name
      setCurrentImage(''); // Reset current image
      setSnackAlertData({
        open: true,
        message: response?.data?.message,
        severity: "success",
      });
      console.log(response);
    } catch (error) {
      console.error('Error submitting brand induction:', error);
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
        Edit Brand / User
      </Typography>
      <Box sx={{ display: "flex", flexDirection: { lg: "row", xs: "column" }, gap: "1.5rem", height: { lg: "100%", xs: "370px" } }}>
        <input type="file" id="uploadimage" name="image" style={{ display: 'none' }} onChange={handleChange} />
        <label htmlFor="uploadimage" style={{ flexBasis: "100%", height: "165px", backgroundColor: "#2E210A", border: "2px dashed #FFA100", display: "flex", justifyContent: "center", alignItems: "center", borderRadius: "12px", cursor: "pointer" }}>
          <Typography sx={{ color: "white", textAlign: "center", fontSize: "22px", fontWeight: "600" }}>{selectedFileName ? `Selected File: ${selectedFileName}` : "Upload Banner Image"}</Typography>
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
          <Typography sx={{
            color: "#FFA100",
            fontWeight: "500",
            fontSize: {
              sm: "16px",
              xs: "16px"
            },
            fontFamily: "Montserrat !important",
            marginBottom: "0.4rem" // Add this line to create a gap between label and input field
          }}>
            Name
          </Typography>
          <CustomInputShadow
            placeholder='Enter Name'
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
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
            marginBottom: "0.4rem" // Add this line to create a gap between label and input field
          }}>
            Type
          </Typography>
          <CustomSelectForType
            label="Select Type"
            options={[
              { label: 'User', value: 'user' },
              { label: 'Brand', value: 'brand' },
              { label: 'Admin', value: 'admin' }
            ]}
            value={formData.type} // This should display the initial value
            handleChange={(value) => handleSelectChange('type', value)}
            error={errors.type}
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
            marginBottom: "0.4rem" // Add this line to create a gap between label and input field
          }}>
            Status
          </Typography>
          <CustomSelectForType
            label="Select Status"
            options={[
              { label: 'Active', value: 'active' },
              { label: 'Inactive', value: 'inactive' }
            ]}
            value={formData.status} // This should display the initial value
            handleChange={(value) => handleSelectChange('status', value)}
            error={errors.status}
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
            marginBottom: "0.4rem" // Add this line to create a gap between label and input field
          }}>
            Points
          </Typography>
          <CustomInputShadow
            placeholder='Enter Points'
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

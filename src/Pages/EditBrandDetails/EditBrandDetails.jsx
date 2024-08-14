import React, { useState, useEffect } from 'react';
import CustomInputShadow from '../../Components/CustomInput/CustomInput';
import { Box, Typography } from '@mui/material';
import CustomButton from '../../Components/CustomButton/CustomButton';
import axios from 'axios';
import SnackAlert from '../../Components/SnackAlert/SnackAlert';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

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
  const [getUser, setGetUser] = useState({});
  const auth = useSelector(state => state.auth)

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

  const fetchUser = async () => {
    try {
      const response = await axios({
        url: `https://aws.markcoders.com/sauced-backend/api/admin/get-user/${id}`,
        method: "get",
        headers: {
          Authorization: `Bearer ${auth.accessToken}`
        },
      });
      console.log(response);
      const userData = response?.data?.user;
      setGetUser(userData);
      setFormData({
        name: userData?.name,
        image: null,
        type: userData?.type,
        status: userData?.status,
        points: userData?.points
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

      setFormData({
        name: '',
        image: null,
        type: '',
        status: '',
        points: ''
      });
      setSelectedFileName(""); // Reset file name
      setCurrentImage(''); // Reset current image
      setSnackAlertData({
        open: true,
        message: response?.data?.message,
        severity: "success",
      });
      console.log(response);
      setGetUser(response.data.user)
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
          }}>
            Name
          </Typography>
          <CustomInputShadow
            placeholder={getUser.name || 'Enter Name'}
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
          }}>
            Type
          </Typography>
          <CustomInputShadow
            placeholder={getUser.type || 'Enter Type'}
            name="type"
            value={formData.type}
            onChange={handleChange}
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
          }}>
            Status
          </Typography>
          <CustomInputShadow
            placeholder={getUser.status || 'Enter Status'}
            name="status"
            value={formData.status}
            onChange={handleChange}
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
          }}>
            Points
          </Typography>
          <CustomInputShadow
            placeholder={getUser.points}
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

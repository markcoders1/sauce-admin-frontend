import React, { useState, useEffect } from 'react';
import CustomInputShadow from '../../Components/CustomInput/CustomInput';
import { Box, Typography } from '@mui/material';
import CustomButton from '../../Components/CustomButton/CustomButton';
import axios from 'axios';
import SnackAlert from '../../Components/SnackAlert/SnackAlert';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import CustomSelectForType from '../../Components/CustomSelectForType/CustomSelectForType';
import MenuBar from '../../Components/MenuBar/MenuBar';
import Heading from '../../Components/Heading/Heading';
import NavigateBack from '../../Components/NavigateBackButton/NavigateBack';

const appUrl = import.meta.env.VITE_REACT_APP_API_URL;

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
    type: '',
    status: '',
    points: '',
    about: Array(6).fill(''), // Initialize about with 6 empty strings
  });
  const [errors, setErrors] = useState({});
  const [selectedFileName, setSelectedFileName] = useState("");
  const auth = useSelector(state => state.auth);
  const [loading, setLoading] = useState(false);

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

  const handleAboutChange = (index, value) => {
    const newAbout = [...formData.about];
    newAbout[index] = value;
    setFormData({ ...formData, about: newAbout });
  };

  const fetchUser = async () => {
    try {
      const response = await axios({
        url: `${appUrl}/admin/get-user/${id}`,
        method: "get",
        headers: {
          Authorization: `Bearer ${auth.accessToken}`
        },
      });
      const userData = response?.data?.user;
      console.log(response.data)
      setFormData({
        name: userData?.name || '',
        image: userData?.image || '',
        type: userData?.type || '',
        status: userData?.status || '',
        points: userData?.points || 0,
        about: userData?.about || Array(6).fill(''), // Fetch about if available, else set to 6 empty strings
      });
      setSelectedFileName(userData.image);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleSubmit = async () => {
    console.log('Form data submitted:', formData);
  
    // Check for file size
    if (formData.image && formData.image.size > 4 * 1024 * 1024) {
      setSnackAlertData({
        open: true,
        message: "Selected image size exceeds 4MB.",
        severity: "error",
      });
      return;
    }
  
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('image', formData.image);
    formDataToSend.append('type', formData.type);
    formDataToSend.append('status', formData.status);
    formDataToSend.append('points', formData.points);
    formDataToSend.append('userId', id);
  
    // Handle about array
    formDataToSend.append('about', JSON.stringify(formData.about));
  
    try {
      setLoading(true);
      const response = await axios({
        url: `${appUrl}/admin/edit-user`,
        method: "post",
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
          'Content-Type': 'multipart/form-data',
        },
        data: formDataToSend,
      });
  
      setSnackAlertData({
        open: true,
        message: response?.data?.message,
        severity: "success",
      });
      console.log(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error submitting brand induction:', error);
      setLoading(false);
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
        padding: {sm:"0px 21px", xs:"0px 15px 20px 25px"}
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
          Edit Brand / User
        </Typography>
        <Typography sx={{display:"flex", alignItems:"center", gap:".3rem"}}>
          <MenuBar/>  <NavigateBack /> 
        </Typography>
      </Box>
      <Box sx={{ display: "flex", flexDirection: { lg: "row", xs: "column" }, gap: "1.5rem", height: { lg: "100%", xs: "370px" } }}>
        <input type="file" id="uploadimage" name="image" style={{ display: 'none' }} onChange={handleChange} />
        <label htmlFor="uploadimage" style={{ flexBasis: "100%", height: "165px", backgroundColor: "#2E210A", border: "2px dashed #FFA100", display: "flex", justifyContent: "center", alignItems: "center", borderRadius: "12px", cursor: "pointer" }}>
          <Typography sx={{ color: "white", textAlign: "center", fontSize: {sm:"22px",xs:"16px"}, fontWeight: "600" }}>{selectedFileName ? `Selected File: ${selectedFileName}` : "Upload Banner Image"}</Typography>
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
            marginBottom: "0.4rem"
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
            marginBottom: "0.4rem"
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
            value={formData.type}
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
            marginBottom: "0.4rem"
          }}>
            Status
          </Typography>
          <CustomSelectForType
            label="Select Status"
            options={[
              { label: 'Active', value: 'active' },
              { label: 'Inactive', value: 'inactive' }
            ]}
            value={formData.status}
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
            marginBottom: "0.4rem"
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

      {formData.type === 'brand' && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <Heading Heading='About' />
          {formData.about.map((about, index) => (
            <CustomInputShadow
              key={index}
              placeholder={`About ${index + 1}`}
              name={`about${index + 1}`}
              value={about} // Corrected the value reference
              onChange={(e) => handleAboutChange(index, e.target.value)} // Changed to handleAboutChange
              error={errors[`about${index + 1}`]}
            />
          ))}
        </Box>
      )}

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

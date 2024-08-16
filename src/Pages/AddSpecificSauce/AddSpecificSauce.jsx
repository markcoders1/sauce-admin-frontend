import React, { useState } from 'react';
import CustomInputShadow from '../../Components/CustomInput/CustomInput';
import { Box, Typography } from '@mui/material';
import CustomButton from '../../Components/CustomButton/CustomButton';
import axios from 'axios';
import Heading from '../../Components/Heading/Heading';
import SnackAlert from '../../Components/SnackAlert/SnackAlert';
import { useDispatch, useSelector } from 'react-redux';
import { clearBrandInfo } from '../../Redux/Slice/brandSlice/brandSlice';
import { useNavigate, useParams } from 'react-router-dom';
import MenuBar from '../../Components/MenuBar/MenuBar';

const  AddSpecificSauce= () => {
  const [snackAlertData, setSnackAlertData] = useState({
    open: false,
    message: "",
    severity: "success"
  });
  const brandInfo = useSelector(state => state.brand);
const auth = useSelector(state => state.auth)
const {id} = useParams();
  // console.log(brandInfo)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    sauceName: '',
    websiteLink: '',
    productLink: '',
    details: '',
    ingredients: [''],
 
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
    data.append('userId',id);
    data.append('type', formData.type);
    data.append('title', formData.title);

    try {
      console.log(formData)
      const response = await axios({
        url: "https://aws.markcoders.com/sauced-backend/api/admin/add-sauce",
        method: "post",
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
          'Content-Type': 'multipart/form-data'
        },
        data: data
      });
      console.log(response.data);
      setSnackAlertData({
        open: true,
        message: response?.data?.message,
        severity: "success",
      })

      setFormData({
        sauceName: '',
    websiteLink: '',
    productLink: '',
    details: '',
    ingredients: [''],
 
    type: '',
    title: ""
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
Add {brandInfo.name} Brand Sauce
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
      <Box sx={{ display: "flex", flexDirection: {md:"row", xs:"column"}, gap: "1.5rem" }}>
       
        <Box sx={{ flexBasis: "50%" }}>
          <CustomInputShadow
            placeholder="Type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            error={errors.type}
          />
        </Box>
        <Box sx={{ flexBasis: "50%" }}>
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
                buttonStyle={{ height: {sm:"75px", xs:"68px"}, mt:"-16px" }}
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
          fontSize='18px'
          fontWeight='500'
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

export default AddSpecificSauce;

import React, { useState } from 'react';
import CustomInputShadow from '../../Components/CustomInput/CustomInput';
import { Box, Typography } from '@mui/material';
import CustomButton from '../../Components/CustomButton/CustomButton';
import BrandImg from '../../assets/brandimage.png'; // Adjust path as needed
import SnackAlert from '../../Components/SnackAlert/SnackAlert';
import MenuBar from '../../Components/MenuBar/MenuBar';
import { useNavigate } from 'react-router-dom';

const appUrl = import.meta.env.VITE_REACT_APP_API_URL;


const AddSauce = () => {
  const [formData, setFormData] = useState({
    sauceName: '',
    websiteLink: '',
    productLink: '',
    details: '',
    chiliPapers: '',
    ingredients: '',
    sauceImage: null,
    bannerImage: null,
  });
  const [errors, setErrors] = useState({});
  const [selectedSauceFileName, setSelectedSauceFileName] = useState("");
  const [selectedBannerFileName, setSelectedBannerFileName] = useState("");
  const [loading , setLoading] = useState(false);
  const navigate = useNavigate()
  const [snackAlertData, setSnackAlertData] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      const file = files[0];
      if (name === 'sauceImage') {
        setFormData({
          ...formData,
          sauceImage: file,
        });
        setSelectedSauceFileName(file?.name || "");
      } else if (name === 'bannerImage') {
        setFormData({
          ...formData,
          bannerImage: file,
        });
        setSelectedBannerFileName(file?.name || "");
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = () => {
    let validationErrors = {};

    // Check for empty fields
    Object.keys(formData).forEach(field => {
      if (!formData[field] && field !== 'sauceImage' && field !== 'bannerImage') {
        validationErrors[field] = `${field} is required`;
      }
    });

    // Check file sizes
    if (formData.sauceImage && formData.sauceImage.size > 4 * 1024 * 1024) {
      validationErrors.sauceImage = "Sauce image size exceeds 4MB.";
    }
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

    console.log('Form data submitted:', formData);
  
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between"
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
          <img src={BrandImg} alt="Sauce" style={{ width: '112px', height: '62px', borderRadius: '8px' }} />
        </Typography>
      </Box>
      <Box sx={{ display: "flex", flexDirection: { md: "row", xs: "column" }, gap: "1.5rem", height: { md: "100%", xs: "350px" } }}>
        <label htmlFor="uploadSauceImage" style={{ flexBasis: "50%", height: "165px", backgroundColor: "#2E210A", border: "2px dashed #FFA100", display: "flex", justifyContent: "center", alignItems: "center", borderRadius: "12px", cursor: "pointer" }}>
          <input type="file" id="uploadSauceImage" name="sauceImage" style={{ display: 'none' }} onChange={handleChange} />
          <Typography sx={{ color: "white", textAlign: "center", fontSize: "22px", fontWeight: "600" }}>
            {selectedSauceFileName ? `Selected File: ${selectedSauceFileName}` : "Upload Sauce Image"}
          </Typography>
        </label>
        <label htmlFor="uploadBannerImage" style={{ flexBasis: "50%", height: "165px", backgroundColor: "#2E210A", border: "2px dashed #FFA100", display: "flex", justifyContent: "center", alignItems: "center", borderRadius: "12px", cursor: "pointer" }}>
          <input type="file" id="uploadBannerImage" name="bannerImage" style={{ display: 'none' }} onChange={handleChange} />
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

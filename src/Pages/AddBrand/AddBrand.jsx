import React, { useEffect, useState } from "react";
import CustomInputShadow from "../../Components/CustomInput/CustomInput";
import { Box, Typography } from "@mui/material";
import CustomButton from "../../Components/CustomButton/CustomButton";
import axios from "axios";
import SnackAlert from "../../Components/SnackAlert/SnackAlert";
import MenuBar from "../../Components/MenuBar/MenuBar";
import Heading from "../../Components/Heading/Heading";
import { useSelector } from "react-redux";
import NavigateBack from "../../Components/NavigateBackButton/NavigateBack";
import { useNavigate } from "react-router-dom";
import CustomSelectForType from "../../Components/CustomSelectForType/CustomSelectForType";
import CustomTextAreaShadow from "../../Components/CustomTextAreaShadow/CustomTextAreaShadow";

const appUrl = import.meta.env.VITE_REACT_APP_API_URL;

const AddBrand = () => {
  const auth = useSelector((state) => state.auth);
  const [snackAlertData, setSnackAlertData] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [formData, setFormData] = useState({
    name: "",
    chilli: [''],
    websiteLink: "",
    amazonLink: "",
    bannerImage: null,
    about: "", // Initialize an array of 6 empty strings
    isTopRated: false,
  });
  const [errors, setErrors] = useState({});
  const [selectedFileName, setSelectedFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null); // State for image preview
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData({
        ...formData,
        [name]: files[0],
      });
      setSelectedFileName(files[0]?.name || ""); // Update selected file name

      // Create an object URL for the selected image to display a preview
      const previewUrl = URL.createObjectURL(files[0]);
      setImagePreview(previewUrl);
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleAboutChange = (index, value) => {
    const newAbout = [...formData.about];
    newAbout[index] = value;
    setFormData({ ...formData, about: newAbout });
  };
  const requiredFields = {
    name: "Brand name is required",
    websiteLink:"Website link is required"
  };
  const handleSubmit = async () => {
    console.log("Form data submitted:", formData);

    let validationErrors = {};

    // Check file size for bannerImage
    if (formData.bannerImage && formData.bannerImage.size > 4 * 1024 * 1024) {
      validationErrors.bannerImage = "Banner image size exceeds 4MB.";
    }

    // if (Object.keys(validationErrors).length > 0) {
    //   setErrors(validationErrors);
    //   setSnackAlertData({
    //     open: true,
    //     message: `${Object.values(validationErrors).join(" ")}`,
    //     severity: "error",
    //   });
    //   return;
    // }


    if (!formData.bannerImage) {
      validationErrors.bannerImage = "Brand image is required.";
    }

    Object.entries(requiredFields).forEach(([field, message]) => {
      if (!formData[field]) {
        validationErrors[field] = message;
      }
    });
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }


    const data = new FormData();
    data.append("isTopRated", formData.isTopRated);

    data.append("name", formData?.name);

    data.append("websiteLink", formData?.websiteLink);
    data.append("amazonLink", formData?.amazonLink);


    data.append("image", formData?.bannerImage); // Append the file
    data.append("about", formData?.about); // Serialize the array to JSON

    console.log(data);
    try {
      setLoading(true);
      const response = await axios({
        url: `${appUrl}/admin/create-brand`,
        method: "post",
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
          "Content-Type": "multipart/form-data",
        },
        data: data,
      });
      const res = await axios({
        url: `${appUrl}/send-notification-to-active-users-in-batches`,
        method: "post",
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
          // "Content-Type": "multipart/form-data",
        },
        data: {
          title: "New Hot Sauce Brand Alert!",
          body: `We've just added a new hot sauce brand: ${formData.name}. Check it out now!`,
          image: response.data.user.image,
          "data": {
            "isNavigate": "true",
            "_id": response.data.user._id,
            "route": "BrandScreen",
          }
        }
      });

      setFormData({
        name: "",
        amazonLink: "",

        websiteLink: "",
        bannerImage: null,
        about: "", // Reset about
        isTopRated: false,
      });
      navigate(-1)

      setSelectedFileName(""); // Reset file name
      setImagePreview(null); // Reset image preview
      setLoading(false);

      setSnackAlertData({
        open: true,
        message: response?.data?.message,
        severity: "success",
      });

      console.log(response.data);
    } catch (error) {
      console.error("Error submitting brand induction:", error);
      setSnackAlertData({
        open: true,
        message:
          error?.response?.data?.error?.message ||
          error?.response?.data?.message,
        severity: "error",
      });
      setLoading(false);
    }
  };
useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const errorIds = [
        'name',
        'websiteLink',
        'bannerImage'
      ];
      const firstErrorField = errorIds.find(field => errors[field]);
      if (firstErrorField) {
        let element = document.getElementById(firstErrorField);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }
  }, [errors]);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
        padding: "0px 21px",
      }}
    >
      <Box
        sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}
      >
        <Typography
          sx={{
            color: "white",
            fontWeight: "600",
            fontSize: {
              lg: "45px",
              sm: "40px",
              xs: "30px",
            },
            fontFamily: "Fira Sans !important",
          }}
        >
          Add New Brand
        </Typography>
        <Typography
          sx={{ display: "flex", alignItems: "center", gap: ".3rem" }}
        >
          <MenuBar /> <NavigateBack />
        </Typography>
      </Box>
      {/* <Box
        sx={{
          display: "flex",
          flexDirection: { lg: "row", xs: "column" },
          gap: "1.5rem",
          height: { lg: "100%", xs: "370px" },
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "165px",
            flexBasis: "50%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Brand image"
              style={{
                width: "200px",
                height: "100%",
                objectFit: "cover",
                borderRadius: "12px",
              }}
            />
          ) : (
            <Typography
              sx={{
                color: "white",
                textAlign: "center",
                fontSize: { sm: "22px", xs: "15px" },
                fontWeight: "600",
                background: '#ffa100',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '170px',
                width: '170px',
                borderRadius: '10px'
              }}
            >
              Select Image
            </Typography>
          )}
        </Box>
        <label
          htmlFor="uploadBannerImage"
          style={{
            flexBasis: "50%",
            height: "165px",
            backgroundColor: "#2E210A",
            border: "2px dashed #FFA100",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "12px",
            cursor: "pointer",
          }}
        >
          <input
            type="file"
            id="uploadBannerImage"
            name="bannerImage"
            style={{ display: "none" }}
            onChange={handleChange}
            accept="image/png, image/jpg, image/jpeg, image/webp"
          />
          <Typography
            sx={{
              color: "white",
              textAlign: "center",
              fontSize: "22px",
              fontWeight: "600",
            }}
          >
            {selectedFileName
              ? `Selected File  ${selectedFileName}`
              : "Upload Banner Image"}
          </Typography>
        </label>
      </Box> */}
<Box
          
          id="bannerImage"
          sx={{
                display: "flex",
                flexDirection: { lg: "row",
                  xs:"column"
                },
                gap: "1.5rem",
                // height: {  xs: "170px",  },
              }}
            >
              {imagePreview ? (
                                  <img
                                    src={imagePreview}
                                    alt="Selected Badge"
                                    style={{
                                      width: "auto",
                                      height: "190px",
                                      borderRadius: "12px",
                                      objectFit: "contain",
                                    }}
                                  />
                                ) : (
                                  <Box sx={{
                                    height:"100%",
                                    border: "2px dashed #FFA100",
                                    backgroundColor: "#2E210A",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderRadius: "12px",
                                    padding:{
                                      xs:"20px",
                                      md:"70px"
                                    }
                                  }}>
              
                                  <Typography
                                    sx={{
                                      color: "#FFA100",
                                      fontSize: "18px",
                                      fontWeight: "600",
                                      textAlign:"center"
                                      
                                    }}
                                  >
                                    Image Preview
                                  </Typography>
                                  </Box>
              
                                )}
              <label
                htmlFor="uploadBannerImage"
                style={{
                  flexBasis: "100%",
                  backgroundColor: "#2E210A",
                  border: "2px dashed #FFA100",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "12px",
                  cursor: "pointer",
                }}
              >
                <input
                  type="file"
                  id="uploadBannerImage"
                  name="bannerImage"
                  style={{ display: "none" }}
                 onChange={handleChange}
            accept="image/png, image/jpg, image/jpeg, image/webp"
                />
                <Typography
                  sx={{
                    color: "white",
                    textAlign: "center",
                    fontSize: "22px",
                    fontWeight: "600",
                    padding:{
                      xs:"20px",
                      md:"70px"
                    }
      
                  }}
                >
                {selectedFileName
              ? `Selected File  ${selectedFileName}`
              : "Upload Banner Image"}
                </Typography>
              </label>
            </Box>
            <Box>
           { errors.bannerImage  && (
                        <Typography sx={{
                          background: "#2e210a",
                          p: "10px",
                          color: "red",
                          mt: "8px",
                          wordBreak: "break-word",
                          borderRadius: "5px"
                        }}>
                          {errors.bannerImage}
                        </Typography>
                      )}
            </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: {
            md: "column",
            xs: "column",
          },
          gap: "1.5rem",
        }}
      >
        <Box
          sx={{
            flexBasis: "33%",
            display: "flex",
            flexDirection: "column",
            gap: "0.3rem",
          }}
        >
          <Typography
          id="name"
            sx={{
              color: "#FFA100",
              fontWeight: "500",
              fontSize: {
                sm: "16px",
                xs: "16px",
              },
              fontFamily: "Montserrat !important",
            }}
          >
            Brand Name *
          </Typography>
          <CustomInputShadow
            placeholder="Brand Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
          />
        </Box>

        <Box
          sx={{
            flexBasis: "33%",
            display: "flex",
            flexDirection: "column",
            gap: "0.3rem",
          }}
        >
          <Typography
          id="websiteLink"
            sx={{
              color: "#FFA100",
              fontWeight: "500",
              fontSize: {
                sm: "16px",
                xs: "16px",
              },
              fontFamily: "Montserrat !important",
            }}
          >
            Brand Website *
          </Typography>
          <CustomInputShadow
            placeholder="https://example.com"
            name="websiteLink"
            value={formData.websiteLink}
            onChange={handleChange}
            error={errors.websiteLink}
          />
        </Box>
        <Box
          sx={{
            flexBasis: "33%",
            display: "flex",
            flexDirection: "column",
            gap: "0.3rem",
          }}
        >
          <Typography
            sx={{
              color: "#FFA100",
              fontWeight: "500",
              fontSize: {
                sm: "16px",
                xs: "16px",
              },
              fontFamily: "Montserrat !important",
            }}
          >
            Amazon Link
          </Typography>
          <CustomInputShadow
            placeholder="https://amazon.com"
            name="amazonLink"
            value={formData.amazonLink}
            onChange={handleChange}
            error={errors.amazonLink}
          />
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
          <Typography
            sx={{
              color: "#FFA100",
              fontWeight: "500",
              fontSize: {
                sm: "16px",
                xs: "16px",
              },
              fontFamily: "Montserrat !important",
            }}
          >
            Make Top Rated
          </Typography>
          <CustomSelectForType
            label={"Brand Type"}
            options={[
              { label: "No", value: false },
              { label: "Yes", value: true },
            ]}
            value={formData?.isTopRated}
            handleChange={(selectedValue) =>
              setFormData({ ...formData, isTopRated: selectedValue })
            }
            labelField="label"
            valueField="value"
          />
          {console.log(formData.isTopRated)}
        </Box>

      </Box>

      {/* <Box sx={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
        <Typography
          sx={{
            color: "#FFA100",
            fontWeight: "500",
            fontSize: {
              sm: "16px",
              xs: "16px",
            },
            fontFamily: "Montserrat !important",
          }}
        >
          About
        </Typography>

        <CustomInputShadow
          placeholder="About"
          name="about"
          value={formData.about}
          onChange={handleChange}
          error={errors.about}
          height={"300px"}
          rows ={"5" }
        />
      </Box> */}

      <Box sx={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
        <Typography
          sx={{
            color: "#FFA100",
            fontWeight: "500",
            fontSize: {
              sm: "16px",
              xs: "16px",
            },
            fontFamily: "Montserrat !important",
          }}
        >
          About
        </Typography>

        <CustomTextAreaShadow
          placeholder="Enter brand details..."
          name="about"
          value={formData.about}
          onChange={handleChange}
          error={errors.about}
          rows={3} // You can adjust the number of rows as needed
        />
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 0 }}>
        <CustomButton
          border="1px solid #FFA100"
          ButtonText={loading ? "Adding" : "Add"}
          color="white"
          borderRadius="8px"
          background={
            loading ? "" : "linear-gradient(90deg, #FFA100 0%, #FF7B00 100%)"
          }
          width={"208px"}
          padding="25px 0px"
          fontSize="18px"
          fontWeight="600"
          onClick={() => handleSubmit()}
        />
      </Box>
      <SnackAlert
        severity={snackAlertData.severity}
        message={snackAlertData.message}
        open={snackAlertData.open}
        handleClose={() => {
          setSnackAlertData((prev) => ({ ...prev, open: false }));
        }}
      />
    </Box>
  );
};

export default AddBrand;

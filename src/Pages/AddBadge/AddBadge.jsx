import React, { useState } from "react";
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

const appUrl = import.meta.env.VITE_REACT_APP_API_URL;

const AddBadge = () => {
  const auth = useSelector((state) => state.auth);
  const [snackAlertData, setSnackAlertData] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [formData, setFormData] = useState({
    name: "",
    condition: "",
    pointsRequired: "",
    websiteLink: "",
    icon: null,
    description: "",
  });
  const [errors, setErrors] = useState({});
  const [selectedFileName, setSelectedFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData({
        ...formData,
        [name]: files[0],
      });
      setSelectedFileName(files[0]?.name || ""); // Update selected file name
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };



  const handleSubmit = async () => {
    console.log("Form data submitted:", formData);

    let validationErrors = {};

    // Check file size for bannerImage
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

    const data = new FormData();
    data.append("name", formData.name);

    data.append("condition", formData?.condition);
    data.append("description", formData?.description);
    data.append("pointsRequired", formData?.pointsRequired);
    
    data.append("icon", formData?.icon); // Append the file
    

    console.log(data);
    try {
      setLoading(true);
      const response = await axios({
        url: `${appUrl}/admin/create-badge`,
        method: "post",
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
          "Content-Type": "multipart/form-data",
        },
        data: data,
      });

      setFormData({
        name: "",
    condition: "",
    pointsRequired: "",
    websiteLink: "",
    icon: null,
    description: "",
      });
      // navigate(-1)

      setSelectedFileName(""); // Reset file name
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
          Add New Badge
        </Typography>
        <Typography
          sx={{ display: "flex", alignItems: "center", gap: ".3rem" }}
        >
          <MenuBar /> <NavigateBack />
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: { lg: "row", xs: "column" },
          gap: "1.5rem",
          height: { lg: "100%", xs: "370px" },
        }}
      >
        <label
          htmlFor="uploadBannerImage"
          style={{
            flexBasis: "100%",
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
            name="icon"
            accept="image/png, image/jpg, image/jpeg, image/webp" 
            style={{ display: "none" }}
            onChange={handleChange}
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
              : "Upload Badge Image"}
          </Typography>
        </label>
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
            Badge Name
          </Typography>
          <CustomInputShadow
            placeholder="Badge Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
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
            Conditions
          </Typography>
          <CustomSelectForType
            label={"Condition"}
            options={[
              { label: "Points", value: "points" },
              { label: "First Review", value: "First Review" },
            ]}
            handleChange={(selectedValue) =>
              setFormData({ ...formData, condition: selectedValue })
            }
            labelField="label"
            valueField="value"
          />
        </Box>
        {
            formData.condition === "points" && (
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
                 Points Required
                </Typography>
                <CustomInputShadow
                  placeholder="Points Required"
                  name="pointsRequired"
                  value={formData.pointsRequired}
                  onChange={handleChange}
                  error={errors.pointsRequired}
                  type={"number"}
                />
              </Box>
            )
        }
     
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
            Descriptions
          </Typography>
          <CustomInputShadow
            placeholder="Descriptions"
            name="description"
            value={formData.description}
            onChange={handleChange}
            error={errors.description}
            height={"220px"}
            // rows={"5"}
            multiline={true}
            
          />
        </Box>
      
      </Box>


      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 0 }}>
        <CustomButton
          border="1px solid #FFA100"
          ButtonText={loading ? "Adding" : "Add"}
          color="white"
          width={"178px"}
          borderRadius="8px"
          background={
            loading ? "" : "linear-gradient(90deg, #FFA100 0%, #FF7B00 100%)"
          }
          padding="10px 0px"
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

export default AddBadge;

import React, { useState, useEffect } from "react";
import CustomInputShadow from "../../Components/CustomInput/CustomInput";
import { Box, Typography } from "@mui/material";
import CustomButton from "../../Components/CustomButton/CustomButton";
import axios from "axios";
import SnackAlert from "../../Components/SnackAlert/SnackAlert";
import MenuBar from "../../Components/MenuBar/MenuBar";
import NavigateBack from "../../Components/NavigateBackButton/NavigateBack";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import CustomSelectForType from "../../Components/CustomSelectForType/CustomSelectForType";

const appUrl = import.meta.env.VITE_REACT_APP_API_URL;

const EditBadge = () => {
  const auth = useSelector((state) => state.auth);
  let { state } = useLocation(); // To access the existing badge details for editing
  const [snackAlertData, setSnackAlertData] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const navigate = useNavigate()
  // Pre-fill the formData if editing an existing badge, otherwise use empty values
  const [formData, setFormData] = useState({
    name: state?.name || "",
    condition: state?.condition || "",
    pointsRequired: state?.pointsRequired || "",
    websiteLink: state?.websiteLink || "",
    icon: state?.icon || null,
    url:state?.icon||null,
    description: state?.description || "",

  });

  const [errors, setErrors] = useState({});
  const [selectedFileName, setSelectedFileName] = useState(state?.icon || "");
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(state?.icon || ""); // For image preview

  useEffect(() => {
    if (state) {
      // Pre-fill form when editing a badge
      setFormData({
        name: state?.name || "",
        condition: state?.condition || "",
        pointsRequired: state?.pointsRequired || "",
        websiteLink: state?.websiteLink || "",
        icon: state?.icon || null,
        description: state?.description || "",
      });
      setSelectedFileName(state?.icon || "");
      setPreviewImage(state?.icon || ""); // Set the initial preview image
    }
  }, [state]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      state["icon"] = URL.createObjectURL(files[0])
      console.log(state)
      setFormData({
        ...formData,
        [name]: files[0],
      });
      setSelectedFileName(files[0]?.name || ""); // Update selected file name
      setPreviewImage(URL.createObjectURL(files[0])); // Preview the selected image
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

    if (formData.icon && formData.icon.size > 4 * 1024 * 1024) {
      validationErrors.icon = "Badge image size exceeds 4MB.";
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

    const url = state?._id
      ? `${appUrl}/admin/edit-badge/${state._id}` // Edit badge route if editing
      : `${appUrl}/admin/add-badge`; // Add new badge route if adding

    try {
      setLoading(true);
      const response = await axios({
        url,
        method: "post",
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
          "Content-Type": "multipart/form-data",
        },
        data: data,
      });

      // setFormData({
      //   name: "",
      //   condition: "",
      //   pointsRequired: "",
      //   websiteLink: "",
      //   icon: null,
      //   description: "",
      // });

      // setSelectedFileName(""); // Reset file name
      setLoading(false);
      
      setSnackAlertData({
        open: true,
        message: response?.data?.message,
        severity: "success",
      });

      navigate(-1); // Navigate back after successful submission
    } catch (error) {
      console.error("Error submitting badge:", error);
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
          {state ? "Edit Badge" : "Add New Badge"}
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
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
           width:"100%"
          }}
        >
          {previewImage ? (
            <img
              src={state.icon}
              alt="Selected Badge"
              style={{
                width: "auto",
                height: "190px",
                borderRadius: "12px",
                objectFit: "contain",
              }}
            />
          ) : (
            <Typography
              sx={{
                color: "#FFA100",
                fontSize: "18px",
                fontWeight: "600",
                textAlign: "center",
              }}
            >
              No Image Available
            </Typography>
          )}
        </Box>

        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#2E210A",
            border: "2px dashed #FFA100",
            borderRadius: "12px",
            cursor: "pointer",
            height: "165px",
          }}
          onClick={() => document.getElementById("uploadIcon").click()}
        >
          <input
            type="file"
            id="uploadIcon"
            name="icon"
            style={{ display: "none" }}
            onChange={handleChange}
            accept="image/png, image/jpg, image/jpeg, image/webp" 
          />
          <Typography
            sx={{
              color: "white",
              fontSize: "22px",
              fontWeight: "600",
            }}
          >
            {"Click Here to Change Image"}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: { md: "column", xs: "column" },
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
              fontSize: { sm: "16px", xs: "16px" },
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
              fontSize: { sm: "16px", xs: "16px" },
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
            value={formData.condition} // Set current value in select
          />
        </Box>

        {formData.condition === "points" && (
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
                fontSize: { sm: "16px", xs: "16px" },
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
              type="number"
              

            />
          </Box>
        )}

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
              fontSize: { sm: "16px", xs: "16px" },
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
            multiline={true}
          />
        </Box>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 0 }}>
        <CustomButton
          border="1px solid #FFA100"
          ButtonText={loading ? "Saving" : state ? "Save" : "Saving"}
          color="white"
         width={"208px"}
          padding='25px 0px'
          borderRadius="8px"
          background={
            loading ? "" : "linear-gradient(90deg, #FFA100 0%, #FF7B00 100%)"
          }
        
          fontSize="18px"
          fontWeight="600"
          onClick={handleSubmit}
        />
      </Box>

      <SnackAlert
        severity={snackAlertData.severity}
        message={snackAlertData.message}
        open={snackAlertData.open}
        handleClose={() =>
          setSnackAlertData((prev) => ({ ...prev, open: false }))
        }
      />
    </Box>
  );
};

export default EditBadge;

import React, { useState } from "react";
import CustomInputShadow from "../../Components/CustomInput/CustomInput";
import { Box, Typography } from "@mui/material";
import CustomButton from "../../Components/CustomButton/CustomButton";
import axios from "axios";
import Heading from "../../Components/Heading/Heading";
import SnackAlert from "../../Components/SnackAlert/SnackAlert";
import { useDispatch, useSelector } from "react-redux";
import { clearBrandInfo } from "../../Redux/Slice/brandSlice/brandSlice";
import { useNavigate, useParams } from "react-router-dom";
import MenuBar from "../../Components/MenuBar/MenuBar";
import NavigateBack from "../../Components/NavigateBackButton/NavigateBack";
import CustomSelectForType from "../../Components/CustomSelectForType/CustomSelectForType";

const appUrl = import.meta.env.VITE_REACT_APP_API_URL;

const AddSpecificSauce = () => {
  const [snackAlertData, setSnackAlertData] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const brandInfo = useSelector((state) => state.brand);
  const auth = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    sauceName: "",
    websiteLink: "",
    productLink: "",
    details: "",
    chilli: [""],
    type: "",
    title: "",
    ingredients: "",
    isFeatured: false,
    isTopRated: false
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
      [field]: updatedField,
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
      [field]: [...formData[field], ""],
    });
  };

  const removeBullet = (field, index) => {
    if (formData[field].length > 1) {
      const updatedField = formData[field].filter((_, i) => i !== index);
      setFormData({
        ...formData,
        [field]: updatedField,
      });
    }
  };

  const handleSubmit = async () => {
    let validationErrors = {};

    // Check file sizes
    if (sauceImage && sauceImage.size > 4 * 1024 * 1024) {
      validationErrors.sauceImage = "Sauce image size exceeds 4MB.";
    }
    if (bannerImage && bannerImage.size > 4 * 1024 * 1024) {
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
    data.append("image", sauceImage);
    data.append("bannerImage", bannerImage);
    data.append("name", formData.sauceName);
    data.append("description", formData.details);
    data.append("chilli", formData.chilli);
    data.append("productLink", formData.productLink);
    data.append("websiteLink", formData.websiteLink);
    data.append("userId", id);
    data.append("type", formData.type);
    data.append("title", formData.title);
    data.append("ingredients", formData.ingredients);
    data.append("isFeatured", formData.isFeatured);
    data.append("isTopRated",  formData.isTopRated);

    console.log(data)
    console.log(formData)

    try {
      setLoading(true);
      console.log(formData);
      const response = await axios({
        url: `${appUrl}/admin/add-sauce`,
        method: "post",
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
          "Content-Type": "multipart/form-data",
        },
        data: data,
      });
      console.log(response.data);
      setSnackAlertData({
        open: true,
        message: response?.data?.message,
        severity: "success",
      });

      // navigate(-1)

      setFormData({
        sauceName: "",
        websiteLink: "",
        productLink: "",
        details: "",
        chilli: [""],
        type: "",
        title: "",
        ingredients: "",
        isFeatured: false,
    
      });
      setLoading(false);
    } catch (error) {
      console.error("Error submitting sauce:", error);
      setSnackAlertData({
        open: true,
        message: error?.response?.data?.message,
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
          Add {brandInfo.name} Brand Sauce
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
          flexDirection: { md: "row", xs: "column" },
          gap: "1.5rem",
          height: { md: "100%", xs: "370px" },
        }}
      >
        <label
          htmlFor="uploadSauceImage"
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
            id="uploadSauceImage"
            style={{ display: "none" }}
            onChange={handleImageChange}
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
            {selectedSauceFileName
              ? `Selected File: ${selectedSauceFileName}`
              : "Upload Sauce Image"}
          </Typography>
        </label>
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
            style={{ display: "none" }}
            onChange={handleImageChange}
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
            {selectedBannerFileName
              ? `Selected File: ${selectedBannerFileName}`
              : "Upload Banner Image"}
          </Typography>
        </label>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: {
            md: "row",
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
        <Box sx={{ flexBasis: "33%",  display: "flex",
            flexDirection: "column",
            gap: "0.3rem", }}>
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
        <Box sx={{ flexBasis: "33%", display: "flex",
            flexDirection: "column",
            gap: "0.3rem",  }}>
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
      <Box
        sx={{
          display: "flex",
          flexDirection: { md: "row", xs: "column" },
          gap: "1.5rem",
        }}
      >
        <Box sx={{ flexBasis: "50%", display: "flex",
            flexDirection: "column",
            gap: "0.3rem",  }}>
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
        <Box sx={{ flexBasis: "50%",  display: "flex",
            flexDirection: "column",
            gap: "0.3rem",  }}>
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
      <Box
        sx={{
          flexBasis: "100%",
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
      <Box
        sx={{
          flexBasis: "100%",
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
             Ingredients
          </Typography>
        <CustomInputShadow
          name="ingredients"
          multiline={true}
          value={formData.ingredients}
          onChange={handleChange}
          error={errors.ingredients}
          height="160px"
        />
      </Box>
      <Box sx={{display: "flex",
          flexDirection: "column",
          gap: "0.3rem",}} >
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
             Make Featured
          </Typography>
        <CustomSelectForType
          label={"Sauce Type"}
          options={[
            { label: "None", value: "false" },
            { label: "Featured", value: "true" },
          ]}
          handleChange={(selectedValue) =>
            setFormData({ ...formData, isFeatured: selectedValue })
          }
          labelField="label"
          valueField="value"
        />
      </Box>
      <Box sx={{display: "flex",
          flexDirection: "column",
          gap: "0.3rem",}} >
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
          label={"Sauce Type"}
          options={[
            { label: "None", value: "false" },
            { label: "Top Rated", value: "true" },
          ]}
          handleChange={(selectedValue) =>
            setFormData({ ...formData, isTopRated: selectedValue })
          }
          labelField="label"
          valueField="value"
        />
      </Box>
      <Box
        sx={{
          flexBasis: "100%",
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
             Chilli
          </Typography>
        {formData.chilli.map((chilli, index) => (
          <Box
            key={index}
            sx={{ display: "flex", alignItems: "center", gap: "1rem" }}
          >
            <Box sx={{ width: "100%" }}>
              <CustomInputShadow
                name={`chilli-${index}`}
                value={chilli}
                onChange={(e) =>
                  handleDetailChange("chilli", index, e.target.value)
                }
                error={errors.chilli}
              />
            </Box>
            {formData.chilli.length > 1 && (
              <CustomButton
                border="1px solid #FFA100"
                ButtonText={"Remove"}
                color="white"
                height="100px"
                width={"98px"}
                borderRadius="6px"
                buttonStyle={{
                  height: { sm: "75px", xs: "68px" },
                  mt: "-16px",
                }}
                onClick={() => removeBullet("chilli", index)}
              />
            )}
          </Box>
        ))}
        <CustomButton
          border="1px solid #FFA100"
          ButtonText={"Add Bullet"}
          color="white"
          height="100px"
          width={"100%"}
          borderRadius="6px"
          buttonStyle={{ height: "75px" }}
          onClick={() => addBullet("chilli")}
          fontSize="18px"
          fontWeight="500"
        />
      </Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 0 }}>
        <CustomButton
          border="1px solid #FFA100"
          ButtonText={loading ? "Saving" : "Save"}
          color="white"
          width={"178px"}
          borderRadius="8px"
          background={
            loading ? "" : "linear-gradient(90deg, #FFA100 0%, #FF7B00 100%)"
          }
          padding="10px 0px"
          fontSize="18px"
          fontWeight="600"
          onClick={handleSubmit}
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

export default AddSpecificSauce;

import React, { useEffect, useState } from "react";
import CustomInputShadow from "../../Components/CustomInput/CustomInput";
import { Box, Typography } from "@mui/material";
import CustomButton from "../../Components/CustomButton/CustomButton";
import axios from "axios";
import Heading from "../../Components/Heading/Heading";
import SnackAlert from "../../Components/SnackAlert/SnackAlert";
import { useSelector } from "react-redux";
import MenuBar from "../../Components/MenuBar/MenuBar";
import NavigateBack from "../../Components/NavigateBackButton/NavigateBack";
import { useLocation, useNavigate } from "react-router-dom";
import { isURL } from "../../../utils";
const appUrl = import.meta.env.VITE_REACT_APP_API_URL;
import CustomSelect from "../../Components/CustomSelect/CustomSelect";
import CustomSelectForType from "../../Components/CustomSelectForType/CustomSelectForType";

import ConfirmDeleteModalRequestedSauce from "../../Components/DeleteRequestedSauce/DeleteRequestedSauce";
import VirtualizedCustomSelect from "../../Components/VirtualzedCustomSelect/VirtualizedCustomSelect";

const AddSauce = () => {
  const [snackAlertData, setSnackAlertData] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const { state} = useLocation();

  const [formData, setFormData] = useState({
    sauceName: state?.name ? state?.name : "",
    websiteLink: state?.websiteLink ? state?.websiteLink : "",
    productLink: "",
    amazonLink: "",
    details: "",
    chilli: [""],
    ingredients: "",
    isFeatured: false,
    userId:""
  });

  const [sauceImage, setSauceImage] = useState(null);
  const [allBrands, setAllBrands] = useState([]);

  const [bannerImage, setBannerImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [selectedSauceFileName, setSelectedSauceFileName] = useState("");
  const [selectedBannerFileName, setSelectedBannerFileName] = useState("");
  const auth = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
    const [previewImage, setPreviewImage] = useState("");
  

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    console.log("============================================================================>",state);
  }, []);

  const handleOpenDeleteModal = () => {
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
  };

  const handleDeleteSuccess = () => {
    setDeleteModalOpen(false);
    navigate(-1); // Navigate back after successful deletion
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // const handleChange = (e) => {
  //   const { name, value, type, files } = e.target;
  //   if (type === "file") {
  //     const file = files[0];
  //     setFormData((prevFormData) => ({
  //       ...prevFormData,
  //       [name]: file,
  //     }));
  //     setSelectedSauceFileName(file?.name || ""); // Update selected file name
  //     setPreviewImage(URL.createObjectURL(file));
      
  //   } else {
  //     setFormData((prevFormData) => ({
  //       ...prevFormData,
  //       [name]: value,
  //     }));
  //   }
  // };

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
      const file = e.target.files[0];
      if (file) {
        setSauceImage(file);
        setSelectedSauceFileName(file.name || "");
        setPreviewImage(URL.createObjectURL(file)); // Update previewImage
      }
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
    if (formData.productLink) {
      if (!isURL(formData.productLink)) {
        setSnackAlertData({
          open: true,
          message: "Product link must be a valid url",
          severity: "error",
        });
        return;
      } else {
        data.append("productLink", formData.productLink);
      }
    }
    if (formData.websiteLink) {
      if (!isURL(formData.websiteLink)) {
        setSnackAlertData({
          open: true,
          message: "Website link must be a valid url",
          severity: "error",
        });
        return;
      } else {
        data.append("websiteLink", formData.websiteLink);
      }
    }
    if (formData.amazonLink) {
      if (!isURL(formData.amazonLink)) {
        setSnackAlertData({
          open: true,
          message: "Amazon link must be a valid url",
          severity: "error",
        });
        return;
      } else {
        data.append("amazonLink", formData.amazonLink);
      }
    }
    data.append("isFeatured", formData.isFeatured || false);
    data.append("image", sauceImage);
    data.append("name", formData.sauceName);
    data.append("description", formData.details);
    formData.chilli.forEach((chilliItem) => {
      data.append("chilli[]", chilliItem);
    });
    data.append("ingredients", formData.ingredients);
    data.append("userId", formData.userId);


    console.log(data);
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
      if(state?.isFromRequestedPage){
        const res = await axios({
          url: `${appUrl}/admin/send-notification-to-requested-sauce-user`,
          method: "post",
          headers: {
            Authorization: `Bearer ${auth.accessToken}`,
            "Content-Type": "application/json",
          },
          "data": {
            "token": state.owner.notificationToken,
            "title": "Your Requested Hot Sauce is Here!",
            "body": `Good news! The hot sauce you requested, ${state.name}, is now available in our app. Check it out now!`
          }
        });
      }
      console.log(response.data);
      setSnackAlertData({
        open: true,
        message: response?.data?.message,
        severity: "success",
      });

      setFormData({
        sauceName: "",
        websiteLink: "",
        productLink: "",
        details: "",
        chilli: [""],
        ingredients: "",
        isFeatured: false,
      });
      setLoading(false);
      navigate(-1);
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

  const fetchBrands = async () => {
    try {
      const response = await axios({
        url: `${appUrl}/admin/get-all-active-users`,
        method: "get",
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
        },
        params: {
          limit: 8,
          searchTerm: searchQuery,
           type:"brand"
        },
      });
      console.log(response);
      setAllBrands(response?.data?.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, [searchQuery]);

  const handleBrandChange = (userId) => {
    setFormData((prev) => ({ ...prev, userId }));
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
        padding: { sm: "0px 21px", xs: "0px 20px" },
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
          Add Sauce
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
         <Box
                  sx={{
                    width: "100%",
                    height: "165px",
                    flexBasis: "50%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Sauce image"
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
width: '190px',
borderRadius: '10px'
                      }}
                    >
                       Preview Image
                    </Typography>
                  )}
                </Box>
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
              display: "flex",
              alignItems: "center",
              gap: ".5rem", 
            }}
          >
            Sauce Owner 
            
            {state?.isFromRequestedPage &&<Typography>
                Brand name suggested by user : {state?.description}
            </Typography>}
          </Typography>

          <VirtualizedCustomSelect
            data={allBrands}
            handleChange={handleBrandChange}
            label="Select Brand"
            isMultiSelect={false} // Set to true if you need multi-select
            setSearchQuery={setSearchQuery}
            searchQuery={searchQuery}
          />
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
            flexBasis: "50%",
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
        <Box
          sx={{
            flexBasis: "50%",
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
            placeholder="https://example.com"
            name="amazonLink"
            value={formData.amazonLink}
            onChange={handleChange}
            error={errors.amazonLink}
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
        <Box
          sx={{
            flexBasis: "50%",
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
            Product Link
          </Typography>
          <CustomInputShadow
            placeholder="https://example.com"
            name="productLink"
            value={formData.productLink}
            onChange={handleChange}
            error={errors.productLink}
          />
        </Box>
        <Box
          sx={{
            flexBasis: "50%",
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
            Website Link
          </Typography>
          <CustomInputShadow
            placeholder="https://example.com"
            name="websiteLink"
            value={formData.websiteLink}
            onChange={handleChange}
            error={errors.websiteLink}
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
          Description
        </Typography>
        <CustomInputShadow
          name="details"
          multiline={true}
          value={formData.details}
          onChange={handleChange}
          error={errors.details}
          placeholder={"Description"}
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
          placeholder={"Ingredients"}
          height="160px"
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
          Make Featured
        </Typography>
        <CustomSelectForType
          label={"Featured Sauce"}
          options={[
            { label: "No", value: false },
            { label: "Yes", value: true },
          ]}
          value={formData?.isFeatured}
          handleChange={(selectedValue) =>
            setFormData({ ...formData, isFeatured: selectedValue })
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
          Chili
        </Typography>
        {formData?.chilli.map((ingredient, index) => (
          <Box
            key={index}
            sx={{ display: "flex", alignItems: "center", gap: "1rem" }}
          >
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: "0.3rem",
              }}
            >
              <CustomInputShadow
                name={`chilli-${index}`}
                value={ingredient}
                onChange={(e) =>
                  handleDetailChange("chilli", index, e.target.value)
                }
                error={errors.chilli}
              />
            </Box>
            {formData?.chilli.length > 1 && (
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
          ButtonText={"Add Chili"}
          color="white"
          height="100px"
          width={"100%"}
          borderRadius="6px"
          background="linear-gradient(90deg, #FFA100 0%, #FF7B00 100%)"
          hoverBg="linear-gradient(90deg, #F3C623 0%, #F3C623 100%)"
          buttonStyle={{ height: "75px" }}
          onClick={() => addBullet("chilli")}
          fontSize="18px"
          fontWeight="500"
        />
      </Box>

      <Box
        sx={{ display: "flex", justifyContent: "flex-end", mt: 0, gap: "2rem" }}
      >
        {state ? (
          <CustomButton
            border="1px solid #FFA100"
            ButtonText={loading ? "Delete Sauce" : "Delete Request Sauce"}
            color="white"
            width={"208px"}
            padding="25px 0px"
            borderRadius="8px"
            // background={
            //   loading ? "" : "linear-gradient(90deg, #FFA100 0%, #FF7B00 100%)"
            // }

            fontSize="18px"
            fontWeight="600"
            onClick={handleOpenDeleteModal}
          />
        ) : (
          ""
        )}

        <CustomButton
          border="1px solid #FFA100"
          ButtonText={loading ? "Saving Sauce" : "Save Sauce"}
          color="white"
          borderRadius="8px"
          background={
            loading ? "" : "linear-gradient(90deg, #FFA100 0%, #FF7B00 100%)"
          }
          width={"208px"}
          padding="25px 0px"
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
      <ConfirmDeleteModalRequestedSauce
        open={deleteModalOpen}
        handleClose={handleCloseDeleteModal}
        reviewId={state?._id} // Assuming you pass the ID of the review to delete
        onSuccess={handleDeleteSuccess} // Callback for success handling
      />
    </Box>
  );
};

export default AddSauce;

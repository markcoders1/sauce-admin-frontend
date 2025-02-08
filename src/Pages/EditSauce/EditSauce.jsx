import React, { useState, useEffect } from "react";
import CustomInputShadow from "../../Components/CustomInput/CustomInput";
import { Box, Typography } from "@mui/material";
import CustomButton from "../../Components/CustomButton/CustomButton";
import axios from "axios";
import Heading from "../../Components/Heading/Heading";
import SnackAlert from "../../Components/SnackAlert/SnackAlert";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import MenuBar from "../../Components/MenuBar/MenuBar";
import NavigateBack from "../../Components/NavigateBackButton/NavigateBack";
import { isURL } from "../../../utils";
import CustomSelectForType from "../../Components/CustomSelectForType/CustomSelectForType";
import VirtualizedCustomSelect from "../../Components/VirtualzedCustomSelect/VirtualizedCustomSelect";
import DeleteIcon from "../../assets/deleteIcon.png";
import ConfirmDeleteModalSauce from "../../Components/DeleteSaucModal/DeleteSauceModal";


const appUrl = import.meta.env.VITE_REACT_APP_API_URL;

const EditSauce = () => {
  const auth = useSelector((state) => state.auth);
  const { id } = useParams();
  const [reviewToDelete, setReviewToDelete] = useState(null);

  const [loading, setLoading] = useState(false);
  const [snackAlertData, setSnackAlertData] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [formData, setFormData] = useState({
    sauceName: "",
    websiteLink: "",
    productLink: "",
    amazonLink: "",
    details: "",
    chilli: [""],
    userId: "",
    ownerName: "",

    ingredients: "",
    isFeatured: false,
  });
  const [sauceImage, setSauceImage] = useState(null);
  const [bannerImage, setBannerImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [selectedSauceFileName, setSelectedSauceFileName] = useState("");
  const navigate = useNavigate();
  const [selectedBannerFileName, setSelectedBannerFileName] = useState("");
  const [allBrands, setAllBrands] = useState([]);
  const [previewImage, setPreviewImage] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);


  const [searchQuery, setSearchQuery] = useState("");

  const handleOpenDeleteModal = (id) => {
    setReviewToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setReviewToDelete(null);
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
  //     setSelectedFileName(file?.name || ""); // Update selected file name
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

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const { name } = e.target;

    if (name === "sauceImage") {
      setSauceImage(file);
    }

    if (file.size > 4 * 1024 * 1024) {
      setSnackAlertData({
        open: true,
        message: `Selected image size exceeds 4MB.`,
        severity: "error",
      });
      return;
    }

    // Create a preview URL for the image
    const previewURL = URL.createObjectURL(file);
    setPreviewImage(previewURL);
    setSelectedSauceFileName(file.name); // Update the file name display
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
    // Validate productLink
    if (formData.productLink) {
      if (!isURL(formData.productLink)) {
        setSnackAlertData({
          open: true,
          message: "Product link must be a valid URL",
          severity: "error",
        });
        return; // Exit the function to prevent further execution
      }
    }

    // Validate websiteLink
    if (formData.websiteLink) {
      if (!isURL(formData.websiteLink)) {
        setSnackAlertData({
          open: true,
          message: "Website link must be a valid URL",
          severity: "error",
        });
        return; // Exit the function to prevent further execution
      }
    }

    if (formData.amazonLink) {
      if (!isURL(formData.amazonLink)) {
        setSnackAlertData({
          open: true,
          message: "Amazon link must be a valid URL",
          severity: "error",
        });
        return; // Exit the function to prevent further execution
      }
    }
    const formDataToSend = new FormData();
    console.log(formData.isFeatured);

    // Append all the form fields
    formDataToSend.append("name", formData.sauceName);
    formDataToSend.append("description", formData.details);
    formDataToSend.append("chilli", JSON.stringify(formData.chilli));
    formDataToSend.append("productLink", formData.productLink);
    formDataToSend.append("websiteLink", formData.websiteLink);
    formDataToSend.append("sauceId", id);
    formDataToSend.append("ingredients", formData.ingredients);
    formDataToSend.append("isFeatured", formData.isFeatured);
    formDataToSend.append("amazonLink", formData.amazonLink);
    formDataToSend.append("userId", formData?.userId);


    // Check and append the sauce image file if it exists
    if (sauceImage) {
      formDataToSend.append("image", sauceImage); // Adding sauce image as binary
    }
    try {
      setLoading(true);
      const response = await axios({
        url: `${appUrl}/admin/edit-sauce`,
        method: "post",
        headers: {
          Authorization: `Bearer ${auth.accessToken}`, // Assuming you have a Bearer token
          "Content-Type": "multipart/form-data", // Important for file uploads
        },
        data: formDataToSend,
      });
      console.log(response.data);
      setLoading(false);
      navigate(-1);

      setSnackAlertData({
        open: true,
        message: response?.data?.message,
        severity: "success",
      });
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

  const fetchSauce = async () => {
    try {
      const response = await axios({
        url: `${appUrl}/admin/get-sauce/${id}`,
        method: "get",
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
        },
      });
      console.log(response.data);
      console.log("hello edit sauce");
      const sauceData = response?.data?.sauce;
      setFormData({
        sauceName: sauceData.name || "",
        websiteLink: sauceData.websiteLink || "",
        productLink: sauceData.productLink || "",
        amazonLink: sauceData.amazonLink || "",
        details: sauceData.description || "",
        chilli: sauceData.chilli || [""],
        ingredients: sauceData.ingredients || "",
        isFeatured: sauceData.isFeatured || false,
        userId: sauceData.owner._id,
        ownerName: sauceData.owner.name || sauceData.name,
      });
      setPreviewImage(sauceData?.image);
      setSauceImage(sauceData.image);
    } catch (error) {
      console.error("Error fetching sauce data:", error);
    }
  };

  useEffect(() => {
    fetchSauce();
  }, [id]);

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
          type: "brand",
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

  // const handleBrandChange = (ownerId) => {
  //   setFormData((prev) => ({ ...prev, ownerId }));
  // };
  const handleBrandChange = (selectedId) => {
    console.log(selectedId)
    setFormData((prev) => ({ ...prev, userId: selectedId }));
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
        padding: {
          sm: "0px 21px",
          xs: "0px 15px",
        },
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
          Edit Sauce
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
              alt="Brand Banner"
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
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '170px',
                width: '190px',
                borderRadius: '10px',
                background: '#ffa100',

              }}
            >
              Preview Image
            </Typography>
          )}
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: { md: "row", xs: "column" },
            gap: "1.5rem",
            height: { md: "100%", xs: "370px" },
            flexBasis: "50%",
          }}
        >
          <label
            htmlFor="uploadSauceImage"
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
              name="sauceImage"
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
      </Box> */}




      
<Box
              sx={{
                display: "flex",
                flexDirection: { lg: "row",
                  xs:"column"
                },
                gap: "1.5rem",
                // height: {  xs: "170px",  },
              }}
            >
              {previewImage ? (
                                  <img
                                    src={previewImage}
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
                htmlFor="uploadSauceImage"
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
                  id="uploadSauceImage"
                  name="sauceImage"
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
                    padding:{
                      xs:"20px",
                      md:"70px"
                    }
      
                  }}
                >
                  {selectedSauceFileName
              ? `Selected File: ${selectedSauceFileName}`
              : "Upload Sauce Image"}
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
          Sauce Owner
        </Typography>
        {
          console.log(formData.ownerName)
        }
        <VirtualizedCustomSelect
          data={allBrands}
          handleChange={handleBrandChange}
          label={formData.ownerName}
          isMultiSelect={false}
          setSearchQuery={setSearchQuery}
          searchQuery={searchQuery}
          value={formData?.userId}
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
        <Box sx={{ flexBasis: "50%" }}>
          <Typography
            sx={{
              color: "#FFA100",
              fontWeight: "500",
              fontSize: {
                sm: "16px",
                xs: "16px",
              },
              fontFamily: "Montserrat !important",
              marginBottom: "0.4rem",
            }}
          >
            Sauce Name
          </Typography>
          <CustomInputShadow
            placeholder="Sauce Name"
            name="sauceName"
            value={formData?.sauceName}
            onChange={handleChange}
            error={errors.sauceName}
          />
        </Box>
        <Box sx={{ flexBasis: "50%" }}>
          <Typography
            sx={{
              color: "#FFA100",
              fontWeight: "500",
              fontSize: {
                sm: "16px",
                xs: "16px",
              },
              fontFamily: "Montserrat !important",
              marginBottom: "0.4rem",
            }}
          >
            Amazon Link
          </Typography>
          <CustomInputShadow
            placeholder="https://example.com"
            name="amazonLink"
            value={formData?.amazonLink}
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
        <Box sx={{ flexBasis: "50%" }}>
          <Typography
            sx={{
              color: "#FFA100",
              fontWeight: "500",
              fontSize: {
                sm: "16px",
                xs: "16px",
              },
              fontFamily: "Montserrat !important",
              marginBottom: "0.4rem",
            }}
          >
            Website Link
          </Typography>
          <CustomInputShadow
            placeholder="https://example.com"
            name="websiteLink"
            value={formData?.websiteLink}
            onChange={handleChange}
            error={errors.websiteLink}
          />
        </Box>
        <Box sx={{ flexBasis: "50%" }}>
          <Typography
            sx={{
              color: "#FFA100",
              fontWeight: "500",
              fontSize: {
                sm: "16px",
                xs: "16px",
              },
              fontFamily: "Montserrat !important",
              marginBottom: "0.4rem",
            }}
          >
            Product Link
          </Typography>
          <CustomInputShadow
            placeholder="https://example.com"
            name="productLink"
            value={formData?.productLink}
            onChange={handleChange}
            error={errors.productLink}
          />
        </Box>
      </Box>

      <Box sx={{ flexBasis: "100%", display: "flex", flexDirection: "column" }}>
        <Typography
          sx={{
            color: "#FFA100",
            fontWeight: "500",
            fontSize: {
              sm: "16px",
              xs: "16px",
            },
            fontFamily: "Montserrat !important",
            marginBottom: "0.4rem",
          }}
        >
          Description
        </Typography>
        <CustomInputShadow
          name="details"
          multiline={true}
          value={formData?.details}
          onChange={handleChange}
          error={errors.details}
          placeholder={"Description"}
          height="100%"
          inputStyle={{}}
        />
      </Box>

      <Box sx={{ flexBasis: "100%", display: "flex", flexDirection: "column" }}>
        <Typography
          sx={{
            color: "#FFA100",
            fontWeight: "500",
            fontSize: {
              sm: "16px",
              xs: "16px",
            },
            fontFamily: "Montserrat !important",
            marginBottom: "0.4rem",
          }}
        >
          Ingredients
        </Typography>
        <CustomInputShadow
          name="ingredients"
          multiline={true}
          value={formData?.ingredients}
          onChange={handleChange}
          error={errors.ingredients}
          height="100%"
        />
      </Box>

      {/* here isthe select component */}
      <Box sx={{ flexBasis: "100%", display: "flex", flexDirection: "column" }}>
        <Typography
          sx={{
            color: "#FFA100",
            fontWeight: "500",
            fontSize: {
              sm: "16px",
              xs: "16px",
            },
            fontFamily: "Montserrat !important",
            marginBottom: "0.4rem",
          }}
        >
          Make Featured
        </Typography>
        <CustomSelectForType
          options={[
            { label: "No", value: "false" },
            { label: "Yes", value: "true" },
          ]}
          handleChange={(selectedValue) =>
            setFormData({ ...formData, isFeatured: selectedValue })
          }
          value={formData.isFeatured}
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
            marginBottom: "0.4rem",
          }}
        >
          Chili
        </Typography>
        {formData.chilli.map((ingredient, index) => (
          <Box
            key={index}
            sx={{ display: "flex", alignItems: "center", gap: "1rem" }}
          >
            <Box sx={{ width: "100%" }}>

              <CustomInputShadow
                name={`chilli-${index}`}
                value={ingredient}
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
                borderRadius="8px"
                buttonStyle={{ height: { sm: "75px", xs: "68px" }, mt: "-15px" }}
                onClick={() => removeBullet("chilli", index)}
              />
            )}
          </Box>
        ))}
        <CustomButton
          border="1px solid #FFA100"
          ButtonText={"Add Chili"}
          background="linear-gradient(90deg, #FFA100 0%, #FF7B00 100%)"
          color="white"
          height="100px"
          width={"100%"}
          borderRadius="6px"
          buttonStyle={{ height: "75px" }}
          onClick={() => addBullet("chilli")}
          fontSize="20px"
        />
      </Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 0, gap: "20px" }}>
        <CustomButton
          border="1px solid #FFA100"
          ButtonText={"Delete this sauce"}
          color="white"
          width={"178px"}
          borderRadius="8px"

          padding="10px 0px"
          fontSize="18px"
          fontWeight="600"
          onClick={() => {
            handleOpenDeleteModal(id);

          }}
        />
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
      {deleteModalOpen && (
        <ConfirmDeleteModalSauce
          open={deleteModalOpen}
          handleClose={handleCloseDeleteModal}
          reviewId={reviewToDelete}
          onSuccess={() => navigate(-1)}
        />
      )}
    </Box>
  );
};

export default EditSauce;

import React, { useState, useEffect } from "react";
import CustomInputShadow from "../../Components/CustomInput/CustomInput";
import { Box, Tooltip, Typography } from "@mui/material";
import CustomButton from "../../Components/CustomButton/CustomButton";
import axios from "axios";
import SnackAlert from "../../Components/SnackAlert/SnackAlert";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import CustomSelectForType from "../../Components/CustomSelectForType/CustomSelectForType";
import MenuBar from "../../Components/MenuBar/MenuBar";
import NavigateBack from "../../Components/NavigateBackButton/NavigateBack";
import CustomTextAreaShadow from "../../Components/CustomTextAreaShadow/CustomTextAreaShadow";
import PageLoader from "../../Components/Loader/PageLoader";
import ConfirmBrandDeleteModal from "../../Components/ConfirmBrandDeleteModal/ConfirmBrandDeleteModal";

const appUrl = import.meta.env.VITE_REACT_APP_API_URL;

const EditBrandDetails = () => {
  const { id } = useParams();
  const [snackAlertData, setSnackAlertData] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [formData, setFormData] = useState({
    name: "",
    image: null,
    type: "",
    status: "",
    points: "",
    about: "",
    isTopRated: false,
    email: "",
    websiteLink: "",
    amazonLink: "",
  });
  const [errors, setErrors] = useState({});
  const [selectedFileName, setSelectedFileName] = useState("");
  const auth = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      const file = files[0];
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: file,
      }));
      setSelectedFileName(file?.name || ""); // Update selected file name
      setPreviewImage(URL.createObjectURL(file));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleAboutChange = (index, value) => {
    const newAbout = [...formData.about];
    newAbout[index] = value;
    setFormData({ ...formData, about: newAbout });
  };

  // Function to add a new bullet point
  const addBullet = () => {
    setFormData({
      ...formData,
      about: [...formData.about, ""],
    });
  };

  const removeBullet = (index) => {
    if (formData.about.length > 1) {
      const updatedAbout = formData.about.filter((_, i) => i !== index);
      setFormData({
        ...formData,
        about: updatedAbout,
      });
    }
  };

  const fetchUser = async () => {
    setLoading(true)
    try {
      
      const response = await axios({
        url: `${appUrl}/admin/get-user/${id}`,
        method: "get",
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
        },
      });
      const userData = response?.data?.user;
      console.log(response.data);
      setFormData({
        name: userData?.name || "",
        amazonLink: userData?.amazonLink || "",
        websiteLink: userData?.websiteLink || "",

        image: userData?.image || "",
        type: userData?.type || "",
        status: userData?.status || "",
        points: userData?.points || 0,
        about: userData?.about || "", // Fetch about if available, else set to one empty string
        isTopRated: userData?.isTopRated || false,
        email: userData?.email || "",
        sauces: userData?.sauces 
      });
      setPreviewImage(userData?.image);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
    setLoading(false)

    }
  };
  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleSubmit = async () => {
    console.log("Form data submitted:", formData);

    if (formData.image && formData.image.size > 4 * 1024 * 1024) {
      setSnackAlertData({
        open: true,
        message: "Selected image size exceeds 4MB.",
        severity: "error",
      });
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("image", formData.image);
    formDataToSend.append("type", formData.type);
    formDataToSend.append("status", formData.status);
    formDataToSend.append("points", formData.points);
    formDataToSend.append("userId", id);
    formDataToSend.append("isTopRated", formData.isTopRated);
    formDataToSend.append("websiteLink", formData.websiteLink);
    formDataToSend.append("amazonLink", formData.amazonLink);
    formDataToSend.append("email", formData.email);
    // Handle about array
    formDataToSend.append("about", formData.about);

    try {
      setLoading(true);
      const response = await axios({
        url: `${appUrl}/admin/edit-user/${id}`,
        method: "post",
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
          "Content-Type": "multipart/form-data",
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
      console.error("Error submitting brand induction:", error);
      setLoading(false);
      setSnackAlertData({
        open: true,
        message:
          error?.response?.data?.error?.message ||
          error?.response?.data?.message,
        severity: "error",
      });
    }
  };

  if (loading){
    return (
      <PageLoader/>
    )
  }
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
        padding: { sm: "0px 21px", xs: "0px 15px 20px 25px" },
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
          {!formData.type
            ? ""
            : formData?.type == "user"
            ? "Edit User"
            : "Edit Brand"}
        </Typography>
        <Typography
          sx={{ display: "flex", alignItems: "center", gap: ".3rem" }}
        >
          <MenuBar /> <NavigateBack />
        </Typography>
      </Box>

      {/* Image Preview and Upload Section */}
      {/* <Box sx={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
        
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
                }}
              >
                No Image
              </Typography>
            )}
          </Box>

     
        <label
          htmlFor="uploadimage"
          style={{
            cursor: "pointer",
            color: "#FFA100",
            textAlign: "center",
            border: "2px dashed #FFA100",
            flexBasis: "50%",
            height: "165px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#2E210A",
            borderRadius: "8px",
          }}
        >
          <input
            type="file"
            id="uploadimage"
            name="image"
            style={{ display: "none" }}
            onChange={handleChange}
            accept="image/png, image/jpg, image/jpeg, image/webp"
          />
          <Typography
            sx={{ fontSize: { sm: "22px", xs: "15px" }, fontWeight: "600" }}
          >
            {selectedFileName ? `${selectedFileName}` : "Upload Image"}
          </Typography>
        </label>
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
                htmlFor="uploadimage"
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
                  id="uploadimage"
                  name="image"
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
              {selectedFileName ? `${selectedFileName}` : "Upload Image"}
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
        {formData.type == "brand" ? (
          ""
        ) : (
          <Box sx={{ flexBasis: "33%" }}>
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
              Email
            </Typography>
            <CustomInputShadow
              placeholder="Enter Name"
              name="name"
              value={formData.email}
              onChange={handleChange}
              error={errors.name}
              disabled={true}
            />
          </Box>
        )}

        <Box sx={{ flexBasis: "33%" }}>
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
            Name
          </Typography>
          <CustomInputShadow
            placeholder="Enter Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
          />
        </Box>
        
        <Box sx={{ flexBasis: "33%" }}>
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
            placeholder="Enter amazon link "
            name="amazonLink"
            value={formData.amazonLink}
            onChange={handleChange}
            error={errors.name}
          />
        </Box>


        <Box sx={{ flexBasis: "33%" }}>
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
            placeholder="Enter Website Link"
            name="websiteLink"
            value={formData.websiteLink}
            onChange={handleChange}
            error={errors.name}
          />
        </Box>


        {/* <Box sx={{ flexBasis: "33%" }}>
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
        </Box> */}
        {
          formData.type == "brand" ? "" : (
            <Box sx={{ flexBasis: "33%" }}>
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
              Status
            </Typography>
            <CustomSelectForType
              label="Select Status"
              options={[
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
              ]}
              value={formData.status}
              handleChange={(value) => handleSelectChange("status", value)}
              error={errors.status}
            />
          </Box>
          )
        }
       
      </Box>
      {formData.type === "brand" && (
        <Box sx={{}}>
          <Typography
            sx={{
              color: "#FFA100",
              fontWeight: "500",
              fontSize: {
                sm: "16px",
                xs: "16px",
              },
              mb: "5px",
              fontFamily: "Montserrat !important",
            }}
          >
            Make Top Rated
          </Typography>

          <CustomSelectForType
            options={[
              { label: "None", value: false },
              { label: "Top Rated", value: true },
            ]}
            handleChange={(selectedValue) =>
              setFormData({ ...formData, isTopRated: selectedValue })
            }
            value={formData.isTopRated}
            labelField="label"
            valueField="value"
          />
        </Box>
      )}

      {/* Conditionally show 'About' section if the type is 'brand' */}
      {formData.type === "brand" && (
        <>
          
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
          rows={6} // You can adjust the number of rows as needed
        />
      </Box>
        </>
      )}

      <Box sx={{ display: "flex", justifyContent: "flex-end",gap:"20px", mt: 0 }}>
        {
         
        }
     {(formData.type && formData.type =="brand" )&& 
     <Tooltip title={formData.sauces?"To delete this brand, first delete all the sauces under this brand.":"Delete this sauce"}>  
     <span>
       <CustomButton
            border="1px solid #FFA100"
            ButtonText={loading ? "Deleting" : "Delete this brand"}
            color="white"
            width={"208px"}
            borderRadius="8px"
          background={formData.sauces?"rgba(236, 236, 236, .5)":""}
          hoverBg={formData.sauces?"rgba(236, 236, 236, .5)":""}
  
            padding="25px 0px"
            fontSize="18px"
            fontWeight="600"
            onClick={ formData.sauces?null:()=>{setDeleteModalOpen(true)}}
          />
      </span>    
     </Tooltip>
     }
        <CustomButton
          border="1px solid #FFA100"
          ButtonText={loading ? "Saving" : "Save"}
          color="white"
          width={"208px"}
          borderRadius="8px"
          background={
            loading ? "" : "linear-gradient(90deg, #FFA100 0%, #FF7B00 100%)"
          }
          padding="25px 0px"
          fontSize="18px"
          fontWeight="600"
          onClick={handleSubmit}
        />
      </Box>
      {deleteModalOpen && (
          <ConfirmBrandDeleteModal
            open={deleteModalOpen}
            handleClose={handleCloseDeleteModal}
            brandId={id}
            onSuccess={() => navigate(-1)}
          />
        )}
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

export default EditBrandDetails;

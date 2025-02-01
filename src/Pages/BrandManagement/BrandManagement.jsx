import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  Tooltip,
} from "@mui/material";
import SearchIcon from "../../assets/SearchIcon.png";
import "./BrandManagement.css"; // Import the CSS file for custom styles
import CustomButton from "../../Components/CustomButton/CustomButton";
import { useNavigate } from "react-router-dom";
import EditIcon from "../../assets/EditIcon.png"; // Adjust path as needed
import axios from "axios";
import PageLoader from "../../Components/Loader/PageLoader";
import { useSelector } from "react-redux";
import MenuBar from "../../Components/MenuBar/MenuBar";
import logoAdmin from "../../assets/logoAdmin.png";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import queryString from "query-string"; // Import query-string library
import { debounce } from "lodash";
import eyeIcon from "../../assets/eyeopen.png";
import loadingGIF from "../../assets/loading.gif";
import DeleteIcon from "../../assets/deleteIcon.png";
import ConfirmDeleteModal from "../../Components/ConfirmReviewDeleteModal/ConfirmReviewDeleteModal";
import ConfirmBrandDeleteModal from "../../Components/ConfirmBrandDeleteModal/ConfirmBrandDeleteModal";

const appUrl = import.meta.env.VITE_REACT_APP_API_URL;

const BrandManagement = () => {
  const navigate = useNavigate();
  const [isSearchBarLoading, setSearchBarLoading] = useState(false)
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [allBrands, setAllBrands] = useState([]);
  const [page, setPage] = useState(1); // Current page state
  const [totalPages, setTotalPages] = useState(1); // Total pages state
  const auth = useSelector((state) => state.auth);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState(null);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  // Function to fetch brands from the server
  const fetchBrands = useCallback(
    async (page, searchTerm) => {
      try {
        setLoading(true);
        const response = await axios({
          url: `${appUrl}/admin/get-all-active-users`,
          method: "get",
          params: {
            type: "brand",
            page: page,
            limit: 8,
            searchTerm: searchTerm,
          },
          headers: {
            Authorization: `Bearer ${auth.accessToken}`,
          },
        });
        setAllBrands(response?.data?.entities || response?.data?.users);
        setTotalPages(response?.data?.pagination?.totalPages || 1);
        setLoading(false);
        setSearchBarLoading(false)
      } catch (error) {
        console.error("Error fetching brands:", error);
        setLoading(false);
      }
    },
    [auth.accessToken]
  );

  useEffect(() => {
    const parsed = queryString.parse(window.location.search);
    const currentPage = parsed.page ? parseInt(parsed.page, 10) : 1;
    setPage(currentPage);
    fetchBrands(currentPage, searchTerm);
  }, [window.location.search, searchTerm, fetchBrands]);

  const debouncedSearch = useCallback(
    debounce((value) => {
      navigate(`${location.pathname}?page=1`); // Reset to page 1 for new search
      setSearchTerm(value);
    }, 2000),
    []
  );

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchBarLoading(true)
    const value = event.target.value;
    setInputValue(value); // Update input field immediately
    debouncedSearch(value); // Debounce the search term update
    setPage(1); // Reset to first page on new search
  };

  // Handle pagination change
  const handlePageChange = useCallback(
    (event, value) => {
      setPage(value);
      navigate(`${window.location.pathname}?page=${value}`);
    },
    [navigate]
  );

  function formatDate(isoString) {
    const date = new Date(isoString);
    const options = { year: "numeric", month: "short", day: "2-digit" };
    let formattedDate = date
      .toLocaleDateString("en-US", options)
      .replace(/,/, "")
      .toLowerCase()
      .replace(/\s/g, "-");

    // Capitalize the first letter of the month
    formattedDate =
      formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

    return formattedDate;
  }

  // Navigation functions
  const handleNavigate = (id) => {
    navigate(`/admin/specific-brand-management/${id}`);
  };

  const navigateToEdit = (id) => {
    navigate(`/admin/edit-brand-user-details/${id}`);
  };


  const handleOpenDeleteModal = (id) => {
    setBrandToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setBrandToDelete(null);
  };

  // Open lightbox
  const openLightbox = (imageSrc) => {
    setSelectedImage(imageSrc);
    setIsOpen(true);
  };

  return (
    <>
      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            p: { sm: "0px 20px 0px 20px", xs: "0px 0px 0px 0px" },
            alignItems: { md: "center", xs: "start" },
            flexDirection: { md: "row", xs: "column" },
            gap: "20px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
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
              Brand Management
            </Typography>
            <Typography>
              <MenuBar />
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: { sm: "row", xs: "column" },
              justifyContent: { md: "center", sm: "end" },
              alignItems: { sm: "center", xs: "end" },
              gap: "1rem",
              width: { md: "800px", xs: "100%" },
            }}
          >
            <Box
              sx={{
                position: "relative",
                maxWidth: { sm: "350px", xs: "100%" },
                width: "100%",
              }}
            >
              <input
                type="search"
                name="search"
                id="search"
                className="search-input"
                placeholder="Search"
                value={inputValue}
                onChange={handleSearchChange}
              />
            {
                isSearchBarLoading?
                <img
                src={loadingGIF}
                alt="loading"
                style={{
                  width:"30px",
                  
                  position: "absolute",
                  top: "8px",
                  right: "15px",
                }}
              />
                :
              <img
                src={SearchIcon}
                alt="Search"
                style={{
                  position: "absolute",
                  top: "14px",
                  right: "20px",
                }}
              />
              }
            </Box>
            <Box sx={{ width: { sm: "200px", xs: "100%" } }}>
              <CustomButton
                border="1px solid #FFA100"
                ButtonText="Add Brand+"
                color="white"
                width={"100%"}
                borderRadius="8px"
                background="linear-gradient(90deg, #FFA100 0%, #FF7B00 100%)"
                padding="7px 0px"
                fontSize="18px"
                fontWeight="600"
                onClick={() => navigate("/admin/add-brand")}
              />
            </Box>
          </Box>
        </Box>

        {loading ? (
          <PageLoader />
        ) : (
          <>
            <Box sx={{ mt: "30px", padding: { md: "0px 20px", xs: "0px" } }}>
              <TableContainer
                component={Paper}
                className="MuiTableContainer-root"
              >
                <Table className="data-table">
                  <TableHead className="MuiTableHead-root">
                    <TableRow
                      sx={{
                        backgroundImage: `linear-gradient(90deg, #FFA100 0%, #FF7B00 100%) !important`,
                        // "&:hover": {
                        //   backgroundImage: `linear-gradient(90deg, #5A3D0A 0%, #5A3D0A 100%) !important`,
                        // },
                        padding: "0px",
                        border: "none",
                      }}
                      className="header-row"
                    >
                      <TableCell
                        className="MuiTableCell-root-head "
                        sx={{
                          fontWeight: "500",
                          padding: "0px 0px",
                          fontSize: "21px",
                          textAlign: "start",
                          borderRadius: "8px 0px 0px 8px",
                          color: "white",
                          paddingLeft: "50px",
                        }}
                      >
                        Image
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: "500",
                          padding: "12px 0px",
                          fontSize: "21px",
                          textAlign: "start",
                          color: "white",
                          paddingLeft: "10px",
                        }}
                        className="MuiTableCell-root-head"
                      >
                        Brand Name
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: "500",
                          padding: "12px 0px",
                          fontSize: "21px",
                          textAlign: "center",
                          color: "white",
                          paddingLeft: "10px",
                        }}
                        className="MuiTableCell-root-head"
                      >
                        Total Sauces
                      </TableCell>
                      {/* <TableCell
                        sx={{
                          fontWeight: "500",
                          padding: "12px 0px",
                          fontSize: "21px",
                          textAlign: "center",
                          
                          color: "white",
                          paddingLeft: "10px",
                        }}
                        className="MuiTableCell-root-head"
                      >
                        View Sauces
                      </TableCell> */}
                      <TableCell
                        sx={{
                          fontWeight: "500",
                          padding: "12px 0px",
                          fontSize: "21px",
                          textAlign: "center",
                          borderRadius: "0px 8px 8px 0px",
                          color: "white",
                          paddingLeft: "10px",
                        }}
                        className="MuiTableCell-root-head"
                      >
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody className="MuiTableBody-root">
                    {allBrands.map((brand, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          border: "2px solid #FFA100",
                          display:brand?.isDeleted?"none":"table-row"
                        }}
                        className="MuiTableRow-root"
                      >
                        <TableCell
                          sx={{
                            borderRadius: "8px 0px 0px 8px",
                            color: "white",
                            paddingLeft: "40px !important",
                            textAlign: "start !important",
                          }}
                          className="MuiTableCell-root"
                        >
                          <img
                            src={brand.image ? brand.image : logoAdmin}
                            alt="Brand"
                            style={{
                              width: "80px",
                              height: "50px",
                              borderRadius: "8px",
                              objectFit: "contain",
                              cursor: "pointer",
                            }}
                            onClick={() => openLightbox(brand.image)}
                          />
                        </TableCell>
                        <TableCell
                          sx={{ textAlign: "start !important" }}
                          className="MuiTableCell-root"
                        >
                          {brand.name}
                        </TableCell>

                        <TableCell
                          sx={{ 
                            textAlign: "center !important" }}
                          className="MuiTableCell-root"
                        >
                            <Tooltip 
                            
                            title={brand.sauces?"View this Brand Sauces":"This brand has no sauces"}>
                          <Typography
                         onClick={() =>brand.sauces? handleNavigate(brand._id):null}
                          
                          sx={{
                             textDecoration:"underline !important",
                             color:"#FFA100 !important",
                             cursor: "pointer",
                          }}>

                          {brand.sauces}
                          </Typography>
                        </Tooltip>
                        </TableCell>
                        {/* <TableCell
                          sx={{
                            
                            textAlign: "start !important",
                          }}
                          className="MuiTableCell-root"
                        >
                          <Box
                            sx={{
                              display: "flex",
                              gap: "30px",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <Tooltip title="View this Brand Sauces">
                              <img
                                className="delete-icon edit-icon"
                                src={eyeIcon}
                                alt="Delete"
                                style={{
                                  width: "40px",
                                  height: "40px",
                                  cursor: "pointer",
                                  border: "0 px solid red",
                                  borderRadius: "10px",
                                  padding: "8px",
                                  objectFit: "contain",
                                }}
                                onClick={() => handleNavigate(brand._id)}
                              />
                            </Tooltip>
                          
                          </Box>
                        </TableCell> */}
                        <TableCell
                          sx={{
                            borderRadius: "0px 8px 8px 0px",
                            textAlign: "start !important",
                          }}
                          className="MuiTableCell-root"
                        >
                          <Box
                            sx={{
                              display: "flex",
                              gap: "30px",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                           
                            <Tooltip title="Edit Brand">
                            <img
                              className="edit-icon"
                              src={EditIcon}
                              alt="Edit"
                              style={{
                                width: "40px",
                                height: "40px",
                                cursor: "pointer",
                                border: "0 px solid red",
                                borderRadius: "10px",
                                padding: "8px",
                              }}
                              onClick={() => navigateToEdit(brand._id)}
                            />
                            </Tooltip>
                             <Tooltip title={brand.sauces?"To delete this brand, first delete all the sauces under this brand.":"Delete this Brand"}>
                                                        <img
                                                          
                                                          src={DeleteIcon}
                                                          className="edit-icon"
                                                          style={{
                                                            width: "35px",
                                                            height: "35px",
                                                            cursor: "pointer",
                                                            objectFit: "contain",
                                                            borderRadius:"8px",
                                                            background:brand.sauces?"rgba(236, 236, 236, .4)":"unset"

                                                            
                                                          }}
                                                          onClick={() =>(brand.isDeleted|| brand.sauces)?()=>{} : handleOpenDeleteModal(brand._id)}
                                                          alt="Delete"
                                                        />
                                                      </Tooltip>

                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            {/* Pagination */}
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                sx={{
                  "& .MuiPaginationItem-root": {
                    color: "white", // Text color
                    backgroundColor: "#2E210A", // Background color for pagination buttons
                    border: "2px solid #FFA100", // Border color matching the theme
                  },
                  "& .Mui-selected": {
                    color: "#FFA100", // Text color for selected page
                    backgroundColor: "", // Background color for selected page
                    fontWeight: "bold", // Bold text for selected page
                  },
                  "& .MuiPaginationItem-ellipsis": {
                    color: "white", // Color for ellipsis (...)
                  },
                  "& .MuiPaginationItem-root:hover": {
                    backgroundColor: "#5A3D0A", // Background color on hover
                    borderColor: "#FF7B00", // Border color on hover
                  },
                }}
              />
            </Box>
          </>
        )}
      </Box>
      {deleteModalOpen && (
          <ConfirmBrandDeleteModal
            open={deleteModalOpen}
            handleClose={handleCloseDeleteModal}
            brandId={brandToDelete}
            onSuccess={() => fetchBrands(page, searchTerm)}
          />
        )}
      {isOpen && (
        <Lightbox
          open={isOpen}
          close={() => setIsOpen(false)}
          slides={[{ src: selectedImage }]}
        />
      )}
    </>
  );
};

export default BrandManagement;

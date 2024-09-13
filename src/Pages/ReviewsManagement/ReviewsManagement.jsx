import React, { useState, useEffect, useCallback } from "react";
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
import axios from "axios";
import { useSelector } from "react-redux";
import MenuBar from "../../Components/MenuBar/MenuBar";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import PageLoader from "../../Components/Loader/PageLoader";
import logoAdmin from "../../assets/logoAdmin.png";
import "../TabooManagement/TabooManagement.css";
import copyIcon from "../../assets/copyIcon.png";
import DeleteIcon from "../../assets/deleteIcon.png";
import ConfirmDeleteModal from "../../Components/ConfirmReviewDeleteModal/ConfirmReviewDeleteModal";
import AddReviewModal from "../../Components/AddReviewModal/AddReviewModal";
import CustomButton from "../../Components/CustomButton/CustomButton";
import { debounce } from "lodash";
import SearchIcon from "../../assets/SearchIcon.png";

const appUrl = import.meta.env.VITE_REACT_APP_API_URL;

const ReviewsManagement = () => {
  const [loading, setLoading] = useState(false);
  const [officialReviews, setOfficialReviews] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [addReviewModalOpen, setAddReviewModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // Added search term state
  const auth = useSelector((state) => state.auth);

  const fetchReviews = async (currentPage) => {
    try {
      setLoading(true);
      const response = await axios({
        url: `${appUrl}/get-official-reviews`,
        method: "get",
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
          "Content-Type": `application/json`,
        },
        params: {
          page: currentPage,
          limit: 8,
          searchTerm, // Include search term in request
        },
      });
      setOfficialReviews(response?.data?.officialReviews || []);
      setTotalPages(response?.data?.pagination?.totalPages || 1);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setLoading(false);
    }
  };

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchTerm(value);
    }, 2000),
    []
  );

  useEffect(() => {
    fetchReviews(page);
  }, [page, searchTerm]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleSearchChange = (event) => {
    setPage(1); // Reset to page 1 on search
    debouncedSearch(event.target.value); // Trigger debounced search
  };

  const openLightbox = (imageSrc) => {
    setSelectedImage(imageSrc);
    setIsOpen(true);
  };

  const handleCopyUrl = (url) => {
    navigator.clipboard.writeText(url);
    alert("URL copied to clipboard!");
  };

  const handleAddReview = () => {
    setAddReviewModalOpen(true);
  };

  const handleCloseAddReviewModal = () => {
    setAddReviewModalOpen(false);
  };

  const handleOpenDeleteModal = (id) => {
    setReviewToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setReviewToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (reviewToDelete) {
      deleteOfficialReview(reviewToDelete);
    }
    handleCloseDeleteModal();
  };

  return (
    <>
      {loading ? (
        <PageLoader />
      ) : (
        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              p: { sm: "0px 20px 0px 20px", xs: "0px 0px 0px 0px" },
              alignItems: "center",
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
                  fontSize: { lg: "45px", sm: "40px", xs: "30px" },
                  fontFamily: "Fira Sans !important",
                }}
              >
                Reviews Management
              </Typography>
              <MenuBar />
            </Box>
            <Box sx={{ width: "100%", display: "flex", justifyContent: "end" }}>
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  maxWidth: { md: "350px", xs: "100%" },
                }}
              >
                <input
                  type="search"
                  name="search"
                  id="search"
                  className="search-input"
                  placeholder="Search"
                  onChange={handleSearchChange} // Handle search input change
                  style={{ color: "white" }}
                />
                <img
                  src={SearchIcon}
                  alt="Search"
                  style={{
                    position: "absolute",
                    top: "14px",
                    right: "20px",
                  }}
                />
              </Box>
            </Box  >
            <Box
            sx={{
              width:{md:"300px", xs:"100%"}
            }}
            >

           
            <Tooltip title="Add Review">
              <CustomButton
                border="1px solid #FFA100"
                ButtonText="Add Review+"
                color="white"
                width={"100%"}
                borderRadius="8px"
                background="linear-gradient(90deg, #FFA100 0%, #FF7B00 100%)"
                padding="10px 0px"
                fontSize="16px"
                fontWeight="600"
                onClick={handleAddReview}
              />
            </Tooltip>
            </Box>
          </Box>
          {officialReviews.length === 0 ? (
            <Typography
              sx={{
                textAlign: "center",
                fontWeight: "600",
                mt: 4,
                fontSize: "1.5rem",
                color: "#FFA100",
              }}
            >
              No reviews found
            </Typography>
          ) : (
            <Box sx={{ mt: "30px", padding: { md: "0px 20px", xs: "0px" } }}>
              <TableContainer
                component={Paper}
                className="MuiTableContainer-root"
              >
                <Table className="data-table">
                  <TableHead className="MuiTableHead-root">
                    <TableRow
                      sx={{
                        backgroundImage:
                          "linear-gradient(90deg, #FFA100 0%, #FF7B00 100%) !important",
                        "&:hover": {
                          backgroundImage:
                            "linear-gradient(90deg, #5A3D0A 0%, #5A3D0A 100%) !important",
                        },
                        padding: "0px",
                      }}
                      className="header-row"
                    >
                      <TableCell
                        className="MuiTableCell-root-head"
                        sx={{
                          fontWeight: "500",
                          fontSize: { sm: "21px", xs: "16px" },
                          textAlign: "center",
                          borderRadius: "8px 0px 0px 8px",
                          color: "white",
                        }}
                      >
                        Image
                      </TableCell>
                      <TableCell
                        className="MuiTableCell-root-head"
                        sx={{
                          fontWeight: "500",
                          padding: "12px 0px",
                          fontSize: { sm: "21px", xs: "16px" },
                          textAlign: "start",
                          color: "white",
                          pl: "10px",
                        }}
                      >
                        URL
                      </TableCell>
                      <TableCell
                        className="MuiTableCell-root-head"
                        sx={{
                          fontWeight: "500",
                          padding: "12px 0px",
                          fontSize: { sm: "21px", xs: "16px" },
                          textAlign: "start",
                          color: "white",
                          pl: "10px",
                        }}
                      >
                        Video Title
                      </TableCell>
                      <TableCell
                        className="MuiTableCell-root-head"
                        sx={{
                          fontWeight: "500",
                          padding: "12px 0px",
                          fontSize: { sm: "21px", xs: "16px" },
                          textAlign: "start",
                          color: "white",
                          pl: "10px",
                          borderRadius: "0px 8px 8px 0px",
                        }}
                      >
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody className="MuiTableBody-root">
                    {officialReviews.map((review, index) => (
                      <TableRow
                        key={index}
                        sx={{ border: "2px solid #FFA100" }}
                        className="MuiTableRow-root"
                      >
                        <TableCell
                          sx={{
                            borderRadius: "8px 0px 0px 8px",
                            color: "white",
                            ml: { md: "20px", xs: "10px" },
                          }}
                          className="MuiTableCell-root"
                        >
                          <img
                            src={
                              review.bannerImage
                                ? review.bannerImage
                                : logoAdmin
                            }
                            style={{
                              width: "80px",
                              height: "50px",
                              borderRadius: "8px",
                              cursor: "pointer",
                              objectFit: "contain",
                            }}
                            onClick={() => openLightbox(review.bannerImage)}
                            alt="Review"
                          />
                        </TableCell>
                        <TableCell
                          sx={{ textAlign: "start !important" }}
                          className="MuiTableCell-root"
                        >
                          {review.url ? (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: "1rem",
                              }}
                            >
                              <a
                                href={review.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  color: "#FFA100",
                                  textDecoration: "none",
                                }}
                              >
                                {review.url}
                              </a>
                            </Box>
                          ) : (
                            "No URL Available"
                          )}
                        </TableCell>
                        <TableCell
                          sx={{ textAlign: "start !important" }}
                          className="MuiTableCell-root"
                        >
                          {review.videoTitle && review?.videoTitle.slice(0, 45)}
                        </TableCell>
                        <TableCell
                          sx={{
                            borderRadius: "0px 8px 8px 0px",
                            color: "white",
                            ml: { md: "20px", xs: "10px" },
                          }}
                          className="MuiTableCell-root"
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: "1rem",
                            }}
                          >
                            <Tooltip title="Copy Video URL">
                              <img
                                src={copyIcon}
                                style={{
                                  width: "38px",
                                  height: "38px",
                                  cursor: "pointer",
                                }}
                                onClick={() => handleCopyUrl(review.url)}
                                alt="Copy"
                              />
                            </Tooltip>
                            <Tooltip title="Delete Review">
                              <img
                                src={DeleteIcon}
                                style={{
                                  width: "35px",
                                  height: "35px",
                                  cursor: "pointer",
                                  objectFit: "contain",
                                }}
                                onClick={() =>
                                  handleOpenDeleteModal(review._id)
                                }
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
                      color: "black", // Text color for selected page
                      backgroundColor: "#FFA100", // Background color for selected page
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
            </Box>
          )}
          {isOpen && (
            <Lightbox
              open={isOpen}
              close={() => setIsOpen(false)}
              slides={[{ src: selectedImage }]}
            />
          )}
          {deleteModalOpen && (
            <ConfirmDeleteModal
              open={deleteModalOpen}
              handleClose={handleCloseDeleteModal}
              reviewId={reviewToDelete} // Pass the review ID here
              onSuccess={() => fetchReviews(page)} // Refresh reviews list after deletion
            />
          )}
          {addReviewModalOpen && (
            <AddReviewModal
              open={addReviewModalOpen}
              handleClose={handleCloseAddReviewModal}
              onSuccess={() => fetchReviews(page)}
            />
          )}
        </Box>
      )}
    </>
  );
};

export default ReviewsManagement;

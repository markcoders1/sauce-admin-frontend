import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import MenuBar from "../../Components/MenuBar/MenuBar";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css"; // Import the CSS for the lightbox
import PageLoader from "../../Components/Loader/PageLoader";
import logoAdmin from "../../assets/logoAdmin.png"; // Placeholder image for reviews without images
import "../TabooManagement/TabooManagement.css"; // Use the same CSS to keep the design consistent
import EditIcon from "../../assets/EditIcon.png";
import DeleteIcon from "../../assets/deleteIcon.png";
import ConfirmDeleteModal from "../../Components/ConfirmReviewDeleteModal/ConfirmReviewDeleteModal"; // Import the ConfirmDeleteModal component
import Tooltip from "@mui/material/Tooltip";
import AddReviewModal from "../../Components/AddReviewModal/AddReviewModal";
import CustomButton from "../../Components/CustomButton/CustomButton";
import { useNavigate } from "react-router-dom";

import ConfirmDeleteModalForBadge from "../../Components/DeleteBadge/DeleteBadgeModal";
const appUrl = import.meta.env.VITE_REACT_APP_API_URL



const BadgeManagement = () => {
  const [loading, setLoading] = useState(false);
  const [allBadges, setAllBadges] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [addReviewModalOpen, setAddReviewModalOpen] = useState(false);
  const navigate = useNavigate()

  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const fetchReviews = async (currentPage) => {
    try {
      setLoading(true);
      const response = await axios({
        url: `${appUrl}/get-all-badges`,
        method: "get",
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
          "Content-Type": "application/json",
        },
        params: {
          page: currentPage, // Pass the current page to the backend
          limit: 8, // Assuming each page should show 8 badges
        },
      });
      setAllBadges(response?.data?.badges || []); // Set the badges data
      setTotalPages(response?.data?.pagination?.totalPages || 1); // Update total pages based on response
      setLoading(false);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setLoading(false);
    }
  };

  const deleteOfficialReview = async (id) => {
    try {
      const response = await axios({
        url: `${appUrl}/admin/delete-official-review/${id}`,
        method: "delete", // Correctly set to DELETE method
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
        },
      });
      console.log(response);
      fetchReviews(page); // Refresh the reviews list
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  useEffect(() => {
    fetchReviews(page);
  }, [page]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const openLightbox = (imageSrc) => {
    setSelectedImage(imageSrc);
    setIsOpen(true);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    fetchReviews(value);
  };

  const handleCopyUrl = (url) => {
    navigator.clipboard.writeText(url);
    alert("URL copied to clipboard!");
  };

  const handleNavigate = () => {
  navigate("/admin/badge-management/add-badge")
  };

  const handleCloseAddReviewModal = () => {
    setAddReviewModalOpen(false);
  };

  const handleOpenDeleteModal = (id) => {
    console.log(id)
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

 const handleNavigateToEdit = (state) => {
    navigate("/admin/badge-management/edit-badge", {state: state})
 }

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
                Badge Management
              </Typography>
              <MenuBar />
            </Box>
            <Tooltip title="Add Review">
              <CustomButton
                border="1px solid #FFA100"
                ButtonText="Add Badge+"
                color="white"
                width={"198px"}
                borderRadius="8px"
                background="linear-gradient(90deg, #FFA100 0%, #FF7B00 100%)"
                padding="10px 0px"
                fontSize="16px"
                fontWeight="600"
                onClick={handleNavigate}
              />
            </Tooltip>
          </Box>
          {allBadges?.length === 0 ? (
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
                       Name
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
                       Points Required
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
                    {allBadges.map((review, index) => (
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
                              review.icon
                                ? review.icon
                                : logoAdmin
                            }
                            style={{
                              width: "80px",
                              height: "50px",
                              borderRadius: "8px",
                              cursor: "pointer",
                              objectFit: "contain",
                            }}
                            onClick={() => openLightbox(review.icon)}
                            alt="Review"
                          />
                        </TableCell>
                        {/* <TableCell
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
                                {review?.url}
                              </a>
                            </Box>
                          ) : (
                            "No URL Available"
                          )}
                        </TableCell> */}
                        <TableCell
                          sx={{ textAlign: "start !important" }}
                          className="MuiTableCell-root"
                        >
                         {review.name}
                        </TableCell>
                        <TableCell
                          sx={{ textAlign: "start !important" }}
                          className="MuiTableCell-root"
                        >
                         {review.pointsRequired}
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
                            <Tooltip title="Edit Badge">
                              <img
                                src={EditIcon}
                                style={{
                                  width: "25px",
                                  height: "24px",
                                  cursor: "pointer",
                                }}
                                onClick={()=> handleNavigateToEdit(review)}
                                alt="Copy"
                              />
                            </Tooltip>
                            <Tooltip title="Delete Badge">
                              <img
                                src={DeleteIcon}
                                style={{
                                  width: "37px",
                                  height: "37px",
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
            <ConfirmDeleteModalForBadge
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

export default BadgeManagement;
  
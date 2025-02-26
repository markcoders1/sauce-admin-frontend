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
import { useDispatch, useSelector } from "react-redux";
import MenuBar from "../../Components/MenuBar/MenuBar";
import PageLoader from "../../Components/Loader/PageLoader";
import "../TabooManagement/TabooManagement.css"; // Use the same CSS for consistent design
import CustomButton from "../../Components/CustomButton/CustomButton";
import { useNavigate, useParams } from "react-router-dom";
import { debounce } from "lodash"; // Import lodash debounce
import DeleteIcon from "../../assets/deleteIcon.png"; 
import SearchIcon from "../../assets/SearchIcon.png";

import ConfirmDeleteModalTextReview from "../../Components/DeleteTextReviewModal/DeleteTextReviewModal";

const appUrl = import.meta.env.VITE_REACT_APP_API_URL;

const TextReviewManagement = () => {
  const [loading, setLoading] = useState(false);
  const [allReviews, setAllReviews] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const { id } = useParams();

  // Dummy Data
  const dummyData = [
    {
      _id: 1,
      fullName: "John Doe",
      email: "john.doe@example.com",
      review: "Great service, will recommend!",
      joiningDate: "2023-01-15",
    },
    {
      _id: 2,
      fullName: "Jane Smith",
      email: "jane.smith@example.com",
      review: "Not happy with the product.",
      joiningDate: "2023-02-20",
    },
    {
      _id: 3,
      fullName: "Alice Johnson",
      email: "alice.johnson@example.com",
      review: "The best experience I've had!",
      joiningDate: "2023-03-10",
    },
    {
      _id: 4,
      fullName: "Bob Williams",
      email: "bob.williams@example.com",
      review: "Average quality, nothing special.",
      joiningDate: "2023-04-05",
    },
    {
      _id: 5,
      fullName: "Charlie Brown",
      email: "charlie.brown@example.com",
      review: "Amazing! Exceeded expectations.",
      joiningDate: "2023-05-25",
    },
    {
      _id: 6,
      fullName: "David Harris",
      email: "david.harris@example.com",
      review: "Not bad, but could be better.",
      joiningDate: "2023-06-30",
    },
    {
      _id: 7,
      fullName: "Emma Wilson",
      email: "emma.wilson@example.com",
      review: "Terrible experience, will not return.",
      joiningDate: "2023-07-20",
    },
    {
      _id: 8,
      fullName: "George Miller",
      email: "george.miller@example.com",
      review: "Decent quality, satisfied overall.",
      joiningDate: "2023-08-15",
    },
  ];

  const fetchReviews = async (currentPage) => {
    try {
      setLoading(true);
      const response = await axios({
        url: `${appUrl}/admin/get-specific-user-reviews/${id}`,
        method: "get",
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
          "Content-Type": "application/json",
        },
        params: {
          page: currentPage,
          limit: 8,
          searchTerm: searchTerm,
        },
      });

      console.log(response);
      // Check if response is valid, if not use dummy data
      setAllReviews(response.data.reviews || []); // Set the reviews data
      setTotalPages(response.data.pagination.totalPages || 1); // Update total pages
     

      setLoading(false);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      
      setTotalPages(1); // Default pagination for dummy data
      setLoading(false);
    }
  };

  // Debounce the search input
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

  const handleViewReview = (id) => {
    navigate(`/admin/text-review-management/view-review/${id}`); // Dummy route for viewing reviews
  };

  const handleOpenDeleteModal = (id) => {
    setReviewToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setReviewToDelete(null);
  };

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

  return (
    <>
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
              User Reviews
            </Typography>
            <MenuBar />
          </Box>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "end",
              mt: "20px",
            }}
          >
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
                onChange={handleSearchChange}
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
          </Box>
        </Box>

        {loading ? (
          <PageLoader />
        ) : allReviews?.length == 0 ? (
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
                      // "&:hover": {
                      //   backgroundImage:
                      //     "linear-gradient(90deg, #5A3D0A 0%, #5A3D0A 100%) !important",
                      // },
                      padding: "0px",
                    }}
                    className="header-row"
                  >
                    <TableCell
                      className="MuiTableCell-root-head"
                      sx={{
                        fontWeight: "500",
                        fontSize: { sm: "21px", xs: "16px" },
                        textAlign: "start",
                        color: "white",
                        // pl: "10px",
                        borderRadius: "8px 0px 0px 8px",
                        pl: "40px",
                      }}
                    >
                      Full Name
                    </TableCell>
                    <TableCell
                      className="MuiTableCell-root-head"
                      sx={{
                        fontWeight: "500",
                        fontSize: { sm: "21px", xs: "16px" },
                        textAlign: "start",
                        color: "white",
                        pl: "10px",
                      }}
                    >
                      Email
                    </TableCell>
                    <TableCell
                      className="MuiTableCell-root-head"
                      sx={{
                        fontWeight: "500",
                        fontSize: { sm: "21px", xs: "16px" },
                        textAlign: "start",
                        color: "white",
                        pl: "10px",
                      }}
                    >
                      Review
                    </TableCell>
                    <TableCell
                      className="MuiTableCell-root-head"
                      sx={{
                        fontWeight: "500",
                        fontSize: { sm: "21px", xs: "16px" },
                        textAlign: "center",
                        color: "white",
                        pl: "10px",
                      }}
                    >
                      Sauce Name
                    </TableCell>
                    <TableCell
                      className="MuiTableCell-root-head"
                      sx={{
                        fontWeight: "500",
                        fontSize: { sm: "21px", xs: "16px" },
                        textAlign: "center",
                        color: "white",
                        borderRadius: "0px 8px 8px 0px",
                      }}
                    >
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody className="MuiTableBody-root">
                  {allReviews.map((review, index) => (
                    <TableRow
                      key={index}
                      sx={{ border: "2px solid #FFA100" }}
                      className="MuiTableRow-root"
                    >
                      <TableCell
                        sx={{
                          color: "white",
                          borderRadius: "8px 0px 0px 8px",
                          textAlign: "start !important",
                          pl: "40px !important",
                        }}
                        className="MuiTableCell-root"
                      >
                        {review?.owner?.name}
                      </TableCell>
                      <TableCell
                        sx={{ color: "white", textAlign: "start !important" }}
                        className="MuiTableCell-root"
                      >
                        {review?.owner?.email}
                      </TableCell>
                      <TableCell
                        sx={{ color: "white", textAlign: "start !important" }}
                        className="MuiTableCell-root"
                      >
                        {review?.text}
                      </TableCell>
                      <Tooltip title="Edit Sauce">

                      <TableCell
                        sx={{ 
                          
                          // color: "white",
                          
                          textAlign: "center !important", cursor:"pointer", textDecoration:"underline", color:" #FFA100 !important" }}

                        className="MuiTableCell-root"
                        onClick={() => navigate(`/admin/edit-sauce-details/${review.sauceId._id}`)}
                      >
                        {/* {formatDate(review?.createdAt)} */}
                        {review.sauceId.name}
                      </TableCell>
                      </Tooltip>

                      <TableCell
                        sx={{
                          color: "white",
                          textAlign: "center",
                          borderRadius: "0px 8px 8px 0px",
                        }}
                        className="MuiTableCell-root"
                      >
                        <Tooltip title="Delete Review">
                          <img
                            src={DeleteIcon}
                            style={{
                              width: "35px",
                              height: "35px",
                              cursor: "pointer",
                              objectFit: "contain",
                            }}
                            onClick={() => {
                              handleOpenDeleteModal(review._id);
                              console.log(review._id);
                            }}
                            alt="Delete"
                          />
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                sx={{
                  "& .MuiPaginationItem-root": {
                    color: "white",
                    backgroundColor: "#2E210A",
                    border: "2px solid #FFA100",
                  },
                  "& .Mui-selected": {
                    color: "black",
                    backgroundColor: "#FFA100",
                    fontWeight: "bold",
                  },
                  "& .MuiPaginationItem-ellipsis": {
                    color: "white",
                  },
                  "& .MuiPaginationItem-root:hover": {
                    backgroundColor: "#5A3D0A",
                    borderColor: "#FF7B00",
                  },
                }}
              />
            </Box>
          </Box>
        )}
      </Box>
      {deleteModalOpen && (
        <ConfirmDeleteModalTextReview
          open={deleteModalOpen}
          handleClose={handleCloseDeleteModal}
          reviewId={reviewToDelete} // Pass the review ID here
          onSuccess={() => fetchReviews(page)} // Refresh reviews list after deletion
        />
      )}
    </>
  );
};

export default TextReviewManagement;

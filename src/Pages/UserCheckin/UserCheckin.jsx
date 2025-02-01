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
import ConfirmDeleteModalCheckin from "../../Components/DeleteUserCheckinModal/DeleteUserCheckinModal";
import Lightbox from "yet-another-react-lightbox";
import logoAdmin from "../../assets/logoAdmin.png";
import loadingGIF from "../../assets/loading.gif";
import SearchIcon from "../../assets/SearchIcon.png";


const appUrl = import.meta.env.VITE_REACT_APP_API_URL;

const TextReviewManagement = () => {
  const [isSearchBarLoading, setSearchBarLoading] = useState(false)
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
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const {id} = useParams()



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

  const fetchReviews = async (currentPage, search) => {
    try {
      setLoading(true);
      const response = await axios({
        url: `${appUrl}/admin/get-specific-user-checkins/${id}`, // Dummy API endpoint for now
        method: "get",
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
          "Content-Type": "application/json",
        },
        params: {
          page: currentPage, // Pass current page to the backend
          limit: 8, // Set the limit per page
          searchTerm: search,
        },
      });

        console.log(response)
      
        setAllReviews(response.data.checkins || []); // Set the reviews data
        setTotalPages(response.data.pagination.totalPages || 1); // Update total pages
        setSearchBarLoading(false)


      setLoading(false);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setAllReviews(dummyData); // Fallback to dummy data on error
      setTotalPages(1); // Default pagination for dummy data
      setLoading(false);
    }
  };

  // Debounce the search input
  const debouncedSearch = useCallback(
    debounce((value, search) => {
    fetchReviews(value, search)
    }, 2000),
    []
  );

  useEffect(() => {
    fetchReviews(page);
  }, [page]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event?.target?.value);
    setSearchBarLoading(true)
    setPage(1); // Reset to page 1 on search
    debouncedSearch(1, event?.target?.value); // Trigger debounced search
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

    // Open lightbox
    const openLightbox = (imageSrc) => {
        setSelectedImage(imageSrc);
        setIsOpen(true);
    };


    function formatDate(isoString) {
      const date = new Date(isoString);
      const options = { year: 'numeric', month: 'short', day: '2-digit' };
      let formattedDate = date.toLocaleDateString('en-US', options)
                              .replace(/,/, '')
                              .toLowerCase()
                              .replace(/\s/g, '-');
    
      // Capitalize the first letter of the month
      formattedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
      
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
              User Checkin
            </Typography>
            <MenuBar />
          </Box>
          <Box
                      sx={{
                        display: "flex",
                        flexDirection: { sm: "row", xs: "column" },
                        justifyContent: { md: "end", sm: "end" },
                        alignItems: { sm: "center", xs: "end" },
                        gap: "1rem",
                        width: { md: "700px", xs: "100%" },
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
                          placeholder="Search Event..."
                          value={searchTerm}
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
                    </Box>
        </Box>

        {loading ? (
          <PageLoader />
        ) : allReviews?.length === 0 ? (
          <Typography
            sx={{
              textAlign: "center",
              fontWeight: "600",
              mt: 4,
              fontSize: "1.5rem",
              color: "#FFA100",
            }}
          >
            No Checkin found
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
                    
                      padding: "0px",
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
                      className="MuiTableCell-root-head"
                      sx={{
                        fontWeight: "500",
                        fontSize: { sm: "21px", xs: "16px" },
                        textAlign: "start",
                        color: "white",
                        pl: "10px",
                        
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
                      Check-Ins
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
                  {allReviews?.map((review, index) => (
                    <TableRow
                      key={index}
                      sx={{ border: "2px solid #FFA100" }}
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
                          src={review?.owner?.image ? review?.owner?.image : logoAdmin}
                          alt="Brand"
                          style={{
                            width: "80px",
                            height: "50px",
                            borderRadius: "8px",
                            objectFit: "contain",
                            cursor: "pointer",
                          }}
                          onClick={() => openLightbox(review?.owner.image)}
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "white",
                          
                          textAlign: "start !important",
                          pl: "40px !important",
                        }}
                        className="MuiTableCell-root"
                      >
                        {review.owner.name || "John Doe"}
                      </TableCell>
                      <TableCell
                        sx={{ color: "white", textAlign: "start !important" }}
                        className="MuiTableCell-root"
                      >
                        {review.owner.email || "example@email.com"}
                      </TableCell>
                      <TableCell
                        sx={{ color: "white", textAlign: "start !important" }}
                        className="MuiTableCell-root"
                      >
                        {review.text || "This is a sample review."}
                      </TableCell>
                       <Tooltip title="Edit Sauce">
                      <TableCell
                        sx={{ color: "white", textAlign: "center !important", cursor:"pointer",textDecoration:"underline", color:" #FFA100 !important"   }}
                        className="MuiTableCell-root"
                        onClick={() => navigate(`/admin/edit-sauce-details/${review.sauceId._id}`)}
                      >
                        {review?.sauceId?.name}
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
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: ".7rem",
                          }}
                        >
                          {/* <CustomButton
                            border="1px solid #FFA100"
                            ButtonText={"View Comments"}
                            color="white"
                            width= {{sm:"147px", xl:"170px"}}
                            borderRadius="6px"
                            
                            onClick={() => handleNavigate(brand._id)}
                            hoverBg="linear-gradient(90deg, #2E210A 0%, #2E210A 100%)"
                          /> */}
                          <Tooltip title="Delete Review">
                            <img
                              src={DeleteIcon}
                              style={{
                                width: "35px",
                                height: "35px",
                                cursor: "pointer",
                                objectFit: "contain",
                              }}
                              onClick={() => handleOpenDeleteModal(review._id)}
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
        <ConfirmDeleteModalCheckin
          open={deleteModalOpen}
          handleClose={handleCloseDeleteModal}
          reviewId={reviewToDelete} 
          onSuccess={() => fetchReviews(page)} 
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

export default TextReviewManagement;

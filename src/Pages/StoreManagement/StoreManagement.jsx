import React, { useState, useEffect , useCallback} from "react";
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

// import ConfirmDeleteModalForStore from "../../DeleteStoreModal/DeleteStoreModal";
import ConfirmDeleteModalForStore from "../../DeleteStoreModal/DeleteStoreModal.jsx";
import { debounce } from "lodash"; // Import lodash debounce
import SearchIcon from "../../assets/SearchIcon.png";

const appUrl = import.meta.env.VITE_REACT_APP_API_URL



const StoreManagement = () => {
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
  const [searchTerm, setSearchTerm] = useState(""); 


//   here stores varaible define 
const [allStores, setAllStores] = useState([]);

  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const fetchStores = async (currentPage) => {
    try {
      setLoading(true);
      const response = await axios({
        url: `${appUrl}/get-locations`,
        method: "get",
        
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
          "Content-Type": "application/json",
        },
        params: {
          page: currentPage, // Pass the current page to the backend
          limit: 8, // Set the limit per page
          searchTerm: searchTerm,
          type: "store"
        },
      });
      console.log(response.data)

      setAllStores(response.data.items || []); // Set the stores data
      setTotalPages(response.data.pagination.totalPages ||1); // Update total pages
      setLoading(false);
    } catch (error) {
      console.error("Error fetching stores:", error);
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
      fetchStores(page);
    }, [page, searchTerm]);

  
  const openLightbox = (imageSrc) => {
    setSelectedImage(imageSrc);
    setIsOpen(true);
  };

   // Handle Pagination Change
   const handlePageChange = (event, value) => {
    setPage(value);
  };


  const handleSearchChange = (event) => {
    setPage(1); // Reset to page 1 on search
    debouncedSearch(event.target.value); // Trigger debounced search
  };


  const handleCopyUrl = (url) => {
    navigator.clipboard.writeText(url);
    alert("URL copied to clipboard!");
  };

  const handleNavigate = () => {
  navigate("/admin/store-management/add-store")
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

 const handleNavigateToEdit = (id) => {
    navigate(`/admin/store-management/edit-store/${id}`)
 }

 const handleNavigateToView = (id) => {
  navigate(`/admin/store-management/view-store/${id}`)
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
              Store Management
            </Typography>
            <MenuBar />
          </Box>
          <Box sx={{ display: "flex", gap: "1rem", flexDirection:{sm:"row", xs:"column"} }}>
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
            <Box sx={{ width: { sm: "200px", xs: "100%" } }}>
              <Tooltip title="Add Store">
                <CustomButton
                  border="1px solid #FFA100"
                  ButtonText="Add Store+"
                  color="white"
                  width={"100%"}
                  borderRadius="8px"
                  background="linear-gradient(90deg, #FFA100 0%, #FF7B00 100%)"
                  padding="7px 0px"
                  fontSize="16px"
                  fontWeight="600"
                  onClick={handleNavigate}
                />
              </Tooltip>
            </Box>
          </Box>
        </Box>

        {loading ? (
          <PageLoader />
        ) : allStores?.length === 0 ? (
          <Typography
            sx={{
              textAlign: "center",
              fontWeight: "600",
              mt: 4,
              fontSize: "1.5rem",
              color: "#FFA100",
            }}
          >
            No Store found
          </Typography>
        ) : (
          <Box sx={{ mt: "30px", padding: { md: "0px 20px", xs: "0px" } }}>
            <TableContainer component={Paper} className="MuiTableContainer-root">
              <Table className="data-table">
                <TableHead className="MuiTableHead-root">
                  <TableRow
                    sx={{
                      backgroundImage: "linear-gradient(90deg, #FFA100 0%, #FF7B00 100%) !important",
                      "&:hover": {
                        backgroundImage: "linear-gradient(90deg, #5A3D0A 0%, #5A3D0A 100%) !important",
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
                      Owner Image
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
                      Store Name
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
                      Owner Name
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
                      Owner Email
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
                  {allStores.map((review, index) => (
                    <TableRow key={index} sx={{ border: "2px solid #FFA100" }} className="MuiTableRow-root">
                      <TableCell
                        sx={{ borderRadius: "8px 0px 0px 8px", color: "white", ml: { md: "20px", xs: "10px" } }}
                        className="MuiTableCell-root"
                      >
                        <img
                          src={ review?.postedBy?.image ?  review?.postedBy?.image :  logoAdmin}
                          style={{
                            width: "80px",
                            height: "50px",
                            borderRadius: "8px",
                            cursor: "pointer",
                            objectFit: "contain",
                          }}
                          onClick={() => openLightbox(review?.postedBy?.image)}
                          alt=""
                        />
                      </TableCell>
                      <TableCell sx={{ textAlign: "start !important" }} className="MuiTableCell-root">
                        {review?.storeName}
                      </TableCell>
                      <TableCell sx={{ textAlign: "start !important" }} className="MuiTableCell-root">
                        {review?.postedBy?.name}
                      </TableCell>
                      <TableCell sx={{ textAlign: "start !important" }} className="MuiTableCell-root">
                        {review?.postedBy?.email}
                      </TableCell>
                      <TableCell sx={{ borderRadius: "0px 8px 8px 0px", color: "white", ml: { md: "20px", xs: "10px" } }} className="MuiTableCell-root">
                        <Box sx={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                          <Tooltip title="View Store">
                            <CustomButton
                              border="1px solid #FFA100"
                              ButtonText="View Store"
                              color="white"
                              width={"100px"}
                              borderRadius="8px"
                              padding="8px 0px"
                              fontSize="12px"
                              fontWeight="400"
                              onClick={() => handleNavigateToView(review._id)}
                            />
                          </Tooltip>
                          <Tooltip title="Edit Store">
                            <img
                              src={EditIcon}
                              style={{
                                width: "25px",
                                height: "24px",
                                cursor: "pointer",
                              }}
                              onClick={() => handleNavigateToEdit(review._id)}
                              alt="Edit"
                            />
                          </Tooltip>
                          <Tooltip title="Delete Store">
                            <img
                              src={DeleteIcon}
                              style={{
                                width: "37px",
                                height: "37px",
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

        {isOpen && <Lightbox open={isOpen} close={() => setIsOpen(false)} slides={[{ src: selectedImage }]} />}
        {deleteModalOpen && (
          <ConfirmDeleteModalForStore
            open={deleteModalOpen}
            handleClose={handleCloseDeleteModal}
            reviewId={reviewToDelete}
            onSuccess={() => fetchStores(page)}
          />
        )}
      </Box>
    </>
  );
};

export default StoreManagement;
  
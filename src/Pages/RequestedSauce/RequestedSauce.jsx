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
import { useNavigate } from "react-router-dom";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css"; // Import the CSS for the lightbox
import PageLoader from "../../Components/Loader/PageLoader";
import logoAdmin from "../../assets/logoAdmin.png"; // Placeholder image for sauces without images
import CustomButton from "../../Components/CustomButton/CustomButton";
import SearchIcon from "../../assets/SearchIcon.png";
import { debounce } from "lodash"; // Import lodash debounce
import MenuBar from "../../Components/MenuBar/MenuBar";
import eyeIcon from "../../assets/eyeopen.png";

import "../TabooManagement/TabooManagement.css"; // Use the same CSS to keep the design consistent
// delete requested sauce modal
import ConfirmDeleteModalRequestedSauce from "../../Components/DeleteRequestedSauce/DeleteRequestedSauce";
const appUrl = import.meta.env.VITE_REACT_APP_API_URL;

const RequestedSauce = () => {
  const [loading, setLoading] = useState(false);
  const [sauces, setSauces] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // Added state for search term

  const auth = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const fetchSauces = async (currentPage, search) => {
    try {
      setLoading(true);
      const response = await axios({
        url: `${appUrl}/get-sauces`,
        method: "get",
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
        },
        params: {
          page: currentPage,
          type: "requested",
          searchTerm: search, // Added searchTerm to API params
        },
      });
      setSauces(response?.data?.sauces || []);
      setTotalPages(response?.data?.pagination?.totalPages || 1);
      setLoading(false);
      console.log(response);
    } catch (error) {
      console.error("Error fetching sauces:", error);
      setLoading(false);
    }
  };

  // Debounce search input to reduce API calls
  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchTerm(value);
      fetchSauces(page, value);
    }, 2000),
    [page]
  );

  useEffect(() => {
    fetchSauces(page, searchTerm); // Include searchTerm when fetching data
  }, [page, searchTerm]);

  const openLightbox = (imageSrc) => {
    setSelectedImage(imageSrc);
    setIsOpen(true);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    fetchSauces(value, searchTerm);
  };

  const handleNavigate = (sauceData) => {
    navigate("/admin/add-sauce", { state: sauceData });
  };

  const handleSearchChange = (event) => {
    setPage(1); // Reset to page 1 on search
    debouncedSearch(event.target.value);
  };

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
              Requested Sauces
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
        ) : (
          <>
            {sauces.length === 0 ? (
              <Typography
                sx={{
                  textAlign: "center",
                  fontWeight: "600",
                  mt: 4,
                  fontSize: "1.5rem",
                  color: "#FFA100",
                }}
              >
                No sauces found
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
                            padding: "12px 0px",
                            fontSize: { sm: "21px", xs: "16px" },
                            textAlign: "start",
                            color: "white",
                            borderRadius: "8px 0px 0px 8px",
                            pl: "40px",
                          }}
                        >
                          Sauce Name
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
                          Brand Name
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
                          Brand Email
                        </TableCell>
                        <TableCell
                          className="MuiTableCell-root-head"
                          sx={{
                            fontWeight: "500",
                            padding: "12px 0px",
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
                      {sauces.map((sauce, index) => (
                        <TableRow
                          key={index}
                          sx={{ border: "2px solid #FFA100" }}
                          className="MuiTableRow-root"
                        >
                          <TableCell
                            sx={{
                              borderRadius: "8px 0px 0px 8px",
                              textAlign: "start !important",
                              pl: "40px !important",
                            }}
                            className="MuiTableCell-root"
                          >
                            {sauce?.name || "No Sauce Name"}
                          </TableCell>
                          <TableCell
                            sx={{ textAlign: "start !important" }}
                            className="MuiTableCell-root"
                          >
                            {sauce?.owner?.name || "No Brand Name"}
                          </TableCell>
                          <TableCell
                            sx={{ textAlign: "start !important" }}
                            className="MuiTableCell-root"
                          >
                            {sauce?.owner?.email || "No Email Available"}
                          </TableCell>
                          <TableCell
                            sx={{
                              borderRadius: "0px 8px 8px 0px",
                              color: "white",
                              textAlign: "center",
                            }}
                            className="MuiTableCell-root"
                          >
                            {/* <CustomButton
                              border="1px solid #FFA100"
                              ButtonText="View Request"
                              color="white"
                              width="148px"
                              borderRadius="6px"
                              buttonStyle={{ height: "39px" }}
                              onClick={() => handleNavigate(sauce)}
                              hoverBg="linear-gradient(90deg, #2E210A 0%, #2E210A 100%)"
                            /> */}
                            <Box
                            sx={{
                              display:"flex", justifyContent:"center", alignItems:"center"
                            }}
                            >

                            <Tooltip title="View Requested Sauce">
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
                                onClick={() => handleNavigate(sauce)}
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
          </>
        )}

        {isOpen && (
          <Lightbox
            open={isOpen}
            close={() => setIsOpen(false)}
            slides={[{ src: selectedImage }]}
          />
        )}
      </Box>
    </>
  );
};

export default RequestedSauce;

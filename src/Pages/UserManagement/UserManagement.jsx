import React, { useEffect, useState, useCallback } from "react";
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
import { debounce } from "lodash"; // Import lodash debounce
import SearchIcon from "../../assets/SearchIcon.png";
import "./TableStyle.css";
import CustomButton from "../../Components/CustomButton/CustomButton";
import axios from "axios";
import PageLoader from "../../Components/Loader/PageLoader";
import { useSelector } from "react-redux";
import SnackAlert from "../../Components/SnackAlert/SnackAlert";
import ConfirmActionModal from "../../Components/ConfirmActionModal/ConfirmActionModal";
import EditIcon from "../../assets/EditIcon.png";
import { useNavigate } from "react-router-dom";
import MenuBar from "../../Components/MenuBar/MenuBar";
import queryString from "query-string";
import IconButton from "@mui/material/IconButton";

const appUrl = import.meta.env.VITE_REACT_APP_API_URL;

const UserManagement = () => {
  const auth = useSelector((state) => state.auth);
  const [snackAlertData, setSnackAlertData] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [allUsers, setAllUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [action, setAction] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const fetchUsers = async (page) => {
    try {
      setLoading(true);
      const response = await axios({
        url: `${appUrl}/admin/get-all-users`,
        method: "get",
        params: {
          type: "user",
          page,
          limit: 8,
          searchTerm: searchTerm,
        },
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
        },
      });
      setAllUsers(response?.data?.entities || response?.data?.users);
      setTotalPages(response?.data?.pagination?.totalPages || 1);
      setLoading(false);
      console.log(response)
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false);
    }
  };

  const toggleBlock = (userId, currentStatus) => {
    setSelectedUser(userId);
    setAction(currentStatus === "active" ? "block" : "unblock");
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleModalSuccess = () => {
    setAllUsers((prevUsers) =>
      prevUsers.map((user) =>
        user._id === selectedUser
          ? { ...user, status: user.status === "active" ? "blocked" : "active" }
          : user
      )
    );
    setSelectedUser(null);
  };

  useEffect(() => {
    const parsed = queryString.parse(window.location.search);
    const currentPage = parsed.page ? parseInt(parsed.page, 10) : 1;
    setPage(currentPage);
    fetchUsers(currentPage);
    
  }, [window.location.search, searchTerm]);


  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchTerm(value);
    }, 2000),
    []
  );

    // Handle pagination change
    const handlePageChange = useCallback(
      (event, value) => {
        setPage(value); // Update the current page
        navigate(`${window.location.pathname}?page=${value}`);
      },
      [navigate]
    );
  

  const handleSearchChange = (event) => {
    setPage(1)
    debouncedSearch(event.target.value);
  };

  // const handlePageChange = (event, value) => {
  //   navigate(`${window.location.pathname}?page=${value}`);
  // };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const navigateToEdit = (id) => {
    navigate(`/admin/edit-brand-user-details/${id}`);
  };

  const handleNavigate = (id) => {
    navigate(`/admin/user-interested-events/${id}`);
  };


  const handleNavigateToReview = (id) => {
    navigate(`/admin/user-reviews/${id}`);
  };


  return (
    <>
   
        <Box>
          {/* Header Section */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              p: {
                md: "0px 20px 0px 20px",
                xs: "0px 0px 0px 0px",
              },
              alignItems: {
                md: "center",
                xs: "start",
              },
              flexDirection: {
                md: "row",
                xs: "column",
              },
              position: "relative",
              gap: "20px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Typography
                sx={{
                  color: "white",
                  fontWeight: "600",
                  fontSize: {
                    sm: "45px",
                    xs: "30px",
                  },
                  fontFamily: "Fira Sans !important",
                }}
              >
                Users Management
              </Typography>
              <Typography>
                <MenuBar />
              </Typography>
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
                  onChange={handleSearchChange}
                  style={{ color: "white" }}
                />
                <img
                  src={SearchIcon}
                  alt=""
                  style={{
                    position: "absolute",
                    top: "14px",
                    right: "20px",
                  }}
                />
              </Box>
            </Box>
          </Box>

          {/* Table Section */}

          {
            loading ? (
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
                      "&:hover": {
                        backgroundImage: `linear-gradient(90deg, #5A3D0A 0%, #5A3D0A 100%) !important`,
                      },
                      padding: "0px",
                    }}
                    className="header-row"
                  >
                    <TableCell
                      className="MuiTableCell-root-head"
                      sx={{
                        fontWeight: "500",
                        padding: "0px 0px",
                        fontSize: {
                          xl: "21px !important",
                          xs: "15px !important",
                        },
                        textAlign: "start",
                        borderRadius: "8px 0px 0px 8px",
                        color: "white",
                        paddingLeft: "40px",
                      }}
                    >
                      Full Name
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "500",
                        padding: "12px 0px",
                        fontSize: {
                          xl: "21px !important",
                          xs: "15px !important",
                        },
                        textAlign: "start",
                        color: "white",
                        paddingLeft: "0px",
                      }}
                      className="MuiTableCell-root-head"
                    >
                      Email
                    </TableCell>
                    {/* <TableCell
                      sx={{
                        fontWeight: "500",
                        padding: "12px 0px",
                        fontSize: {
                          sm: "21px",
                          xs: "16px",
                        },
                        textAlign: "center",
                        color: "white",
                        minWidth: "150px",
                      }}
                      className="MuiTableCell-root-head"
                    >
                       Badges Earned
                    </TableCell> */}
                    <TableCell
                      sx={{
                        fontWeight: "500",
                        padding: "12px 0px",
                        fontSize: {
                          xl: "21px !important",
                          xs: "15px !important",
                        },
                        textAlign: "center",
                        color: "white",
                        minWidth: "150px",
                      }}
                      className="MuiTableCell-root-head"
                    >
                      Interested Events
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "500",
                        padding: "12px 0px",
                        fontSize: {
                          xl: "21px !important",
                          xs: "15px !important",
                        },
                        textAlign: "center",
                        color: "white",
                        minWidth: "150px",
                      }}
                      className="MuiTableCell-root-head"
                    >
                      Check-Ins
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "500",
                        padding: "12px 0px",
                        fontSize: {
                          xl: "21px !important",
                          xs: "15px !important",
                        },
                        textAlign: "center",
                        color: "white",
                        minWidth: "150px",
                      }}
                      className="MuiTableCell-root-head"
                    >
                      Reviews
                    </TableCell>

                    <TableCell
                      sx={{
                        fontWeight: "500",
                        padding: "12px 0px",
                        fontSize: {
                          xl: "21px !important",
                          xs: "15px !important",
                        },
                        textAlign: "center",
                        color: "white",
                      }}
                      className="MuiTableCell-root-head"
                    >
                      Joining Date
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "500",
                        padding: "12px 0px",
                        fontSize: {
                          xl: "21px !important",
                          xs: "15px !important",
                        },
                        textAlign: "center",
                        borderRadius: "0px 8px 8px 0px",
                        color: "white",
                      }}
                      className="MuiTableCell-root-head"
                    >
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody className="MuiTableBody-root">
                  {allUsers.map((user, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        border: "2px solid #FFA100",
                      }}
                      className="MuiTableRow-root"
                    >
                      <TableCell
                        sx={{
                          borderRadius: "8px 0px 0px 8px",
                          color: "white",
                          textAlign: "start !important",
                          paddingLeft: "40px !important",
                        }}
                        className="MuiTableCell-root"
                      >
                        {user?.name}
                      </TableCell>
                      <TableCell
                        sx={{
                          textAlign: "start !important",
                          paddingLeft: "0px !important",
                        }}
                        className="MuiTableCell-root"
                      >
                        {user?.email}
                      </TableCell>

                      {/* <Tooltip title="See Badges Earned">
                      <TableCell
                      onClick={()=> handleNavigate(user._id)}
                        sx={{
                          
                          cursor: "pointer",
                        }}
                        className="MuiTableCell-root"
                      >
                         
                          {user?.badgeCount}
                          
                      </TableCell>
                        </Tooltip> */}

                      <Tooltip title="see all events">
                      <TableCell
                      onClick={()=> handleNavigate(user._id)}
                        sx={{
                        //   border: "1px solid red !important",
                          cursor: "pointer",
                        }}
                        className="MuiTableCell-root"
                      >
                         
                          {user?.interestedEvents}
                          
                      </TableCell>
                        </Tooltip>
                    
                        <Tooltip title="See all Check-in">
                      <TableCell className="MuiTableCell-root"
                       onClick={()=> navigate(`/admin/user-checkin/${user._id}`)}
                       sx={{
                      
                         cursor: "pointer",
                       }}
                      >
                        {user?.checkins}
                      </TableCell>
                      </Tooltip>
                      <Tooltip title="see all Reviews">

                      <TableCell className="MuiTableCell-root"
                       onClick={()=> handleNavigateToReview(user._id)}
                       sx={{
                     
                         cursor: "pointer",
                       }}
                      >
                        {user?.reviews}
                      </TableCell>
                      </Tooltip>

                      <TableCell className="MuiTableCell-root">
                        {formatDate(user?.date)}
                      </TableCell>
                      <TableCell
                        sx={{ borderRadius: "0px 8px 8px 0px" }}
                        className="MuiTableCell-root"
                      >
                        <Box
                          sx={{
                            display: "flex",
                            gap: "30px",
                            justifyContent: "center",
                          }}
                        >
                          <CustomButton
                            border="1px solid #FFA100"
                            ButtonText={
                              user.status === "active" ? "Block" : "Unblock"
                            }
                            color="white"
                            width={"98px"}
                            borderRadius="6px"
                            buttonStyle={{ height: "39px" }}
                            onClick={() => toggleBlock(user._id, user.status)}
                            hoverBg="linear-gradient(90deg, #2E210A 0%, #2E210A 100%)"
                          />
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
                            onClick={() => navigateToEdit(user._id)}
                          />
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
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
                  color: "#FFA100",
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
          </>
           )}

          {/* Pagination */}

          <SnackAlert
            severity={snackAlertData.severity}
            message={snackAlertData.message}
            open={snackAlertData.open}
            handleClose={() => {
              setSnackAlertData((prev) => ({ ...prev, open: false }));
            }}
          />
          <ConfirmActionModal
            open={modalOpen}
            handleClose={handleModalClose}
            userId={selectedUser}
            action={action}
            onSuccess={handleModalSuccess}
          />
        </Box>
      
    </>
  );
};

export default UserManagement;

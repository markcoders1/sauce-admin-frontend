import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Pagination } from '@mui/material';
import SearchIcon from '../../assets/SearchIcon.png';
import "./TableStyle.css";
import CustomButton from '../../Components/CustomButton/CustomButton';
import axios from 'axios';
import PageLoader from '../../Components/Loader/PageLoader';
import { useSelector } from 'react-redux';
import SnackAlert from '../../Components/SnackAlert/SnackAlert';
import ConfirmActionModal from '../../Components/ConfirmActionModal/ConfirmActionModal';
import EditIcon from '../../assets/EditIcon.png'; 
import { useNavigate } from 'react-router-dom';
import MenuBar from '../../Components/MenuBar/MenuBar';
import queryString from 'query-string'; // Import query-string library

const appUrl = import.meta.env.VITE_REACT_APP_API_URL;

const UserManagement = () => {
    const auth = useSelector((state) => state.auth);
    const [snackAlertData, setSnackAlertData] = useState({
        open: false,
        message: "",
        severity: "success"
    });
    const [allUsers, setAllUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [action, setAction] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [page, setPage] = useState(1); // Current page
    const [totalPages, setTotalPages] = useState(1); // Total number of pages
    const navigate = useNavigate();

    const fetchUsers = async (page) => {
        try {
            setLoading(true);
            const response = await axios({
                url: `${appUrl}/admin/get-all-users`,
                method: "get",
                params: {
                    type: "user",
                    page: page, // Pass current page to backend
                    limit: 8 // Number of items per page
                },
                headers: {
                    Authorization: `Bearer ${auth.accessToken}`
                }
            });
            setAllUsers(response?.data?.users || []);
            setTotalPages(response?.data?.pagination?.totalPages || 1); // Set total pages
            setLoading(false);
            console.log("appRul", response);
        } catch (error) {
            console.error('Error fetching users:', error);
            setLoading(false);
        }
    };

    const toggleBlock = (userId, currentStatus) => {
        setSelectedUser(userId);
        setAction(currentStatus === 'active' ? 'block' : 'unblock');
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
    };

    const handleModalSuccess = () => {
        setAllUsers(prevUsers =>
            prevUsers.map(user =>
                user._id === selectedUser ? { ...user, status: user.status === 'active' ? 'blocked' : 'active' } : user
            )
        );
        setSelectedUser(null);
    };

    useEffect(() => {
        const parsed = queryString.parse(window.location.search);
        const currentPage = parsed.page ? parseInt(parsed.page, 10) : 1;
        setPage(currentPage);
        fetchUsers(currentPage);
    }, [window.location.search]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handlePageChange = (event, value) => {
        navigate(`${window.location.pathname}?page=${value}`);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
    };

    const filteredUsers = allUsers.filter(user =>
        (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const navigateToEdit = (id) => {
        navigate(`/admin/edit-brand-user-details/${id}`);
    };

    return (
        <>
            {loading ? (
                <PageLoader />
            ) : (
                <Box>
                    <Box sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        p: {
                            md: "0px 20px 0px 20px",
                            xs: "0px 0px 0px 0px"
                        },
                        alignItems: {
                            md: "center",
                            xs: "start"
                        },
                        flexDirection: {
                            md: "row",
                            xs: "column"
                        },
                        position: "relative",
                        gap: "20px"
                    }}>
                        <Box sx={{display:"flex", justifyContent:"space-between", width:"100%"}} >
                            <Typography sx={{
                                color: "white",
                                fontWeight: "600",
                                fontSize: {
                                    sm: "45px",
                                    xs: "30px"
                                },
                                fontFamily: "Fira Sans !important",
                            }}>
                                Users Management
                            </Typography>
                            <Typography>
                                <MenuBar />
                            </Typography>
                        </Box>
                        <Box sx={{width:"100%", display:"flex", justifyContent:"end"}} >
                            <Box sx={{ position: "relative", width: "100%", maxWidth: {md:"350px", xs:"100%"} }}>
                                <input
                                    type="search"
                                    name="search"
                                    id="search"
                                    className="search-input"
                                    placeholder="Search"
                                    value={searchTerm}
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

                    <Box sx={{ mt: "30px", padding: {md: "0px 20px", xs:"0px"},   }}>
                        <TableContainer component={Paper} className="MuiTableContainer-root">
                            <Table className="data-table">
                                <TableHead className="MuiTableHead-root">
                                    <TableRow
                                        sx={{
                                            backgroundImage: `linear-gradient(90deg, #FFA100 0%, #FF7B00 100%) !important`,
                                            '&:hover': { 
                                                backgroundImage: `linear-gradient(90deg, #5A3D0A 0%, #5A3D0A 100%) !important`,
                                            },
                                            padding: "0px"
                                        }}
                                        className="header-row"
                                    >
                                        <TableCell className="MuiTableCell-root-head" sx={{
                                            fontWeight: "500",
                                            padding: "0px 0px",
                                            fontSize: {
                                                sm: "21px",
                                                xs: "16px"
                                            },
                                            textAlign: "start",
                                            borderRadius: "8px 0px 0px 8px",
                                            color: "white",
                                            paddingLeft: "40px"
                                        }}>Full Name</TableCell>
                                        <TableCell sx={{
                                            fontWeight: "500",
                                            padding: "12px 0px",
                                            fontSize: {
                                                sm: "21px",
                                                xs: "16px"
                                            },
                                            textAlign: "start",
                                            color: "white",
                                            paddingLeft: "0px"
                                        }} className="MuiTableCell-root-head">Email</TableCell>
                                        <TableCell sx={{
                                            fontWeight: "500",
                                            padding: "12px 0px",
                                            fontSize: {
                                                sm: "21px",
                                                xs: "16px"
                                            },
                                            textAlign: "center",
                                            color: "white",
                                            minWidth:"150px"
                                        }} className="MuiTableCell-root-head">Check-Ins</TableCell>
                                        <TableCell sx={{
                                            fontWeight: "500",
                                            padding: "12px 0px",
                                            fontSize: {
                                                sm: "21px",
                                                xs: "16px"
                                            },
                                            textAlign: "center",
                                            color: "white"
                                        }} className="MuiTableCell-root-head">Joining Date</TableCell>
                                        <TableCell sx={{
                                            fontWeight: "500",
                                            padding: "12px 0px",
                                            fontSize: {
                                                sm: "21px",
                                                xs: "16px"
                                            },
                                            textAlign: "center",
                                            borderRadius: "0px 8px 8px 0px",
                                            color: "white"
                                        }} className="MuiTableCell-root-head">Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody className="MuiTableBody-root">
                                    {filteredUsers.map((user, index) => (
                                        <TableRow key={index} sx={{
                                            border: "2px solid #FFA100"
                                        }} className="MuiTableRow-root">
                                            <TableCell sx={{ borderRadius: "8px 0px 0px 8px", color: "white", textAlign: "start !important", paddingLeft: "40px !important"
                                            }} className="MuiTableCell-root">{user.name}</TableCell>
                                            <TableCell sx={{ textAlign: "start !important", paddingLeft: "0px !important" }} className="MuiTableCell-root">{user.email}</TableCell>
                                            <TableCell className="MuiTableCell-root">{user.checkins}</TableCell>
                                            <TableCell className="MuiTableCell-root">{formatDate(user.date)}</TableCell>
                                            <TableCell sx={{ borderRadius: "0px 8px 8px 0px", }} className="MuiTableCell-root">
                                                <Box sx={{ display: "flex", gap: "30px", justifyContent: "center" }}>
                                                    <CustomButton
                                                        border='1px solid #FFA100'
                                                        ButtonText={user.status === 'active' ? 'Block' : 'Unblock'}
                                                        color='white'
                                                        width={"98px"}
                                                        borderRadius='6px'
                                                        buttonStyle={{ height: "39px" }}
                                                        onClick={() => toggleBlock(user._id, user.status)}
                                                        hoverBg='linear-gradient(90deg, #2E210A 0%, #2E210A 100%)' 
                                                    />
                                                    <img className="edit-icon" src={EditIcon} alt="Edit" style={{ width: '40px', height: '40px', cursor: 'pointer', border: "0 px solid red", borderRadius: "10px", padding: "8px" }} onClick={() => navigateToEdit(user._id)} />
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
                                '& .MuiPaginationItem-root': {
                                    color: 'white', // Text color
                                    backgroundColor: '#2E210A', // Background color for pagination buttons
                                    border: '2px solid #FFA100', // Border color matching the theme
                                },
                                '& .Mui-selected': {
                                    color: '#FFA100', // Text color for selected page
                                    backgroundColor: '', // Background color for selected page
                                    fontWeight: 'bold', // Bold text for selected page
                                },
                                '& .MuiPaginationItem-ellipsis': {
                                    color: 'white', // Color for ellipsis (...)
                                },
                                '& .MuiPaginationItem-root:hover': {
                                    backgroundColor: '#5A3D0A', // Background color on hover
                                    borderColor: '#FF7B00', // Border color on hover
                                },
                            }}
                        />
                    </Box>

                    <SnackAlert
                        severity={snackAlertData.severity}
                        message={snackAlertData.message}
                        open={snackAlertData.open}
                        handleClose={() => { setSnackAlertData(prev => ({ ...prev, open: false })) }}
                    />
                    <ConfirmActionModal
                        open={modalOpen}
                        handleClose={handleModalClose}
                        userId={selectedUser}
                        action={action}
                        onSuccess={handleModalSuccess}
                    />
                </Box>
            )}
        </>
    );
}

export default UserManagement;

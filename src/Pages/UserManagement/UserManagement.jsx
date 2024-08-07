import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Tabs, Tab } from '@mui/material';
import { styled } from '@mui/system';
import SearchIcon from '../../assets/SearchIcon.png';
import "./TableStyle.css"; // Import the CSS file for custom styles
import CustomButton from '../../Components/CustomButton/CustomButton';
import axiosInstance from '../../Hooks/AuthHook/AuthHook';
import axios from 'axios';
import EditSauceModal from '../../Components/EditSauceModal/EditSauceModal';
import SnackAlert from '../../Components/SnackAlert/SnackAlert';


const appUrl = import.meta.env.VITE_REACT_APP_API_URL;

const StyledTabs = styled(Tabs)({
    '& .MuiTabs-indicator': {
        backgroundColor: 'black',
    },
});

const StyledTab = styled((props) => <Tab {...props} />)(({ theme }) => ({
    textTransform: 'none',
    minWidth: 72,
    fontWeight: theme.typography,
    marginRight: theme.spacing(4),
    color: '#9B9B9B',
    fontSize: '22px',
    '&.Mui-selected': {
        color: 'black',
    },
    '&.Mui-focusVisible': {
        backgroundColor: '#d1eaff',
    },
}));

const UserManagement = () => {

    sessionStorage.setItem("accessToken", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmEzZTgyYTVkY2FlY2IyNGI4Nzc4YjkiLCJpYXQiOjE3MjIwMTc4MzQsImV4cCI6MTcyNzIwMTgzNH0.jAigSu6rrFjBiJjBKlvShm0--WNo-0YgaJXq6eW_QlU")

    console.log(appUrl)

    const staticEmployees = [
        { fullName: "John Doe", email: "john.doe@example.com", createdAt: "2023-07-22" , check :  "30"},
        { fullName: "Jane Smith", email: "jane.smith@example.com", createdAt: "2023-07-22" ,check :  "43"},
        { fullName: "Alice Johnson", email: "alice.johnson@example.com", createdAt: "2023-07-22",check :  "43" },
        { fullName: "Bob Brown", email: "bob.brown@example.com", createdAt: "2023-07-22",check :  "42" },
        { fullName: "John Doe", email: "john.doe@example.com", createdAt: "2023-07-22" , check :  "30"},
        { fullName: "Jane Smith", email: "jane.smith@example.com", createdAt: "2023-07-22" ,check :  "43"},
        { fullName: "Alice Johnson", email: "alice.johnson@example.com", createdAt: "2023-07-22",check :  "43" },
        { fullName: "Bob Brown", email: "bob.brown@example.com", createdAt: "2023-07-22",check :  "42" },
        { fullName: "John Doe", email: "john.doe@example.com", createdAt: "2023-07-22" , check :  "30"},
        { fullName: "Jane Smith", email: "jane.smith@example.com", createdAt: "2023-07-22" ,check :  "43"},
        { fullName: "Alice Johnson", email: "alice.johnson@example.com", createdAt: "2023-07-22",check :  "43" },
        { fullName: "Bob Brown", email: "bob.brown@example.com", createdAt: "2023-07-22",check :  "42" },
    ];

    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = date.toLocaleString('default', { month: 'long' });
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    };

    const filteredEmployees = staticEmployees.filter(employee =>
        employee.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase())
    );


    // const fetchUsers = async (data) => {
    //     try {
    //       const response = await axiosInstance({
    //         url: `${appUrl}/admin/get-all-reviews`,
    //         method: "get",

    //       });
    
    //       console.log(response);
         
    //     } catch (error) {
    //       console.error(error);
    //     }
    //   };


    const fetchUsers = async () => {
        try {
          const response = await axios({
            url: "https://sauced-backend.vercel.app/admin/get-all-events",
            method: "get",
            headers: {
              Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmEzZTgyYTVkY2FlY2IyNGI4Nzc4YjkiLCJpYXQiOjE3MjIwMTc4MzQsImV4cCI6MTcyNzIwMTgzNH0.jAigSu6rrFjBiJjBKlvShm0--WNo-0YgaJXq6eW_QlU`
            }
          });
          console.log(response.data); // Handle the response data as needed
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      };
      
      useEffect(() => {
        // fetchUsers();
      }, []);

    return (
        <Box>
            <Box sx={{
                display: "flex",
                justifyContent: "space-between",
                p: {
                    sm: "0px 20px 0px 20px",
                    xs: "0px 0px 0px 0px"
                },
                alignItems: "center",
            }}>
                <Typography sx={{
                    color: "white",
                    fontWeight: "600",
                    fontSize: {
                        sm: "45px",
                        xs: "26px"
                    },
                    fontFamily: "Fira Sans !important",
                }}>
                    Users Management
                </Typography>

                <Box sx={{ position: "relative", width: "300px" }}>
                    <input
                        type="search"
                        name="search"
                        id="search"
                        className="search-input"
                        placeholder="Search User..."
                        value={searchTerm}
                        onChange={handleSearchChange}
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

            <Box sx={{ mt: "30px", padding: "0px 20px" }}>
                <TableContainer component={Paper} className="MuiTableContainer-root">
                    <Table className="data-table">
                        <TableHead className="MuiTableHead-root">
                            <TableRow
                                sx={{
                                    backgroundColor: "transparent",
                                    padding: "0px"
                                }}
                                  className="header-row"
                            >
                                <TableCell className="MuiTableCell-root-head" sx={{
                                    fontWeight: "500",
                                    padding: "0px 0px",
                                    fontSize: "18px",
                                    textAlign: "center",
                                    borderRadius: "8px 0px 0px 8px",
                                    color: "white"
                                }}>Full Name</TableCell>
                                <TableCell sx={{
                                    fontWeight: "500",
                                    padding: "12px 0px",
                                    fontSize: "18px",
                                    textAlign: "center",
                                     color: "white"
                                }} className="MuiTableCell-root-head">Email</TableCell>
                                 <TableCell sx={{
                                    fontWeight: "500",
                                    padding: "12px 0px",
                                    fontSize: "18px",
                                    textAlign: "center",
                                     color: "white"
                                }} className="MuiTableCell-root-head">Check-Ins</TableCell>
                                <TableCell sx={{
                                    fontWeight: "500",
                                    padding: "12px 0px",
                                    fontSize: "18px",
                                    textAlign: "center",
                                     color: "white"
                                }} className="MuiTableCell-root-head">Joining Date</TableCell>
                                <TableCell sx={{
                                    fontWeight: "500",
                                    padding: "12px 0px",
                                    fontSize: "18px",
                                    textAlign: "center",
                                    borderRadius: "0px 8px 8px 0px",
                                     color: "white"
                                }} className="MuiTableCell-root-head">Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody className="MuiTableBody-root">
                            {filteredEmployees.map((employee, index) => (
                                <TableRow key={index} sx={{
                                    border:"2px solid red"
                                }} className="MuiTableRow-root">
                                    <TableCell sx={{ borderRadius: "8px 0px 0px 8px", color: "white" }} className="MuiTableCell-root">{employee.fullName}</TableCell>
                                    <TableCell className="MuiTableCell-root">{employee.email}</TableCell>
                                    <TableCell className="MuiTableCell-root">{employee.check}</TableCell>

                                    <TableCell className="MuiTableCell-root">{formatDate(employee.createdAt)}</TableCell>
                                    <TableCell sx={{ borderRadius: "0px 8px 8px 0px", }} className="MuiTableCell-root">
                                        <Box sx={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                                           <CustomButton 
                                           border='1px solid #FFA100'
                                          ButtonText='Block'
                                          color='white'
                                          width={"98px"}
                                          borderRadius='6px'
                                          buttonStyle={{height : "39px"}}
                                          
                                          />
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            {/* <EditSauceModal
            open={open}
            handleClose={() => {
              setOpen(false);
            }}
          /> */}
          {/* <SnackAlert
            message={snackAlertData.message}
            severity={snackAlertData.severity}
            open={snackAlertData.open}
            handleClose={() => {
              setSnackAlertData((prev) => ({ ...prev, open: false }));
            }}
          /> */}
        </Box>
    );
}

export default UserManagement;

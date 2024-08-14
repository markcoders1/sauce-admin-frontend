import React, { useState, useEffect } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Tabs, Tab } from '@mui/material';
import { styled } from '@mui/system';
import SearchIcon from '../../assets/SearchIcon.png';
import "./SauceManagement.css"; // Import the CSS file for custom styles
import CustomButton from '../../Components/CustomButton/CustomButton';
import { useNavigate } from 'react-router-dom';
import EditIcon from '../../assets/EditIcon.png'; // Adjust path as needed
import SauceIcon from '../../assets/sauceImg.png'; // Adjust path as needed
import axios from 'axios';
import PageLoader from '../../Components/Loader/PageLoader';
import SnackAlert from '../../Components/SnackAlert/SnackAlert';
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

const SauceManagement = () => {
    const [snackAlertData, setSnackAlertData] = useState({
        open: false,
        message: "",
        severity: "success"
      });
    const navigate = useNavigate();
    const [loading  ,setLoading] = useState(false)


    const [allSauce, setAllSauce] = useState([]);

    const fetchSauce = async () => {
        setLoading(true)
        try {
            const response = await axios({
                url: "https://sauced-backend.vercel.app/api/get-sauces?type=all",
                method: "get",
                headers: {
                    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmEzZTgyYTVkY2FlY2IyNGI4Nzc4YjkiLCJpYXQiOjE3MjIwMTc4MzQsImV4cCI6MTcyNzIwMTgzNH0.jAigSu6rrFjBiJjBKlvShm0--WNo-0YgaJXq6eW_QlU`
                },
                // params: {
                //     type : "all"
                // }
            });
            console.log(response);
            setAllSauce(response?.data?.sauces || []);
            setLoading(false)
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    useEffect(()=>{
        fetchSauce()
    },[])


    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (event) => {
        setSearchTerm(event?.target?.value);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = date.toLocaleString('default', { month: 'long' });
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    };

    const filteredEmployees = allSauce.filter(employee =>
        employee?.owner?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleNavigateToEdit = (id) => {
        navigate(`/edit-sauce-details/${id}`);
    };


    return (

        <>
        {
            loading ? (
                <PageLoader/>
            ) : (
        <Box>
            <Box sx={{
                display: "flex",
                justifyContent: "space-between",
                p: {
                    sm: "0px 20px 0px 20px",
                    xs: "0px 0px 0px 0px"
                },
                alignItems: {
                    md:"center",
                    xs:"start"
                },
                flexDirection:{
                    md:"row",
                    xs:"column"
                },
                position:"relative",
                gap:"20px"
            }}>
                <Typography sx={{
                    color: "white",
                    fontWeight: "600",
                    fontSize: {
                        sm: "45px",
                        xs: "40px"
                    },
                    fontFamily: "Fira Sans !important",
                }}>
                    Sauce Management
                </Typography>

                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem" }}>
                    <Box sx={{ position: "relative", width: "300px" }}>
                        <input
                            type="search"
                            name="search"
                            id="search"
                            className="search-input"
                            placeholder="Search"
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
                    <Box>
                        <CustomButton
                            border='1px solid #FFA100'
                            ButtonText='Add Sauce+'
                            color='white'
                            width={"178px"}
                            borderRadius='8px'
                            background='linear-gradient(90deg, #FFA100 0%, #FF7B00 100%)'
                            padding='10px 0px'
                            fontSize='18px'
                            fontWeight='600'
                            onClick={() => navigate("/add-sauce")}
                        />
                    </Box>
                </Box>
            </Box>

            <Box sx={{ mt: "30px", padding: "0px 20px", minWidth:"700px" }}>
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
                                    fontSize: "21px",
                                    textAlign: "start",
                                    borderRadius: "8px 0px 0px 8px",
                                    color: "white",
                                    paddingLeft:"40px"
                                }}>Image</TableCell>
                                <TableCell sx={{
                                    fontWeight: "500",
                                    padding: "12px 0px",
                                    fontSize: "21px",
                                    textAlign: "start",
                                    color: "white",
                                       paddingLeft:"40px"
                                }} className="MuiTableCell-root-head">Brand Name</TableCell>
                                <TableCell sx={{
                                    fontWeight: "500",
                                    padding: "12px 0px",
                                    fontSize: "21px",
                                    textAlign: "start",
                                    color: "white",
                                     paddingLeft:"40px"
                                    
                                }} className="MuiTableCell-root-head">Sauce Name</TableCell>
                                <TableCell sx={{
                                    fontWeight: "500",
                                    padding: "12px 0px",
                                    fontSize: "21px",
                                    textAlign: "start",
                                    color: "white",
                                     paddingLeft:"40px"
                                }} className="MuiTableCell-root-head">Upload Date</TableCell>
                                <TableCell sx={{
                                    fontWeight: "500",
                                    padding: "12px 0px",
                                    fontSize: "21px",
                                    textAlign: "start",
                                    borderRadius: "0px 8px 8px 0px",
                                    color: "white",
                                     paddingLeft:"40px"
                                }} className="MuiTableCell-root-head">Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody className="MuiTableBody-root">
                            {filteredEmployees.map((sauce, index) => (
                                <TableRow key={index} sx={{
                                    border: "2px solid #FFA100"
                                }} className="MuiTableRow-root">
                                    <TableCell sx={{ borderRadius: "8px 0px 0px 8px", color: "white", textAlign:"start !important", paddingLeft:"40px !important" }} className="MuiTableCell-root">
                                        <img src={sauce.bannerImage} alt="Sauce" style={{ width: '90px', height: '100%', borderRadius: '8px' , objectFit:"contain"}} />
                                    </TableCell>
                                    <TableCell sx={{textAlign:"start !important", paddingLeft:"40px !important"}} className="MuiTableCell-root">{sauce.owner.name}</TableCell>
                                    <TableCell sx={{textAlign:"start !important", paddingLeft:"40px !important"}} className="MuiTableCell-root">{sauce.name}</TableCell>
                                    <TableCell sx={{textAlign:"start !important", paddingLeft:"40px !important"}} className="MuiTableCell-root">{formatDate(sauce.owner.date)}</TableCell>
                                    <TableCell sx={{textAlign:"start !important", paddingLeft:"40px !important"}} sx={{ borderRadius: "0px 8px 8px 0px", }} className="MuiTableCell-root">
                                        <Box sx={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                                            <img onClick={() => handleNavigateToEdit(sauce._id)} src={EditIcon} alt="Edit" style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>

            )
        }
        </>

    );
}

export default SauceManagement;

import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Tabs, Tab } from '@mui/material';
import { styled } from '@mui/system';
import SearchIcon from '../../assets/SearchIcon.png';
import "./BrandManagement.css"; // Import the CSS file for custom styles
import CustomButton from '../../Components/CustomButton/CustomButton';
import { useNavigate } from 'react-router-dom';
import EditIcon from '../../assets/EditIcon.png'; // Adjust path as needed
import BrandImg from '../../assets/brandimage.png'; // Adjust path as needed
import axios from 'axios';
import PageLoader from '../../Components/Loader/PageLoader';

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
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)
  

    const [searchTerm, setSearchTerm] = useState('');
    const [allBrands, setAllBrands] = useState([])


    const fetchBrands = async () => {
        try {
            setLoading(true)
            const response = await axios({
                url: "https://aws.markcoders.com/sauced-backend/api/admin/get-all-users?type=brand",
                method: "get",
                headers: {
                    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmEzZTgyYTVkY2FlY2IyNGI4Nzc4YjkiLCJpYXQiOjE3MjIwMTc4MzQsImV4cCI6MTcyNzIwMTgzNH0.jAigSu6rrFjBiJjBKlvShm0--WNo-0YgaJXq6eW_QlU`
                }
            });
            console.log(response);
            setAllBrands(response.data.users);
            setLoading(false)
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };
useEffect(()=>{
  fetchBrands()
},[])

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

    const filteredEmployees = allBrands.filter(brand =>
        brand.name.toLowerCase().includes(searchTerm.toLowerCase()) 
    );

    return (
        <>
        {
            loading ? (
                <PageLoader /> 
            ) : (
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
                    Brand Management
                </Typography>

                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem" }}>
                    <Box sx={{ position: "relative", width: "300px" }}>
                        <input
                            type="search"
                            name="search"
                            id="search"
                            className="search-input"
                            placeholder="Search Sauce..."
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
                            ButtonText='Add Brand+'
                            color='white'
                            width={"178px"}
                            borderRadius='8px'
                            background='linear-gradient(90deg, #FFA100 0%, #FF7B00 100%)'
                            padding='10px 0px'
                            fontSize='18px'
                            fontWeight='600'
                            onClick={() => navigate("/add-brand")}
                        />
                    </Box>
                </Box>
            </Box>

            <Box sx={{ mt: "30px", padding: "0px 20px" }}>
                <TableContainer component={Paper} className="MuiTableContainer-root">
                    <Table className="data-table">
                        <TableHead className="MuiTableHead-root">
                            <TableRow
                                sx={{
                                    backgroundColor: "transparent",
                                    padding: "0px",
                                    border:"none"
                                }}
                                  className="header-row"
                            >
                                <TableCell className="MuiTableCell-root-head " sx={{
                                    fontWeight: "500",
                                    padding: "0px 0px",
                                    fontSize: "21px",
                                    textAlign: "center",
                                    borderRadius: "8px 0px 0px 8px",
                                    color: "white",
                                        
                                   
                                }}>Image</TableCell>
                                <TableCell sx={{
                                    fontWeight: "500",
                                    padding: "12px 0px",
                                    fontSize: "21px",
                                    textAlign: "center",
                                    color: "white"
                                }} className="MuiTableCell-root-head">Brand Name</TableCell>
                             
                                <TableCell sx={{
                                    fontWeight: "500",
                                    padding: "12px 0px",
                                    fontSize: "21px",
                                    textAlign: "center",
                                    color: "white"
                                }} className="MuiTableCell-root-head">Upload Date</TableCell>
                                <TableCell sx={{
                                    fontWeight: "500",
                                    padding: "12px 0px",
                                    fontSize: "21px",
                                    textAlign: "center",
                                    borderRadius: "0px 8px 8px 0px",
                                    color: "white"
                                }} className="MuiTableCell-root-head">Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody className="MuiTableBody-root">
                            {filteredEmployees.map((brand, index) => (
                                <TableRow key={index} sx={{
                                    border: "2px solid #FFA100"
                                }} className="MuiTableRow-root">
                                    <TableCell sx={{ borderRadius: "8px 0px 0px 8px", color: "white" }} className="MuiTableCell-root">
                                        <img src={brand.image} alt="Sauce" style={{ width: '80px', height: '50px', borderRadius: '8px' , objectFit:"contain"}} />
                                    </TableCell>
                                    <TableCell className="MuiTableCell-root">{brand.name}</TableCell>
                                    <TableCell className="MuiTableCell-root">{formatDate(brand.date)}</TableCell>
                                    <TableCell sx={{ borderRadius: "0px 8px 8px 0px", }} className="MuiTableCell-root">
                                        <Box sx={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                                            <img src={EditIcon} alt="Edit" style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
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

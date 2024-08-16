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
import { useSelector } from 'react-redux';


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
    const brandInfo = useSelector(state => state.brand);
    const auth = useSelector(state => state.auth)
    console.log(brandInfo)

    const fetchBrands = async () => {
        try {
            setLoading(true)
            const response = await axios({
                url: "https://aws.markcoders.com/sauced-backend/api/admin/get-all-users?type=brand",
                method: "get",
                headers: {
                    Authorization: `Bearer ${auth.accessToken}`
                }
            });
            setAllBrands(response?.data?.users || []);
            setLoading(false)
            console.log(response?.data?.users)
        } catch (error) {
            console.error('Error fetching users:', error);
            setLoading(false)
        }
    };

    useEffect(() => {
        fetchBrands();
    }, []);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth() is zero-based
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
    };
    const filteredEmployees = allBrands.filter(brand =>
        brand.name.toLowerCase().includes(searchTerm.toLowerCase()) 
    );

    const handleNavigate = (id) => {
        navigate(`/admin/specific-brand-management/${id}`);
    }

    const navigateToEdit = (id) => {
        navigate(`/admin/edit-brand-details/${id}`)
    }
    return (
        <>
            {loading ? (
                <PageLoader />
            ) : (
                <Box>
                    <Box sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        p: { sm: "0px 20px 0px 20px", xs: "0px 0px 0px 0px" },
                        alignItems: { md: "center", xs: "start" },
                        flexDirection: { md: "row", xs: "column" },
                        gap: "20px"
                    }}>
                        <Typography sx={{
                            color: "white",
                            fontWeight: "600",
                            fontSize: { sm: "45px", xs: "40px" },
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
                                    ButtonText='Add Brand+'
                                    color='white'
                                    width={"178px"}
                                    borderRadius='8px'
                                    background='linear-gradient(90deg, #FFA100 0%, #FF7B00 100%)'
                                    padding='10px 0px'
                                    fontSize='18px'
                                    fontWeight='600'
                                    onClick={() => navigate("/admin/add-brand")}
                                />
                            </Box>
                        </Box>
                    </Box>

                    <Box sx={{ mt: "30px", padding: {md:"0px 20px", xs:"0px"} }}>
                        <TableContainer component={Paper} className="MuiTableContainer-root" >
                            <Table className="data-table">
                                <TableHead className="MuiTableHead-root">
                                    <TableRow
                                        sx={{
                                            backgroundColor: "transparent",
                                            padding: "0px",
                                            border: "none"
                                        }}
                                        className="header-row"
                                    >
                                        <TableCell className="MuiTableCell-root-head " sx={{
                                            fontWeight: "500",
                                            padding: "0px 0px",
                                            fontSize: "21px",
                                            textAlign: "start",
                                            borderRadius: "8px 0px 0px 8px",
                                            color: "white",
                                            paddingLeft:"50px"

                                        }}>Image</TableCell>
                                        <TableCell sx={{
                                            fontWeight: "500",
                                            padding: "12px 0px",
                                            fontSize: "21px",
                                            textAlign: "start",
                                            color: "white",
                                            paddingLeft:"10px"
                                        }} className="MuiTableCell-root-head">Brand Name</TableCell>
                                        <TableCell sx={{
                                            fontWeight: "500",
                                            padding: "12px 0px",
                                            fontSize: "21px",
                                            textAlign: "start",
                                            color: "white",
                                              paddingLeft:"10px"
                                        }} className="MuiTableCell-root-head">Upload Date</TableCell>
                                        <TableCell sx={{
                                            fontWeight: "500",
                                            padding: "12px 0px",
                                            fontSize: "21px",
                                            textAlign: "center",
                                            borderRadius: "0px 8px 8px 0px",
                                            color: "white",
                                              paddingLeft:"10px"
                                        }} className="MuiTableCell-root-head">Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody className="MuiTableBody-root">
                                    {filteredEmployees.map((brand, index) => (
                                        <TableRow key={index} sx={{
                                            border: "2px solid #FFA100"
                                        }} className="MuiTableRow-root" >
                                            <TableCell sx={{ borderRadius: "8px 0px 0px 8px", color: "white" , paddingLeft:"40px !important", textAlign:"start !important"}} className="MuiTableCell-root">
                                                <img src={brand.image} alt="Sauce" style={{ width: '80px', height: '50px', borderRadius: '8px', objectFit: "contain" }} />
                                            </TableCell>
                                            <TableCell sx={{textAlign:"start !important"}} className="MuiTableCell-root">{brand.name}</TableCell>
                                            <TableCell sx={{textAlign:"start !important"}} className="MuiTableCell-root">{formatDate(brand.date)}</TableCell>
                                            <TableCell sx={{ borderRadius: "0px 8px 8px 0px",textAlign:"start !important" }} className="MuiTableCell-root">
                                                <Box sx={{ display: "flex", gap: "30px",   justifyContent: "center", alignItems:"center" }}>
                                                    <CustomButton
                                                    border='1px solid #FFA100'
                                                    ButtonText={"View Sauces"}
                                                    color='white'
                                                    width={"128px"}
                                                    borderRadius='6px'
                                                    buttonStyle={{ height: "45px" }}
                                                    onClick={() => handleNavigate(brand._id)}
                                                    />
                                                     <img className="edit-icon" src={EditIcon} alt="Edit" style={{ width: '40px', height: '40px', cursor: 'pointer', border: "0 px solid red", borderRadius: "10px", padding: "8px" }} onClick={() => navigateToEdit(brand._id)} />

                                                    
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Box>
            )}
        </>
    );
}

export default SauceManagement;

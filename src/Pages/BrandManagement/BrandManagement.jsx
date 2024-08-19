import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Pagination } from '@mui/material';
import { styled } from '@mui/system';
import SearchIcon from '../../assets/SearchIcon.png';
import "./BrandManagement.css"; // Import the CSS file for custom styles
import CustomButton from '../../Components/CustomButton/CustomButton';
import { useNavigate } from 'react-router-dom';
import EditIcon from '../../assets/EditIcon.png'; // Adjust path as needed
import axios from 'axios';
import PageLoader from '../../Components/Loader/PageLoader';
import { useSelector } from 'react-redux';
import MenuBar from '../../Components/MenuBar/MenuBar';
import logoAdmin from '../../assets/logoAdmin.png';

const appUrl = import.meta.env.VITE_REACT_APP_API_URL;

// Import the Lightbox component
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const BrandManagement = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [allBrands, setAllBrands] = useState([]);
    const [page, setPage] = useState(1); // Current page state
    const [totalPages, setTotalPages] = useState(1); // Total pages state
    const auth = useSelector(state => state.auth);

    // State for lightbox
    const [isOpen, setIsOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');

    const fetchBrands = async (page) => {
        try {
            setLoading(true);
            const response = await axios({
                url: `${appUrl}/admin/get-all-users`,
                method: "get",
                params: {
                    type: "brand",
                    page: page, // Pass current page to backend
                    limit: 8 // Number of items per page
                },
                headers: {
                    Authorization: `Bearer ${auth.accessToken}`
                }
            });
            setAllBrands(response?.data?.users || []);
            setTotalPages(response?.data?.pagination?.totalPages || 1); // Set total pages
            setLoading(false);
            console.log(response)
        } catch (error) {
            console.error('Error fetching brands:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBrands(page); // Fetch data based on the current page
    }, [page]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth() is zero-based
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
    };

    const filteredBrands = allBrands.filter(brand =>
        brand.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleNavigate = (id) => {
        navigate(`/admin/specific-brand-management/${id}`);
    };

    const navigateToEdit = (id) => {
        navigate(`/admin/edit-brand-user-details/${id}`);
    };

    const openLightbox = (imageSrc) => {
        setSelectedImage(imageSrc);
        setIsOpen(true);
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
                        p: { sm: "0px 20px 0px 20px", xs: "0px 0px 0px 0px" },
                        alignItems: { md: "center", xs: "start" },
                        flexDirection: { md: "row", xs: "column" },
                        gap: "20px"
                    }}>
                        <Box sx={{display:"flex", alignItems:"center", justifyContent:"space-between", width:"100%"}} >
                            <Typography sx={{
                                color: "white",
                                fontWeight: "600",
                                fontSize: {
                                    lg: "45px",
                                    sm:"40px",
                                    xs: "30px"
                                },
                                fontFamily: "Fira Sans !important",
                            }}>
                                Brand Management
                            </Typography>
                            <Typography>
                                <MenuBar/>
                            </Typography>
                        </Box>

                        <Box sx={{ display: "flex",flexDirection:{sm:"row" , xs:"column"}, justifyContent: {md:"center", sm:"end"}, alignItems: {sm:"center", xs:"end"}, gap: "1rem",width:{md:"800px", xs:"100%"} }}>
                            <Box sx={{ position: "relative", maxWidth: {sm:"350px", xs:"100%"}, width:"100%" }}>
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
                                    padding='7px 0px'
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
                                            backgroundImage: `linear-gradient(90deg, #FFA100 0%, #FF7B00 100%) !important`,
                                            '&:hover': { 
                                                backgroundImage: `linear-gradient(90deg, #5A3D0A 0%, #5A3D0A 100%) !important`,
                                            },
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
                                    {filteredBrands.map((brand, index) => (
                                        <TableRow key={index} sx={{
                                            border: "2px solid #FFA100"
                                        }} className="MuiTableRow-root" >
                                            <TableCell sx={{ borderRadius: "8px 0px 0px 8px", color: "white", paddingLeft:"40px !important", textAlign:"start !important"}} className="MuiTableCell-root">
                                                <img 
                                                    src={brand.image? brand.image : logoAdmin} 
                                                    alt="Brand" 
                                                    style={{ width: '80px', height: '50px', borderRadius: '8px', objectFit: "contain", cursor:"pointer" }}  
                                                    onClick={() => openLightbox(brand.image)} 
                                                />
                                            </TableCell>
                                            <TableCell sx={{textAlign:"start !important"}} className="MuiTableCell-root">{brand.name}</TableCell>
                                            <TableCell sx={{textAlign:"start !important"}} className="MuiTableCell-root">{formatDate(brand.date)}</TableCell>
                                            <TableCell sx={{ borderRadius: "0px 8px 8px 0px",textAlign:"start !important" }} className="MuiTableCell-root">
                                                <Box sx={{ display: "flex", gap: "30px", justifyContent: "center", alignItems:"center" }}>
                                                    <CustomButton
                                                        border='1px solid #FFA100'
                                                        ButtonText={"View Sauces"}
                                                        color='white'
                                                        width={"128px"}
                                                        borderRadius='6px'
                                                        buttonStyle={{ height: "45px" }}
                                                        onClick={() => handleNavigate(brand._id)}
                                                        hoverBg='linear-gradient(90deg, #2E210A 0%, #2E210A 100%)' 
                                                    />
                                                    <img 
                                                        className="edit-icon" 
                                                        src={EditIcon} 
                                                        alt="Edit" 
                                                        style={{ width: '40px', height: '40px', cursor: 'pointer', border: "0 px solid red", borderRadius: "10px", padding: "8px" }} 
                                                        onClick={() => navigateToEdit(brand._id)} 
                                                    />
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
                                    color: 'black', // Text color
                                    backgroundColor: '#2E210A', // Background color for pagination buttons
                                    border: '2px solid #FFA100', // Border color matching the theme
                                },
                                '& .Mui-selected': {
                                    color: 'white', // Text color for selected page
                                    backgroundColor: '#FFA100', // Background color for selected page
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
                </Box>
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
}

export default BrandManagement;

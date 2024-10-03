import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Pagination } from '@mui/material';
import SearchIcon from '../../assets/SearchIcon.png';
import "./SauceManagement.css";
import CustomButton from '../../Components/CustomButton/CustomButton';
import { useLocation, useNavigate } from 'react-router-dom';
import EditIcon from '../../assets/EditIcon.png';
import axios from 'axios';
import PageLoader from '../../Components/Loader/PageLoader';
import { useSelector } from 'react-redux';
import MenuBar from '../../Components/MenuBar/MenuBar';
import logoAdmin from '../../assets/logoAdmin.png';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import queryString from 'query-string'; // Import query-string library
import { debounce } from 'lodash';

const appUrl = import.meta.env.VITE_REACT_APP_API_URL;

const SauceManagement = () => {
    const [loading, setLoading] = useState(false);
    const [allSauce, setAllSauce] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [page, setPage] = useState(1);
    const [itemsPerPage] = useState(8); // Set items per page
    const [searchTerm, setSearchTerm] = useState('');
    const auth = useSelector(state => state.auth);
    const location = useLocation(); 
    const navigate = useNavigate();
    const [inputValue, setInputValue] = useState('');


    // State for lightbox
    const [isOpen, setIsOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');

    const fetchSauce = async (page, searchTerm = '') => {
        setLoading(true);
        try {
            const response = await axios({
                url: `${appUrl}/search-sauces`,
                method: "get",
                headers: {
                    Authorization: `Bearer ${auth.accessToken}`
                },
                params: {
                    limit: itemsPerPage,
                    page: page,
                    searchTerm: searchTerm,  
                },
            });
            setAllSauce(response?.data?.sauces || []);
            setTotalPages(response?.data?.pagination?.totalPages || 1);
            setLoading(false);
            console.log(response);
        } catch (error) {
            console.error('Error fetching sauces:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        const parsed = queryString.parse(location.search);
        const currentPage = parsed.page ? parseInt(parsed.page, 10) : 1;
        setPage(currentPage);
        fetchSauce(currentPage, searchTerm);
    }, [location.search, searchTerm]);

    // Debounce search input
    const debouncedSearch = useCallback(
        debounce((value) => {
            navigate(`${location.pathname}?page=1`);  // Reset to page 1 for new search
            setSearchTerm(value);
            
        }, 2000), 
        []
    );

    const handleSearchChange = (event) => {
        const value = event.target.value;
        setInputValue(value); // Update input field immediately
        debouncedSearch(value); // Debounce the search term update
        setPage(1); // Reset to first page on new search
    };

      // Handle pagination change
      const handlePageChange = useCallback((event, value) => {
        setPage(value);
        navigate(`${window.location.pathname}?page=${value}`);
    }, [navigate]);


    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
    };

    const handleNavigateToEdit = (id) => {
        navigate(`/admin/edit-sauce-details/${id}`);
    };

    const openLightbox = (imageSrc) => {
        setSelectedImage(imageSrc);
        setIsOpen(true);
    };

    // const handlePageChange = (event, value) => {
    //     navigate(`${location.pathname}?page=${value}`);
    // };

    return (
        <>
            {/* {
                loading ? (
                    <PageLoader />
                ) : ( */}
                    <Box>
                        <Box sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            p: {
                                sm: "0px 20px 0px 20px",
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
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }} >
                                <Typography sx={{
                                    color: "white",
                                    fontWeight: "600",
                                    fontSize: {
                                        lg: "45px",
                                        sm: "40px",
                                        xs: "30px"
                                    },
                                    fontFamily: "Fira Sans !important",
                                }}>
                                    Sauce Management
                                </Typography>
                                <Typography>
                                    <MenuBar />
                                </Typography>
                            </Box>

                            <Box sx={{ display: "flex", flexDirection: { sm: "row", xs: "column" }, justifyContent: { md: "center", sm: "end" }, alignItems: { sm: "center", xs: "end" }, gap: "1rem", width: { md: "800px", xs: "100%" } }}>
                                <Box sx={{ position: "relative", maxWidth: { sm: "350px", xs: "100%" }, width: "100%" }}>
                                    <input
                                        type="search"
                                        name="search"
                                        id="search"
                                        className="search-input"
                                        placeholder="Search"
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
                                <Box sx={{
                                    width:{sm:"200px", xs:"100%"}
                                }} >
                                    <CustomButton
                                        border='1px solid #FFA100'
                                        ButtonText='Add Sauce+'
                                        color='white'
                                        width={"100%"}
                                        borderRadius='8px'
                                        background='linear-gradient(90deg, #FFA100 0%, #FF7B00 100%)'
                                        padding='7px 0px'
                                        fontSize='18px'
                                        fontWeight='600'
                                        onClick={() => navigate("/admin/add-sauce")}
                                    />
                                </Box>
                            </Box>
                        </Box>

                        {
                            loading ? <PageLoader /> :
                            (

                          
                        <Box sx={{ mt: "30px", padding: { sm: "0px 20px", xs: "0px" }, }}>
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
                                                paddingLeft: {
                                                    md: "40px",
                                                    xs: "20px"
                                                }
                                            }}>Image</TableCell>
                                            <TableCell sx={{
                                                fontWeight: "500",
                                                padding: "12px 0px",
                                                fontSize: {
                                                    sm: "21px",
                                                    xs: "16px"
                                                },
                                                textAlign: "start",
                                                color: "white",
                                                paddingLeft: "8px"
                                            }} className="MuiTableCell-root-head">Brand Name</TableCell>
                                            <TableCell sx={{
                                                fontWeight: "500",
                                                padding: "12px 0px",
                                                fontSize: {
                                                    sm: "21px",
                                                    xs: "16px"
                                                },
                                                textAlign: "start",
                                                color: "white",
                                                paddingLeft: "8px"
                                            }} className="MuiTableCell-root-head">Sauce Name</TableCell>
                                            <TableCell sx={{
                                                fontWeight: "500",
                                                padding: "12px 0px",
                                                fontSize: {
                                                    sm: "21px",
                                                    xs: "16px"
                                                },
                                                textAlign: "start",
                                                color: "white"
                                            }} className="MuiTableCell-root-head">Upload Date</TableCell>
                                            <TableCell sx={{
                                                fontWeight: "500",
                                                padding: "12px 0px",
                                                fontSize: {
                                                    sm: "21px",
                                                    xs: "16px"
                                                },
                                                textAlign: "start",
                                                borderRadius: "0px 8px 8px 0px",
                                                color: "white"
                                            }} className="MuiTableCell-root-head">Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody className="MuiTableBody-root">
                                        {allSauce.map((sauce, index) => (
                                            <TableRow key={index} sx={{
                                                border: "2px solid #FFA100"
                                            }} className="MuiTableRow-root">
                                                <TableCell
                                                    sx={{
                                                        borderRadius: "8px 0px 0px 8px",
                                                        color: "white",
                                                        textAlign: "start !important",
                                                        paddingLeft: {
                                                            md: "20px !important",
                                                            xs: "20px !important"
                                                        }
                                                    }}
                                                    className="MuiTableCell-root"
                                                >
                                                    <img
                                                        src={sauce.image ? sauce.image : logoAdmin}
                                                        alt="Sauce"
                                                        style={{ borderRadius: '8px', objectFit: "contain", cursor: 'pointer' }}
                                                        onClick={() => openLightbox(sauce.image)}
                                                        className='image-inside-rows'
                                                    />
                                                </TableCell>
                                                <TableCell sx={{ textAlign: "start !important" }} className="MuiTableCell-root">{sauce?.owner?.name}</TableCell>
                                                <TableCell sx={{ textAlign: "start !important" }} className="MuiTableCell-root">{sauce?.name}</TableCell>
                                                <TableCell sx={{ textAlign: "start !important" }} className="MuiTableCell-root">{formatDate(sauce?.createdAt)}</TableCell>
                                                <TableCell sx={{ textAlign: "start !important", borderRadius: "0px 8px 8px 0px" }} className="MuiTableCell-root">
                                                    <Box sx={{ display: "flex", gap: "10px", justifyContent: "start" }}>
                                                        <img className="edit-icon" src={EditIcon} alt="Edit" style={{ width: '40px', height: '40px', cursor: 'pointer', border: "0 px solid red", borderRadius: "10px", padding: "8px" }} onClick={() => handleNavigateToEdit(sauce._id)} />
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                        )
                    }

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
                
                    </Box>

                {/* )
            } */}

            {/* Lightbox component */}
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

export default SauceManagement;

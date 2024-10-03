import React, { useCallback, useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Pagination } from '@mui/material';
import { styled } from '@mui/system';
import SearchIcon from '../../assets/SearchIcon.png';
import "./EventsManagement.css"; // Import the CSS file for custom styles
import CustomButton from '../../Components/CustomButton/CustomButton';
import { useNavigate } from 'react-router-dom';
import EditIcon from '../../assets/EditIcon.png'; // Adjust path as needed
import PageLoader from '../../Components/Loader/PageLoader';
import axios from 'axios';
import MenuBar from '../../Components/MenuBar/MenuBar';
import { useSelector } from 'react-redux';
import logoAdmin from '../../assets/logoAdmin.png';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import queryString from 'query-string'; // Import query-string library
import { debounce } from 'lodash';


const appUrl = import.meta.env.VITE_REACT_APP_API_URL;

const EventsManagement = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [allEvents, setAllEvents] = useState([]);
    const [page, setPage] = useState(1); // Current page state
    const [totalPages, setTotalPages] = useState(1); // Total pages state
    const [searchTerm, setSearchTerm] = useState('');
    const auth = useSelector(state => state.auth);
    const [inputValue, setInputValue] = useState('');


    // State for lightbox
    const [isOpen, setIsOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');

    const fetchEvents = async (page) => {
        setLoading(true);
        try {
            const response = await axios({
                url: `${appUrl}/admin/get-all-events`,
                method: "get",
                params: {
                    page: page, // Pass current page to backend
                    limit: 8 ,// Number of items per page
                    searchTerm : searchTerm,
                },
                headers: {
                    Authorization: `Bearer ${auth.accessToken}`
                }
            });
            setAllEvents(response?.data?.events);
            setTotalPages(response?.data?.pagination?.totalPages || 1); // Set total pages
            setLoading(false);
            console.log(response)
        } catch (error) {
            console.error('Error fetching events:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        const parsed = queryString.parse(window.location.search);
        const currentPage = parsed.page ? parseInt(parsed.page, 10) : 1;
        setPage(currentPage);
        fetchEvents(currentPage);
    }, [window.location.search, searchTerm]);

    const debouncedSearch = useCallback(
        debounce((value) => {
            navigate(`${location.pathname}?page=1`);  // Reset to page 1 for new search
            setSearchTerm(value);
            
        }, 2000), 
        []
    );



    // Handle search input change
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

    function formatDate(isoString) {
        const date = new Date(isoString);
        const options = { year: 'numeric', month: 'short', day: '2-digit' };
        return date.toLocaleDateString('en-US', options)
                   .replace(/,/, '')
                   .toLowerCase()
                   .replace(/\s/g, '-');
      }

    const filteredEvents = allEvents.filter(event =>
        event?.eventName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event?.owner.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleNavigateToEdit = (id) => {
        navigate(`/admin/edit-event-details/${id}`);
    };

    const openLightbox = (imageSrc) => {
        setSelectedImage(imageSrc);
        setIsOpen(true);
    };

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
                                        lg: "45px",
                                        sm:"40px",
                                        xs: "30px"
                                    },
                                    fontFamily: "Fira Sans !important",
                                }}>
                                    Events Management
                                </Typography>
                                <Typography>
                                    <MenuBar/>
                                </Typography>
                            </Box>

                            <Box sx={{ display: "flex",flexDirection:{sm:"row" , xs:"column"}, justifyContent: {md:"center", sm:"end"}, alignItems: {sm:"center", xs:"end"}, gap: "1rem",width:{md:"700px", xs:"100%"} }}>
                                <Box sx={{ position: "relative", maxWidth: {sm:"350px", xs:"100%"}, width:"100%" }}>
                                    <input
                                        type="search"
                                        name="search"
                                        id="search"
                                        className="search-input"
                                        placeholder="Search Event..."
                                        value={inputValue}
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
                                <Box
                                sx={{width:{sm:"200px", xs:"100%"}}}
                                >
                                    <CustomButton
                                        border='1px solid #FFA100'
                                        ButtonText='Add Event+'
                                        color='white'
                                        width={"100%"}
                                        borderRadius='8px'
                                        background='linear-gradient(90deg, #FFA100 0%, #FF7B00 100%)'
                                        padding='7px 0px'
                                        fontSize='18px'
                                        fontWeight='600'
                                        onClick={() => navigate("/admin/add-event")}
                                    />
                                </Box>
                            </Box>
                        </Box>

                        <Box sx={{ mt: "30px", padding: {md:"0px 20px" , xs:"0px"}}}>
                            <TableContainer component={Paper} className="MuiTableContainer-root" >
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
                                                padding: "0px 20px",
                                                fontSize: {
                                                    sm: "21px",
                                                    xs: "16px"
                                                },
                                                textAlign: "start",
                                                borderRadius: "8px 0px 0px 8px",
                                                color: "white",
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
                                                pl:"10px"
                                            }} className="MuiTableCell-root-head">Events Name</TableCell>
                                            <TableCell sx={{
                                                fontWeight: "500",
                                                padding: "12px 0px",
                                                fontSize: {
                                                    sm: "21px",
                                                    xs: "16px"
                                                },
                                                textAlign: "start",
                                                color: "white"
                                            }} className="MuiTableCell-root-head">Organized By</TableCell>
                                            <TableCell sx={{
                                                fontWeight: "500",
                                                padding: "12px 0px",
                                                fontSize: {
                                                    sm: "21px",
                                                    xs: "16px"
                                                },
                                                textAlign: "start",
                                                color: "white",
                                                pl:"5px"
                                            }} className="MuiTableCell-root-head">Destination</TableCell>
                                            <TableCell sx={{
                                                fontWeight: "500",
                                                padding: "12px 0px",
                                                fontSize: {
                                                    sm: "21px",
                                                    xs: "16px"
                                                },
                                                textAlign: "center",
                                                color: "white",
                                                // paddingLeft:"1"
                                            }} className="MuiTableCell-root-head">Start Date</TableCell>
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
                                        {filteredEvents.map((event, index) => (
                                            <TableRow key={index} sx={{
                                                border: "2px solid #FFA100"
                                            }} className="MuiTableRow-root">
                                               <TableCell sx={{ borderRadius: "8px 0px 0px 8px !important", color: "white" ,  textAlign:"start !important"}} className="MuiTableCell-root">
                                                <img src={event.bannerImage ? event.bannerImage : logoAdmin} alt="Sauce" style={{ width: '80px', height: '50px', borderRadius: '8px !important', objectFit: "contain", cursor:"pointer" }}  onClick={() => openLightbox(event.bannerImage)}  />
                                            </TableCell>
                                                <TableCell sx={{textAlign:"start !important"}} className="MuiTableCell-root">{event.eventName}</TableCell>
                                                <TableCell sx={{textAlign:"start !important"}} className="MuiTableCell-root">{event?.owner?.name}</TableCell>
                                                <TableCell sx={{textAlign:"start !important"}} className="MuiTableCell-root">{event.venueName}</TableCell>
                                                <TableCell className="MuiTableCell-root">{formatDate(event.eventDate)}</TableCell>
                                                <TableCell sx={{ borderRadius: "0px 8px 8px 0px", }} className="MuiTableCell-root">
                                                    <Box sx={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                                                    <img className="edit-icon" src={EditIcon} alt="Edit" style={{ width: '40px', height: '40px', cursor: 'pointer', border: "0 px solid red", borderRadius: "10px", padding: "8px" }} onClick={() => handleNavigateToEdit(event._id)}  />
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
                    </Box>
                )
            }

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

export default EventsManagement;

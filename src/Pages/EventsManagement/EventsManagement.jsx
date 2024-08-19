import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Tabs } from '@mui/material';
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


const appUrl = import.meta.env.VITE_REACT_APP_API_URL;



// Import the Lightbox component
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

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

const EventsManagement = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [allEvents, setAllEvents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const auth = useSelector(state => state.auth);


    // State for lightbox
    const [isOpen, setIsOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');
    
    const fetchEvents = async () => {
        setLoading(true);
        try {
            const response = await axios({
                url: `${appUrl}/admin/get-all-events`,
                method: "get",
                headers: {
                    Authorization: `Bearer ${auth.accessToken}`
                }
            });
            setAllEvents(response?.data?.events || []);
            setLoading(false);
            console.log(response)
        } catch (error) {
            console.error('Error fetching events:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp * 1000); // Convert Unix timestamp to milliseconds
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
    };
    

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
                                        ButtonText='Add Event+'
                                        color='white'
                                        width={"178px"}
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
                                                // paddingLeft:{sm:"4px", xs:"70px"}
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
                                                color: "white"
                                            }} className="MuiTableCell-root-head">Destination</TableCell>
                                            <TableCell sx={{
                                                fontWeight: "500",
                                                padding: "12px 0px",
                                                fontSize: {
                                                    sm: "21px",
                                                    xs: "16px"
                                                },
                                                textAlign: "center",
                                                color: "white"
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
                                                <TableCell sx={{textAlign:"start !important"}} className="MuiTableCell-root">{event.owner.name}</TableCell>
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

import React, { useState, useEffect } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import SearchIcon from '../../assets/SearchIcon.png';
import "./SauceManagement.css";
import CustomButton from '../../Components/CustomButton/CustomButton';
import { useNavigate } from 'react-router-dom';
import EditIcon from '../../assets/EditIcon.png';
import axios from 'axios';
import PageLoader from '../../Components/Loader/PageLoader';
import SnackAlert from '../../Components/SnackAlert/SnackAlert';
import { useSelector } from 'react-redux';
import MenuBar from '../../Components/MenuBar/MenuBar';

// Import the Lightbox component
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const SauceManagement = () => {
    const [snackAlertData, setSnackAlertData] = useState({
        open: false,
        message: "",
        severity: "success"
    });
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [allSauce, setAllSauce] = useState([]);
    const auth = useSelector(state => state.auth);

    // State for lightbox
    const [isOpen, setIsOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');

    const fetchSauce = async () => {
        setLoading(true);
        try {
            const response = await axios({
                url: "https://aws.markcoders.com/sauced-backend/api/get-sauces?type=all",
                method: "get",
                headers: {
                    Authorization: `Bearer ${auth.accessToken}`
                },
            });
            setAllSauce(response?.data?.sauces || []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching events:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSauce();
    }, []);

    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (event) => {
        setSearchTerm(event?.target?.value);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
    };

    const filteredEmployees = allSauce.filter(employee =>
        employee?.owner?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleNavigateToEdit = (id) => {
        navigate(`/admin/edit-sauce-details/${id}`);
    };

    const openLightbox = (imageSrc) => {
        setSelectedImage(imageSrc);
        setIsOpen(true);
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
                                Sauce Management
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
                                        ButtonText='Add Sauce+'
                                        color='white'
                                        width={"178px"}
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

                        <Box sx={{ mt: "30px", padding: {sm: "0px 20px", xs:"0px"},}}>
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
                                                    md:"40px",
                                                    xs:"20px"
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
                                                color: "white"
                                            }} className="MuiTableCell-root-head">Brand Name</TableCell>
                                            <TableCell sx={{
                                                fontWeight: "500",
                                                padding: "12px 0px",
                                                fontSize: {
                                                    sm: "21px",
                                                    xs: "16px"
                                                },
                                                textAlign: "start",
                                                color: "white"
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
                                        {filteredEmployees.map((sauce, index) => (
                                            <TableRow key={index} sx={{
                                                border: "2px solid #FFA100"
                                            }} className="MuiTableRow-root">
                                                <TableCell 
                                                    sx={{ borderRadius: "8px 0px 0px 8px", color: "white", textAlign: "start !important",  paddingLeft: {
                                                    md:"20px !important",
                                                    xs:"20px !important"
                                                } }} 
                                                    className="MuiTableCell-root"
                                                >
                                                    <img 
                                                        src={sauce.bannerImage} 
                                                        alt="Sauce" 
                                                        style={{ width: '90px', height: '60px', borderRadius: '8px', objectFit: "contain", cursor: 'pointer' }} 
                                                        onClick={() => openLightbox(sauce.bannerImage)}
                                                    />
                                                </TableCell>
                                                <TableCell sx={{ textAlign: "start !important" }} className="MuiTableCell-root">{sauce.owner.name}</TableCell>
                                                <TableCell sx={{ textAlign: "start !important" }} className="MuiTableCell-root">{sauce.name}</TableCell>
                                                <TableCell sx={{ textAlign: "start !important" }} className="MuiTableCell-root">{formatDate(sauce.owner.date)}</TableCell>
                                                <TableCell sx={{ textAlign: "start !important", borderRadius: "0px 8px 8px 0px" }} className="MuiTableCell-root">
                                                    <Box sx={{ display: "flex", gap: "10px", justifyContent: "start" }}>
                                                        <img className="edit-icon" src={EditIcon} alt="Edit" style={{ width: '40px', height: '40px', cursor: 'pointer', border: "0 px solid red", borderRadius: "10px", padding: "8px" }} onClick={()=> handleNavigateToEdit(sauce._id)} />
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

export default SauceManagement;

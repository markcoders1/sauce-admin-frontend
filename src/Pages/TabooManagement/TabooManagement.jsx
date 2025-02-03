import React, { useState, useEffect } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Tabs, Tab, Pagination, Tooltip } from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import queryString from 'query-string'; // Import query-string library
import SearchIcon from '../../assets/SearchIcon.png';
import "./TabooManagement.css";
import CustomButton from '../../Components/CustomButton/CustomButton';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import MenuBar from '../../Components/MenuBar/MenuBar';
import logoAdmin from '../../assets/logoAdmin.png';
import PageLoader from '../../Components/Loader/PageLoader';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css"; // Import the CSS for the lightbox
import EditIcon from '../../assets/EditIcon.png'
import loadingGIF from "../../assets/loading.gif";
import ConfirmDeleteModalSauce from '../../Components/DeleteSaucModal/DeleteSauceModal';
import DeleteIcon from "../../assets/deleteIcon.png";

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

const TabooManagement = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();
    const [isSearchBarLoading, setSearchBarLoading] = useState(false)
    const [loading, setLoading] = useState(false);
    const [brands, setBrands] = useState([]);
    const [brandName, setBrandName] = useState('');
    const [totalPages, setTotalPages] = useState(1);
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');
    const [reviewToDelete, setReviewToDelete] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const dispatch = useDispatch();
    const auth = useSelector(state => state.auth);
    const handleOpenDeleteModal = (id) => {
        setReviewToDelete(id);
        setDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setReviewToDelete(null);
        setDeleteModalOpen(false);
    };

    const fetchBrands = async (currentPage) => {
        try {
            setLoading(true);
            const response = await axios({
                url: `${appUrl}/admin/brand-sauces/${id}`,
                method: "get",
                params: {
                    page: currentPage,
                    limit: 8, // Assuming you want to fetch 8 items per page
                },
                headers: {
                    Authorization: `Bearer ${auth.accessToken}`
                }
            });
            console.log(response)
            setBrands(response?.data?.sauces || []);
            setTotalPages(response?.data?.pagination?.totalPages || 1);
            const firstBrand = response?.data?.sauces[0]?.owner.name;
            setBrandName(firstBrand);
            setLoading(false);
            setSearchBarLoading(false)
        } catch (error) {
            console.error('Error fetching brands:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        const parsed = queryString.parse(location.search);
        const currentPage = parsed.page ? parseInt(parsed.page, 10) : 1;
        setPage(currentPage);
        fetchBrands(currentPage);
    }, [location.search, searchTerm]);

    const handleSearchChange = (event) => {
        setSearchBarLoading(true)
        setSearchTerm(event.target.value);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
    };

    const filteredBrands = brands.filter(brand =>
        brand.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleNavigate = () => {
        navigate(`/admin/add-specific-sauce/${id}`);
    };

    const handleNavigateToEditSauce = (sauceId) => {
        navigate(`/admin/edit-sauce-details/${sauceId}`);
    };

    const handlePageChange = (event, value) => {
        navigate(`${location.pathname}?page=${value}`);
    };

    const openLightbox = (imageSrc) => {
        setSelectedImage(imageSrc);
        setIsOpen(true);
    };
    const handleNavigateToEdit = (id) => {
        navigate(`/admin/edit-sauce-details/${id}`);
    };

    return (
        <>
            {/* {loading ? (
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
                        alignItems: "center",
                        flexDirection: {
                            md: "row",
                            xs: "column"
                        },
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
                                {brandName}
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
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                />
                                {
                                    isSearchBarLoading ?
                                        <img
                                            src={loadingGIF}
                                            alt="loading"
                                            style={{
                                                width: "30px",

                                                position: "absolute",
                                                top: "8px",
                                                right: "15px",
                                            }}
                                        />
                                        :
                                        <img
                                            src={SearchIcon}
                                            alt="Search"
                                            style={{
                                                position: "absolute",
                                                top: "14px",
                                                right: "20px",
                                            }}
                                        />
                                }
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
                                    onClick={handleNavigate}
                                />
                            </Box>
                        </Box>
                    </Box>

                    {filteredBrands.length === 0 ? (
                        <Typography sx={{ textAlign: "center", fontWeight: "600", mt: 4, fontSize: "1.5rem", color: "#FFA100" }}>
                            Sauce not found
                        </Typography>
                    ) : (
                        <Box sx={{ mt: "30px", padding: { md: "0px 20px", xs: "0px" } }}>
                            {
                                  loading?<PageLoader />:

                            <TableContainer component={Paper} className="MuiTableContainer-root">
                                <Table className="data-table">
                                    <TableHead className="MuiTableHead-root">
                                        <TableRow
                                            sx={{
                                                backgroundImage: `linear-gradient(90deg, #FFA100 0%, #FF7B00 100%) !important`,
                                                // '&:hover': { 
                                                //     backgroundImage: `linear-gradient(90deg, #5A3D0A 0%, #5A3D0A 100%) !important`,
                                                // },
                                                padding: "0px",
                                            }}
                                            className="header-row"
                                        >
                                            <TableCell className="MuiTableCell-root-head" sx={{
                                                fontWeight: "500",
                                                padding: "0px 20px 0px 40px",
                                                fontSize: {
                                                    sm: "21px",
                                                    xs: "16px"
                                                },
                                                textAlign: "center",
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
                                                pl: "10px"
                                            }} className="MuiTableCell-root-head">Sauce Name</TableCell>
                                            <TableCell sx={{
                                                fontWeight: "500",
                                                padding: "12px 0px",
                                                fontSize: {
                                                    sm: "21px",
                                                    xs: "16px"
                                                },
                                                textAlign: "center",
                                                color: "white",
                                                pl:"10px"
                                            }} className="MuiTableCell-root-head">Featured</TableCell>
                                            <TableCell sx={{
                                                     textAlign: "center !important",
                                                fontWeight: "500",
                                                padding: "12px 0px",
                                                fontSize: {
                                                    sm: "21px",
                                                    xs: "16px"
                                                },
                                                color: "white",
                                                pl: "10px"
                                            }} className="MuiTableCell-root-head">Check-ins</TableCell>
                                            <TableCell sx={{
                                                     textAlign: "center !important",
                                                fontWeight: "500",
                                                padding: "12px 0px",
                                                fontSize: {
                                                    sm: "21px",
                                                    xs: "16px"
                                                },
                                                color: "white",
                                                pl: "10px"
                                            }} className="MuiTableCell-root-head">Reviews</TableCell>
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
                                        {filteredBrands.map((sauce, index) => (
                                            <TableRow key={index} sx={{
                                                border: "2px solid #FFA100"
                                            }} className="MuiTableRow-root">
                                                <TableCell sx={{ borderRadius: "8px 0px 0px 8px", color: "white", ml: { md: "20px", xs: "10px" } }} className="MuiTableCell-root">
                                                    <img
                                                        src={sauce.image ? sauce.image : logoAdmin}
                                                        style={{ width: '80px', height: '50px', borderRadius: '8px', cursor: 'pointer', objectFit: "contain" }}
                                                        onClick={() => openLightbox(sauce.image)}
                                                    />
                                                </TableCell>
                                                <TableCell sx={{ textAlign: "start !important" }} className="MuiTableCell-root">{sauce.name}</TableCell>
                                                <TableCell sx={{ textAlign: "center !important" }} className="MuiTableCell-root">{sauce.isFeatured?"YES" :"NO"}</TableCell>
                                                <Tooltip title="View All Check-ins ">

                                                    <TableCell
                                                        onClick={() => navigate(`/admin/sauce-checkin/${sauce._id}`)}
                                                        sx={{
                                                            textAlign: "center !important",

                                                            textDecoration: "underline !important",
                                                            color: "#FFA100 !important",
                                                            cursor: "pointer",
                                                        }}
                                                        className="MuiTableCell-root"
                                                    >
                                                        {sauce.checkIn}
                                                    </TableCell>
                                                </Tooltip>

                                                <Tooltip title="View All  Reviews">

                                                    <TableCell
                                                        onClick={() => navigate(`/admin/sauce-reviews/${sauce._id}`)}

                                                        sx={{
                                                            textAlign: "center !important",
                                                            textDecoration: "underline !important",
                                                            color: "#FFA100 !important",
                                                            cursor: "pointer",
                                                        }}
                                                        className="MuiTableCell-root"
                                                    >
                                                        {sauce.reviewCount}
                                                    </TableCell>
                                                </Tooltip>
                                                <TableCell sx={{ borderRadius: "0px 8px 8px 0px", }} className="MuiTableCell-root">
                                                    <Box sx={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                                                        <img className="edit-icon" src={EditIcon} alt="Edit" style={{ width: '40px', height: '40px', cursor: 'pointer', border: "0 px solid red", borderRadius: "10px", padding: "8px" }} onClick={() => handleNavigateToEditSauce(sauce._id)} />
                                                    <Tooltip title="Delete Sauce">
                                                        <img
                                                            className="edit-icon"

                                                            src={DeleteIcon}
                                                            style={{
                                                                width: "40px",
                                                                height: "40px",
                                                                cursor: "pointer",
                                                                objectFit: "contain",
                                                                borderRadius: "10px",


                                                            }}
                                                            onClick={() => {
                                                                handleOpenDeleteModal(sauce._id);

                                                            }}
                                                            alt="Delete"
                                                        />
                                                    </Tooltip>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            }
                        </Box>
                    )}

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
                                    color: 'black', // Text color for selected page
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
            {/* )} */}
            {/* )
            } */}
            {deleteModalOpen && (
                <ConfirmDeleteModalSauce
                    open={deleteModalOpen}
                    handleClose={handleCloseDeleteModal}
                    reviewId={reviewToDelete} // Pass the review ID here
                    onSuccess={() => {fetchBrands(page, searchTerm)}} // Refresh reviews list after deletion
                />
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

export default TabooManagement;

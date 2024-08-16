import React, { useState , useEffect} from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Tabs, Tab } from '@mui/material';
import { styled } from '@mui/system';
import SearchIcon from '../../assets/SearchIcon.png';
import "./TabooManagement.css";
import CustomButton from '../../Components/CustomButton/CustomButton';
import { useNavigate, useParams } from 'react-router-dom';
import EditIcon from '../../assets/EditIcon.png';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setBrandInfo , clearBrandInfo } from '../../Redux/Slice/brandSlice/brandSlice';
import MenuBar from '../../Components/MenuBar/MenuBar';


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
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [brands, setBrands] = useState([]);
    const [brandName, setBrandName] = useState([]);
    const dispatch = useDispatch();
    const auth = useSelector(state=> state.auth)

    const [searchTerm, setSearchTerm] = useState('');

    const fetchBrands = async () => {
        try {
            setLoading(true);
            const response = await axios({
                url: `https://aws.markcoders.com/sauced-backend/api/admin/brand-sauces/${id}`,
                method: "get",
                headers: {
                    Authorization: `Bearer ${auth.accessToken}`
                }
            });
            setBrands(response?.data?.sauces || []);
            const firstBrand = response?.data?.sauces[0]?.owner.name;
            setBrandName(firstBrand);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching brands:', error);  
            setLoading(false);
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
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
    };

    const filteredBrands = brands.filter(brand =>
        brand.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleNavigate = () => {
        navigate(`/admin/add-specific-sauce/${id}`)
    }

    const handleNavigateToEditSauce = (id) => {
        navigate(`/admin/edit-sauce-details/${id}`)
    }


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
                flexDirection: {
                    md: "row",
                    xs: "column"
                },
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
                               {brandName}
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
                            onClick={handleNavigate}
                        />
                    </Box>
                </Box>
            </Box>

            <Box sx={{ mt: "30px", padding: {md:"0px 20px", xs:"0px"} }}>
                <TableContainer component={Paper} className="MuiTableContainer-root">
                    <Table className="data-table">
                        <TableHead className="MuiTableHead-root">
                            <TableRow
                                sx={{
                                    backgroundImage: `linear-gradient(90deg, #FFA100 0%, #FF7B00 100%) !important`,

                                    '&:hover': { 
                                        backgroundImage: `linear-gradient(90deg, #5A3D0A 0%, #5A3D0A 100%) !important`,
                                    },
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
                                    textAlign: "start",
                                    borderRadius: "8px 0px 0px 8px",
                                    color: "white"
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
                                }} className="MuiTableCell-root-head">Upload Date</TableCell>
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
                            {filteredBrands.map((brand, index) => (
                                <TableRow key={index} sx={{
                                    border: "2px solid #FFA100"
                                }} className="MuiTableRow-root">
                                    <TableCell sx={{ borderRadius: "8px 0px 0px 8px", color: "white", ml:{md:"20px", xs:"10px"} }} className="MuiTableCell-root">
                                        <img src={brand.image} alt="Sauce" style={{ width: '80px', height: '50px', borderRadius: '8px' }} />
                                    </TableCell>
                                    <TableCell sx={{textAlign:"start !important"}} className="MuiTableCell-root">{brand.name}</TableCell>
                                    <TableCell sx={{textAlign:"start !important"}} className="MuiTableCell-root">{formatDate(brand.createdAt)}</TableCell>
                                    <TableCell sx={{ borderRadius: "0px 8px 8px 0px", }} className="MuiTableCell-root">
                                        <Box sx={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                                        <img className="edit-icon" src={EditIcon} alt="Edit" style={{ width: '40px', height: '40px', cursor: 'pointer', border: "0 px solid red", borderRadius: "10px", padding: "8px" }} onClick={()=> handleNavigateToEditSauce(brand._id)} />
                                            
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    );
}

export default TabooManagement;

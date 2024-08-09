// import React, { useEffect, useState } from 'react';
// import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper , Tabs} from '@mui/material';
// import { styled } from '@mui/system';
// import SearchIcon from '../../assets/SearchIcon.png';
// import "./HasnainBhaiTable.css"; // Import the CSS file for custom styles
// import CustomButton from '../../Components/CustomButton/CustomButton';
// import axios from 'axios';
// import PageLoader from '../../Components/Loader/PageLoader'

// const StyledTabs = styled(Tabs)({
//     '& .MuiTabs-indicator': {
//         backgroundColor: 'black',
//     },
// });

// const StyledTab = styled((props) => <Tab {...props} />)(({ theme }) => ({
//     textTransform: 'none',
//     minWidth: 72,
//     fontWeight: theme.typography,
//     marginRight: theme.spacing(4),
//     color: '#9B9B9B',
//     fontSize: '22px',
//     '&.Mui-selected': {
//         color: 'black',
//     },
//     '&.Mui-focusVisible': {
//         backgroundColor: '#d1eaff',
//     },
// }));

// const HasnainBhaiTable = () => {
//     const [allUsers, setAllUsers] = useState([]);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [loading, setLoading] = useState(false);

//     const fetchUsers = async () => {
//         try {
//             setLoading(true)
//             const response = await axios({
//                 url: "https://sauced-backend.vercel.app/api/admin/get-all-users",
//                 method: "get",
//                 headers: {
//                     Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmEzZTgyYTVkY2FlY2IyNGI4Nzc4YjkiLCJpYXQiOjE3MjIwMTc4MzQsImV4cCI6MTcyNzIwMTgzNH0.jAigSu6rrFjBiJjBKlvShm0--WNo-0YgaJXq6eW_QlU`
//                 }
//             });
//             console.log(response);
//             setAllUsers(response.data.users);
//             setLoading(false)
//         } catch (error) {
//             console.error('Error fetching users:', error);
//         }
//     };

//     const toggleBlock = async (userId) => {
//         console.log(userId)
//         try {
//             const response = await axios({
//                 url: "https://sauced-backend.vercel.app/api/admin/block-unblock-user",
//                 method: "post",
//                 headers: {
//                     Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmEzZTgyYTVkY2FlY2IyNGI4Nzc4YjkiLCJpYXQiOjE3MjIwMTc4MzQsImV4cCI6MTcyNzIwMTgzNH0.jAigSu6rrFjBiJjBKlvShm0--WNo-0YgaJXq6eW_QlUz`
//                 },
//                 data: { 
//                     userId : userId
//                 }
//             });
//             console.log(response);
//             setAllUsers(prevUsers =>
//                 prevUsers.map(user =>
//                     user._id === userId ? { ...user, status: user.status === 'active' ? 'blocked' : 'active' } : user
//                 )
//             );
//         } catch (error) {
//             console.error('Error toggling block status:', error);
//         }
//     };

//     useEffect(() => {
//         fetchUsers();
//     }, []);

//     const handleSearchChange = (event) => {
//         setSearchTerm(event.target.value);
//     };

//     const formatDate = (dateString) => {
//         const date = new Date(dateString);
//         const day = String(date.getDate()).padStart(2, "0");
//         const month = date.toLocaleString('default', { month: 'long' });
//         const year = date.getFullYear();
//         return `${day} ${month} ${year}`;
//     };

//     const filteredUsers = allUsers.filter(user =>
//         (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
//         (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
//     );

//     return (
//         <>
//         {
//             loading ? (
//                 <PageLoader />
//             ) : (
//                 <Box>
//                     <Box sx={{
//                         display: "flex",
//                         justifyContent: "space-between",
//                         p: {
//                             sm: "0px 20px 0px 20px",
//                             xs: "0px 0px 0px 0px"
//                         },
//                         alignItems: "center",
//                     }}>
//                         <Typography sx={{
//                             color: "white",
//                             fontWeight: "600",
//                             fontSize: {
//                                 sm: "45px",
//                                 xs: "26px"
//                             },
//                             fontFamily: "Fira Sans !important",
//                         }}>
//                             Hasnain Bhai
//                         </Typography>

//                         <Box sx={{ position: "relative", width: "300px" }}>
//                             <input
//                                 type="search"
//                                 name="search"
//                                 id="search"
//                                 className="search-input"
//                                 placeholder="Search User..."
//                                 value={searchTerm}
//                                 onChange={handleSearchChange}
//                             />
//                             <img
//                                 src={SearchIcon}
//                                 alt=""
//                                 style={{
//                                     position: "absolute",
//                                     top: "14px",
//                                     right: "20px",
//                                 }}
//                             />
//                         </Box>
//                     </Box>

//                     <Box sx={{ mt: "30px", padding: "0px 20px" }}>
//                         <TableContainer component={Paper} className="MuiTableContainer-root">
//                             <Table className="data-table">
//                                 <TableHead className="MuiTableHead-root"
//                                 sx={{backgroundColor:"transparent"}}
//                                 >
//                                     <TableRow className="header-row"
//                                      sx={{backgroundColor:"transparent"}}
//                                     >
//                                         <TableCell className="MuiTableCell-root-head" sx={{
//                                             fontWeight: "500",
//                                             padding: "0px 0px",
//                                             fontSize: "18px",
//                                             textAlign: "center",
//                                             borderRadius: "8px 0px 0px 8px",
//                                             color: "white",
//                                             backgroundColor:"#37475A !important"
//                                         }}>Full Name</TableCell>
//                                         <TableCell sx={{
//                                             fontWeight: "500",
//                                             padding: "12px 0px",
//                                             fontSize: "18px",
//                                             textAlign: "center",
//                                             color: "white",
//                                              backgroundColor:"#37475A !important"
//                                         }} className="MuiTableCell-root-head">Email</TableCell>
//                                         <TableCell sx={{
//                                             fontWeight: "500",
//                                             padding: "12px 0px",
//                                             fontSize: "18px",
//                                             textAlign: "center",
//                                             color: "white",
//                                              backgroundColor:"#37475A !important"
//                                         }} className="MuiTableCell-root-head">Check-Ins</TableCell>
//                                         <TableCell sx={{
//                                             fontWeight: "500",
//                                             padding: "12px 0px",
//                                             fontSize: "18px",
//                                             textAlign: "center",
//                                             color: "white",
//                                              backgroundColor:"#37475A !important"
//                                         }} className="MuiTableCell-root-head">Joining Date</TableCell>
//                                         <TableCell sx={{
//                                             fontWeight: "500",
//                                             padding: "12px 0px",
//                                             fontSize: "18px",
//                                             textAlign: "center",
//                                             borderRadius: "0px 8px 8px 0px",
//                                             color: "white",
//                                              backgroundColor:"#37475A !important",
//                                              border:"none !important"
//                                         }} className="MuiTableCell-root-head">Action</TableCell>
//                                     </TableRow>
//                                 </TableHead>
//                                 <TableBody className="MuiTableBody-root">
//                                     {filteredUsers.map((user, index) => (
//                                         <TableRow key={index} className="MuiTableRow-root">
//                                             <TableCell sx={{ borderRadius: "8px 0px 0px 8px", color: "white" }} className="MuiTableCell-root">{user.name}</TableCell>
//                                             <TableCell className="MuiTableCell-root">{user.email}</TableCell>
//                                             <TableCell className="MuiTableCell-root">{user.checkins}</TableCell>
//                                             <TableCell className="MuiTableCell-root">{formatDate(user.date)}</TableCell>
//                                             <TableCell sx={{ borderRadius: "0px 8px 8px 0px", }} className="MuiTableCell-root">
//                                                 <Box sx={{ display: "flex", gap: "10px", justifyContent: "center" }}>
//                                                     <CustomButton
//                                                         border='1px solid #FFA100'
//                                                         ButtonText={user.status === 'active' ? 'Block' : 'Unblock'}
//                                                         color='white'
//                                                         width={"98px"}
//                                                         borderRadius='6px'
//                                                         buttonStyle={{ height: "39px" }}
//                                                         onClick={() => toggleBlock(user._id)}
//                                                     />
//                                                 </Box>
//                                             </TableCell>
//                                         </TableRow>
//                                     ))}
//                                 </TableBody>
//                             </Table>
//                         </TableContainer>
//                     </Box>
//                 </Box>
//             )
//         }
//         </>
//     );
// }

// export default HasnainBhaiTable;
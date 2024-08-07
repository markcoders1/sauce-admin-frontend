import React, { useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Tabs, Tab } from '@mui/material';
import { styled } from '@mui/system';
import SearchIcon from '../../assets/SearchIcon.png';
import "./EventsManagement.css"; // Import the CSS file for custom styles
import CustomButton from '../../Components/CustomButton/CustomButton';
import { useNavigate } from 'react-router-dom';
import EditIcon from '../../assets/EditIcon.png'; // Adjust path as needed
import EventsImg from '../../assets/EventsImg.png'; // Adjust path as needed

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
    const staticEvents = [
        { eventName: "Lorem Event", organizedBy: "Emma Williams", destination: "Lorem Hall", startDate: "2023-07-22" },
        { eventName: "Lorem Event", organizedBy: "Emma Williams", destination: "Lorem Hall", startDate: "2023-07-22" },
        { eventName: "Lorem Event", organizedBy: "Emma Williams", destination: "Lorem Hall", startDate: "2023-07-22" },
        { eventName: "Lorem Event", organizedBy: "Emma Williams", destination: "Lorem Hall", startDate: "2023-07-22" },
        { eventName: "Lorem Event", organizedBy: "Emma Williams", destination: "Lorem Hall", startDate: "2023-07-22" },
        { eventName: "Lorem Event", organizedBy: "Emma Williams", destination: "Lorem Hall", startDate: "2023-07-22" },
        { eventName: "Lorem Event", organizedBy: "Emma Williams", destination: "Lorem Hall", startDate: "2023-07-22" },
        { eventName: "Lorem Event", organizedBy: "Emma Williams", destination: "Lorem Hall", startDate: "2023-07-22" },
        { eventName: "Lorem Event", organizedBy: "Emma Williams", destination: "Lorem Hall", startDate: "2023-07-22" },
        { eventName: "Lorem Event", organizedBy: "Emma Williams", destination: "Lorem Hall", startDate: "2023-07-22" },
        { eventName: "Lorem Event", organizedBy: "Emma Williams", destination: "Lorem Hall", startDate: "2023-07-22" },
        { eventName: "Lorem Event", organizedBy: "Emma Williams", destination: "Lorem Hall", startDate: "2023-07-22" },
    ];

    const [searchTerm, setSearchTerm] = useState('');

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

    const filteredEvents = staticEvents.filter(event =>
        event.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.organizedBy.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                    Events Management
                </Typography>

                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem" }}>
                    <Box sx={{ position: "relative", width: "300px" }}>
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
                            padding='10px 0px'
                            fontSize='18px'
                            fontWeight='600'
                            onClick={() => navigate("/add-event")}
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
                                    padding: "0px"
                                }}
                                  className="header-row"
                            >
                                <TableCell className="MuiTableCell-root-head" sx={{
                                    fontWeight: "500",
                                    padding: "0px 0px",
                                    fontSize: "21px",
                                    textAlign: "center",
                                    borderRadius: "8px 0px 0px 8px",
                                    color: "white"
                                }}>Image</TableCell>
                                <TableCell sx={{
                                    fontWeight: "500",
                                    padding: "12px 0px",
                                    fontSize: "21px",
                                    textAlign: "center",
                                    color: "white"
                                }} className="MuiTableCell-root-head">Events Name</TableCell>
                                <TableCell sx={{
                                    fontWeight: "500",
                                    padding: "12px 0px",
                                    fontSize: "21px",
                                    textAlign: "center",
                                    color: "white"
                                }} className="MuiTableCell-root-head">Organized By</TableCell>
                                <TableCell sx={{
                                    fontWeight: "500",
                                    padding: "12px 0px",
                                    fontSize: "21px",
                                    textAlign: "center",
                                    color: "white"
                                }} className="MuiTableCell-root-head">Destination</TableCell>
                                <TableCell sx={{
                                    fontWeight: "500",
                                    padding: "12px 0px",
                                    fontSize: "21px",
                                    textAlign: "center",
                                    color: "white"
                                }} className="MuiTableCell-root-head">Start Date</TableCell>
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
                            {filteredEvents.map((event, index) => (
                                <TableRow key={index} sx={{
                                    border: "2px solid #FFA100"
                                }} className="MuiTableRow-root">
                                    <TableCell sx={{ borderRadius: "8px 0px 0px 8px", color: "white" }} className="MuiTableCell-root">
                                        <img src={EventsImg} alt="Event" style={{ width: '80px', height: '50px', borderRadius: '8px' }} />
                                    </TableCell>
                                    <TableCell className="MuiTableCell-root">{event.eventName}</TableCell>
                                    <TableCell className="MuiTableCell-root">{event.organizedBy}</TableCell>
                                    <TableCell className="MuiTableCell-root">{event.destination}</TableCell>
                                    <TableCell className="MuiTableCell-root">{formatDate(event.startDate)}</TableCell>
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
    );
}

export default EventsManagement;

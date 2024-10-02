import { Box } from '@mui/material';
import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../Components/Header/Header';
import backgroundImg1 from '../assets/backgroundImg1-min.webp';
import AppSidebar from '../Pages/AppSidebar/AppSidebar';
import LogoutButton from '../Components/Logout/Logout';
import MobileSidebar from '../Pages/AppSidebar/MobileSidebar';

const DashboardLayout = () => {
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(prevState => !prevState);
  };

  const getHeaderTitle = (pathname) => {
    switch (pathname) {
      case '/':
        return 'User Management';
      case '/user-management':
        return 'User Management';
      case '/sauce-management':
        return 'Sauce Management';
      case '/add-sauce':
        return 'Add Sauce';
      default:
        return '';
    }
  }

  const headerTitle = getHeaderTitle(location.pathname);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        backgroundImage: `url(${backgroundImg1})`,
        backgroundColor: "black",
        minHeight: '100vh',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundAttachment: "fixed",
        padding: {
          sm: "0px 10px",
          xs: "10px 10px"
        },
        boxSizing: 'border-box',
        m: "0px",
        
      }}
    >
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box',
        gap: {
          md:"1rem",sx:"0px"
        }
        }}
      >
         <MobileSidebar />
        <Box
          sx={{
            mt: "15px",
            width: {
              xl: isSidebarOpen ? '320px' : '65px',
              md: isSidebarOpen ? '320px' : '55px',
            }, // Adjust width based on sidebar state
            position: 'fixed', // Fixed position
            maxHeight: "100%",
            minHeight: "96%",
            zIndex: 1,
            display: {
              xs: 'none',
              md: 'block',
            },
            alignItems:"start",
            justifyContent:"center",
            borderRadius: "15px",
            background: 'linear-gradient(90deg, #FFA100 100%, #FF7B00 100%)',
            transition: 'width 0.3s ease-in-out', // Smooth transition for width change
            gap:"10rem" }}
        >
          <Box>
            <AppSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} /> 
          </Box>
          <Box sx={{
            position:"absolute", bottom:".5rem",
            ml:{xs:isSidebarOpen ? "12px":" 8px" , xl:"15px" },
            display: "flex", // Ensure the text appears next to the button
            alignItems: "center",
          }} >
            <LogoutButton isSidebarOpen={isSidebarOpen} /> 
          </Box>
        </Box>
        <Box>
         
        </Box>
        <Box
          sx={{
            marginLeft: {
              md: isSidebarOpen ? '300px' : '20px', // Adjust margin based on sidebar state
              xs: '0px',
            },
            width: '100%',
            maxWidth: '100%',
            padding: {
              md: '20px',
              xs: '0px 0px',
            },
            boxSizing: 'border-box',
            overflowY: 'hidden', // Enable scrolling for the main content
            transition: 'margin-left 0.3s ease-in-out', // Smooth transition for margin change
          }}
        >
          <Box sx={{ mt: "20px" }}>
            <Outlet />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;

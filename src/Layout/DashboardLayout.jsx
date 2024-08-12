import { Box } from '@mui/material';
import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../Components/Header/Header';
// import SnackAlert from '../Components/SnackAlert/SnackAlert';
// import { useSelector } from 'react-redux';
import backgroundImg1 from '../assets/backgroundImg1.png';
import AppSidebar from '../Pages/AppSidebar/AppSidebar';

const DashboardLayout = () => {
  const location = useLocation();
  // const snackAlert = useSelector(state => state.snackAlert);

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
          sm: "0px 0px",
          xs: "10px 10px"
        },
        boxSizing: 'border-box',
        m: "0px"
      }}
    >
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          maxWidth: '1440px',
          boxSizing: 'border-box',
          gap: "1rem"
        }}
      >
        <Box
          sx={{
            mt: "15px",
            width: isSidebarOpen ? '300px' : '80px', // Adjust width based on sidebar state
            position: 'fixed', // Fixed position
            maxHeight: "900px",
            minHeight: "900px",
            zIndex: 1,
            display: {
              xs: 'none',
              lg: 'block',
            },
            borderRadius: "15px",
            background: 'linear-gradient(90deg, #FFA100 100%, #FF7B00 100%)',
            transition: 'width 0.3s ease-in-out' // Smooth transition for width change
          }}
        >
          <AppSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        </Box>
        <Box>
          {/* <MobileSidebar /> */}
        </Box>
        <Box
          sx={{
            marginLeft: {
              lg: isSidebarOpen ? '270px' : '50px', // Adjust margin based on sidebar state
              xs: '0px',
            },
            width: '100%',
            maxWidth: '1340px',
            padding: {
              sm: '20px',
              xs: '0px 0px',
            },
            borderRadius: '30px',
            boxSizing: 'border-box',
            overflowY: 'hidden', // Enable scrolling for the main content
            transition: 'margin-left 0.3s ease-in-out', // Smooth transition for margin change
          }}
        >
          {/* <Header title={headerTitle} /> */}
          <Box sx={{ mt: "20px" }}>
            <Outlet />
          </Box>
        </Box>
      </Box>
      {/* <SnackAlert open={snackAlert.open} message={snackAlert.message} severity={snackAlert.severity} /> */}
    </Box>
  );
};

export default DashboardLayout;

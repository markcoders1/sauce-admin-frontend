import { Box } from '@mui/material';
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../Components/Header/Header';
// import SnackAlert from '../Components/SnackAlert/SnackAlert';
// import { useSelector } from 'react-redux';
import backgroundImg1 from '../assets/backgroundImg1.png';

const DashboardLayout = () => {
  const location = useLocation();
  // const snackAlert = useSelector(state => state.snackAlert);

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
        backgroundColor:"black",
        minHeight: '100vh',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundAttachment: "fixed",
        padding: {
          sm: "20px 30px",
          xs: "10px 10px"
        },
        boxSizing: 'border-box',
        m:"0px"
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
            width: {
              lg: '120px',
              xs: '0px', // Hidden on smaller screens
            },
            position: 'fixed', // Fixed position
            height: '100%',
            zIndex: 1,
            display: {
              xs: 'none',
              lg: 'block',
            },
          }}
        >
          {/* <AppSidebar /> */}
        </Box>
        <Box>
          {/* <MobileSidebar /> */}
        </Box>
        <Box
          sx={{
            marginLeft: {
              lg: '120px', // Adjust to match fixed sidebar width
              xs: '0px',
            },
            width: '100%',
            maxWidth: '1340px',
            padding: {
              sm: '20px',
              xs: '30px 12px',
            },
            
            borderRadius: '30px',
            boxSizing: 'border-box',
            overflowY: 'auto', // Enable scrolling for the main content
            // border: "2px solid red",
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

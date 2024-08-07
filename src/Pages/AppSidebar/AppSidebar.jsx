import React from 'react';
import { Box, Typography } from '@mui/material';
import { NavLink } from 'react-router-dom';
import './AppSidebar.css'; // Add styles for active and default states
import hambergImg from '../../assets/hamberger.png';

const AppSidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '4rem',
        justifyContent: 'center',
        mt: '40px',
        p: '1px 7px',
        // width: isOpen ? '200px' : '80px', // Adjust width based on isOpen
        transition: 'width 0.3s ease-in-out',
      
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '50px',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Box
          sx={{
            borderRadius: '12px',
            backgroundColor: 'white',
            width: '50px',
            height: '50px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer' // Add pointer cursor
          }}
          onClick={toggleSidebar} // Toggle sidebar on click
        >
          <img src={hambergImg} alt="" />
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.4rem',
            alignItems: isOpen ? 'flex-start' : 'center' // Align items based on isOpen
          }}
        >
          <Typography>
            <NavLink
              to="/user-management"
              className={({ isActive }) =>
                isActive ? 'anchortag anchorActive' : 'anchortag'
              }
            >
              U
            </NavLink>
          </Typography>
          <Typography>
            <NavLink
              to="/brand-management"
              className={({ isActive }) =>
                isActive ? 'anchortag anchorActive' : 'anchortag'
              }
            >
              B
            </NavLink>
          </Typography>
          <Typography>
            <NavLink
              to="/events-management"
              className={({ isActive }) =>
                isActive ? 'anchortag anchorActive' : 'anchortag'
              }
            >
              E
            </NavLink>
          </Typography>
          <Typography>
            <NavLink
              to="/sauce-management"
              className={({ isActive }) =>
                isActive ? 'anchortag anchorActive' : 'anchortag'
              }
            >
              S
            </NavLink>
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '5px',
          justifyContent: 'center',
        }}
      >
        <Typography
          sx={{
            fontWeight: '600',
            fontSize: '1.9rem',
            color: '#ffff',
          }}
        >
          {/* {username} */}
        </Typography>
        <Typography
          sx={{
            fontWeight: '400',
            fontSize: '1.1rem',
            color: '#a49ab7',
          }}
        >
          {/* {email} */}
        </Typography>
        <Typography
          sx={{
            marginTop: '10px',
          }}
        >
          {/* <Logout /> */}
        </Typography>
      </Box>
    </Box>
  );
};

export default AppSidebar;

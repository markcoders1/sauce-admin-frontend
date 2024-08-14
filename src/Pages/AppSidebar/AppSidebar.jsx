import React from 'react';
import { Box, Typography } from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
import './AppSidebar.css';
import hambergImg from '../../assets/hamberger.png';
import icon1 from '../../assets/icons-01.png';
import icon2 from '../../assets/icons-02.png';
import icon3 from '../../assets/icons-03.png';
import icon4 from '../../assets/icons-04.png';

const AppSidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  
  const handleNavigate = (nav) => {
    navigate(nav);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '4rem',
        justifyContent: 'center',
        mt: '40px',
        p: '1px 7px',
        transition: 'width 0.3s ease-in-out',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '50px',
          justifyContent: 'center',
          alignItems: 'center',
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
            cursor: 'pointer',
          }}
          onClick={toggleSidebar}
        >
          <img src={hambergImg} alt="Toggle Sidebar" />
        </Box>
        
        {/* Sidebar Content when Open */}
        <Box
          sx={{
            opacity: isOpen ? 1 : 0,
            visibility: isOpen ? 'visible' : 'hidden',
            transform: isOpen ? 'translateX(0)' : 'translateX(-500%)',
            transition: 'opacity .5s ease, transform .8s ease, visibility 1s ease',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            overflow: 'hidden',
          }}
        >
          {isOpen && (
            <>
              <NavLink
                to="/user-management"
                className={({ isActive }) =>
                  isActive ? 'active-nav-link' : 'nav-link'
                }
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    p: '5px 5px',
                    borderRadius: '12px',
                  }}
                >
                  <Typography sx={{    borderRadius: '50%',
                  backgroundColor: 'white',
                  width: '50px',
                  height: '50px',display:"flex", justifyContent:"center", alignItems:"center"}} >
                  <img src={icon1} style={{ width: '19px' }} alt="User Management" />
                  </Typography>
                  <Typography>User Management</Typography>
                </Box>
              </NavLink>
              <NavLink
                to="/sauce-management"
                className={({ isActive }) =>
                  isActive ? 'active-nav-link' : 'nav-link'
                }
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    p: '5px 5px',
                    borderRadius: '12px',
                  }}
                >
                  <Typography sx={{    borderRadius: '50%',
                  backgroundColor: 'white',
                  width: '50px',
                  height: '50px',display:"flex", justifyContent:"center", alignItems:"center"}} >
                  <img src={icon3} style={{ width: '19px' }} alt="Sauce Management" />
                  </Typography>
                  <Typography>Sauce Management</Typography>
                </Box>
              </NavLink>
              <NavLink
                to="/brand-management"
                className={({ isActive }) =>
                  isActive ? 'active-nav-link' : 'nav-link'
                }
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    p: '5px 5px',
                    borderRadius: '12px',
                  }}
                >
                  <Typography sx={{    borderRadius: '50%',
                  backgroundColor: 'white',
                  width: '50px',
                  height: '50px',display:"flex", justifyContent:"center", alignItems:"center"}} >
                  <img src={icon2} style={{ width: '19px' }} alt="Brand Management" />
                  </Typography>
                  <Typography>Brand Management</Typography>
                </Box>
              </NavLink>
              <NavLink
                to="/events-management"
                className={({ isActive }) =>
                  isActive ? 'active-nav-link' : 'nav-link'
                }
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    p: '5px 5px',
                    borderRadius: '12px',
                  }}
                >
                  <Typography sx={{    borderRadius: '50%',
                  backgroundColor: 'white',
                  width: '50px',
                  height: '50px',display:"flex", justifyContent:"center", alignItems:"center"}} >
                  <img src={icon4} style={{ width: '19px' }} alt="Events Management" />
                  </Typography>
                  <Typography>Events Management</Typography>
                </Box>
              </NavLink>
            </>
          )}
        </Box>

        {/* Sidebar Content when Closed */}
        <Box
          sx={{
            opacity: !isOpen ? 1 : 0,
            visibility: !isOpen ? 'visible' : 'hidden',
            transform: !isOpen ? 'translateX(0)' : 'translateX(-10%)',
            transition: 'opacity .5s ease, transform .8s ease, visibility 1s ease',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            overflow: 'hidden',
          }}
        >
          {!isOpen && (
            <>
              <Box
                sx={{
                  borderRadius: '50%',
                  backgroundColor: 'white',
                  width: '50px',
                  height: '50px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'pointer',
                  color: 'black',
                  fontWeight: '600',
                }}
                onClick={() => handleNavigate('/user-management')}
              >
                <img src={icon1} style={{ width: '55%', zIndex: '100' }} alt="User Management" />
              </Box>
              <Box
                sx={{
                  borderRadius: '50%',
                  backgroundColor: 'white',
                  width: '50px',
                  height: '50px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'pointer',
                  color: 'black',
                  fontWeight: '600',
                }}
                onClick={() => handleNavigate('/sauce-management')}
              >
                <img src={icon3} style={{ width: '45%', zIndex: '100' }} alt="Sauce Management" />
              </Box>
              <Box
                sx={{
                  borderRadius: '50%',
                  backgroundColor: 'white',
                  width: '50px',
                  height: '50px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'pointer',
                  color: 'black',
                  fontWeight: '600',
                }}
                onClick={() => handleNavigate('/brand-management')}
              >
                <img src={icon2} style={{ width: '55%', zIndex: '100' }} alt="Brand Management" />
              </Box>
              <Box
                sx={{
                  borderRadius: '50%',
                  backgroundColor: 'white',
                  width: '50px',
                  height: '50px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'pointer',
                  color: 'black',
                  fontWeight: '600',
                }}
                onClick={() => handleNavigate('/events-management')}
              >
                <img src={icon4} style={{ width: '50%', zIndex: '100' }} alt="Events Management" />
              </Box>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default AppSidebar;

import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
import './AppSidebar.css';
import hambergImg from '../../assets/hamberger.png';
import logoAdmin from '../../assets/logoAdmin.png';
import crossIcon from '../../assets/crossIcon.png';
import LogoutButton from '../../Components/Logout/Logout';

// When not hovered, these icons will be displayed
import icon1 from '../../assets/icons-01.png';
import icon2 from '../../assets/icons-02.png';
import icon3 from '../../assets/icons-03.png';
import icon4 from '../../assets/icons-04.png';
import icon5 from '../../assets/reviewedMan.png';
import icon6 from '../../assets/icon-05.png';
import icon7 from '../../assets/icon6.png';
import icon8 from '../../assets/icon7.png';





// When hovered, these icons will be displayed
import icon11 from '../../assets/icon11.png';
import icon21 from '../../assets/icon21.png';
import icon31 from '../../assets/icon31.png';
import icon41 from '../../assets/icon41.png';
import icon51 from '../../assets/hovered.png';
import icon61 from '../../assets/icon51.png';
import icon71 from '../../assets/icon61.png';
import icon81 from '../../assets/icon71.png';






const AppSidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const [hoveredIcon, setHoveredIcon] = useState(null);

  const handleNavigate = (nav) => {
    navigate(nav);
  };

  const handleMouseEnter = (icon) => {
    if (!isOpen) {
      setHoveredIcon(icon);
    }
  };

  const handleMouseLeave = () => {
    if (!isOpen) {
      setHoveredIcon(null);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '4rem',
        justifyContent: 'center',
        mt: '20px',
        p: '1px 7px',
        transition: 'width 0.3s ease-in-out',
        position: "relative",
        height: "100%"
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems:"start",
        }}
      >
        <Box
          sx={{
            opacity: isOpen ? 1 : 0,
            visibility: isOpen ? 'visible' : 'hidden',
            transform: isOpen ? 'translateX(0)' : 'translateX(-500%)',
            transition: 'opacity 0.5s ease, transform 0.8s ease, visibility 0.8s ease',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
          }}
        >
          {isOpen && (
            <>
              <Typography className={isOpen ? 'logo-admin' : ''} sx={{ color: "red !important", position: "absolute", top: "-10px", right: "-10px", width: "30px", height: "30px", backgroundColor: "white", display: "flex", justifyContent: "center", alignItems: "center", borderRadius: "5px" }} >
                <img src={crossIcon} alt="" style={{ color: "white", width: "20px", cursor: "pointer" }} onClick={toggleSidebar} />
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  mt: "0px"
                }}
              >
                <img src={logoAdmin} alt=""   className={isOpen ? 'logo-admin logo-admin-width' : ''} />
              </Box>
              <NavLink
                to="/admin/user-management"
                className={({ isActive }) =>
                  isActive ? 'active-nav-link' : 'nav-link'
                } 
                style={{
                  marginTop: "10px"
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    p: '4px 5px',
                    borderRadius: '12px',
                  }}
                >
                  <Typography sx={{ borderRadius: '50%', backgroundColor: 'white', width: '40px', height: '40px', display: "flex", justifyContent: "center", alignItems: "center" }} >
                    <img src={icon1} className='navlink-image1' alt="User Management" />
                  </Typography>
                  <Typography sx={{ fontSize: {xs:"14px", xl:"16px"}, fontWeight: "600", fontFamily: "Montserrat !important" }} >User Management</Typography>
                </Box>
              </NavLink>
              <NavLink
                to="/admin/sauce-management"
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
                  <Typography sx={{ borderRadius: '50%', backgroundColor: 'white',  width: '40px', height: '40px', display: "flex", justifyContent: "center", alignItems: "center" }} >
                    <img src={icon3} className='navlink-image' alt="Sauce Management" />
                  </Typography>
                  <Typography sx={{ fontSize: {xs:"14px", xl:"16px"}, fontWeight: "600", fontFamily: "Montserrat !important" }} >Sauce Management</Typography>
                </Box>
              </NavLink>
              <NavLink
                to="/admin/brand-management"
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
                  <Typography sx={{ borderRadius: '50%', backgroundColor: 'white',  width: '40px', height: '40px', display: "flex", justifyContent: "center", alignItems: "center" }} >
                    <img src={icon2} className='navlink-image1' alt="Brand Management" />
                  </Typography>
                  <Typography sx={{ fontSize: {xs:"14px", xl:"16px"}, fontWeight: "600", fontFamily: "Montserrat !important" }} >Brand Management</Typography>
                </Box>
              </NavLink>
              <NavLink
                to="/admin/events-management"
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
                  <Typography sx={{ borderRadius: '50%', backgroundColor: 'white',  width: '40px', height: '40px', display: "flex", justifyContent: "center", alignItems: "center" }} >
                    <img src={icon4} className='navlink-image1' alt="Events Management" />
                  </Typography>
                  <Typography sx={{ fontSize: {xs:"14px", xl:"16px"}, fontWeight: "600", fontFamily: "Montserrat !important" }} >Events Management</Typography>
                </Box>
              </NavLink>
              <NavLink
                to="/admin/reviews-management"
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
                  <Typography sx={{ borderRadius: '50%', backgroundColor: 'white',  width: '40px', height: '40px',display: "flex", justifyContent: "center", alignItems: "center" }} >
                    <img src={icon5} className='navlink-image2' alt="Events Management" />
                  </Typography>
                  <Typography sx={{ fontSize: {xs:"14px", xl:"16px"}, fontWeight: "600", fontFamily: "Montserrat !important" }} >Video Reviews Management</Typography>
                </Box>
              </NavLink>

              <NavLink
                to="/admin/requested-sauce"
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
                  <Typography sx={{ borderRadius: '50%', backgroundColor: 'white',  width: '40px', height: '40px', display: "flex", justifyContent: "center", alignItems: "center" }} >
                    <img src={icon6} className='navlink-image3' alt="Events Management" />
                  </Typography>
                  <Typography sx={{ fontSize: {xs:"14px", xl:"16px"}, fontWeight: "600", fontFamily: "Montserrat !important" }} >Requested Sauce</Typography>
                </Box>
              </NavLink>
              <NavLink
                to="/admin/badge-management"
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
                  <Typography sx={{ borderRadius: '50%', backgroundColor: 'white',  width: '40px', height: '40px', display: "flex", justifyContent: "center", alignItems: "center" }} >
                    <img src={icon71} className='navlink-image3' alt="Events Management" />
                  </Typography>
                  <Typography sx={{ fontSize: {xs:"14px", xl:"16px"}, fontWeight: "600", fontFamily: "Montserrat !important" }} >Badge Management</Typography>
                </Box>
              </NavLink>
              <NavLink
                to="/admin/store-management"
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
                  <Typography sx={{ borderRadius: '50%', backgroundColor: 'white',  width: '40px', height: '40px',display: "flex", justifyContent: "center", alignItems: "center" }} >
                    <img src={icon81} className='navlink-image3' alt="Events Management" />
                  </Typography>
                  <Typography sx={{ fontSize: {xs:"14px", xl:"16px"}, fontWeight: "600", fontFamily: "Montserrat !important" }} >Store Management</Typography>
                </Box>
              </NavLink>
            </>
          )}
        </Box>

        <Box
          sx={{
            opacity: !isOpen ? 1 : 0,
            visibility: !isOpen ? 'visible' : 'hidden',
            transform: !isOpen ? 'translateX(0)' : 'translateX(-10%)',
            transition: 'opacity 0.8s ease, transform 0.8s ease, visibility 0.8s ease',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            alignItems:"center"
          }}
        >
          {!isOpen && (
            <>
              <Box
                sx={{
                  borderRadius: '12px',
                  backgroundColor: 'white',
                  width: {xl:'50px', xs:'40px'},
                  height: {xl:'50px', xs:'40px'},
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'pointer',
                }}
                onClick={toggleSidebar}
              >
                <img src={hambergImg} alt="Toggle Sidebar" />
              </Box>
              <Box
                sx={{
                  borderRadius: '50%',
                  backgroundColor: hoveredIcon === 'icon1' ? 'rgba(255, 0, 0, 0.6)' : 'white',
                  width: {xl:'50px', xs:'40px'},
                  height: {xl:'50px', xs:'40px'},
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'pointer',
                  color: 'black',
                  fontWeight: '600',
                  boxShadow: hoveredIcon === 'icon1' ? '0px 4px 10px rgba(0, 0, 0, 0.1)' : 'none',
                  transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
                  mt: "50px",
                }}
                onClick={() => handleNavigate('/admin/user-management')}
                onMouseEnter={() => handleMouseEnter('icon1')}
                onMouseLeave={handleMouseLeave}
              >
                <img src={hoveredIcon === 'icon1' ? icon11 : icon1} style={{ width: '55%', zIndex: '100' }} alt="User Management" />
              </Box>
              <Box
                sx={{
                  borderRadius: '50%',
                  backgroundColor: hoveredIcon === 'icon3' ? 'rgba(255, 0, 0, 0.6)' : 'white',
                  width: {xl:'50px', xs:'40px'},
                  height: {xl:'50px', xs:'40px'},
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'pointer',
                  color: 'black',
                  fontWeight: '600',
                  boxShadow: hoveredIcon === 'icon3' ? '0px 4px 10px rgba(0, 0, 0, 0.1)' : 'none',
                  transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
                }}
                onClick={() => handleNavigate('/admin/sauce-management')}
                onMouseEnter={() => handleMouseEnter('icon3')}
                onMouseLeave={handleMouseLeave}
              >
                <img src={hoveredIcon === 'icon3' ? icon21 : icon3} style={{ width: '45%', zIndex: '100' }} alt="Sauce Management" />
              </Box>
              <Box
                sx={{
                  borderRadius: '50%',
                  backgroundColor: hoveredIcon === 'icon2' ? 'rgba(255, 0, 0, 0.6)' : 'white',
                  width: {xl:'50px', xs:'40px'},
                  height: {xl:'50px', xs:'40px'},
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'pointer',
                  color: 'black',
                  fontWeight: '600',
                  boxShadow: hoveredIcon === 'icon2' ? '0px 4px 10px rgba(0, 0, 0, 0.1)' : 'none',
                  transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
                }}
                onClick={() => handleNavigate('/admin/brand-management')}
                onMouseEnter={() => handleMouseEnter('icon2')}
                onMouseLeave={handleMouseLeave}
              >
                <img src={hoveredIcon === 'icon2' ? icon31 : icon2} style={{ width: '55%', zIndex: '100' }} alt="Brand Management" />
              </Box>
              <Box
                sx={{
                  borderRadius: '50%',
                  backgroundColor: hoveredIcon === 'icon4' ? 'rgba(255, 0, 0, 0.6)' : 'white',
                  width: {xl:'50px', xs:'40px'},
                  height: {xl:'50px', xs:'40px'},
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'pointer',
                  color: 'black',
                  fontWeight: '600',
                  boxShadow: hoveredIcon === 'icon4' ? '0px 4px 10px rgba(0, 0, 0, 0.1)' : 'none',
                  transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
                }}
                onClick={() => handleNavigate('/admin/events-management')}
                onMouseEnter={() => handleMouseEnter('icon4')}
                onMouseLeave={handleMouseLeave}
              >
                <img src={hoveredIcon === 'icon4' ? icon41 : icon4} style={{ width: '50%', zIndex: '100' }} alt="Events Management" />
              </Box>
              <Box
                sx={{
                  borderRadius: '50%',
                  backgroundColor: hoveredIcon === 'icon5' ? 'rgba(255, 0, 0, 0.6)' : 'white',
                  width: {xl:'50px', xs:'40px'},
                  height: {xl:'50px', xs:'40px'},
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'pointer',
                  color: 'black',
                  fontWeight: '600',
                  boxShadow: hoveredIcon === 'icon5' ? '0px 4px 10px rgba(0, 0, 0, 0.1)' : 'none',
                  transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
                }}
                onClick={() => handleNavigate('/admin/reviews-management')}
                onMouseEnter={() => handleMouseEnter('icon5')}
                onMouseLeave={handleMouseLeave}
              >
                <img src={hoveredIcon === 'icon5' ? icon51 : icon5} style={{ width: '80%', zIndex: '100' }} alt="Reviews Management" />
              </Box>

              <Box
                sx={{
                  borderRadius: '50%',
                  backgroundColor: hoveredIcon === 'icon6' ? 'rgba(255, 0, 0, 0.6)' : 'white',
                  width: {xl:'50px', xs:'40px'},
                  height: {xl:'50px', xs:'40px'},
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'pointer',
                  color: 'black',
                  fontWeight: '600',
                  boxShadow: hoveredIcon === 'icon6' ? '0px 4px 10px rgba(0, 0, 0, 0.1)' : 'none',
                  transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
                }}
                onClick={() => handleNavigate('/admin/requested-sauce')}
                onMouseEnter={() => handleMouseEnter('icon6')}
                onMouseLeave={handleMouseLeave}
              >
                <img src={hoveredIcon === 'icon6' ? icon61 : icon6} style={{ width: '80%', zIndex: '100' }} alt="Reviews Management" />
              </Box>

              {/* badge and store management
               */}

<Box
                sx={{
                  borderRadius: '50%',
                  backgroundColor: hoveredIcon === 'icon7' ? 'rgba(255, 0, 0, 0.6)' : 'white',
                  width: {xl:'50px', xs:'40px'},
                  height: {xl:'50px', xs:'40px'},
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'pointer',
                  color: 'black',
                  fontWeight: '600',
                  boxShadow: hoveredIcon === 'icon7' ? '0px 4px 10px rgba(0, 0, 0, 0.1)' : 'none',
                  transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
                }}
                onClick={() => handleNavigate('/admin/badge-management')}
                onMouseEnter={() => handleMouseEnter('icon7')}
                onMouseLeave={handleMouseLeave}
              >
                <img src={hoveredIcon === 'icon7' ? icon7 : icon71} style={{ width: '80%', zIndex: '100' }} alt="Reviews Management" />
              </Box>

              <Box
                sx={{
                  borderRadius: '50%',
                  backgroundColor: hoveredIcon === 'icon8' ? 'rgba(255, 0, 0, 0.6)' : 'white',
                  width: {xl:'50px', xs:'40px'},
                  height: {xl:'50px', xs:'40px'},
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'pointer',
                  color: 'black',
                  fontWeight: '600',
                  boxShadow: hoveredIcon === 'icon8' ? '0px 4px 10px rgba(0, 0, 0, 0.1)' : 'none',
                  transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
                }}
                onClick={() => handleNavigate('/admin/store-management')}
                onMouseEnter={() => handleMouseEnter('icon8')}
                onMouseLeave={handleMouseLeave}
              >
                <img src={hoveredIcon === 'icon8' ? icon8 : icon81} style={{ width: '80%', zIndex: '100' }} alt="Reviews Management" />
              </Box>
              
              {/* new management pages */}
              
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default AppSidebar;

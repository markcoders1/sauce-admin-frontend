import React, { useState } from "react";
import { Box, Typography , Tooltip} from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import "./AppSidebar.css";
import hambergImg from "../../assets/hamberger.png";
import logoAdmin from "../../assets/logoAdmin.png";
import crossIcon from "../../assets/crossIcon.png";
import LogoutButton from "../../Components/Logout/Logout";

// When not hovered, these icons will be displayed
import icon1 from "../../assets/icons-01.png";
import icon2 from "../../assets/icons-02.png";
import icon3 from "../../assets/icons-03.png";
import icon4 from "../../assets/icons-04.png";
import icon5 from "../../assets/reviewedMan.png";
import icon6 from "../../assets/icon-05.png";
import icon7 from "../../assets/icon6.png";
import icon8 from "../../assets/icon7.png";
import icon9 from "../../assets/requestedEventyellow.png";
import { Bell } from "lucide-react";
import bellYellowSVG from "../../assets/bell.svg";

// When hovered, these icons will be displayed
import icon11 from "../../assets/icon11.png";
import icon21 from "../../assets/icon21.png";
import icon31 from "../../assets/icon31.png";
import icon41 from "../../assets/icon41.png";
import icon51 from "../../assets/hovered.png";
import icon61 from "../../assets/icon51.png";
import icon71 from "../../assets/icon61.png";
import icon81 from "../../assets/icon71.png";
import icon91 from "../../assets/requestedEvent.png";

const vapid_key = import.meta.env.VAPID_KEY;
import Zoom from '@mui/material/Zoom';
import { logout } from "../../Redux/Slice/UserSlice/UserSlice";

import { toggleSidebar, closeSidebar, openSidebar } from '../../Redux/Slice/sidebarSlice/sidebarSlice';
import logoutpng from '../../assets/logout.png';


import { useDispatch } from 'react-redux';
import LogoutConfirmationModal from "../../Components/LogoutConfirmationModal/LogoutConfirmationModal";


const AppSidebar = ({ isOpen, toggleSidebar }) => {
 
  const [hoveredIcon, setHoveredIcon] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  // const isOpen = useSelector((state) => state.sidebar.isOpen)



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

  const handleLogout = () => {
    dispatch(logout({
        accessToken: null,
        refreshToken: null,
        _id: null,
        username: null,
        email: null,
        createdAt: null,
        updatedAt: null,
        authenticated: false,
        type: null
    }));
    navigate("/");
    localStorage.removeItem("accessToken");
    dispatch(toggleSidebar())
    dispatch(closeSidebar()); 
};

const handleOpenModal = () => setModalOpen(true);
const handleCloseModal = () => setModalOpen(false);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "4rem",
        justifyContent: "center",
        mt: "20px",
        p: "1px 7px",
        transition: "width 0.3s ease-in-out",
        position: "relative",
        height: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "start",
        }}
      >
        <Box
          sx={{
            opacity: isOpen ? 1 : 0,
            visibility: isOpen ? "visible" : "hidden",
            transform: isOpen ? "translateX(0)" : "translateX(-500%)",
            transition:
              "opacity 0.5s ease, transform 0.8s ease, visibility 0.8s ease",
            display: "flex",
            flexDirection: "column",
            gap: "1px",
          }}
        >
          {isOpen && (
            <>
              <Typography
                className={isOpen ? "logo-admin" : ""}
                sx={{
                  color: "red !important",
                  position: "absolute",
                  top: "-10px",
                  right: {xs:"-35px" , xl:"-0px"},
                  width: { xl: "30px", xs: "25px" },
                  height: { xl: "30px", xs: "25px" },
                  backgroundColor: "white",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "5px",
                  cursor:"pointer"
                  
                }}
                onClick={toggleSidebar}
              >
                <img
                  src={crossIcon}
                  alt=""
                  style={{ color: "white", width: "15px", cursor: "pointer" }}
                />
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  mt: "0px",
                }}
              >
                <img
                  src={logoAdmin}
                  alt=""
                  className={isOpen ? "logo-admin logo-admin-width" : ""}
                />
              </Box>
              <NavLink
                to="/admin/user-management"
                className={({ isActive }) =>
                  isActive ? "active-nav-link" : "nav-link"
                }
                style={{
                  marginTop: "10px",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    p: "4px 5px",
                    borderRadius: "12px",
                  }}
                >
                  <Typography
                    sx={{
                      borderRadius: "50%",
                      backgroundColor: "white",
                      width: { xl: "40px", xs: "35px" },
                      height: { xl: "40px", xs: "35px" },
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={icon1}
                      className="navlink-image1"
                      alt="User Management"
                    />
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: { xs: "12px", xl: "15px" },
                      fontWeight: "600",
                      fontFamily: "Montserrat !important",
                    }}
                  >
                    User Management
                  </Typography>
                </Box>
              </NavLink>
              <NavLink
                to="/admin/sauce-management"
                className={({ isActive }) =>
                  isActive ? "active-nav-link" : "nav-link"
                }
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    p: "5px 5px",
                    borderRadius: "12px",
                  }}
                >
                  <Typography
                    sx={{
                      borderRadius: "50%",
                      backgroundColor: "white",
                      width: { xl: "40px", xs: "35px" },
                      height: { xl: "40px", xs: "35px" },
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={icon3}
                      className="navlink-image"
                      alt="Sauce Management"
                    />
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: { xs: "14px", xl: "15px" },
                      fontWeight: "600",
                      fontFamily: "Montserrat !important",
                    }}
                  >
                    Sauce Management
                  </Typography>
                </Box>
              </NavLink>
              <NavLink
                to="/admin/brand-management"
                className={({ isActive }) =>
                  isActive ? "active-nav-link" : "nav-link"
                }
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    p: "5px 5px",
                    borderRadius: "12px",
                  }}
                >
                  <Typography
                    sx={{
                      borderRadius: "50%",
                      backgroundColor: "white",
                      width: { xl: "40px", xs: "35px" },
                      height: { xl: "40px", xs: "35px" },
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={icon2}
                      className="navlink-image1"
                      alt="Brand Management"
                    />
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: { xs: "14px", xl: "15px" },
                      fontWeight: "600",
                      fontFamily: "Montserrat !important",
                    }}
                  >
                    Brand Management
                  </Typography>
                </Box>
              </NavLink>
              <NavLink
                to="/admin/events-management"
                className={({ isActive }) =>
                  isActive ? "active-nav-link" : "nav-link"
                }
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    p: "5px 5px",
                    borderRadius: "12px",
                  }}
                >
                  <Typography
                    sx={{
                      borderRadius: "50%",
                      backgroundColor: "white",
                      width: { xl: "40px", xs: "35px" },
                      height: { xl: "40px", xs: "35px" },
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={icon4}
                      className="navlink-image1"
                      alt="Events Management"
                    />
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: { xs: "14px", xl: "15px" },
                      fontWeight: "600",
                      fontFamily: "Montserrat !important",
                    }}
                  >
                    Events Management
                  </Typography>
                </Box>
              </NavLink>
              <NavLink
                to="/admin/requested-events"
                className={({ isActive }) =>
                  isActive ? "active-nav-link" : "nav-link"
                }
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    p: "5px 5px",
                    borderRadius: "12px",
                  }}
                >
                  <Typography
                    sx={{
                      borderRadius: "50%",
                      backgroundColor: "white",
                      width: { xl: "40px", xs: "35px" },
                      height: { xl: "40px", xs: "35px" },
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={icon9}
                      className="navlink-image1"
                      alt="Events Management"
                    />
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: { xs: "14px", xl: "15px" },
                      fontWeight: "600",
                      fontFamily: "Montserrat !important",
                    }}
                  >
                   Requested Events 
                  </Typography>
                </Box>
              </NavLink>
              <NavLink
                to="/admin/reviews-management"
                className={({ isActive }) =>
                  isActive ? "active-nav-link" : "nav-link"
                }
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    p: "5px 5px",
                    borderRadius: "12px",
                  }}
                >
                  <Typography
                    sx={{
                      borderRadius: "50%",
                      backgroundColor: "white",
                      width: { xl: "40px", xs: "35px" },
                      height: { xl: "40px", xs: "35px" },
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={icon5}
                      className="navlink-image2"
                      alt="Events Management"
                    />
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: { xs: "14px", xl: "15px" },
                      fontWeight: "600",
                      fontFamily: "Montserrat !important",
                    }}
                  >
                    Official Reviews Management
                  </Typography>
                </Box>
              </NavLink>

              <NavLink
                to="/admin/requested-sauce"
                className={({ isActive }) =>
                  isActive ? "active-nav-link" : "nav-link"
                }
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    p: "5px 5px",
                    borderRadius: "12px",
                  }}
                >
                  <Typography
                    sx={{
                      borderRadius: "50%",
                      backgroundColor: "white",
                      width: { xl: "40px", xs: "35px" },
                      height: { xl: "40px", xs: "35px" },
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={icon6}
                      className="navlink-image3"
                      alt="Events Management"
                    />
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: { xs: "14px", xl: "15px" },
                      fontWeight: "600",
                      fontFamily: "Montserrat !important",
                    }}
                  >
                    Requested Sauce
                  </Typography>
                </Box>
              </NavLink>
              <NavLink
                to="/admin/badge-management"
                className={({ isActive }) =>
                  isActive ? "active-nav-link" : "nav-link"
                }
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    p: "5px 5px",
                    borderRadius: "12px",
                  }}
                >
                  <Typography
                    sx={{
                      borderRadius: "50%",
                      backgroundColor: "white",
                      width: { xl: "40px", xs: "35px" },
                      height: { xl: "40px", xs: "35px" },
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={icon71}
                      className="navlink-image3"
                      alt="Events Management"
                    />
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: { xs: "14px", xl: "15px" },
                      fontWeight: "600",
                      fontFamily: "Montserrat !important",
                    }}
                  >
                    Badge Management
                  </Typography>
                </Box>
              </NavLink>
              <NavLink
                to="/admin/store-management"
                className={({ isActive }) =>
                  isActive ? "active-nav-link" : "nav-link"
                }
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    p: "5px 5px",
                    borderRadius: "12px",
                  }}
                >
                  <Typography
                    sx={{
                      borderRadius: "50%",
                      backgroundColor: "white",
                      width: { xl: "40px", xs: "35px" },
                      height: { xl: "40px", xs: "35px" },
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={icon81}
                      className="navlink-image3"
                      alt="Events Management"
                    />
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: { xs: "14px", xl: "15px" },
                      fontWeight: "600",
                      fontFamily: "Montserrat !important",
                    }}
                  >
                    Store Management
                  </Typography>
                </Box>
              </NavLink>

              <NavLink
                to="/admin/notification"
                className={({ isActive }) =>
                  isActive ? "active-nav-link" : "nav-link"
                }
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    p: "5px 5px",
                    borderRadius: "12px",
                  }}
                >
                  <Typography
                    sx={{
                      borderRadius: "50%",
                      backgroundColor: "white",
                      width: { xl: "40px", xs: "35px" },
                      height: { xl: "40px", xs: "35px" },
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={bellYellowSVG}
                      className="navlink-image3"
                      alt="Events Management"
                      style={{
                        width:"50%",
                      }}
                    />
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: { xs: "14px", xl: "15px" },
                      fontWeight: "600",
                      fontFamily: "Montserrat !important",
                    }}
                  >
                   Notifications
                  </Typography>
                </Box>
              </NavLink>
              <NavLink
                onClick={handleOpenModal}
                
                className={({ isActive }) =>
                  isActive ? "nav-link" : " active-nav-link"
                }
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    p: "5px 5px",
                    borderRadius: "12px",
                  }}
                >
                  <Typography
                    sx={{
                      borderRadius: "50%",
                      backgroundColor: "white",
                      width: { xl: "40px", xs: "35px" },
                      height: { xl: "40px", xs: "35px" },
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={logoutpng}
                      className="navlink-image3"
                      alt="Events Management"
                      style={{
                        width:"50%",
                      }}
                    />
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: { xs: "14px", xl: "15px" },
                      fontWeight: "600",
                      fontFamily: "Montserrat !important",
                    }}
                  >
                   Logout
                  </Typography>
                </Box>
              </NavLink>
            </>
          )}
        </Box>

        <Box
          sx={{
            opacity: !isOpen ? 1 : 0,
            visibility: !isOpen ? "visible" : "hidden",
            transform: !isOpen ? "translateX(0)" : "translateX(-10%)",
            transition:
              "opacity 0.8s ease, transform 0.8s ease, visibility 0.8s ease",
            display: "flex",
            flexDirection: "column",
            gap: { xs: "8px", xl: "10px" },
            alignItems: "center",
          }}
        >
          {!isOpen && (
            <>
              <Box
                sx={{
                  borderRadius: "12px",
                  backgroundColor: "white",
                  width: { xl: "50px", xs: "35px" },
                  height: { xl: "50px", xs: "35px" },
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                }}
                onClick={toggleSidebar}
              >
                <img src={hambergImg} alt="Toggle Sidebar" />
              </Box>
              <Tooltip title="User Management"  placement="right" TransitionComponent={Zoom} TransitionProps={{timeout:200}} >
              <Box
                sx={{
                  borderRadius: "50%",
                  backgroundColor:
                    hoveredIcon === "icon1" ? "rgba(255, 0, 0, 0.6)" : "white",
                  width: { xl: "45px", xs: "35px" },
                  height: { xl: "45px", xs: "35px" },
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                  color: "black",
                  fontWeight: "600",
                  boxShadow:
                    hoveredIcon === "icon1"
                      ? "0px 4px 10px rgba(0, 0, 0, 0.1)"
                      : "none",
                  transition:
                    "background-color 0.3s ease, box-shadow 0.3s ease",
                  mt: "15px",
                }}
                onClick={() => handleNavigate("/admin/user-management")}
                onMouseEnter={() => handleMouseEnter("icon1")}
                onMouseLeave={handleMouseLeave}
              >
                <img
                  src={hoveredIcon === "icon1" ? icon11 : icon1}
                  style={{ width: "55%", zIndex: "100" }}
                  alt="User Management"
                />
              </Box>
              </Tooltip>
              <Tooltip title="Sauce Management"  placement="right" TransitionComponent={Zoom} TransitionProps={{timeout:200}} >
              <Box
                sx={{
                  borderRadius: "50%",
                  backgroundColor:
                    hoveredIcon === "icon3" ? "rgba(255, 0, 0, 0.6)" : "white",
                  width: { xl: "45px", xs: "35px" },
                  height: { xl: "45px", xs: "35px" },
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                  color: "black",
                  fontWeight: "600",
                  boxShadow:
                    hoveredIcon === "icon3"
                      ? "0px 4px 10px rgba(0, 0, 0, 0.1)"
                      : "none",
                  transition:
                    "background-color 0.3s ease, box-shadow 0.3s ease",
                }}
                onClick={() => handleNavigate("/admin/sauce-management")}
                onMouseEnter={() => handleMouseEnter("icon3")}
                onMouseLeave={handleMouseLeave}
              >
                <img
                  src={hoveredIcon === "icon3" ? icon21 : icon3}
                  style={{ width: "45%", zIndex: "100" }}
                  alt="Sauce Management"
                />
              </Box>
              </Tooltip>
              <Tooltip title="Brand Management"  placement="right" TransitionComponent={Zoom} TransitionProps={{timeout:200}} >
              <Box
                sx={{
                  borderRadius: "50%",
                  backgroundColor:
                    hoveredIcon === "icon2" ? "rgba(255, 0, 0, 0.6)" : "white",
                  width:{ xl: "45px", xs: "35px" },
                  height: { xl: "45px", xs: "35px" },
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                  color: "black",
                  fontWeight: "600",
                  boxShadow:
                    hoveredIcon === "icon2"
                      ? "0px 4px 10px rgba(0, 0, 0, 0.1)"
                      : "none",
                  transition:
                    "background-color 0.3s ease, box-shadow 0.3s ease",
                }}
                onClick={() => handleNavigate("/admin/brand-management")}
                onMouseEnter={() => handleMouseEnter("icon2")}
                onMouseLeave={handleMouseLeave}
              >
                <img
                  src={hoveredIcon === "icon2" ? icon31 : icon2}
                  style={{ width: "55%", zIndex: "100" }}
                  alt="Brand Management"
                />
              </Box>
              </Tooltip>
              <Tooltip title="Events Management"  placement="right" TransitionComponent={Zoom} TransitionProps={{timeout:200}} >
              <Box
                sx={{
                  borderRadius: "50%",
                  backgroundColor:
                    hoveredIcon === "icon4" ? "rgba(255, 0, 0, 0.6)" : "white",
                  width: { xl: "45px", xs: "35px" },
                  height:{ xl: "45px", xs: "35px" },
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                  color: "black",
                  fontWeight: "600",
                  boxShadow:
                    hoveredIcon === "icon4"
                      ? "0px 4px 10px rgba(0, 0, 0, 0.1)"
                      : "none",
                  transition:
                    "background-color 0.3s ease, box-shadow 0.3s ease",
                }}
                onClick={() => handleNavigate("/admin/events-management")}
                onMouseEnter={() => handleMouseEnter("icon4")}
                onMouseLeave={handleMouseLeave}
              >
                <img
                  src={hoveredIcon === "icon4" ? icon41 : icon4}
                  style={{ width: "50%", zIndex: "100" }}
                  alt="Events Management"
                />
              </Box>
              </Tooltip>
              <Tooltip title=" Requested Events Management"  placement="right" TransitionComponent={Zoom} TransitionProps={{timeout:200}} >
              <Box
                sx={{
                  borderRadius: "50%",
                  backgroundColor:
                    hoveredIcon === "icon9" ? "rgba(255, 0, 0, 0.6)" : "white",
                  width: { xl: "45px", xs: "35px" },
                  height: { xl: "45px", xs: "35px" },
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                  color: "black",
                  fontWeight: "600",
                  boxShadow:
                    hoveredIcon === "icon9"
                      ? "0px 4px 10px rgba(0, 0, 0, 0.1)"
                      : "none",
                  transition:
                    "background-color 0.3s ease, box-shadow 0.3s ease",
                }}
                onClick={() => handleNavigate("/admin/requested-events")}
                onMouseEnter={() => handleMouseEnter("icon9")}
                onMouseLeave={handleMouseLeave}
              >
                <img
                  src={hoveredIcon === "icon91" ? icon91 : icon9}
                  style={{ width: "80%", zIndex: "100" }}
                  alt="Requested Events Mana"
                />
              </Box>
              </Tooltip>
              <Tooltip title="Official Reviews Management"  placement="right" TransitionComponent={Zoom} TransitionProps={{timeout:200}} >

              <Box
                sx={{
                  borderRadius: "50%",
                  backgroundColor:
                    hoveredIcon === "icon5" ? "rgba(255, 0, 0, 0.6)" : "white",
                  width:{ xl: "45px", xs: "35px" },
                  height: { xl: "45px", xs: "35px" },
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                  color: "black",
                  fontWeight: "600",
                  boxShadow:
                    hoveredIcon === "icon5"
                      ? "0px 4px 10px rgba(0, 0, 0, 0.1)"
                      : "none",
                  transition:
                    "background-color 0.3s ease, box-shadow 0.3s ease",
                }}
                onClick={() => handleNavigate("/admin/reviews-management")}
                onMouseEnter={() => handleMouseEnter("icon5")}
                onMouseLeave={handleMouseLeave}
              >
                <img
                  src={hoveredIcon === "icon5" ? icon51 : icon5}
                  style={{ width: "80%", zIndex: "100" }}
                  alt="Reviews Management"
                />
              </Box>
              </Tooltip>
              <Tooltip title="Requested Sauce Management"  placement="right" TransitionComponent={Zoom} TransitionProps={{timeout:200}} >

              <Box
                sx={{
                  borderRadius: "50%",
                  backgroundColor:
                    hoveredIcon === "icon6" ? "rgba(255, 0, 0, 0.6)" : "white",
                  width: { xl: "45px", xs: "35px" },
                  height: { xl: "45px", xs: "35px" },
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                  color: "black",
                  fontWeight: "600",
                  boxShadow:
                    hoveredIcon === "icon6"
                      ? "0px 4px 10px rgba(0, 0, 0, 0.1)"
                      : "none",
                  transition:
                    "background-color 0.3s ease, box-shadow 0.3s ease",
                }}
                onClick={() => handleNavigate("/admin/requested-sauce")}
                onMouseEnter={() => handleMouseEnter("icon6")}
                onMouseLeave={handleMouseLeave}
              >
                <img
                  src={hoveredIcon === "icon6" ? icon61 : icon6}
                  style={{ width: "80%", zIndex: "100" }}
                  alt="Reviews Management"
                />
              </Box>
              </Tooltip>

              {/* badge and store management
               */}
              <Tooltip title="Badge Management"  placement="right" TransitionComponent={Zoom} TransitionProps={{timeout:200}} >
              <Box
                sx={{
                  borderRadius: "50%",
                  backgroundColor:
                    hoveredIcon === "icon7" ? "rgba(255, 0, 0, 0.6)" : "white",
                  width: { xl: "45px", xs: "35px" },
                  height: { xl: "45px", xs: "35px" },
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                  color: "black",
                  fontWeight: "600",
                  boxShadow:
                    hoveredIcon === "icon7"
                      ? "0px 4px 10px rgba(0, 0, 0, 0.1)"
                      : "none",
                  transition:
                    "background-color 0.3s ease, box-shadow 0.3s ease",
                }}
                onClick={() => handleNavigate("/admin/badge-management")}
                onMouseEnter={() => handleMouseEnter("icon7")}
                onMouseLeave={handleMouseLeave}
              >
                <img
                  src={hoveredIcon === "icon7" ? icon7 : icon71}
                  style={{ width: "80%", zIndex: "100" }}
                  alt="Reviews Management"
                />
              </Box>
              </Tooltip>
              <Tooltip title="Store Management"  placement="right" TransitionComponent={Zoom} TransitionProps={{timeout:200}} >

              <Box
                sx={{
                  borderRadius: "50%",
                  backgroundColor:
                    hoveredIcon === "icon8" ? "rgba(255, 0, 0, 0.6)" : "white",
                  width:{ xl: "45px", xs: "35px" },
                  height: { xl: "45px", xs: "35px" },
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                  color: "black",
                  fontWeight: "600",
                  boxShadow:
                    hoveredIcon === "icon8"
                      ? "0px 4px 10px rgba(0, 0, 0, 0.1)"
                      : "none",
                  transition:
                    "background-color 0.3s ease, box-shadow 0.3s ease",
                }}
                onClick={() => handleNavigate("/admin/store-management")}
                onMouseEnter={() => handleMouseEnter("icon8")}
                onMouseLeave={handleMouseLeave}
              >
                <img
                  src={hoveredIcon === "icon8" ? icon8 : icon81}
                  style={{ width: "80%", zIndex: "100" }}
                  alt="Reviews Management"
                />
              </Box>
              </Tooltip>

              {/* new management pages */}
              <Tooltip title="Notification" placement="right" TransitionComponent={Zoom} TransitionProps={{timeout:200}} > 
              <Box
                sx={{
                  borderRadius: "50%",
                  backgroundColor:
                    hoveredIcon === "bellYellowSVG" ? "rgba(255, 0, 0, 0.6)" : "white",
                  width: { xl: "45px", xs: "35px" },
                  height: { xl: "45px", xs: "35px" },
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                  color: "black",
                  fontWeight: "600",
                  boxShadow:
                    hoveredIcon === "bellYellowSVG"
                      ? "0px 4px 10px rgba(0, 0, 0, 0.1)"
                      : "none",
                  transition:
                    "background-color 0.3s ease, box-shadow 0.3s ease",
                }}
                onClick={() => handleNavigate("/admin/notification")}
                onMouseEnter={() => handleMouseEnter("bellYellowSVG")}
                onMouseLeave={handleMouseLeave}
              >
                {hoveredIcon === "bellYellowSVG" ? (
                  <Bell style={{ width: "50%", zIndex: "100" }} />
                ) : (
                  <img
                    src={bellYellowSVG}
                    style={{ width: "50%", zIndex: "100" }}
                    alt="Bell Icon"
                  />
                )}
              </Box>
              </Tooltip>

              <Tooltip title="Logout" placement="right" TransitionComponent={Zoom} TransitionProps={{timeout:200}} > 
              <Box
                sx={{
                  borderRadius: "50%",
                  backgroundColor:
                    hoveredIcon === "logoutpng" ? "rgba(255, 0, 0, 0.6)" : "white",
                  width: { xl: "45px", xs: "35px" },
                  height: { xl: "45px", xs: "35px" },
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                  color: "black",
                  fontWeight: "600",
                  boxShadow:
                    hoveredIcon === "logoutpng"
                      ? "0px 4px 10px rgba(0, 0, 0, 0.1)"
                      : "none",
                  transition:
                    "background-color 0.3s ease, box-shadow 0.3s ease",
                }}
                onClick={handleOpenModal}
                onMouseEnter={() => handleMouseEnter("logoutpng")}
                onMouseLeave={handleMouseLeave}
              >
                {hoveredIcon === "logoutpng" ? (
                  <img
                  src={logoutpng}
                  style={{ width: "50%", zIndex: "100" }}
                  alt="Bell Icon"
                />
                ) : (
                  <img
                    src={logoutpng}
                    style={{ width: "50%", zIndex: "100" }}
                    alt="Bell Icon"
                  />
                )}
              </Box>
              </Tooltip>
            </>
          )}
        </Box>
      </Box>
      <LogoutConfirmationModal
                open={modalOpen} 
                handleClose={handleCloseModal} 
                onLogoutConfirm={handleLogout} 
            />
    </Box>
  );
};

export default AppSidebar;

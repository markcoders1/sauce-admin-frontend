import React from 'react';
import { Box, Typography } from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
import './AppSidebar.css'; // Add styles for active and default states
import hambergImg from '../../assets/hamberger.png';
import icon1 from '../../assets/sauce icons-01.png'
import icon2 from '../../assets/sauce icons-02.png'
import icon3 from '../../assets/sauce icons-03.png'
import icon4 from '../../assets/sauce icons-04.png'


const AppSidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate()
const handleNavigate=(nav)=>{
  navigate(nav)
}
    
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
        <Box sx={{
        opacity: isOpen ? 1 : 0,
        visibility: isOpen ? 'visible' : 'hidden',
        transform: isOpen ? "translateX(0)" : "translateX(-50%)",
        transition: "opacity .5s ease, transform .8s ease, visibility 1s ease",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        overflow: "hidden", // Ensures content is not visible or interactable when sidebar is closed
      }}>
        {isOpen ? <>

          <Box
            sx={{
           borderRadius:"12px",
              backgroundColor: 'white',
              width: '50px',
              height: '50px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer', // Add pointer cursor
              color:"black",
              fontWeight:"600",
             position:"relative",

            }}
            onClick={() => handleNavigate("/user-management")} // Toggle sidebar on click
          >
          
            <img src={icon1} style={{width:"100%", zIndex:"100"}} alt="" />
          </Box>
      
          <Box
            sx={{
              borderRadius: '12px',
              backgroundColor: 'white',
              width: '50px',
              height: '50px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer', // Add pointer cursor
              color:"black",
              fontWeight:"600",
              position:"relative",
            }}
            onClick={() => handleNavigate("/brand-management")} // Toggle sidebar on click
          >
          
            <img src={icon2} style={{width:"100%", zIndex:"100"}} alt="" />
          </Box>
          <Box
            sx={{
              borderRadius: '12px',
              backgroundColor: 'white',
              width: '50px',
              height: '50px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer', // Add pointer cursor
              color:"black",
              fontWeight:"600"
            }}
            onClick={() => handleNavigate("/sauce-management")} // Toggle sidebar on click
          >
            <img src={icon4} style={{width:"100%"}} alt="" />
          </Box>
          <Box
            sx={{
              borderRadius: '12px',
              backgroundColor: 'white',
              width: '50px',
              height: '50px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer' ,// Add pointer cursor
              color:"black",
              fontWeight:"600"
            }}
            onClick={() => handleNavigate("/events-management")} // Toggle sidebar on click
          >
           <img src={icon3} style={{width:"100%"}} alt="" />
          </Box>
          
        </> : null}
      </Box>


      <Box sx={{
        opacity: !isOpen ? 1 : 0,
        visibility: !isOpen ? 'visible' : 'hidden',
        transform: !isOpen ? "translateX(0)" : "translateX(-10%)",
        transition: "opacity .5s ease, transform .8s ease, visibility 1s ease",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        overflow: "hidden", // Ensures content is not visible or interactable when sidebar is closed
      }}>
        {!isOpen ? <>

          <Box
            sx={{
              borderRadius: '12px',
              backgroundColor: 'white',
              width: '50px',
              height: '50px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer' ,// Add pointer cursor
               color:"black",
              fontWeight:"600"
            }}
            onClick={() => handleNavigate("/user-management")} // Toggle sidebar on click
          >
            
            <img src={icon1} style={{width:"100%", zIndex:"100"}} alt="" />
          </Box>
          <Box
            sx={{
              borderRadius: '12px',
              backgroundColor: 'white',
              width: '50px',
              height: '50px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer' ,// Add pointer cursor
               color:"black",
              fontWeight:"600"
            }}
            onClick={() => handleNavigate("/brand-management")} // Toggle sidebar on click
          >
           
           <img src={icon2} style={{width:"100%", zIndex:"100"}} alt="" />
          </Box>

          <Box
            sx={{
              borderRadius: '12px',
              backgroundColor: 'white',
              width: '50px',
              height: '50px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer' ,// Add pointer cursor
               color:"black",
              fontWeight:"600"
            }}
            onClick={() => handleNavigate("/sauce-management")} // Toggle sidebar on click
          >
            
            <img src={icon4} style={{width:"100%", zIndex:"100"}} alt="" />
          </Box>
          <Box
            sx={{
              borderRadius: '12px',
              backgroundColor: 'white',
              width: '50px',
              height: '50px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer', // Add pointer cursor
              color:"black",
              fontWeight:"600"
            }}
            onClick={() => handleNavigate("/events-management")} // Toggle sidebar on click
          >
           
           <img src={icon3} style={{width:"100%", zIndex:"100"}} alt="" />
          </Box>
        </> : null}
      </Box>
      </Box>
    
    </Box>
  );
};

export default AppSidebar;

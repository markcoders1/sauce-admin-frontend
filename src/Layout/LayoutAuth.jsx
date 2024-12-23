import { Box } from "@mui/material";
import {Outlet } from "react-router-dom";
import React from 'react'

import backgroundImg1 from '../assets/backgroundImg1-min.webp';
import authBg from '../assets/authBg-min.webp'




import { useLocation } from "react-router-dom";

const LayoutAuth = () => {

    const location = useLocation();

  return (
    <div>
        <Box
        sx={{
         
            boxSizing: "border-box",
            fontFamily: "Poppins",
            width: {
              xs: "100%",
              sm: "100vw",
              md: "100%",
            },
            height: {
             md: "100vh",
             xs:"100vh"
            },
    
           
            display: "flex",
            justifyContent: "space-between",
            flexDirection: {
              md: "row",
              xs: "column",
            },
           
            backgroundImage: `url(${backgroundImg1})`,
            backgroundColor: "black",
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundAttachment: "fixed",
          

         
            p:{
              sm:"20px",
              xs:"0px"
            }
          }}
        >
            <Box
             sx={{
                flexBasis: {
                  xs: "50%",
                },
                flexShrink: "1",
                flexGrow: {
                    lg:"0",
                    md:"1"
                },
                p: {
                  xl: "40px 120px",
                  md: "50px 70px",
                  xs: "30px 20px",
      
                },
                // backgroundColor:"red"
              }}
            >
            <Outlet/>
            </Box>
            <Box
             sx={{
                flexBasis: {
                  xs: "40%",
                },
                
                // flexShrink: "1",
                flexGrow: {
                    lg:"0",
                    md:"1"
                },
                display:{
                  md:"flex",
                  xs:"none"
                }
               
               
              }}
            >
           <img src={authBg} alt="" 
           style={{
            width:"100%",
            height:"100%",
           }}
           />
            </Box>
         
        </Box>
    </div>
  )
}

export default LayoutAuth
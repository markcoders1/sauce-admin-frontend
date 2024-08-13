import { Box } from "@mui/material";
import {Outlet } from "react-router-dom";
import React from 'react'

import backgroundImg1 from '../assets/backgroundImg1.png';
import authBg from '../assets/authBg.png'




import { useLocation } from "react-router-dom";

const LayoutAuth = () => {

    const location = useLocation();

  return (
    <div>
        <Box
        sx={{
            backgroundColor:"brown",
            boxSizing: "border-box",
            fontFamily: "Poppins",
            width: {
              xs: "100vw",
              sm: "100vw",
              md: "100%",
            },
            height: {
              height: "100vh",
            },
    
           
            display: "flex",
            justifyContent: "space-between",
            flexDirection: {
              md: "row",
              xs: "column",
            },
            minWidth: {
              md: "400px"
            },
            backgroundImage: `url(${backgroundImg1})`,
            backgroundColor: "black",
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundAttachment: "fixed",

            // border:"2px solid red",
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
                  md: "100px 120px",
                  xs: "60px 20px",
      
                },
                // backgroundColor:"red"
              }}
            >
            <Outlet/>
            </Box>
            <Box
             sx={{
                flexBasis: {
                  xs: "34 %",
                },
                
                // flexShrink: "1",
                flexGrow: {
                    lg:"0",
                    md:"1"
                },
               
               
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
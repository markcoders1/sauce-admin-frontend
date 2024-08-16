import React from 'react';
import hambergImg from '../../assets/hamberger.png';
import { toggleSidebar } from '../../Redux/Slice/sidebarSlice/sidebarSlice';
import { useDispatch } from 'react-redux';
import { Box } from '@mui/material';

const MenuBar = () => {
  const dispatch = useDispatch();

  const toggleSidebarfunc = () => {
    dispatch(toggleSidebar());
  };

  return (
    <Box
      sx={{
        borderRadius: '12px',
        backgroundColor: 'white',
        width: '50px',
        height: '50px',
        display: {
          md: "none",
          xs: "flex",
        },
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
      }}
      onClick={toggleSidebarfunc}
    >
      <img src={hambergImg} alt="Toggle Sidebar" />
    </Box>
  );
}

export default MenuBar;

import React from 'react';
import { Box, Typography } from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSidebar, closeSidebar } from '../../Redux/Slice/sidebarSlice/sidebarSlice';
import { RxCross2 } from 'react-icons/rx';
import './MobileSidebar.css';
import logoAdmin from '../../assets/logoAdmin.png';
import LogoutButton from '../../Components/Logout/Logout';

// Icons
import icon1 from '../../assets/icons-01.png';
import icon2 from '../../assets/icons-02.png';
import icon3 from '../../assets/icons-03.png';
import icon4 from '../../assets/icons-04.png';
import icon5 from '../../assets/reviewedMan.png';
import icon6 from '../../assets/icon-05.png';


import icon71 from '../../assets/icon61.png';
import icon81 from '../../assets/icon71.png';

const MobileSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isOpen = useSelector(state => state.sidebar.isOpen);

  const handleNavigate = (nav) => {
    navigate(nav);
    dispatch(closeSidebar()); // Close the sidebar after navigating
  };

  const handleToggleSidebar = () => {
    dispatch(toggleSidebar());
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        width: '100%',
        backgroundColor: '#1A1A1A',
        // background: 'linear-gradient(90deg, #FFA100 100%, #FF7B00 100%)',
        color: '#FFF',
        zIndex: 1300,
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s ease-in-out',
        display: {
          xs: 'flex',
          md: 'none',
        },
        flexDirection: 'column',
        padding: '30px',
      }}
    >
      <Box sx={{ position: "relative", height: "100%" , top:"5px", left:"5px"}}>
        <Box sx={{ cursor: 'pointer' }} onClick={handleToggleSidebar}>
          <RxCross2 size={30} color="#FFF" />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center',mt:"-30px" }}>
          <Box>
            <img src={logoAdmin} alt="Logo" style={{ width: '120px' }} />
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '30px', marginTop: '0px', alignItems: "start", ml: "40px", mt: "10px" }}>
          <Box onClick={() => handleNavigate('/admin/user-management')} className="nav-link">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <img src={icon1} style={{ width: '30px' }} alt="User Management" />
              <Typography>User Management</Typography>
            </Box>
          </Box>
          
          <Box onClick={() => handleNavigate('/admin/sauce-management')} className="nav-link">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <img src={icon2} style={{ width: '28px' }} alt="Sauce Management" />
              <Typography>Sauce Management</Typography>
            </Box>
          </Box>
          
          <Box onClick={() => handleNavigate('/admin/brand-management')} className="nav-link">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <img src={icon3} style={{ width: '23px' }} alt="Brand Management" />
              <Typography>Brand Management</Typography>
            </Box>
          </Box>
          
          <Box onClick={() => handleNavigate('/admin/events-management')} className="nav-link">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <img src={icon4} style={{ width: '25px' }} alt="Events Management" />
              <Typography>Events Management</Typography>
            </Box>
          </Box>
          <Box onClick={() => handleNavigate('/admin/reviews-management')} className="nav-link">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <img src={icon5} style={{ width: '33px' }} alt="User Management" />
              <Typography>Reviews Management</Typography>
            </Box>
          </Box>
          
          <Box onClick={() => handleNavigate('/admin/requested-sauce')} className="nav-link">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <img src={icon6} style={{ width: '33px' }} alt="Sauce Management" />
              <Typography>Requested Sauce</Typography>
            </Box>
          </Box>
          
          <Box onClick={() => handleNavigate('/admin/badge-management')} className="nav-link">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <img src={icon71} style={{ width: '33px' }} alt="Brand Management" />
              <Typography>Badge Management</Typography>
            </Box>
          </Box>
          
          <Box onClick={() => handleNavigate('/admin/store-management')} className="nav-link">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <img src={icon81} style={{ width: '33px' }} alt="Events Management" />
              <Typography>Store Management</Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'absolute', bottom: '30px' }}>
          <LogoutButton />
        </Box>
      </Box>
    </Box>
  );
};

export default MobileSidebar;

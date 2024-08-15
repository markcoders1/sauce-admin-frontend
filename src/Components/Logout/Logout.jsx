import { useDispatch, useSelector } from 'react-redux';
import {logout} from '../../Redux/Slice/UserSlice/UserSlice'
import { CgLogOff } from "react-icons/cg";
import { useNavigate } from 'react-router-dom';
import crossIcon from '../../assets/crossIcon.png'
const LogoutButton = () => {
    const navigate = useNavigate();
  const dispatch = useDispatch();
const auth = useSelector(state => state.auth);
// console.log(auth)
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
    // Add any additional logout logic such as redirecting to login page
    navigate("/")
    localStorage.removeItem("accessToken")
  };    

  return (
    <button
    style={{
        border:"none", color:"red",
        outline:"none",
        backgroundColor:"transparent"
    }}
    onClick={handleLogout}><CgLogOff style={{color:"red", fontSize:"35px"}} /></button>
  );
};

export default LogoutButton;

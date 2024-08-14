import { useDispatch, useSelector } from 'react-redux';
import {logout} from '../../Redux/Slice/UserSlice/UserSlice'
import { CgLogOff } from "react-icons/cg";
import { useNavigate } from 'react-router-dom';
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
    <button onClick={handleLogout}><CgLogOff/></button>
  );
};

export default LogoutButton;

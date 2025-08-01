import axios from 'axios';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../utils/constants';
import { removeUser } from '../utils/userSlice';
const NavBar = () => {
  const user = useSelector((store) => store.user);
  const navigate=useNavigate();
  const dispatch=useDispatch();

 async function handleLogout(){
  try{

    const res=await axios.post(BASE_URL+"/logout",
      {},
      {withCredentials:true});
      dispatch(removeUser());
      navigate("/login")
  } catch(err){
    console.log(err)
  }
  }
  return (
    <div className="navbar bg-base-200 shadow-sm px-4">
      {/* Left: Logo */}
      <div className="ml-3 flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-code text-primary"
        >
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
        <span className="cursor-pointer text-xl font-semibold "> Dev
        <Link to="/" className='text-primary'>Connect</Link>
      </span>
      </div>

      {/* Right: Profile */}
      {user && (
        <div className="ml-auto">
          <div className="dropdown dropdown-end">
            <label
              tabIndex={0}
              className="btn btn-ghost flex items-center gap-3 normal-case"
            >
              <span className="text-base font-medium text-primary whitespace-nowrap">
                Welcome, {user.firstName}
              </span>
              <div className="avatar">
                <div className="w-10 rounded-full">
                  <img
                    src={user.profilePicture}
                    alt="profile"
                    className="object-cover"
                    
                  />
                </div>
              </div>
            </label>

            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[100] p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <Link to="/profile" className="justify-between" >
                  Profile
                  <span className="badge">New</span>
                </Link>
              </li>
              <li><Link>Settings</Link></li>
              <li><Link onClick={handleLogout}>Logout</Link></li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavBar;

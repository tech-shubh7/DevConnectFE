import React, { useEffect } from 'react'
import NavBar from './NavBar'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import Footer from './Footer'
import axios from 'axios'
import { BASE_URL } from '../utils/constants'
import { useDispatch, useSelector } from 'react-redux'
import { addUser } from '../utils/userSlice'

const Body = () => {

 const dispatch=useDispatch();
 const navigate=useNavigate();
 const userData=useSelector((store)=>store.user);
 const location=useLocation();

 
  // condition: hide footer on certain routes
  const hideFooterRoutes = ["/chat", "/login", "/otp"];

  const fetchUser=async ()=>{
    if(userData) return;
    try{
    const res=await axios.get(
      BASE_URL + "/profile/view",
      {
        withCredentials:true,
      });

      dispatch(addUser(res.data));
    }  catch(err){
      if(err.status===401){
      navigate("/login")
    }
      console.log(err);
    }
  };

  useEffect(()=>{
  
     fetchUser();
  
  },[])

  return (
    <div>
      <NavBar/>
      <Outlet />
      {/* Footer will render unless the current path is in hideFooterRoutes */}
     {!(hideFooterRoutes.includes(location.pathname) || location.pathname.startsWith("/chat/")) && <Footer />}
    </div>
  )
}

export default Body;

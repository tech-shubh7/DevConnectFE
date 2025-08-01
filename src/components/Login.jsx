import React, { useState } from 'react'
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addUser } from '../utils/userSlice';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../utils/constants';

const Login = () => {

  const[emailId,setEmailId]=useState("shubh123@gmail.com");
  const [password,setPassword]=useState("Shubh@123");
  const [error,setError]=useState("")
  const dispatch=useDispatch();
  const navigate=useNavigate();

 async function handleLogin(){

  try{
  const res = await axios.post(
    BASE_URL + "/login",
    {
    emailId,
    password,
  },{withCredentials:true});

  console.log(res.data);
  dispatch(addUser(res.data));
  navigate("/");
  // console.log(appStore.getState());

   } catch(error){
      setError(error?.response?.data);
   }
 }

  return (
    <div className='flex justify-center my-10'>
     <div className="card bg-base-200 text-primary-content w-80 sm:w-96">
  <div className="card-body">
    <h2 className="card-title font-bold text-xl text-primary justify-center">Login</h2>
    <div>
    <label className='form-control w-full max-w-xs'>
      <div className="label mt-2">
         <span className="label-text ">Email Id</span>
      </div>
      <input type="text" 
      placeholder='Enter your email here'
      value={emailId}
      className='input input-bordered w-full max-w-xs'
      onChange={(e)=>setEmailId(e.target.value)}
      />
    </label>
    <label className='form-control w-full max-w-xs'>
      <div className="label mt-5">
         <span className="label-text ">Password</span>
      </div>
      <input type="password" 
      placeholder='Enter your password here'
      value={password}
      className='input input-bordered w-full max-w-xs mb-3'
       onChange={(e)=>setPassword(e.target.value)}
      />
    </label>
   </div>
  {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
    <div className="card-actions justify-center">
      <button className="btn bg-primary"  onClick={handleLogin}>Login</button>
    </div>
  </div>
</div>
    </div>
  )
}

export default Login;

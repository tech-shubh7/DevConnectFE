import React, { useState } from 'react'
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addUser } from '../utils/userSlice';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../utils/constants';

const Login = () => {

  const [emailId, setEmailId] = useState("");
   const [password, setPassword] = useState("");
   const [firstName, setFirstName] = useState("");
   const [lastName, setLastName] = useState("");
   const [isLoginForm, setIsLoginForm] = useState(true);
   const [error, setError] = useState("");
   const dispatch = useDispatch();
   const navigate = useNavigate();

 async function handleLogin(){

  try{
  const res = await axios.post(
    BASE_URL + "/login",
    {
    emailId,
    password,
  },{withCredentials:true});

  // console.log(res.data);
  dispatch(addUser(res.data));
  navigate("/");
  // console.log(appStore.getState());

   } catch(error){
      setError(error?.response?.data);
   }
 }

 const handleSignUp = async () => {
     try {
       const res = await axios.post(
         BASE_URL + "/signup",
         { firstName, lastName, emailId, password },
         { withCredentials: true }
       );
       dispatch(addUser(res.data.data));
       return navigate("/profile");
     } catch (err) {
       setError(err?.response?.data || "Something went wrong");
     }
   };
 
  const handleGithubAuth = () => {
    window.location.href = BASE_URL + "/auth/github";
  }

  return (
    <div className='flex justify-center my-10'>
     <div className="card bg-base-200 text-primary-content w-80 sm:w-96">
    <div className="card-body">
    <h2 className="card-title font-bold text-xl text-primary justify-center"> 
      {isLoginForm ? "Login" : "Sign Up"}
      </h2>
    <div>
      {!isLoginForm && (
            <>
             <label className='form-control w-full  max-w-xs'>
            <div className="label mt-2">
              <span className="label-text ">First Name</span>
            </div>
                <input
                  type="text"
                  placeholder='Enter your first name here'
                  value={firstName}
                  className="input input-bordered w-full max-w-xs"
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </label>
              <label className='form-control w-full max-w-xs'>
             <div className="label mt-3">
            <span className="label-text ">Last Name</span>
          </div>
                <input
                  type="text"
                  placeholder='Enter your last name here'
                  value={lastName}
                  className="input input-bordered w-full max-w-xs"
                  onChange={(e) => setLastName(e.target.value)}
                />
              </label>
            </>
            )}
    <label className='form-control w-full max-w-xs'>
      <div className="label mt-3">
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
      <div className="label mt-3">
         <span className="label-text ">Password</span>
      </div>
      <input type="password" 
      placeholder='Enter your password here'
      value={password}
      className='input input-bordered w-full max-w-xs mb-1'
       onChange={(e)=>setPassword(e.target.value)}
      />
    </label>
   </div>
  {isLoginForm && <div className='mb-2'>
    <span className='cursor-pointer flex ml-52 text-primary hover:text-blue-700' onClick={()=>navigate('/otp')}>
      forgot password?
    </span>
   </div>}
  {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
    <div className="card-actions justify-center">
      <button className="btn bg-primary hover:bg-blue-700"  
      onClick={isLoginForm ? handleLogin : handleSignUp}>
        {isLoginForm ? "Login" : "Sign Up"}
        </button>
    </div>
     <p
            className="m-auto cursor-pointer py-2 text-blue-500"
            onClick={() => setIsLoginForm((value) => !value)}
          >
            {isLoginForm
              ? "New User? Signup Here"
              : "Existing User? Login Here"}
          </p>
          <div className="divider text-sm">OR</div>
          <div className="mx-auto w-full">
            <button
              className="btn btn-neutral w-full gap-2"
              onClick={handleGithubAuth}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              {isLoginForm ? "Login with GitHub" : "Sign Up with GitHub"}
            </button>
          </div>
      </div>
    </div>
   </div>
  )
}

export default Login;

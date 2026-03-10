import axios from 'axios';
import React, { useState } from 'react'
import { BASE_URL } from '../utils/constants';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addUser } from '../utils/userSlice';

const SendOtp = () => {
    const [emailId, setEmailId] = useState("");
    const [clicked, setClicked] = useState(false);
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [error, setError] = useState("");
    const [vefified,setVerified]=useState(false);
    const [password,setPassword]=useState("");
    const [confirmPassword,setConfirmPassword]=useState("");
    const [passwordset,setPasswordset]=useState(false);
    const [msg,setMsg]=useState("");
    const navigate=useNavigate();
    const dispatch=useDispatch();

    const handleGenerateOtp = async () => {
        // Check if email is empty
        if (!emailId.trim()) {
            setError("Please enter your email address");
            return;
        }
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailId)) {
            setError("Please enter a valid email address");
            return;
        }
        
        // If everything is fine, show OTP boxes
        setError("");
        setClicked(true);
        // Here you would call your API to send OTP
     const result = await axios.post(
        BASE_URL+"/sendotp",
        {emailId},
        {withCredentials:true}
     )
        console.log(result.data.message);
        setMsg(result.data.message);
    };

    const handleOtpChange = (index, value) => {
        // Only allow single digit numbers
        if (value.length <= 1 && /^\d*$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);
            
            // Auto focus to next input
            if (value && index < 5) {
                document.getElementById(`otp-${index + 1}`).focus();
            }
        }
    };

    const handleKeyDown = (index, e) => {
        // Handle backspace to go to previous input
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            document.getElementById(`otp-${index - 1}`).focus();
        }
    };

    const handleVerifyOtp = async () => {
        // Check if all OTP boxes are filled
        const isOtpComplete = otp.every(digit => digit !== "");
        
        if (!isOtpComplete) {
            setError("Please enter complete 6-digit OTP");
            return;
        }
        
        // If OTP is complete, proceed with verification
        setError("");
        const otpString = otp.join("");
        console.log("OTP to verify:", otpString);
        // Here you would call your verify OTP API
         const res = await axios.post(
            BASE_URL+"/verifyotp",
            {emailId,otp:otpString},
            {withCredentials:true}
        )
        console.log(res.data);  
        if(res.data.success===true){
            //write new password logic here
           setVerified(true);
            // dispatch(addUser(res.data.user));
            // navigate('/');
        }
    };
  async function FinalPassword(){
    if(password!==confirmPassword){
        setError("Password and Confirm Password do not match");
        return;
    }
   try{
     const res = await axios.patch(
        BASE_URL+"/profile/password",
        {emailId,currentPassword:password,newPassword:confirmPassword},
        {withCredentials:true}
    )
    console.log(res.data);
    if(res.data.message==="Password updated successfully."){
        setPasswordset(true);
       setTimeout(() => {
         navigate('/');
       }, 3000);
    }
   } catch(err){
    console.log(err);
   }
  }
    const handlePaste = (e) => {
        // Handle paste event for OTP
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 6);
        
        if (/^\d+$/.test(pastedData)) {
            const newOtp = [...otp];
            for (let i = 0; i < pastedData.length; i++) {
                newOtp[i] = pastedData[i];
            }
            setOtp(newOtp);
            
            // Focus on the next empty box or last box
            const nextIndex = Math.min(pastedData.length, 5);
            document.getElementById(`otp-${nextIndex}`).focus();
        }
       
    };

    return (
        <div className='flex justify-center my-10'>
            <div className="card bg-base-200 text-primary-content w-80 sm:w-102">
                <div className="card-body">
                    <h2 className="card-title font-bold text-xl text-primary justify-center">
                        Reset Password
                    </h2>
                    
                    <div>
                        <label className='form-control w-full max-w-xs'>
                            <div className='mt-3'>
                                <input 
                                    type="email"
                                    placeholder='Enter your DevConnect email to get OTP'
                                    value={emailId}
                                    className='input input-bordered w-full max-w-xs'
                                    onChange={(e) => setEmailId(e.target.value)}
                                    disabled={clicked}
                                />
                            </div>
                        </label>
                        
                        {/* Show error message if any */}
                        {error && !clicked && (
                            <div className="text-error text-sm mt-2 text-center">
                                {error}
                            </div>
                        )}
                         {msg &&
                            <div className="text-emerald-400 text-sm mt-2 text-center">
                                {msg}
                            </div>
                        }
                    </div>

                    {/* Show Generate OTP button only when OTP boxes are not visible */}
                    {!clicked && (
                        <div className="card-actions justify-center mt-3">
                            <button 
                                className="btn bg-primary hover:bg-blue-700" 
                                onClick={handleGenerateOtp}
                            >
                                Generate OTP
                            </button>
                        </div>
                    )}

                    {/* Show OTP boxes only after clicking Generate OTP */}
                    {clicked && (
                        <>
                            <div className="mt-4">
                                <p className="text-center text-sm mb-3">
                                    Enter 6-digit OTP sent to your email
                                </p>
                                <div className="flex justify-center gap-2">
                                    {otp.map((digit, index) => (
                                        <input
                                            key={index}
                                            id={`otp-${index}`}
                                            type="text"
                                            maxLength="1"
                                            value={digit}
                                            onChange={(e) => handleOtpChange(index, e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(index, e)}
                                            onPaste={index === 0 ? handlePaste : undefined}
                                            className="input input-bordered w-12 h-12 text-center text-lg font-semibold"
                                        />
                                    ))}
                                </div>
                                
                                {/* Show error message for OTP */}
                                {error && clicked && (
                                    <div className="text-error text-sm mt-2 text-center">
                                        {error}
                                    </div>
                                )}
                            </div>

                            <div className="card-actions justify-center mt-4 gap-2">
                                <button 
                                    className="btn btn-outline"
                                    onClick={() => {
                                        setClicked(false);
                                        setOtp(["", "", "", "", "", ""]);
                                        setError("");
                                    }}
                                >
                                    Change Email
                                </button>
                                <button 
                                    className="btn bg-primary hover:bg-blue-700"
                                    onClick={handleVerifyOtp}
                                >
                                    Verify OTP
                                </button>
                            </div>
                          { vefified && <div>
                               <div className='mb-1'>Password</div>
                                <input type="password" name="password" value={password}
                                onChange={(e)=>setPassword(e.target.value)}
                                 className="input input-bordered w-full h-12  mb-4"
                                       />
                                <div className='mb-1'>Confirm Password</div>
                                <input type="password" name="confirmpassword" value={confirmPassword}
                                onChange={(e)=>setConfirmPassword(e.target.value)}
                                 className="input input-bordered w-full h-12 mb-4"  />
                                   <div className='flex justify-center'>
                                    <button 
                                    className="bg-primary px-5 py-3.5 rounded-sm font-semibold text-md hover:bg-blue-700"
                                    onClick={FinalPassword}
                                >
                                   Set Password
                                </button>
                                
                                </div>  
                                    {passwordset && <div className='mt-3 text-violet-500'>
                                    <p className='text-lg'>Password set successfully navigating to the feed page of DevConnect.</p>
                                </div>}
                            </div>}

                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default SendOtp;     
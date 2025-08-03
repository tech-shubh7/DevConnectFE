import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BASE_URL } from '../utils/constants';
import { addRequests, removeRequest } from '../utils/requestSlice'
import axios from 'axios';
import { MoreHorizontal } from 'lucide-react';

const Requests = () => {
  const requests=useSelector((store)=>store.requests);
  const dispatch=useDispatch();



  const reviewRequest= async(status,_id)=>{
    //this function used to accept requets
  try{
     const res=axios.post(
      BASE_URL+"/request/review/"+status+"/"+_id,
      {},
      {
        withCredentials:true,
      }
     )

     dispatch(removeRequest(_id));
  } catch(err){
    console.error(err.message)
  }

  }

  const getRequests=async()=>{
   try{
    const res=await axios.get(
      BASE_URL+"/user/requests/received",
      {
      withCredentials:true,
    });
    // console.log(res.data.data)
    dispatch(addRequests(res.data.data))
   }catch(err){
    console.log(err.message);
   }
  }

  useEffect(()=>{
    getRequests();
  },[])

  if(!requests) return;


   return (
    <div className=' text-center my-10 min-h-screen bg-base-100 pb-20'>
      <h1 className='font-bold text-2xl text-primary'>Requests</h1>
      {requests.length==0 && 
      <div className='font-semibold text-2xl text-red-500 my-5'>No requests found!!</div>}

      {requests.map(requests =>(
        <div key={requests.fromUserId._id} className='mt-7'>
      <div className="sm:w-100 w-80 mx-auto pb-5 bg-gray-800 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-blue-300 ">
      {/* Header with more options */}
      <div className="p-6 pb-0">
        <div className="flex justify-between items-start mb-4">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <button className="p-2 hover:bg-slate-200/50 rounded-full transition-colors duration-200">
            <MoreHorizontal className="w-5 h-5 text-slate-600" />
          </button>
        </div>
        
        {/* Profile Picture */}
        <div className="relative mx-auto w-28 h-28 mb-4">
          <img 
            src={requests.fromUserId.profilePicture} 
            alt={`${requests.fromUserId.firstName} ${requests.fromUserId.lastName}`}
            className="w-full h-full rounded-full object-cover ring-4 ring-white shadow-lg"
          />
          <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center ring-4 ring-white">
            <span className="text-white text-xs font-bold">✓</span>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="px-6 text-center">
        <h2 className="text-2xl font-bold text-primary mb-1">
          {requests.fromUserId.firstName} {requests.fromUserId.lastName}
        </h2>
        <div className="flex items-center justify-center gap-2 text-fuchsia-700 mb-3">
          <span className="text-sm bg-gray-300 px-3 py-1 rounded-full">
            {requests.fromUserId.age} years old
          </span>
          <span className="text-sm bg-gray-300  px-3 py-1 rounded-full">
            {requests.fromUserId.gender}
          </span>
        </div>
        
        {/* Bio */}
        <p className="text-primary text-sm leading-relaxed px-2">
          {requests.fromUserId.bio}
        </p>
      </div>
      
        <div className="flex justify-center mt-4">
          <button className="btn bg-green-500 mr-2"
           onClick={()=>reviewRequest("accepted",requests._id)}>
            Accept</button>
            
          <button className="btn bg-red-500"
           onClick={()=>reviewRequest("rejected",requests._id)}>
            Reject</button>
        </div>
      
      {/* Bottom accent */}
      {/* <div className="h-1 rounded-b-2xl mt-6"></div> */}
    </div>
        
      </div>
    
    ))}
     
    </div>
  )
}

export default Requests

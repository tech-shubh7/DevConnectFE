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
    <div className="text-center py-10 min-h-screen bg-base-100">
  <h1 className="font-bold text-3xl text-primary mb-8">Connection Requests</h1>
  
  {requests.length === 0 && (
    <div className="font-semibold text-xl text-red-500 my-8">
      No requests found!!
    </div>
  )}

  {/* Responsive Grid Container */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 max-w-7xl mx-auto">
    {requests.map(request => (
      <div key={request.fromUserId._id} className="w-full">
        <div className="w-full max-w-sm mx-auto pb-5 bg-gray-800 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-blue-300">
          {/* Header with more options */}
          <div className="p-4 pb-0">
            <div className="flex justify-between items-start mb-4">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <button className="p-2 hover:bg-slate-200/50 rounded-full transition-colors duration-200">
                <MoreHorizontal className="w-4 h-4 text-slate-600" />
              </button>
            </div>
            
            {/* Profile Picture */}
            <div className="relative mx-auto w-24 h-24 mb-4">
              <img 
                src={request.fromUserId.profilePicture} 
                alt={`${request.fromUserId.firstName} ${request.fromUserId.lastName}`}
                className="w-full h-full rounded-full object-cover ring-4 ring-white shadow-lg"
              />
              {/* <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center ring-2 ring-white">
                <span className="text-white text-xs font-bold">✓</span>
              </div> */}
            </div>
          </div>

          {/* User Info */}
          <div className="px-4 text-center">
            <h2 className="text-lg font-bold text-primary mb-2 line-clamp-1">
              {request.fromUserId.firstName} {request.fromUserId.lastName}
            </h2>
            
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="text-xs bg-gray-300 text-gray-700 px-2 py-1 rounded-full">
                {request.fromUserId.age} years
              </span>
              <span className="text-xs bg-gray-300 text-gray-700 px-2 py-1 rounded-full">
                {request.fromUserId.gender}
              </span>
            </div>
            
            {/* Bio - truncated for card layout */}
            <p className="text-primary text-xs leading-relaxed px-2 mb-4 line-clamp-3 h-15 overflow-hidden">
              {request.fromUserId.bio}
            </p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-center gap-3 px-4">
            <button 
              className="btn btn-sm bg-green-400 hover:bg-green-600 text-white border-none flex-1 max-w-20"
              onClick={() => reviewRequest("accepted", request._id)}
            >
              Accept
            </button>
            
            <button 
              className="btn btn-sm bg-red-500 hover:bg-red-600 text-white border-none flex-1 max-w-20"
              onClick={() => reviewRequest("rejected", request._id)}
            >
              Reject
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>
  )
}

export default Requests

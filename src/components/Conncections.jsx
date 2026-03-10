import axios from 'axios'
import React, { useEffect } from 'react'
import { MoreHorizontal } from 'lucide-react';
import { BASE_URL } from '../utils/constants'
import { useDispatch, useSelector } from 'react-redux'
import { addConnections } from '../utils/connectionSlice'
import { useNavigate } from 'react-router-dom';

const Conncections = () => {
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const connections=useSelector((store)=>store.connections);
    const fetchConnections=async()=>{
        try{
            const res=await axios.get(
                BASE_URL+"/user/connections",
                {withCredentials:true}
            )
            dispatch(addConnections(res.data.data));
            // console.log(res.data.data);
        } catch(err){
                console.error(err.message)
        }
    }

    useEffect(()=>{
        fetchConnections();
    },[])
 
    if(!connections) return;
  return (
    <div className=' text-center my-5 min-h-screen bg-base-100 pb-20'>
      <h1 className='font-bold text-2xl text-primary mb-3'>Connections</h1>
      {connections.length==0 && 
      <div className='font-semibold text-2xl text-purple-500 my-5'>No Connections found!!</div>}

   {/* Container with responsive grid layout */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4 max-w-7xl mx-auto">
  {connections.map(connection => (
    <div key={connection._id} className="w-full h-full">
      <div className="w-full h-full bg-gray-800 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-blue-300 flex flex-col">
        {/* Header with more options */}
        <div className="p-4 pb-0">
          <div className="flex justify-between items-start mb-4">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <button onClick={()=>{navigate("/chat/"+connection._id)}} className="p-1 cursor-pointer bg-primary rounded">
              Chat
            </button>
          </div>
          
          {/* Profile Picture - responsive sizing */}
          <div className="relative mx-auto w-20 h-20 sm:w-24 sm:h-24 mb-4">
            <img 
              src={connection.profilePicture} 
              alt={`${connection.firstName} ${connection.lastName}`}
              className="w-full h-full rounded-full object-cover ring-4 ring-white shadow-lg"
            />
            {/* <div className="absolute -bottom-1 -right-1 w-6 h-6 sm:w-8 sm:h-8 bg-blue-400 rounded-full flex items-center justify-center ring-4 ring-white">
              <span className="text-white text-xs font-bold">✓</span>
            </div> */}
          </div>
        </div>

        {/* User Info */}
        <div className="px-4 pb-4 text-center flex-1 flex flex-col justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-primary mb-2">
              {connection.firstName} {connection.lastName}
            </h2>
            
            {/* Age and Gender tags - responsive layout */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
              <span className="text-xs sm:text-sm bg-gray-300 px-2 py-1 rounded-full whitespace-nowrap">
                {connection.age} years old
              </span>
              <span className="text-xs sm:text-sm bg-gray-300 px-2 py-1 rounded-full whitespace-nowrap">
                {connection.gender}
              </span>
            </div>
          </div>
          
          {/* Bio */}
          <p className="text-primary text-xs sm:text-sm leading-relaxed px-1 mt-auto">
            {connection.bio}
          </p>
        </div>
      </div>
    </div>
  ))}
</div>
     
    </div>
  )
}

export default Conncections

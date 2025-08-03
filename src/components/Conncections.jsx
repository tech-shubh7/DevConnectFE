import axios from 'axios'
import React, { useEffect } from 'react'
import { MoreHorizontal } from 'lucide-react';
import { BASE_URL } from '../utils/constants'
import { useDispatch, useSelector } from 'react-redux'
import { addConnections } from '../utils/connectionSlice'

const Conncections = () => {
    const dispatch=useDispatch();
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
    <div className=' text-center my-10 min-h-screen bg-base-100 pb-20'>
      <h1 className='font-bold text-2xl text-primary'>Connections</h1>
      {connections.length==0 && 
      <div className='font-semibold text-2xl text-purple-500 my-5'>No Connections found!!</div>}

      {connections.map(connections =>(
        <div key={connections._id} className='mt-7'>
      <div className="sm:w-100 w-80 mx-auto pb-10 bg-gray-800 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-blue-300 ">
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
            src={connections.profilePicture} 
            alt={`${connections.firstName} ${connections.lastName}`}
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
          {connections.firstName} {connections.lastName}
        </h2>
        <div className="flex items-center justify-center gap-2 text-fuchsia-700 mb-3">
          <span className="text-sm bg-gray-300 px-3 py-1 rounded-full">
            {connections.age} years old
          </span>
          <span className="text-sm bg-gray-300  px-3 py-1 rounded-full">
            {connections.gender}
          </span>
        </div>
        
        {/* Bio */}
        <p className="text-primary text-sm leading-relaxed px-2">
          {connections.bio}
        </p>
      </div>
      
      {/* Bottom accent */}
      {/* <div className="h-1 rounded-b-2xl mt-6"></div> */}
    </div>
        
      </div>
    
    ))}
     
    </div>
  )
}

export default Conncections

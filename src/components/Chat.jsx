import React, { useEffect, useState } from "react";
import { Send, ArrowLeft, Users, MessageCircle} from "lucide-react";
import { useSelector,useDispatch  } from "react-redux";
import { useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from '../utils/constants'
import { addConnections } from '../utils/connectionSlice'
import { useNavigate } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";



export default function Chat() {
   const { targetUserId } = useParams();
  const [selectedUser, setSelectedUser] = useState(null);
  const [isMobileView, setIsMobileView] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
 const [messages, setMessages] = useState([])
  const navigate = useNavigate();
  const [newMessage,setNewMessage]=useState("");
  const user=useSelector((store)=>store.user);
  const userId=user?._id;
  const connections = useSelector((store) => store.connections) || [];
  const dispatch = useDispatch();
  const socketRef = React.useRef(null);

  const fetchConnections = async () => {
    try {
      const res = await axios.get(
        BASE_URL + "/user/connections",
        { withCredentials: true }
      )
      dispatch(addConnections(res.data.data));
    } catch (err) {
      console.error(err.message)
    }
  }
   
  useEffect(()=>{
   fetchConnections();
  },[]);

useEffect(() => {
  // Clear messages when switching users
  setMessages([]);
}, [targetUserId])

useEffect(() => {
  if(!userId || !targetUserId) {
    return;
  }
  
 socketRef.current = createSocketConnection();
const socket = socketRef.current;

  
  socket.emit("joinChat", {
    userId,
    targetUserId,
    firstName: user.firstName
  });

  // Remove any existing listeners first
  socket.off("messageReceived");
  
 socket.on("messageReceived", ({ senderId, text }) => {
    console.log(senderId + " : " + text);
   setMessages((prev) => [...prev, { senderId, text }]);

  });
                                         
  return () => {
    socket.off("messageReceived"); // Remove listener
   socketRef.current.disconnect();
socketRef.current = null;

  };
}, [userId, targetUserId, user?.firstName]);

   useEffect(() => {
    if (targetUserId && connections.length > 0) {
      const targetUser = connections.find(user => user._id === targetUserId);
      if (targetUser) {
        setSelectedUser(targetUser);
        // Hide sidebar on mobile when user is auto-selected
        if (window.innerWidth < 768) {
          setShowSidebar(false);
        }
      }
    }
  }, [targetUserId, connections]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setShowSidebar(!selectedUser);
      } else {
        setShowSidebar(true);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [selectedUser]);

  const handleUserSelect = (user) => {
  setSelectedUser(user);
  navigate(`/chat/${user._id}`); // Add this line
  if (isMobileView) {
    setShowSidebar(false);
  }
};
  const handleBackToSidebar = () => {
    setSelectedUser(null);
    setShowSidebar(true);
  };

  function sendMessage() {
  if (!newMessage.trim()) return;
 
 socketRef.current.emit("sendMessage", {
  userId,
  targetUserId,
  text: newMessage
});

  
  // REMOVE THIS LINE - let the server send it back
  // setMessages(prev => [...prev, {firstName: user.firstName, text: newMessage}]);
  
  setNewMessage("");
}


  return (
    <div className="h-screen bg-gray-900 overflow-hidden   ">
      <div className="flex h-[calc(100vh-64px)] max-w-full mx-auto">
        
        {/* Sidebar */}
        <div className={`${
          showSidebar ? 'flex' : 'hidden'
        } ${
          isMobileView ? 'w-full' : 'w-80'
        } flex-col rounded-md bg-gray-800/90 backdrop-blur-sm shadow-2xl border border-gray-700/50`}>
          
          {/* Sidebar Header */}
          <div className="p-6 bg-gray-900">
            <div className="flex items-center gap-3 text-white">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Users size={22} />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">Your Connections</h1>
                <p className="text-indigo-100 text-sm font-medium">{connections.length} people</p>
              </div>
            </div>
          </div>

          {/* Connections List */}
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent ">
            {connections.length > 0 ? (
              <div className="p-3 space-y-1">
                {connections.map((user) => (
                  <div
                    key={user._id}
                    onClick={() => handleUserSelect(user)}
                    className={`group relative flex items-start gap-4 p-4  rounded-2xl cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-[1.02] ${
                      selectedUser?._id === user._id 
                        ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-600/50 shadow-lg shadow-slate-950/70ring-1 ring-sky-500/10"
                        : "hover:bg-gray-700/50 hover:shadow-md border-1 border-gray-700 hover:border-gray-600"
                    }`}
                  >
                    {/* Profile Section */}
                    <div className="relative flex-shrink-0">
                      <div className="relative">
                        <img
                          src={user.profilePicture || "https://via.placeholder.com/56"}
                          alt="avatar"
                          className="w-14 h-14 rounded-2xl object-cover border-3 border-white shadow-lg"
                        />
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-400 border-3 border-white rounded-full shadow-sm"></div>
                      </div>
                    </div>
                    
                    {/* User Info */}
                    <div className="flex-1 min-w-0 space-y-2">
                      {/* Name and Age */}
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-gray-100 text-base truncate leading-tight">
                          {user.firstName} {user.lastName}
                        </h3>
                        <span className="flex-shrink-0 px-2.5 py-1 bg-gray-700 text-gray-200 rounded-full text-xs font-semibold">
                          {user.age}y
                        </span>
                      </div>
                      
                      {/* Bio */}
                      {user.bio && (
                        <p className="text-sm text-gray-300 line-clamp-2 leading-relaxed">
                          {user.bio.length > 60 ? `${user.bio.substring(0, 60)}...` : user.bio}
                        </p>
                      )}
                      
                      {/* Skills */}
                      {user.skills && user.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {user.skills.slice(0, 2).map((skill, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center px-2.5 py-0.5 bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-700 rounded-lg text-xs font-medium border border-indigo-200/50"
                            >
                              {skill}
                            </span>
                          ))}
                          {user.skills.length > 2 && (
                            <span className="inline-flex items-center px-2.5 py-0.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium">
                              +{user.skills.length - 2}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* Hover Indicator */}
                    <div className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-all duration-300 ${
                      selectedUser?._id === user._id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}>
                      <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500 px-6">
                <div className="p-4 bg-gray-100 rounded-full mb-4">
                  <Users size={32} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No connections yet</h3>
                <p className="text-sm text-gray-500 text-center leading-relaxed">
                  Start connecting with people to see them here
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Chat Section */}
        <div className={`${
          showSidebar && isMobileView ? 'hidden' : 'flex'
        } flex-1 flex-col bg-gray-800/90 backdrop-blur-sm`}>
          {selectedUser ? (
            <>
              {/* Chat Header */}
              <div className="p-5 bg-gray-900/40 backdrop-blur-md border-b border-gray-700/50 shadow-sm">
                <div className="flex items-center gap-4">
                  {isMobileView && (
                    <button
                      onClick={handleBackToSidebar}
                      className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                      <ArrowLeft size={18} className="text-gray-600" />
                    </button>
                  )}
                  
                  <div className="relative flex-shrink-0">
                    <img
                      src={selectedUser.profilePicture || "https://via.placeholder.com/48"}
                      alt="avatar"
                      className="w-12 h-12 rounded-2xl object-cover border-2 border-white shadow-md"
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-400 border-2 border-white rounded-full"></div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1 cursor-pointer" onClick={()=>navigate("/connections")}>
                      <h2 className="font-bold text-gray-100 text-lg tracking-tight">
                        {selectedUser.firstName} {selectedUser.lastName}
                      </h2>
                      <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                        {selectedUser.age}y
                      </span>
                    </div>
                    
                    {selectedUser.skills && selectedUser.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {selectedUser.skills.slice(0, 4).map((skill, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-2.5 py-0.5 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 rounded-lg text-xs font-medium border border-emerald-200/50"
                          >
                            {skill}
                          </span>
                        ))}
                        {selectedUser.skills.length > 4 && (
                          <span className="inline-flex items-center px-2.5 py-0.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium">
                            +{selectedUser.skills.length - 4}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

            {/* Chat Body */}
<div className="flex-1 bg-gradient-to-b from-gray-800/50 to-gray-900 overflow-y-auto p-4">
  <div className="max-w-4xl mx-auto space-y-4">
    {messages.map((message, index) => (
      <div
        key={index}
        className={`flex ${
          message.senderId === userId ? 'justify-end' : 'justify-start'
        }`}
      >
        <div
          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
          message.senderId === userId
        ? 'bg-blue-700 text-white'
        : 'bg-gray-700 text-gray-100'

          }`}
        >
                {message.senderId !== userId && (
          <p className="text-xs text-gray-300 mb-1 font-medium">
            {selectedUser.firstName}
          </p>
        )}

          <p className="text-sm">{message.text}</p>
        </div>
      </div>
    ))}
  </div>
</div>

              {/* Input Box */}
              <div className="p-4 bg-gray-800/95 backdrop-blur-md border-t border-gray-700/50 shadow-lg">
                <div className="flex items-center gap-3 max-w-4xl mx-auto">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={newMessage}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      onChange={(e)=>setNewMessage(e.target.value)}
                      placeholder={`Message ${selectedUser.firstName}...`}
                      className="w-full border-2 border-gray-600/70 rounded-2xl px-6 py-3.5 pr-12 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100/50 transition-all duration-200 text-gray-200 placeholder-gray-500 bg-gray-700/70 backdrop-blur-sm shadow-sm"
                    />
                  </div>
                  <button onClick={sendMessage} className="bg-primary  hover:from-indigo-600 hover:via-blue-600 hover:to-cyan-600 text-white rounded-2xl p-3.5 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95">
                    <Send size={20} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-gray-800/50 via-gray-900/30 to-gray-900/50 p-8">
              <div className="bg-gray-800/90  backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-gray-700/50 text-center max-w-md">
                <div className="bg-gradient-to-r from-indigo-100 via-blue-100 to-cyan-100 rounded-2xl p-6 w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-inner">
                  <MessageCircle size={36} className="text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-100 mb-4 tracking-tight">
                  Welcome to Chat
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  Select a connection from your sidebar to start a conversation and build meaningful relationships.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
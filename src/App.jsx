import React from 'react';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import Body from './components/Body';
import Login from './components/Login';
import Profile from './components/Profile';
import { Provider } from 'react-redux';
import appStore from './utils/appStore';
import Feed from './components/Feed';
import Conncections from './components/Conncections';
import Requests from './components/Requests';
import Chat from './components/Chat';
import SendOtp from './components/sendotp';

function App() {
 
  return (
    <>
    <Provider store={appStore}>
    <BrowserRouter basename='/'>
       <div data-theme="dark" className='flex flex-col h-screen '>
        <Routes>
          <Route path="/" element={<Body />} >
          <Route path="/" element={<Feed />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/connections" element={<Conncections />} />
          <Route path="/requests" element={<Requests/>} />
          <Route path="/chat" element={<Chat/>} />
          <Route path="/chat/:targetUserId" element={<Chat/>} />
          <Route path="/otp" element={<SendOtp/>} />
      </Route>
        </Routes>
     </div>
   </BrowserRouter> 
   </Provider>
    </>
  )
}

export default App

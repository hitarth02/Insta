import React, { useState } from 'react';
import { useSelector } from "react-redux";
import ChatBox from '../components/chat/ChatBox';
import MyChats from '../components/chat/MyChats';
import SearchUsers from '../components/chat/SearchUsers';

const Messenger = () => {

  const [searchBox , setSearchBox] = useState(false);
  const {selectedChat} = useSelector((state)=>state.chat);
  return (
    <div 
      className='flex w-screen'
    >
      {searchBox ? 
        <SearchUsers
          setSearchBox={setSearchBox}
        /> 
        : 
        <MyChats
          setSearchBox={setSearchBox}
        />}
      {selectedChat && <ChatBox/>}
    </div>
  )
};

export default Messenger;
import React, { useState } from 'react';
import {Button, Input, Navbar, NavbarBrand, NavbarItem, Spinner} from '@nextui-org/react';
import {FiSearch} from 'react-icons/fi';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {BsArrowLeft} from 'react-icons/bs';
import { searchUser } from '../../services/utility/userServices';
import { toast } from 'react-hot-toast';
import { accessChat } from '../../services/utility/chatServices';
import { setChats, setSelectedChat } from '../../slices/chatSlice';

const SearchUsers = ({setSearchBox}) => {

  const [search , setSearch] = useState();
  const [searchResult , setSearchResult] = useState([]);
  const {token , user} = useSelector((state)=>state.user);
  const [loading , setLoading] = useState(false);
  const dispatch = useDispatch();
  const {chats , selectedChat} = useSelector((state)=>state.chat);
  const [showText , setShowText] = useState(false);

  const handleSearchUsers = async() => {
    try {
      if(!search){
        toast.error("search cannot be empty");
        return;
      };
      setLoading(true);
      const res = await searchUser(search , token);
      if(res){
        setSearchResult(res);
        setShowText(true);
      };
    } catch (error) {
      console.log(error)
    };
    setLoading(false);
  };

  const createChat = async(userId) => {
    try {
      const res = await accessChat({userId:userId} , token);
      console.log('create chat wala res',res);
      if(chats.find((c)=>c._id === res._id)){
        dispatch(setChats([res?.[0],...chats]))
      };
      if(res){
        dispatch(setSelectedChat(res?.[0]));
        setSearchBox(false);
      };
    } catch (error) {
      console.log(error)
    };
  };

  const handleKey = (e) => {
    if(e.key === "Enter"){
      e.preventDefault();
      handleSearchUsers();
    };
  };

  return (
    <div className={`lg:w-[400px] overflow-auto h-screen w-full lg:border-r border-zinc-800 px-5 ${selectedChat ? 'hidden':'inline-block'} ${selectedChat ? 'lg:inline-block':'lg:inline-block'}`}>
      <div className='flex items-center justify-between py-4 border-b border-zinc-800'>
            <p className='flex gap-x-3 items-center text-xl'>
                  <BsArrowLeft className=' text-xl cursor-pointer' onClick={()=>setSearchBox(false)}/>
                  Search
            </p>

        </div>
        <form className='flex w-full gap-x-2 items-center mt-3'>
          <Input
            autoFocus
            classNames={{
              base: "w-[100%] h-10 mt-2",
              mainWrapper: "h-full",
              input: "text-small",
              inputWrapper: "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
            }}
            placeholder="Search users..."
            size="sm"
            startContent={<FiSearch size={18} />}
            type="search"
            onChange={(e)=>setSearch(e.target.value)}
            onKeyDown={(e)=>handleKey(e)}
          />
          <Button
            onClick={handleSearchUsers}
            className='mt-2'
          >
            Search
          </Button>
        </form>
        <div>
          {
            loading ? <Spinner className='flex justify-center mt-5' size='lg'/> : (
              <div>
                {
                  searchResult.length === 0 ? (<p className='text-center text-zinc-400 text-lg mt-5'>{showText ? 'No users found...':'Search users...'}</p>) : (
                    <div className='flex flex-col gap-y-2 mt-4 cursor-pointer'>
                      {
                        searchResult.map((users)=>{
                          return(
                            <div
                              onClick={()=>createChat(users._id)}
                              className={`flex gap-x-3 items-center px-3 py-2 bg-zinc-800 rounded-lg hover:bg-zinc-900 ${user._id === users._id ? 'hidden':''}`}
                            >
                              <div>
                                <img
                                  src={`${users.userImage}`}
                                  className=' w-9 h-9 rounded-full'
                                />
                              </div>
                              <div className='flex flex-col gap-y-1'>
                                <p>
                                  {users.firstName} {users.lastName}
                                </p>
                                <p className=' text-sm'>
                                  {users.email}
                                </p>
                              </div>
                            </div>
                          )
                        })
                      }
                    </div>
                  )
                }
              </div>
            )
          }
        </div>
    </div>
  )
}

export default SearchUsers
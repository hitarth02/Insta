import React, { useEffect, useState } from "react";
import { BsArrowLeft } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { setChats, setSelectedChat } from "../../slices/chatSlice";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spinner , useDisclosure } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import { searchUser } from "../../services/utility/userServices";
import { toast } from "react-hot-toast";
import {MdOutlineModeEditOutline} from 'react-icons/md';
import { addUserToGroup, deleteGroupService, getAllMessages, removeUserFromGroup, renameGroup, sendMessage } from "../../services/utility/chatServices";
import GroupLogoUpdate from "./GroupLogoUpdate";
import ScrollableChat from "./ScrollableChat";
import io from 'socket.io-client';

const ENDPOINT = "https://insta-backend-qxon.onrender.com";
var socket , selectedChatCompare;

const ChatBox = () => {

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { token, user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { selectedChat , chats } = useSelector((state) => state.chat);
  const filterId = selectedChat?.users.filter((u) => u._id !== user._id);
  const senderUser = filterId[0];
  const [groupChatProfile, setGroupChatProfile] = useState(false);
  const [users, setUsers] = useState();
  const [usersFull, setUsersFull] = useState();
  const [search, setSearch] = useState();
  const [groupName , setGroupName] = useState();
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchBtn, setSearchBtn] = useState(true);
  const [changeGroupName , setChangeGroupName] = useState(false);
  const [updateLogo , setUpdateLogo] = useState(false);
  const navigate = useNavigate();
  const [message , setMessage] = useState();
  const [allMessages , setAllMessages] = useState([]);
  const [chatLoading , setChatLoading] = useState(false);
  console.log("chat",selectedChat);
  const [socketConnected, setsocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const handleSearchUsers = async () => {
    try {
      if (!search) {
        toast.error("search cannot be empty");
        return;
      }
      setLoading(true);
      const res = await searchUser(search, token);
      if (res) {
        setSearchResult(res);
        setSearchBtn(false);
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const handleKey = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearchUsers();
    }
  };

  const removeUser = async(userId) => {
    try {
      const res = await removeUserFromGroup({userId:userId , chatId:selectedChat?._id} , token);
      dispatch(setSelectedChat(res));
    } catch (error) {
      console.log(error);
    };
  };

  const addUser = async () => {
    try {
      const res = await addUserToGroup({userId:users , chatId:selectedChat?._id} , token);
      dispatch(setSelectedChat(res));
      setUsers();
      setUsersFull();
    } catch (error) {
      console.log(error);
    };
  };

  const groupRename = async() => {
    try {
      const res = await renameGroup({name:groupName , chatId:selectedChat?._id} , token);
      dispatch(setSelectedChat(res));
      const newRes = chats.map((chat)=>{
        if(chat._id === res._id){
          return res
        }else{
          return chat
        }
      });
      dispatch(setChats(newRes));
      setChangeGroupName(false);
    } catch (error) {
      console.log(error);
    };
  };

  const deleteGroup = async() => {
    try {
      const res = await deleteGroupService({chatId: selectedChat?._id} , token , dispatch);
      dispatch(setChats(res));
    } catch (error) {
      console.log(error);
    };
  };

  const sendTheMessage = async (e) => {
    e.preventDefault();
    try {
      socket.emit("stopTyping",selectedChat._id);
      setMessage("");
      const res = await sendMessage({message: message , chatId: selectedChat?._id}, token);
      console.log(res);
      socket.emit("newMessage",res);
      setAllMessages([...allMessages , res]);
    } catch (error) {
      console.log(error);
    };
  };

  const fetchMessages = async() => {
    if(!selectedChat) return;
    setChatLoading(true);
    try {
      const res = await getAllMessages({chatId:selectedChat._id} , token);
      setAllMessages(res);
    } catch (error) {
      console.log(error);
    };
    setChatLoading(false);

    socket.emit("joinChat",selectedChat._id);
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    //Typing indicator logic
    if(!socketConnected) return;

    if(!typing){
      setTyping(true);
      socket.emit("typing",selectedChat._id);
    };

    let lastTypingTime = new Date().getTime();
    let timer = 2000;
    setTimeout(()=>{
      let timeNow = new Date().getTime();
      let timeDiff = timeNow - lastTypingTime;

      if(timeDiff >= timer && typing){
        socket.emit("stopTyping",selectedChat._id);
        setTyping(false);
      };
    },timer); 
  };

  useEffect(()=>{
    fetchMessages();
    selectedChatCompare = selectedChat;
  },[selectedChat])

  const handleKeyDown = (e) => {
    if(e.key === "Enter"){
      e.preventDefault();
      sendTheMessage();
    };
  };

  useEffect(()=>{
    socket = io(ENDPOINT);
    socket.emit("setup",user);
    socket.on("connected",()=>{
      setsocketConnected(true);
    });
    socket.on("typing",()=>setIsTyping(true));
    socket.on("stopTyping",()=>setIsTyping(false));
  },[]);

  useEffect(()=>{
    socket.on("messageRecived",(newMessageRecived)=>{
      if(!selectedChatCompare ||
          selectedChatCompare._id !== newMessageRecived.chat._id){
            //notification
        }else{
          setAllMessages([...allMessages , newMessageRecived]);
        };
    });
  });

  function isSameUser(){
    const isUser = selectedChat.users.some(u=>{
      if(u._id === user._id){
        return (
          <></>
        );
      }else{
        return <div>Loading</div>;
      };
    });
    return !isUser;
  };

  return (
    <div className="lg:flex flex-col w-screen h-[99vh] lg:w-[1000px] mx-auto px-2 lg:bg-zinc-950 lg:rounded-lg">
      {!groupChatProfile ? (
        <>
          <div className="w-full border-b border-zinc-800 lg:hidden py-3 fixed top-0 bg-black">
            {selectedChat.isGroupChat === true ? (
              <div className="flex gap-x-3 items-center">
                <BsArrowLeft
                  className=" text-xl cursor-pointer"
                  onClick={() => dispatch(setSelectedChat(null))}
                />
                <img src={`${selectedChat?.groupLogo}`} alt="user" onClick={() => setGroupChatProfile(true)} className=" w-12 h-12 rounded-full cursor-pointer" />
                <div
                  className="flex flex-col gap-y-1 cursor-pointer"
                  onClick={() => setGroupChatProfile(true)}
                >
                  <p className=" text-lg">{selectedChat.chatName}</p>
                  <p className="flex gap-x-1 text-sm">
                    {selectedChat.users?.slice(0,2).map((u) => {
                      return (
                        <>
                          <span
                            className={`${
                              u.userName === user.userName ? "hidden" : ""
                            }`}
                          >
                            {u.userName} {selectedChat.users.length >3 ? ", ...":""} ,
                          </span>
                        </>
                      );
                    })}
                    <span>Me</span>
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex gap-x-3 items-center">
                <BsArrowLeft
                  className=" text-xl cursor-pointer"
                  onClick={() => dispatch(setSelectedChat(null))}
                />
                <img
                  src={`${senderUser.userImage}`}
                  alt="user"
                  className=" w-12 h-12 rounded-full cursor-pointer"
                />

                <div className="flex flex-col gap-y-1 cursor-pointer">
                  <p className=" text-lg">
                    {senderUser.firstName} {senderUser.lastName}
                  </p>
                </div>
              </div>
            )}
          </div>
          <div className="hidden lg:flex w-[980px] py-3 border-b border-zinc-800 fixed top-0 bg-black">
            {selectedChat.isGroupChat === true ? (
              <div className="flex gap-x-3 items-center">
                <img src={`${selectedChat?.groupLogo}`} alt="user" onClick={() => setGroupChatProfile(true)} className=" w-12 h-12 rounded-full cursor-pointer" />
                <div
                  className="flex flex-col gap-y-1 cursor-pointer"
                  onClick={() => setGroupChatProfile(true)}
                >
                  <p className=" text-lg">{selectedChat.chatName}</p>
                  <p className="flex gap-x-1 text-sm">
                    {selectedChat.users?.slice(0,5).map((u) => {
                      return (
                        <>
                          <span
                            className={`${
                              u.userName === user.userName ? "hidden" : ""
                            }`}
                          >
                            {u.userName} {selectedChat.users.length >6 ? ', ...':''} ,
                          </span>
                        </>
                      );
                    })}
                    <span>Me</span>
                  </p>
                </div>
              </div>
            ) : (
              //ADD LINK TO USER PROFILE
              <div className="flex gap-x-3 items-center">
                <img
                  src={`${senderUser.userImage}`}
                  alt="user"
                  className=" w-12 h-12 rounded-full cursor-pointer"
                  onClick={()=>navigate(`/profile/${senderUser.email}`)}
                />

                <div className="flex flex-col gap-y-1 cursor-pointer" onClick={()=>navigate(`/profile/${senderUser.email}`)}>
                  <p className=" text-lg">
                    {senderUser.firstName} {senderUser.lastName}
                  </p>
                  <p className=" text-sm">{senderUser.email}</p>
                </div>
              </div>
            )}
          </div>



          {/* *****************MESSAGES HERE********************* */}



          <div className=" w-full h-[calc(100%-140px)] mt-20 flex flex-col justify-end overflow-y-hidden overflow-x-hidden scrollbar-hide">
            
            {
              chatLoading ? (<div className="w-full h-full flex justify-center items-center">
                <Spinner size="lg"/>
              </div>) : (<div className=" flex flex-col overflow-y-hidden scrollbar-hide ">
                <ScrollableChat allMessages={allMessages}/>
              </div>)
            }
          </div>

          <div className="w-full mx-auto mt-3 mb-2">
            {isTyping ? isSameUser() :<></>}
            <div className="lg:flex hidden">
              <Input
                endContent={
                  <Button isDisabled={message ? false : true} size="md" variant="light" color="primary" onClick={sendTheMessage}>
                    Send
                  </Button>
                }
                size="md"
                radius="full"
                onKeyDown={handleKeyDown}
                onChange={handleTyping}
                value={message}
                placeholder="Type a message..."
                className="mb-2 lg:mb-0"
              />
            </div>
            <div className="flex lg:hidden gap-x-2 fixed bottom-0 mt-[2px] bg-black w-[97%] pt-[1px] z-40 rounded-t-3xl">
              <Input

                size="md"
                radius="full"
                onKeyDown={handleKeyDown}
                onChange={handleTyping}
                value={message}
                placeholder="Type a message..."
                className="mb-2 lg:mb-0"
              />
              <Button isDisabled={message ? false : true} radius="full" size="md" color="primary" onTouchStart={sendTheMessage}>
                Send
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className="px-2 flex flex-col gap-y-3">
          <div className="flex py-3">
            <BsArrowLeft
              className=" text-2xl cursor-pointer"
              onClick={() => setGroupChatProfile(false)}
            />
          </div>
          <div className="flex flex-col items-center gap-y-3 w-full justify-center">
            {
              !updateLogo ? (
                <img
                  src={`${selectedChat?.groupLogo}`}
                  alt="user"
                  className=" lg:w-32 lg:h-32 w-20 h-20 rounded-full"
                />
              ) : (
                <GroupLogoUpdate setUpdateLogo={setUpdateLogo}/>
              )
            }
            {
              updateLogo ? (<Button
                onClick={()=>setUpdateLogo(false)}
                color="danger"
                variant="bordered"
              >
                Cancel
              </Button>) : (
                <Button
                color="primary"
                onClick={()=>setUpdateLogo(true)}
                variant="flat"
              >
                Update Profile
              </Button>
              )
            }
          </div>
          <div className=" flex justify-center text-3xl font-bold items-center">
            {
              changeGroupName ? ( <div className="flex gap-x-2 items-center">
                <Input
                  type="text"
                  placeholder="Group name..."
                  onChange={(e)=>setGroupName(e.target.value)}
                />
                <Button color="primary" variant="flat" size="sm" onClick={groupRename}>
                  Rename
                </Button>
                <Button variant="flat" size="sm" onClick={()=>setChangeGroupName(false)}>
                  Cancel
                </Button>
              </div>) : (<div className="flex gap-x-2 items-center mb-1">
                {selectedChat.chatName}
                <p onClick={()=>setChangeGroupName(true)}>
                  <MdOutlineModeEditOutline className="text-2xl cursor-pointer"/>
                </p>
              </div>)
            }
          </div>

          <div className="flex flex-col mx-auto lg:w-[50%] w-full">
            <div className="text-xl my-2 flex justify-between">
              <p>Users</p>
              {
                user?._id === selectedChat?.groupAdmin?._id && (<Button onPress={onOpen} variant="flat" color="primary" size="sm">
                Add user
              </Button>)
              }
            </div>
            <div className="flex flex-col gap-y-3">
              {selectedChat?.users?.map((u) => {
                return (
                  <div
                    className={`flex gap-x-3 justify-between items-center px-3 py-2 bg-zinc-800 rounded-lg cursor-pointer `}
                  >
                    <div className="flex gap-x-3 items-center">
                      <div>
                        <img
                          src={`${u?.userImage}`}
                          alt="user"
                          className=" w-9 h-9 rounded-full"
                        />
                      </div>
                      <div className="flex flex-col gap-y-1">
                        <p>
                          {u?.firstName} {u?.lastName}
                        </p>
                        <p className=" text-sm">{u?.email}</p>
                      </div>
                    </div>
                    <div>
                      {
                        u?._id === selectedChat?.groupAdmin?._id ? (<Button color="primary" variant="light">Admin</Button>) : (
                          user?._id === selectedChat?.groupAdmin?._id && <Button onClick={()=>removeUser(u._id)} color="danger" variant="flat">Remove</Button>
                        )
                      }
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="w-full mt-5">
            <Button
              onClick={deleteGroup}
              color="danger"
            >
              Delete Group
          </Button>
            </div>
          </div>
          
        </div>
      )}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="center"
        backdrop="blur"
        className="z-40 overflow-y-visible"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Add user
              </ModalHeader>
              <ModalBody>
                <Input
                  endContent={
                    searchBtn ? (
                      <Button
                        onClick={handleSearchUsers}
                        size="sm"
                        variant="flat"
                        color="primary"
                        isDisabled={search ? false : true}
                      >
                        Search
                      </Button>
                    ) : (
                      <Button
                        variant="flat"
                        onClick={() => {
                          setSearchResult([]);
                          setSearchBtn(true);
                        }}
                        size="sm"
                      >
                        cancel
                      </Button>
                    )
                  }
                  onKeyDown={handleKey}
                  onChange={(e) => setSearch(e.target.value)}
                  label="Search users"
                  type="search"
                  variant="bordered"
                />

                <div
                  className={`${
                    searchResult.length === 0 ? "hidden" : "flex"
                  } flex-col gap-y-2 absolute top-[130px] w-[90%] px-2 py-2 bg-zinc-900 z-50 border border-zinc-700 rounded-lg overflow-visible`}
                >
                  {loading ? (
                    <Spinner size="md" />
                  ) : (
                    searchResult?.slice(0, 4).map((u) => {
                      return (
                        <div
                          onClick={() => {
                            setUsers(u._id);
                            setUsersFull(u);
                            setSearchResult([]);
                            setSearchBtn(true);
                          }}
                          className={` flex gap-x-3 items-center px-3 py-2 bg-zinc-800 rounded-lg hover:bg-blue-600 ${
                            user._id === u._id ? "hidden" : ""
                          } ${selectedChat?.users.find((us)=>us._id === u._id) ? 'hidden':''}`}
                        >
                          <div>
                            <img
                              src={`${u.userImage}`}
                              alt="user"
                              className=" w-9 h-9 rounded-full"
                            />
                          </div>
                          <div className="flex flex-col gap-y-1">
                            <p>
                              {u.firstName} {u.lastName}
                            </p>
                            <p className=" text-sm">{u.email}</p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="flex gap-x-2 flex-wrap mb-1">
                  {
                    usersFull && (
                      <span className="px-2 py-1 flex gap-x-2 bg-zinc-800 rounded-lg max-w-fit text-sm items-center">
                        {usersFull?.userName}
                        <p
                          onClick={() => {
                            setUsers(null);
                            setUsersFull(null);
                          }}
                          className=" cursor-pointer"
                        >
                          <IoClose />
                        </p>
                      </span>
                    )
                  }  
                </div>

                <p
                className="text-sm"
                >
                  Note: You can add one user at a time.
                </p>

              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="flat"
                  onPress={onClose}
                  onClick={() => {
                    setUsers();
                    setUsersFull();
                  }}
                >
                  Close
                </Button>
                <Button
                  color="primary"
                  onPress={onClose}
                  isDisabled={usersFull === null ? true : false}
                  onClick={addUser}
                >
                  Add
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ChatBox;

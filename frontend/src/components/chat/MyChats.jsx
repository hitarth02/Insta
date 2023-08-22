import React, { useEffect, useState } from "react";
import {
  Spinner,
} from "@nextui-org/react";
import { FiSearch } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BsArrowLeft } from "react-icons/bs";
import { fetchChats } from "../../services/utility/chatServices";
import { setChats, setSelectedChat } from "../../slices/chatSlice";
import CreateGroupChat from "./CreateGroupChat";

const MyChats = ({ setSearchBox }) => {
  const [loading, setLoading] = useState();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.user);
  const { chats, selectedChat } = useSelector((state) => state.chat);
  console.log(selectedChat);
  console.log("all chats", chats);
  const fetchAllChats = async () => {
    setLoading(true);
    try {
      const res = await fetchChats(token);
      if (res) {
        dispatch(setChats(res));
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAllChats();
  }, []);

  return (
    <div
      className={`lg:w-[400px] overflow-auto h-screen w-full lg:border-r border-zinc-800 px-5 ${
        selectedChat ? "hidden" : "inline-block"
      } ${selectedChat ? "lg:inline-block" : "lg:inline-block"}`}
    >
      <div className="flex items-center justify-between py-4 border-b border-zinc-800">
        <div className="flex gap-x-2 items-center">
          <BsArrowLeft
            className=" text-xl cursor-pointer"
            onClick={() => {
              navigate("/");
              dispatch(setSelectedChat(null));
            }}
          />
          <p className="pl-2 text-xl">{user?.userName}</p>
        </div>
        <div>
          <FiSearch
            onClick={() => setSearchBox(true)}
            size={20}
            className=" cursor-pointer"
          />
        </div>
      </div>
      <div>
        <div className=" text-xl text-zinc-300 mb-4 mt-3 flex justify-between ">
          <p>Messages</p>
          <CreateGroupChat fetchAllChats={fetchAllChats} />
        </div>
        {loading ? (
          <Spinner className="flex justify-center mt-5" size="lg" />
        ) : (
          <div className="flex flex-col gap-y-3">
            {chats.length === 0 && (
              <p className=" text-center text-zinc-400 mt-5">
                Search a user and start a chat.
              </p>
            )}
            {chats.map((chat) => {
              const filterId = chat?.users.filter((u) => u._id !== user._id);
              const connectedUser = filterId[0];
              return (
                <div
                  onClick={() => dispatch(setSelectedChat(chat))}
                  className={`flex gap-x-3 items-center px-3 py-2 rounded-lg hover:bg-zinc-700 cursor-pointer ${
                    selectedChat?._id === chat._id
                      ? "bg-blue-600"
                      : "bg-zinc-800 "
                  }`}
                >
                  {chat.isGroupChat === true ? (
                    <div className="flex gap-x-2 items-center">
                      <img
                        src={`${chat?.groupLogo}`}
                        alt="grp"
                        className="w-9 h-9 rounded-full"
                      />
                      <div className="flex flex-col gap-y-1 text-sm">
                        <div className="text-base">
                          {chat?.chatName}
                        </div>
                        <span>{chat?.latestMessage?.content ? (`${chat?.latestMessage?.sender?.userName}: ${chat?.latestMessage?.content}`) : 'Start conversation'}</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div>
                        <img
                          src={`${connectedUser?.userImage}`}
                          className=" w-9 h-9 rounded-full"
                        />
                      </div>
                      <div className="flex flex-col gap-y-1">
                        <div>
                          {connectedUser?.firstName} {connectedUser?.lastName}
                        </div>
                        <div className=" text-sm">{chat?.latestMessage?.content ? (chat?.latestMessage?.content):'Start conversation'}</div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyChats;

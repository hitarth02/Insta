import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from "../../utils/chatLogics";
import { useSelector } from "react-redux";
import { Avatar } from "@nextui-org/react";

const ScrollableChat = ({ allMessages }) => {
  const { user } = useSelector((state) => state.user);
  
  return (

      <ScrollableFeed className=" scrollbar-hide ">
        {allMessages?.map((m, i) => {
          return (
            <div className="flex items-center gap-x-1 " key={i}>
              {(isSameSender(allMessages, m, i, user._id) ||
                isLastMessage(allMessages, i, user._id)) && (
                <Avatar src={`${m.sender.userImage}`} size="sm" className="mr-1" />
              )}
              <span
                className={`  ${
                  m.sender._id !== user._id ? "bg-zinc-700" : "bg-blue-600"
                } px-3 py-2 rounded-3xl my-1 max-w-[75%] ${m.sender._id === user._id ? '':''}`}

                style={{
                    marginLeft:isSameSenderMargin(allMessages , m , i , user._id),
                    marginTop:isSameUser(allMessages , m , i , user._id) ? 2:10
                }}
              >
                {m.content}
              </span>
            </div>
          );
        })}
      </ScrollableFeed>

  );
};

export default ScrollableChat;

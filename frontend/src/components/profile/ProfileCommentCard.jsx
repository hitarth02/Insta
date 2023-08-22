import React from 'react';
import { AiOutlineDelete } from "react-icons/ai";
import { removeComment } from "../../services/utility/postServices";
import { useSelector } from "react-redux";
import {timeAgo} from '../../utils/timeAgo';

const ProfileCommentCard = ({ comment, postId, setPost }) => {
    const { token } = useSelector((state) => state.user);
  const { user } = useSelector((state) => state.user);
  const time = comment.createdAt;
                      const localDate = new Date(time);
                      const agoTime = timeAgo(new Date(`${localDate}`));

  const deleteComment = async (cId) => {
    try {
      const res = await removeComment(
        { postId: postId, commentId: cId },
        token
      );
      setPost(res);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex flex-row justify-between">
      <div className="flex gap-x-3 pr-1">
        <img
          src={`${comment?.user?.userImage}`}
          alt="user"
          className=" w-8 h-8 rounded-full"
        />
        <div>
          <p className="flex gap-x-4">
            <p className=" text-sm font-bold">{comment?.user?.userName}</p>
            <p className=" text-xs text-zinc-400 ">
              {agoTime}
            </p>
          </p>
          {comment?.comment}
        </div>
      </div>
      {user.email === comment?.user?.email && (
        <div
          onClick={() => deleteComment(comment._id)}
          className=" text-lg cursor-pointer"
        >
          <AiOutlineDelete />
        </div>
      )}
    </div>
  )
};

export default ProfileCommentCard;
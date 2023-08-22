import React, { useEffect, useState } from "react";
import { getAllReels } from "../services/utility/postServices";
import { Avatar, Card, CardBody, CardHeader, Spinner } from "@nextui-org/react";
import { BigPlayButton, Player } from "video-react";
import { NavLink } from "react-router-dom";
import {
  FaRegComment,
  FaRegHeart,
  FaHeart,
  FaRegBookmark,
  FaBookmark,
} from "react-icons/fa";
import { BiNavigation } from "react-icons/bi";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { useSelector } from "react-redux";
import { timeAgo } from "../utils/timeAgo";

const Reels = () => {
  const [allReels, setAllReels] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state) => state.user);
  const { user } = useSelector((state) => state.user);
  const [playing , setPlaying] = useState();
  const fetchAllReels = async () => {
    setLoading(true);
    try {
      const res = await getAllReels();
      if (res) {
        setAllReels(res);
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAllReels();
  }, []);

  return (
    <div>
      {loading ? (
        <Spinner size="lg" />
      ) : allReels?.length === 0 ? (
        <div className=" text-center text-lg text-zinc-400 mt-10">
          No Reels found
        </div>
      ) : (
        allReels?.map((reel) => {
          const time = reel?.createdAt;
          const localDate = new Date(time);
          const agoTime = timeAgo(new Date(`${localDate}`));
          return (
            <Card className=" max-w-[480px] mb-5">
              <CardHeader>
                <NavLink
                  to={`/profile/${reel.user.email}`}
                  className="flex gap-5 mx-1"
                >
                  <Avatar
                    isBordered
                    radius="full"
                    size="md"
                    src={`${reel.user.userImage}`}
                  />
                  <div className="flex flex-col gap-1 items-start justify-center">
                    <h4 className="text-small font-semibold leading-none text-default-600">
                      {reel.user.firstName} {reel.user.lastName}
                    </h4>
                    <h5 className="text-small tracking-tight text-default-400">
                      @{reel.user.userName}
                    </h5>
                  </div>
                </NavLink>
              </CardHeader>
              <CardBody >
                <video playsInline autoPlay={playing===reel?.reel}  aspectRatio="9:16" onClick={()=>setPlaying(reel?.reel)} >
                  <source src={`${reel?.reel}`} type="video/mp4"/>
                  
                </video>
              </CardBody>
              <div className="mx-5 mt-2 mb-0">
                <div className="flex items-center justify-between">
                  <div className="flex gap-x-4 text-xl">
                    {reel.likes.includes(user._id) ? (
                      <FaHeart
                        // onClick={() => unLikePost(reel._id)}
                        className=" text-2xl text-red-500 cursor-pointer"
                      />
                    ) : (
                      <FaRegHeart
                        className=" text-2xl cursor-pointer"
                        // onClick={() => likePost(reel._id)}
                      />
                    )}
                    <FaRegComment
                      // onClick={() => clickHandler(reel._id)}
                      className=" text-2xl cursor-pointer"
                    />
                    <BiNavigation className=" text-2xl cursor-pointer" />
                  </div>
                  <div className="text-2xl cursor-pointer">
                    {reel.savedBy.includes(user._id) ? (
                      <FaBookmark
                        // onClick={() => removeFromCollection(reel._id)}
                      />
                    ) : (
                      <FaRegBookmark
                        // onClick={() => saveToCollection(reel._id)}
                      />
                    )}
                  </div>
                </div>
                <p className=" my-1 text-zinc-300">{reel.likes.length} likes</p>
              </div>
              <div className="mx-5 mb-1">
                <NavLink
                  to={`/profile/${reel.user.email}`}
                  className=" font-bold pr-1"
                >
                  {reel.user.userName}
                </NavLink>{" "}
                {reel.caption}
              </div>
              <div 
                // onClick={() => clickHandler(reel._id)}
              >
                {reel.comments.length === 0 ? (
                  <p className="hidden"></p>
                ) : (
                  <p className="mb-2 text-sm text-zinc-400 mx-5 cursor-pointer">
                    View {reel.comments.length} Comments
                  </p>
                )}
              </div>
              <div className="mb-3 text-sm text-zinc-500 mx-5">
                Posted {agoTime} ago
              </div>
            </Card>
          );
        })
      )}
    </div>
  );
};

export default Reels;

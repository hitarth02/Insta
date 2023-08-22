import { Button, Divider , useDisclosure ,Link } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  followUser,
  getUserDetails,
  unFollowUser,
} from "../../services/utility/userServices";
import UserFollowModal from "../common/UserFollowModal";

const ProfileHeader = ({ userDetails }) => {
  const { user } = useSelector((state) => state.user);
  const { token } = useSelector((state) => state.user);
  const { usermail } = useParams();
  const dispatch = useDispatch();
  const [currentFollowers , setCurrentFollowers] = useState();
  const [currentFollowings , setCurrentFollowings] = useState();
  const [isFollow , setIsFollow] = useState(false);
  const [follower , setFollower] = useState(false);
  const [following , setFollowing] = useState(false);
  const navigate = useNavigate();
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  const getDetailsOfUser = async () => {
    try {
      const res = await getUserDetails({ email: usermail });
      setCurrentFollowers(res?.followers.length);
      setCurrentFollowings(res?.followings.length);
      if(res?.followers.some((uid)=>uid._id === user._id)){
        setIsFollow(true);
      };
      console.log("USERRRR", res);
    } catch (error) {
      console.log(error);
    };
  };

  useEffect(() => {
    getDetailsOfUser();
  }, []);

  const followTheUser = async (userId) => {
    try {
      const res = await followUser({ otherUserId: userId }, token , dispatch);
      if(res){
        setCurrentFollowers(currentFollowers+1);
        setIsFollow(true);
      };
      console.log(res);
      
    } catch (error) {
      console.log(error);
    };
  };

  const unFollowTheUser = async (userId) => {
    try {
      const res = await unFollowUser({ otherUserId: userId }, token , dispatch);
      if(res){
        setCurrentFollowers(currentFollowers-1);
        setIsFollow(false);
      };
      console.log(res);
    } catch (error) {
      console.log(error);
    };
  };

  return (
    <div>
      <div className="flex lg:gap-x-24 md:gap-x-20 gap-x-12  w-full justify-center pt-5 items-center">
        <div>
          <img
            src={userDetails?.userImage}
            alt="user"
            className="w-[80px] md:min-w-[120px] lg:min-w-[120px] aspect-square rounded-full"
          />
        </div>
        <div className="flex flex-col gap-y-3">
          <div className=" hidden md:flex lg:flex text-3xl">
            {userDetails?.userName}
          </div>
          <div className="flex gap-x-5 md:gap-x-7 lg:gap-x-7 text-base md:text-lg lg:text-lg my-2">
            <p className=" text-center flex flex-col md:flex-row lg:flex-row">
              <span className=" font-bold">{userDetails?.posts.length}</span>{" "}
              posts
            </p>
            <p className=" text-center flex flex-col md:flex-row lg:flex-row">
              <span className=" font-bold">
                {currentFollowers} 
              </span>{" "}
              <Link 
                onPress={onOpen} 
                size="md" 
                color="foreground" 
                onPressStart={()=>{
                  setFollower(true);
                  setFollowing(false);
                }}
                className=" cursor-pointer"
              >followers</Link>
            </p>
            <p className=" text-center flex flex-col md:flex-row lg:flex-row">
              <span className=" font-bold">
                {currentFollowings}
              </span>{" "}
              <Link 
                onPress={onOpen} 
                size="md" 
                color="foreground" 
                onPressStart={()=>{
                  setFollowing(true);
                  setFollower(false);
                }}
                className=" cursor-pointer"
              >followings</Link>
            </p>
          </div>
          <div className=" lg:flex md:flex lg:flex-col md:flex-col hidden">
            <p className=" text-xl mb-1">
              {userDetails?.firstName} {userDetails?.lastName}
            </p>
            <p className=" text-zinc-300">{userDetails?.bio}</p>
          </div>
        </div>
        <div
          className={`${
            user.email === usermail
              ? "md:invisible lg:invisible"
              : "md:visible lg:visible"
          } hidden md:flex lg:flex w-24`}
        >
          
            <Button
              color={isFollow ? "default":"primary"}
              size="lg"
              onClick={isFollow ? (()=> unFollowTheUser(userDetails?._id)):(() => followTheUser(userDetails?._id))}
            >
              {isFollow ? "Unfollow":"follow"}
            </Button>
          
        </div>
      </div>
      <div className="flex flex-col justify-start gap-x-2 md:hidden lg:hidden mt-5 mb-6">
        <p className=" text-lg mb-1">
          {userDetails?.firstName} {userDetails?.lastName}
        </p>
        <p className=" text-zinc-300">{userDetails?.bio}</p>
      </div>
      <div className=" mt-2">
        <div className="flex justify-center gap-x-2 md:hidden lg:hidden">
          <Button
            color="primary"
            fullWidth={true}
            className={`${user.email === usermail ? 'block' : 'hidden'}`}
            onClick={()=>navigate(`/settings`)}
          >
            Edit Profile
          </Button>
          <Button
            color={isFollow ? "default":"primary"}
            fullWidth={true}
            onClick={isFollow ? (()=> unFollowTheUser(userDetails?._id)):(() => followTheUser(userDetails?._id))}
            className={`${user.email === usermail ? 'hidden' : 'block'}`}
          >
            {isFollow ? "Unfollow":"follow"}
          </Button>
          <Button fullWidth={true}>Share profile</Button>
        </div>
      </div>
      <Divider className="my-5 md:my-8 lg:my-8" />
      <UserFollowModal onOpenChange={onOpenChange} isOpen={isOpen} follower={follower} following={following} userDetails={userDetails}/>
    </div>
  );
};

export default ProfileHeader;

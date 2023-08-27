import React, { useEffect , useRef, useState } from 'react';
import { notificationApi } from '../services/utility/userServices';
import { useSelector } from 'react-redux';
import {Spinner} from '@nextui-org/react';
import {AiFillHeart , AiOutlineComment} from 'react-icons/ai';
import { NavLink, useNavigate } from "react-router-dom";
import ProfilePostCard from '../components/profile/ProfilePostCard';
import { timeAgo } from '../utils/timeAgo';
import {RiImageAddFill} from 'react-icons/ri';
import {Modal, ModalContent, ModalHeader, ModalBody, Button, useDisclosure} from "@nextui-org/react";


const Suggestions = () => {

  const modalRef = useRef();
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const {token , user} = useSelector((state)=>state.user);
  const [noti, setAllNoti] = useState([]);
  const [loading , setLoading] = useState(false);
  const [post , setPost] = useState();

  const fetchNoti = async () =>{
    setLoading(true);
    try {
      const res = await notificationApi(token);
      console.log(res);
      if(res){
        setAllNoti(res);
      };
    } catch (error) {
      console.log(error);
    };
    setLoading(false);
  };

  useEffect(()=>{
    fetchNoti();
  },[]);

  const handlePost = (post) => {
    modalRef.current.click();
    setPost(post);
  };

  return (
    <div>
      <div className='text-2xl mt-3 px-2 lg:hidden'>
        Notifications
      </div>
      {
        loading ? <div><Spinner size="lg"/></div> : (
          <div className='flex flex-col gap-y-3 mt-5 lg:mt-0 w-full'>
            {
              noti.length === 0 ? (<p className='text-lg text-center mt-5 text-zinc-400'>No Notifications</p>) : (
                noti.map((n)=>{
                  
                  const time = n?.createdAt;
                  const localDate = new Date(time);
                  const agoTime = timeAgo(new Date(`${localDate}`));
                  return(
                    <div
                      onClick={()=>n.isPost && handlePost(n.post)}
                      className={`flex justify-between items-center lg:w-[70%] w-full mx-auto bg-zinc-900 px-2 lg:px-5 py-2 rounded-lg ${user._id === n?.currUser?._id ? 'hidden':''}`}
                    >
                      <div className='flex gap-x-2 items-center'>
                        <div className={`px-1 py-1 lg:px-2 lg:py-2 rounded-full ${n.isLike ? 'bg-red-500':'bg-blue-500'}`}>
                          {n.isLike && <AiFillHeart className=' lg:text-3xl'/>}
                          {n.isLike && n?.isPost && <AiOutlineComment className=' lg:text-3xl'/>}
                          {n?.isPost && <RiImageAddFill className=' lg:text-3xl'/>}
                        </div>
                        <div className=' lg:text-xl'>
                          <NavLink to={`/profile/${n?.currUser?.email}`}>{n.notification}</NavLink> <span className='text-zinc-500 lg:text-base text-sm'>{agoTime}</span>
                        </div>
                      </div>
                      <div 
                        
                        className='px-2'
                      >
                        <img src={`${n.post?.image}`} alt='user' className='lg:w-16 lg:h-16 w-10 h-10'/>
                      </div>
                    </div>
                  )
                })
              )
            }
          </div>
        )
      }
      
      <Button ref={modalRef} onPress={onOpen} className="hidden">
        Open Modal
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Post</ModalHeader>
              {loading ? (
                <Spinner size="lg" />
              ) : (
                <ProfilePostCard
                  post={post}
                  setPost={setPost}
                  onClose={onClose}
                />
              )}
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
};

export default Suggestions;
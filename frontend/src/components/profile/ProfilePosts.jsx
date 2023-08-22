import { Spinner, Tab, Tabs, useSkeleton } from "@nextui-org/react";
import React, { useRef, useState } from "react";
import { BsGrid3X3, BsBookmarkFill } from "react-icons/bs";
import { useSelector } from "react-redux";
import { getSinglePost } from "../../services/utility/postServices";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import ProfilePostCard from "./ProfilePostCard";
import { AiFillPlaySquare } from "react-icons/ai";
import { Player , BigPlayButton } from "video-react";

const ProfilePosts = ({ userDetails, setUserDetails }) => {
  const [showPosts, setShowPosts] = useState(true);
  const [showReels, setShowReels] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const [post, setPost] = useState();
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.user);
  const { token } = useSelector((state) => state.user);
  const modalRef = useRef();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const savedPosts = userDetails?.savedPosts;

  const fetchAPost = async (postId) => {
    setLoading(true);
    try {
      const res = await getSinglePost({ postId: postId }, token);
      if (res) {
        setPost(res);
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const openPostModal = (postId) => {
    modalRef.current.click();
    fetchAPost(postId);
  };

  return (
    <div>
      <div className="flex justify-center">
        {user.email === userDetails?.email && (
          <Tabs aria-label="Options" color="primary" variant="bordered">
            <Tab
              key="Photos"
              title={
                <div
                  className="flex items-center space-x-2"
                  onClick={() => {
                    setShowPosts(true);
                    setShowReels(false);
                    setShowSaved(false);
                  }}
                >
                  <BsGrid3X3 />
                  <span>Posts</span>
                </div>
              }
            />
            <Tab
              key="Reel"
              title={
                <div
                  className="flex items-center space-x-2"
                  onClick={() => {
                    setShowPosts(false);
                    setShowReels(true);
                    setShowSaved(false);
                  }}
                >
                  <AiFillPlaySquare />
                  <span>Reels</span>
                </div>
              }
            />
            <Tab
              key="Saved"
              title={
                <div
                  className="flex items-center space-x-2"
                  onClick={() => {
                    setShowPosts(false);
                    setShowReels(false);
                    setShowSaved(true);
                  }}
                >
                  <BsBookmarkFill />
                  <span>Saved</span>
                </div>
              }
            />
          </Tabs>
        )}
      </div>

      <div>
        {showPosts && (
          <div>
            {userDetails?.posts.length === 0 ? (
              <div className=" flex justify-center text-lg text-zinc-400 mt-10">
                No Posts
              </div>
            ) : (
              <div className=" grid grid-cols-3 mt-5">
                {userDetails?.posts.map((post) => {
                  return (
                    <div onClick={() => openPostModal(post._id)}>
                      <img
                        src={post?.image}
                        alt="post"
                        className=" aspect-square object-cover md:p-2 lg:p-2 p-1 rounded-lg"
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {showReels && (
          <div>
            {userDetails?.reels.length === 0 ? (
              <div className=" flex justify-center  text-lg text-zinc-400 mt-10">
                No Reels
              </div>
            ) : (
              <div className=" grid grid-cols-3 gap-x-2 gap-y-2 mt-5">
                {userDetails?.reels.map((reel) => {
                  return (
                    <div >
                      <AiFillPlaySquare className=" absolute z-10 text-2xl mx-2 my-2"/>
                      <Player
                        src={`${reel?.reel}`}
                        autoPlay={false}
                        className={" pointer-events-none"}
                      >
                        <BigPlayButton className=" invisible"/>
                      </Player>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {showSaved && (
          <div>
            {userDetails?.savedPosts.length === 0 ? (
              <div className=" flex justify-center  text-lg text-zinc-400 mt-10">
                No saved Posts
              </div>
            ) : (
              <div className=" grid grid-cols-3 mt-5">
                {savedPosts?.map((post) => {
                  return (
                    <div onClick={() => openPostModal(post._id)}>
                      <img
                        src={post?.image}
                        alt="post"
                        className=" aspect-square object-cover md:p-2 lg:p-2 p-1 rounded-lg"
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
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
                  setUserDetails={setUserDetails}
                />
              )}
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ProfilePosts;

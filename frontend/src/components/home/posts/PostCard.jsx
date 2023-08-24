import React, { useState } from "react";
import {
  Card,
  CardHeader,
  Avatar,
  CardBody,
  Textarea,
} from "@nextui-org/react";
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
  addComment,
  addLike,
  removeLike,
  savePost,
  unSavePost,
} from "../../../services/utility/postServices";
import { useDispatch, useSelector } from "react-redux";
import { useRef } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { useForm } from "react-hook-form";
import CommentCard from "../../common/CommentCard";
import { timeAgo } from "../../../utils/timeAgo";

const PostCard = ({ post, setAllPosts, allPosts }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { token } = useSelector((state) => state.user);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const inputRef = useRef();
  const [postId, setPostId] = useState();
  const [textComment, setTextComment] = useState("");
  const [isLikeLoading , setIsLikeLoading] = useState(false);
  const [isUnLikeLoading , setIsUnLikeLoading] = useState(false);
  const time = post?.createdAt;
  const localDate = new Date(time);
  const agoTime = timeAgo(new Date(`${localDate}`));

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const likePost = async (postId) => {
    setIsLikeLoading(true);
    try {
      const res = await addLike({ postId: postId }, token, dispatch);
      console.log("res", res);
      const newPosts = allPosts.map((posts) => {
        if (posts._id === res._id) {
          return res;
        } else {
          return posts;
        }
      });
      setAllPosts(newPosts);
    } catch (error) {
      console.log(error);
    };
    setIsLikeLoading(false);
  };

  const unLikePost = async (postId) => {
    setIsUnLikeLoading(true);
    try {
      const res = await removeLike({ postId: postId }, token, dispatch);
      console.log("unres", res);
      const newPosts = allPosts.map((posts) => {
        if (posts._id === res._id) {
          return res;
        } else {
          return posts;
        }
      });
      setAllPosts(newPosts);
    } catch (error) {
      console.log(error);
    };
    setIsUnLikeLoading(false);
  };

  const saveToCollection = async (postId) => {
    try {
      const res = await savePost({ postId: postId }, token, dispatch);
      const newPosts = allPosts.map((posts) => {
        if (posts._id === res?._id) {
          return res;
        } else {
          return posts;
        }
      });
      setAllPosts(newPosts);
    } catch (error) {
      console.log(error);
    }
  };

  const removeFromCollection = async (postId) => {
    try {
      const res = await unSavePost({ postId: postId }, token, dispatch);
      const newPosts = allPosts.map((posts) => {
        if (posts._id === res?._id) {
          return res;
        } else {
          return posts;
        }
      });
      setAllPosts(newPosts);
    } catch (error) {
      console.log(error);
    }
  };

  const clickHandler = (pId) => {
    setPostId(null);
    setPostId(pId);
    inputRef.current.click();
  };

  const addUserComment = async (data) => {
    try {
      const res = await addComment(
        { postId: postId, comment: data.comment },
        token
      );
      const newPosts = allPosts.map((posts) => {
        if (posts._id === res._id) {
          return res;
        } else {
          return posts;
        }
      });
      setAllPosts(newPosts);
      setTextComment("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Card className="py-2 max-w-fit mx-auto lg:mx-0 bg-zinc-950">
        <CardHeader>
            <NavLink
              to={`/profile/${post.user.email}`}
              className="flex gap-5 mx-1"
            >
              <Avatar
                isBordered
                radius="full"
                size="md"
                src={`${post.user.userImage}`}
              />
              <div className="flex flex-col gap-1 items-start justify-center">
                <h4 className="text-small font-semibold leading-none text-default-600">
                  {post.user.firstName} {post.user.lastName}
                </h4>
                <h5 className="text-small tracking-tight text-default-400">
                  @{post.user.userName}
                </h5>
              </div>
            </NavLink>
        </CardHeader>
        <CardBody className="overflow-visible py-2">
          <img
            src={`${post.image}`}
            alt="card"
            className=" aspect-auto max-w-[480px]"
          />
        </CardBody>
        <div className="mx-5 mt-2 mb-0">
          <div className="flex items-center justify-between">
            <div className="flex gap-x-4 text-xl">
              {post.likes.includes(user._id) ? (
                <FaHeart
                  onClick={() => isUnLikeLoading ? '' : unLikePost(post._id)}
                  className=" text-2xl text-red-500 cursor-pointer"
                />
              ) : (
                <FaRegHeart
                  className=" text-2xl cursor-pointer"
                  onClick={() => isLikeLoading ? (''):(likePost(post._id))}
                />
              )}
              <FaRegComment
                onClick={() => clickHandler(post._id)}
                className=" text-2xl cursor-pointer"
              />
              <BiNavigation className=" text-2xl cursor-pointer" />
            </div>
            <div className="text-2xl cursor-pointer">
              {post.savedBy.includes(user._id) ? (
                <FaBookmark onClick={() => removeFromCollection(post._id)} />
              ) : (
                <FaRegBookmark onClick={() => saveToCollection(post._id)} />
              )}
            </div>
          </div>
          <p className=" my-1 text-zinc-300">{post.likes.length} likes</p>
        </div>
        <div className="mx-5 mb-1">
          <NavLink
            to={`/profile/${post.user.email}`}
            className=" font-bold pr-1"
          >
            {post.user.userName}
          </NavLink>{" "}
          {post.caption}
        </div>
        <div onClick={() => clickHandler(post._id)}>
          {post.comments.length === 0 ? (
            <p className="hidden"></p>
          ) : (
            <p className="mb-2 text-sm text-zinc-400 mx-5 cursor-pointer">
              View {post.comments.length} Comments
            </p>
          )}
        </div>
        <div className="mb-3 text-sm text-zinc-500 mx-5">
          Posted {agoTime} ago
        </div>
      </Card>
      <Button ref={inputRef} onPress={onOpen} className={"hidden"}>
        Open Modal
      </Button>
      <Modal
        scrollBehavior={"inside"}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Comments
              </ModalHeader>
              <ModalBody>
                {post.comments.length === 0 ? (
                  <p className=" text-center text-zinc-400 mt-3">No Comments</p>
                ) : (
                  post.comments.map((comment) => {
                    return (
                      <CommentCard
                        comment={comment}
                        postId={post._id}
                        key={comment._id}
                        setAllPosts={setAllPosts}
                        allPosts={allPosts}
                      />
                    );
                  })
                )}
              </ModalBody>
              <ModalFooter className=" flex flex-col">
                <form
                  onSubmit={handleSubmit(addUserComment)}
                  className=" flex items-center w-full gap-x-2"
                >
                  <Textarea
                    type="text"
                    placeholder="Add a comment..."
                    minRows={1}
                    maxRows={4}
                    fullWidth={true}
                    {...register("comment", { required: true })}
                    value={textComment}
                    onChange={(e) => setTextComment(e.target.value)}
                  />
                  <Button type="submit" color="primary">
                    Add
                  </Button>
                </form>
                {errors.comment && (
                  <span className=" mt-1 text-sm text-red-500">
                    Comment cant be empty
                  </span>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default PostCard;

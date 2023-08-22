import React, { useEffect, useState } from "react";
import SideProfile from "../components/common/SideProfile";
import { getAllPosts } from "../services/utility/postServices";
import { Button, Card, Link, Navbar, NavbarBrand, NavbarContent, NavbarItem, Skeleton } from "@nextui-org/react";
import PostCard from "../components/home/posts/PostCard";
import Insta from '../assets/insta.png';
import {BiMessageSquareDots} from 'react-icons/bi';
import { useNavigate } from "react-router-dom";

const Feed = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const fetchAllPosts = async () => {
    setLoading(true);
    try {
      const res = await getAllPosts();
      if (res) {
        setAllPosts(res);
      }
    } catch (error) {
      console.log(error);
    };
    setLoading(false);
  };

  useEffect(() => {
    fetchAllPosts();
  }, []);

  return (
    <div className="relative lg:ml-5 ">
      <Navbar shouldHideOnScroll={true} isBordered={true} className=" inline-block md:hidden lg:hidden mb-5">
      <NavbarBrand>
        <img
          src={Insta}
          className=" w-[35px]"
        />
        <p className="pl-2">Instagram</p>
      </NavbarBrand>
      <NavbarContent justify="end">
        <NavbarItem >
          <Button onClick={()=>navigate('/messenger')} color="default" href="#" variant="flat">
            <BiMessageSquareDots className=" text-2xl text-blue-500" />
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
      <div>
        {loading ? (
          <div className="flex flex-col ">
            <Card className="max-w-[450px] space-y-5 p-4" radius="2xl">
              <Skeleton className="rounded-lg">
                <div className="h-24 rounded-lg bg-default-300"></div>
              </Skeleton>
              <div className="space-y-3">
                <Skeleton className="w-3/5 rounded-lg">
                  <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
                </Skeleton>
                <Skeleton className="w-4/5 rounded-lg">
                  <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
                </Skeleton>
                <Skeleton className="w-2/5 rounded-lg">
                  <div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
                </Skeleton>
              </div>
            </Card>
          </div>
        ) : (
          <div className="flex flex-col gap-y-6">
            {allPosts?.length === 0 ? (
              <div>No posts found</div>
            ) : (
              allPosts?.map((p) => {
                return <PostCard allPosts={allPosts} setAllPosts={setAllPosts} post={p} />;
              })
            )}
          </div>
        )}
        <p className=" text-gray-500 text-center md:mx-28 lg:mx-28 lg:text-left md:text-left mt-5 ">
          You have reached the bottom
        </p>
        <div className=" h-20 md:h-5 lg:h-5 w-full"></div>
      </div>
      <div className=" fixed top-5 right-20">
        <SideProfile />
      </div>
    </div>
  );
};

export default Feed;

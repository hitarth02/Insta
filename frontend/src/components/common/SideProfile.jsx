import { Avatar, Button } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { getAllusers } from "../../services/utility/userServices";

const SideProfile = () => {
  const { user } = useSelector((state) => state.user);
  const [allUsers, setAllUsers] = useState([]);
  const navigate = useNavigate();
  allUsers.length = 4;

  const fetchProfiles = async () => {
    try {
      const res = await getAllusers();
      if (res) {
        setAllUsers(res);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(()=>{
    fetchProfiles();
  },[]);

  return (
    <div className=" w-[400px] bg-zinc-900 rounded-lg mt-10 hidden 2xl:block pb-4">
      <div className="flex justify-start items-center mx-5 py-5">
        <NavLink to={`/profile/${user.email}`} className="flex gap-5">
          <Avatar
            isBordered
            radius="full"
            size="lg"
            src={`${user.userImage}`}
          />
          <div className="flex flex-col gap-1 items-start justify-center">
            <p className="text-lg font-semibold leading-none text-default-600">
              {user.firstName} {user.lastName}
            </p>
            <h5 className="text-small tracking-tight text-default-400">
              @{user.userName}
            </h5>
          </div>
        </NavLink>
        <Button color="primary" size="md" className="mx-8" onClick={()=>navigate("/settings")}>
          Settings
        </Button>
      </div>

      <div className="mx-6">
        <p className="mb-2 text-lg text-zinc-300">Suggested for you</p>
        <div>
          {allUsers?.length === 0 ? (
            <div>No suggestions</div>
          ) : (
            <div>
              {allUsers?.map((aUser) => {
                return (
                  <div className={`flex justify-between items-center py-2 ${user.email === aUser.email ? 'hidden' : ''}`}>
                    <NavLink
                      to={`/profile/${aUser.email}`}
                      className="flex gap-5"
                    >
                      <Avatar
                        isBordered
                        radius="full"
                        size="md"
                        src={`${aUser.userImage}`}
                      />
                      <div className="flex flex-col gap-1 items-start justify-center">
                        <p className="text-base font-semibold leading-none text-default-600">
                          {aUser.firstName} {aUser.lastName}
                        </p>
                        <h5 className="text-small tracking-tight text-default-400">
                          @{aUser.userName}
                        </h5>
                      </div>
                    </NavLink>
                    <Button color="primary" size="sm" className="mx-8" onClick={()=>navigate(`/profile/${aUser.email}`)}>
                      View profile
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <div className="mx-5 mt-6">
        <p className=" text-sm text-zinc-600 cursor-pointer">
          About . Meta . services . contact us . Privacy . Terms . Jobs . Location . Language
        </p>
        <p className=" text-sm text-zinc-600 cursor-pointer mt-4">© 2023 INSTAGRAM FROM META</p>
      </div>
    </div>
  );
};

export default SideProfile;

import React, { useEffect, useState } from "react";
import { Button, Input, Spinner, User } from "@nextui-org/react";
import { FiSearch } from "react-icons/fi";
import { followUser, getAllusers, searchUser } from "../services/utility/userServices";
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";

const Search = () => {
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState();
  const [filteredUsers, setFilteredUsers] = useState([]);
  const {user} = useSelector((state)=>state.user);
  const {token} = useSelector((state)=>state.user);

  const fetchAllUsers = async () => {
    setLoading(true);
    try {
      const res = await searchUser(searchKeyword , token);
      setFilteredUsers(res);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      fetchAllUsers();
    };
  };


  return (
    <div>
      {loading ? (
        <div>
          <Spinner size="lg" />
        </div>
      ) : (
        <div>
          <div className="flex gap-x-1 lg:gap-x-2 w-full items-center">
            <Input
              type="search"
              startContent={<FiSearch size={18} />}
              placeholder="Search user by user name or email.."
              className="mt-5 md:mt-0 lg:mt-0"
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button
              onClick={fetchAllUsers}
              className="mt-5 md:mt-0 lg:mt-0"
              color="primary"
            >
              Search
            </Button>
          </div>
          <div className="flex flex-col gap-y-5 mt-6 md:mt-10 lg:mt-10">
            {filteredUsers.length === 0 ? (<div className=" text-center mt-20 text-gray-400 text-xl">Search users...</div>) :
            (
              filteredUsers.map((u) => {
                return (
                  <Link to={`/profile/${u.email}`} className={`flex items-center bg-zinc-800 rounded-xl px-2 md:px-3 lg:px-3 py-3 md:py-5 lg:py-5 ${user.email === u.email ? 'hidden':''}`}>
                    <div className="flex gap-x-5 items-center lg:w-[50%]">
                      <img src={u.userImage} alt="user" className=" w-[40px] lg:w-[80px] md:w-[80px] aspect-square rounded-full"/>
                      <div className="flex flex-col gap-y-1">
                        <p className=" text-xl">{u.firstName} {u.lastName}</p>
                        <p className=" text-gray-400">@{u.userName}</p>
                      </div>
                    </div>
                    
                  </Link>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;

import {
  Button,
  Checkbox,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
  Input,
  Spinner,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { searchUser } from "../../services/utility/userServices";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { IoClose } from "react-icons/io5";
import { createGroup } from "../../services/utility/chatServices";
const CreateGroupChat = ({fetchAllChats}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [search, setSearch] = useState();
  const [groupName , setGroupName] = useState();
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token, user } = useSelector((state) => state.user);
  const [searchBtn, setSearchBtn] = useState(true);
  const [users, setUsers] = useState([]);
  const [usersFull, setUsersFull] = useState([]);
  console.log("users id array", users);
  console.log("users full array", usersFull);

  const handleSearchUsers = async () => {
    try {
      if (!search) {
        toast.error("search cannot be empty");
        return;
      }
      setLoading(true);
      const res = await searchUser(search, token);
      if (res) {
        setSearchResult(res);
        setSearchBtn(false);
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const handleKey = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearchUsers();
    }
  };

  const createGroupChat = async () => {
    try {
      const res = await createGroup({name:groupName , users:JSON.stringify(users)},token);
      console.log(res);
      fetchAllChats();
      setUsers([]);
      setUsersFull([]);
    } catch (error) {
      console.log(error);
    };
  };


  return (
    <>
      <Button onPress={onOpen} size="sm" variant="flat" color="primary" >
        Create group
      </Button>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="center"
        backdrop="blur"
        className="z-40 overflow-y-visible"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Create Group
              </ModalHeader>
              <ModalBody>
                <Input
                  autoFocus
                  label="Group name"
                  variant="bordered"
                  onChange={(e) => setGroupName(e.target.value)}
                />
                <Input
                  endContent={
                    searchBtn ? (
                      <Button
                        onClick={handleSearchUsers}
                        size="sm"
                        variant="flat"
                        color="primary"
                        isDisabled={search ? false : true}
                      >
                        Search
                      </Button>
                    ) : (
                      <Button
                        variant="flat"
                        onClick={() => {
                          setSearchResult([]);
                          setSearchBtn(true);
                        }}
                        size="sm"
                      >
                        cancel
                      </Button>
                    )
                  }
                  onKeyDown={handleKey}
                  onChange={(e) => setSearch(e.target.value)}
                  label="Search users"
                  type="search"
                  variant="bordered"
                />

                <div
                  className={`${
                    searchResult.length === 0 ? "hidden" : "flex"
                  } flex-col gap-y-2 absolute top-[200px] w-[90%] px-2 py-2 bg-zinc-900 z-50 border border-zinc-700 rounded-lg overflow-visible`}
                >
                  {loading ? (
                    <Spinner size="md" />
                  ) : (
                    searchResult?.slice(0, 4).map((u) => {
                      return (
                        <div
                          onClick={() => {
                            if(users.includes(u._id)){
                                toast.error("User already added");
                                return;
                            };
                            setUsers([u._id, ...users]);
                            setUsersFull([u, ...usersFull]);
                            setSearchResult([]);
                            setSearchBtn(true);
                          }}
                          className={` flex gap-x-3 items-center px-3 py-2 bg-zinc-800 rounded-lg hover:bg-blue-600 ${
                            user._id === u._id ? "hidden" : ""
                          }`}
                        >
                          <div>
                            <img
                              src={`${u.userImage}`}
                              className=" w-9 h-9 rounded-full"
                            />
                          </div>
                          <div className="flex flex-col gap-y-1">
                            <p>
                              {u.firstName} {u.lastName}
                            </p>
                            <p className=" text-sm">{u.email}</p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="flex gap-x-2 flex-wrap mb-1">
                  {usersFull?.map((u) => {
                    return (
                      <span className="px-2 py-1 flex gap-x-2 bg-zinc-800 rounded-lg max-w-fit text-sm items-center">
                        {u.userName}
                        <p
                          onClick={() => {
                            let newUsers = users.filter((us) => us !== u._id);
                            setUsers(newUsers);
                            let newUsersFull = usersFull.filter(
                              (us) => us._id !== u._id
                            );
                            setUsersFull(newUsersFull);
                          }}
                          className=" cursor-pointer"
                        >
                          <IoClose />
                        </p>
                      </span>
                    );
                  })}
                </div>

                <div
                  className={` py-2 px-1 justify-between ${
                    usersFull.length >= 2 ? "hidden" : "flex"
                  }`}
                >
                  <p className=" text-sm text-zinc-400">
                    Add atleast 2 participants
                  </p>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="flat"
                  onPress={onClose}
                  onClick={() => {
                    setUsers([]);
                    setUsersFull([]);
                  }}
                >
                  Close
                </Button>
                <Button
                  color="primary"
                  onPress={onClose}
                  isDisabled={usersFull.length >= 2 ? false : true}
                  onClick={createGroupChat}
                >
                  Create
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateGroupChat;

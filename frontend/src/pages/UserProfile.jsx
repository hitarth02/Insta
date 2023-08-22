import React, { useEffect, useState } from "react";
import ProfileHeader from "../components/profile/ProfileHeader";
import ProfilePosts from "../components/profile/ProfilePosts";
import { getUserDetails } from "../services/utility/userServices";
import { IoMdArrowBack } from "react-icons/io";
import { Spinner } from "@nextui-org/react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
  Button,
  useDisclosure,
  ModalContent,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
} from "@nextui-org/react";
import {
  NavLink,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { VscMenu } from "react-icons/vsc";
import { AiOutlineSetting } from "react-icons/ai";
import { BsBookmark } from "react-icons/bs";
import { BiLogOut } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { setToken, setUser } from "../slices/userSlice";

const UserProfile = () => {
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState();
  const { user } = useSelector((state) => state.user);
  const { usermail } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [size, setSize] = useState("sm");

  const fetchUserDetails = async () => {
    setLoading(true);
    try {
      const res = await getUserDetails({ email: usermail });
      console.log("userDetails",res);
      if (res) {
        setUserDetails(res);
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUserDetails();
    // eslint-disable-next-line
  }, [usermail]);

  const logoutUser = () => {
    try {
      dispatch(setUser(null));
      dispatch(setToken(null));
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      toast.success("Logged Out!");
      navigate("/login");
    } catch (error) {
      console.log(error);
      toast.error("Issue while logging  out!");
    }
  };

  const handleOpen = (size) => {
    setSize(size);
    onOpen();
  };

  return (
    <div>
      {loading ? (
        <div className="w-full h-screen flex flex-col justify-center items-center">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className=" w-full">
          {usermail === user.email ? (
            <div className="flex justify-between items-center h-[40px] border-b border-gray-800 mt-2 pb-2 md:hidden lg:hidden">
              <p>{userDetails?.userName}</p>

              <div>
                <Dropdown>
                  <DropdownTrigger>
                    <Button variant="light">
                      {" "}
                      <VscMenu />{" "}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu aria-label="Static Actions" className="my-2">
                    <DropdownItem key="new">
                      <NavLink
                        to={"/settings"}
                        className=" flex items-center gap-x-2"
                      >
                        <AiOutlineSetting /> Settings
                      </NavLink>
                    </DropdownItem>
                    {/* <DropdownItem key="copy">
                      <NavLink className=" flex items-center gap-x-2">
                        <BsBookmark /> Saved posts
                      </NavLink>
                    </DropdownItem> */}
                    <DropdownItem
                      key="delete"
                      color="danger"
                      className=" text-danger"
                    >
                      <div>
                        <Button color="flat" onPress={() => handleOpen("sm")}>
                          <p className="flex gap-x-2 items-center text-red-500 -mx-4">
                            <BiLogOut />
                            <p className="">Log Out</p>
                          </p>
                        </Button>
                      </div>
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-x-3 h-[40px] border-b border-gray-800 mt-2 pb-2 md:hidden lg:hidden">
              <IoMdArrowBack onClick={() => navigate(-1)} />
              <p>{userDetails?.userName}</p>
            </div>
          )}
          <ProfileHeader userDetails={userDetails} />
          <ProfilePosts userDetails={userDetails} setUserDetails={setUserDetails}/>
        </div>
      )}
      <Modal backdrop="blur" size={size} isOpen={isOpen} onClose={onClose} placement={'center'}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Log Out</ModalHeader>
              <ModalBody>
                <p>Are you sure? You will be logged out of your account!</p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onClick={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose} onClick={logoutUser}>
                  Log Out
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default UserProfile;

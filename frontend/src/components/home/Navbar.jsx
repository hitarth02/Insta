import React, { useState } from "react";
import { RiHome2Line } from "react-icons/ri";
import { BsBookmark } from "react-icons/bs";
import { FiSearch } from "react-icons/fi";
import { NavLink, matchPath, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { VscMenu } from "react-icons/vsc";
import { AiOutlineSetting, AiOutlineCompass , AiOutlineHeart} from "react-icons/ai";
import { IoCreateOutline } from "react-icons/io5";
import { BiLogOut , BiSolidVideos } from "react-icons/bi";
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
import { setToken, setUser } from "../../slices/userSlice";
import { toast } from "react-hot-toast";
import Insta from '../../assets/insta.png';
import {BiMessageSquareDots} from 'react-icons/bi';

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [size, setSize] = useState("sm");
  const { user } = useSelector((state) => state.user);
  console.log("user slice",user);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname);
  };
  const [redDot , setRedDot] = useState(true);

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

  const scrollToTop = () =>{
    window.scrollTo({
      top: 0, 
      behavior: 'smooth'
    });
  };

  return (
    <div>
      <div className=" hidden md:flex lg:flex md:w-[120px] lg:w-[300px] h-screen border-r border-gray-800 ">
        <div>
          <div className=" w-[80%] mx-auto md:text-xl lg:flex lg:text-3xl font-semibold py-5">
            <p className=" md:hidden lg:flex">
              INSTAGRAM
            </p>
            <img
              src={Insta}
              width={"60px"}
              className=" md:flex lg:hidden justify-center w-full px-5 text-xl"
            />
          </div>
          <div className=" w-[80%] mx-auto md:text-xl flex flex-col pt-10 gap-y-14">
            <div
              onClick={scrollToTop}
            >
            <NavLink
              to={"/"}
              className={`flex flex-row gap-x-3 items-center md:justify-center lg:justify-start w-full ${
                matchRoute("/") && "text-blue-500"
              }`}
            >
              <RiHome2Line className=" text-xl" />
              <p className=" hidden lg:block text-xl">Home</p>
            </NavLink>
            </div>
            <NavLink
              to={"/messenger"}
              className={`flex flex-row gap-x-3 items-center md:justify-center lg:justify-start ${
                matchRoute("messenger") && "text-blue-500 "
              }}`}
            >
              <BiMessageSquareDots className=" text-xl" />
              {/* <FiPlusSquare className=" text-xl" /> */}
              <p className=" hidden lg:block text-xl">Message</p>
            </NavLink>
            <NavLink
              to={"/upload"}
              className={`flex flex-row gap-x-3 items-center md:justify-center lg:justify-start ${
                matchRoute("upload") && "text-blue-500 "
              }}`}
            >
              <IoCreateOutline className=" text-xl" />
              {/* <FiPlusSquare className=" text-xl" /> */}
              <p className=" hidden lg:block text-xl">Create</p>
            </NavLink>
            {/* <NavLink
              to={"/reels"}
              className={`flex flex-row gap-x-3 items-center md:justify-center lg:justify-start ${
                matchRoute("reels") && "text-blue-500 "
              }}`}
            >
              <BiSolidVideos className=" text-xl" />
              
              <p className=" hidden lg:block text-xl">Reels</p>
            </NavLink>
             */}
            <NavLink
              to={"/search"}
              className={`flex flex-row gap-x-3 items-center md:justify-center lg:justify-start ${
                matchRoute("search") && "text-blue-500 "
              }}`}
            >
              <FiSearch className=" text-xl" />
              <p className=" hidden lg:block text-xl">Search</p>
            </NavLink>
            <NavLink
              to={"/activity"}
              className={`flex flex-row gap-x-3 items-center md:justify-center lg:justify-start ${
                matchRoute("activity") && "text-blue-500 "
              }}`}
              onClick={()=>setRedDot(false)}
            >
              <p className={`w-[10px] h-[10px] rounded-full bg-red-600 absolute -mt-3 ${redDot ? '':'hidden'}`} ></p>
              <AiOutlineCompass className=" text-xl" />
              <p className=" hidden lg:block text-xl">Activity</p>
            </NavLink>
          </div>
        </div>
        <div className=" absolute bottom-0 md:w-[120px] lg:w-[300px] border-t border-gray-800 text-xl cursor-pointer">
          <Dropdown>
            <DropdownTrigger>
              <div className=" h-[60px] flex mx-auto items-center lg:w-[80%]  md:justify-center lg:justify-start gap-x-3">
                <VscMenu className=" text-xl" />
                <p className=" hidden lg:block text-xl">More</p>
              </div>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Static Actions"
              variant="faded"
              className=" text-xl lg:my-3 lg:mx-5 lg:px-5 md:w-[100px] lg:w-full"
            >
              <DropdownItem color="primary" className=" mb-3">
                <NavLink
                  to={`/profile/${user.email}`}
                  className="flex gap-x-3 items-center text-lg w-[120px]"
                >
                  <img
                    src={user.userImage}
                    alt="user"
                    className=" w-[25px] aspect-square rounded-full"
                  />
                  <p className=" hidden lg:block text-lg">Profile</p>
                </NavLink>
              </DropdownItem>
              <DropdownItem color="primary" className=" mb-3">
                <NavLink
                  to={"/settings"}
                  className="flex gap-x-3 items-center text-lg w-[120px]"
                >
                  <AiOutlineSetting />
                  <p className=" hidden lg:block text-lg">Settings</p>
                </NavLink>
              </DropdownItem>
              <DropdownItem color="primary">
                <NavLink
                  to={`/profile/${user.email}`}
                  className="flex gap-x-3 items-center text-lg"
                >
                  <BsBookmark />
                  <p className=" hidden lg:block text-lg">Saved</p>
                </NavLink>
              </DropdownItem>
              <DropdownSection showDivider></DropdownSection>
              <DropdownItem>
                <div>
                  <Button color="flat" onPress={() => handleOpen("sm")}>
                    <p className="flex gap-x-3 items-center text-lg text-red-500 -mx-4">
                      <BiLogOut />
                      <p className=" hidden lg:block text-lg">Log Out</p>
                    </p>
                  </Button>
                </div>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>

      <div className=" md:hidden lg:hidden border-t border-gray-800 h-[60px] w-screen fixed bottom-0 -mb-[2px] flex gap-x-5 bg-black z-20">
        <div className=" w-[90%] mx-auto flex flex-row justify-evenly items-center gap-x-5">
          <NavLink
            to={"/"}
            className={` ${matchRoute("/") && "text-blue-500"}`}
          >
            <RiHome2Line className=" text-xl" />
          </NavLink>
          <NavLink
            to={"/activity"}
            className={` ${matchRoute("activity") && "text-blue-500"}`}
            onClick={()=>setRedDot(false)}
          >
            <p className={`w-2 h-2 rounded-full bg-red-600 absolute ${redDot ? '':'hidden'}`} ></p>
            <AiOutlineHeart className=" text-2xl" />
          </NavLink>
          {/* <NavLink
              to={"/reels"}
              className={`flex flex-row gap-x-3 items-center md:justify-center lg:justify-start ${
                matchRoute("reels") && "text-blue-500 "
              }}`}
            >
              <BiSolidVideos className=" text-xl" />
            </NavLink> */}
          <NavLink
            to={"/upload"}
            className={`${matchRoute("upload") && "text-blue-500 "}}`}
          >
            <IoCreateOutline className=" text-xl" />
          </NavLink>
          <NavLink
            to={"/search"}
            className={` ${matchRoute("search") && "text-blue-500 "}}`}
          >
            <FiSearch className=" text-xl" />
          </NavLink>
          <NavLink to={`/profile/${user.email}`}>
            <img
              src={user.userImage}
              alt="user"
              width={"26px"}
              className={` aspect-square rounded-full ${
                matchRoute(`profile/${user.email}`) && " border border-blue-500 "
              }`}
            />
          </NavLink>
        </div>
      </div>
      <Modal backdrop="blur" size={size} isOpen={isOpen} onClose={onClose}>
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

export default Navbar;

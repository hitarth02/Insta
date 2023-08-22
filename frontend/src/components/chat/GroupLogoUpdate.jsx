import { Button } from "@nextui-org/react";
import React, { useState } from "react";
import { useRef } from "react";
import { FiUpload } from 'react-icons/fi';
import { useDispatch, useSelector } from "react-redux";
import { updateUserPicture } from "../../services/utility/userServices";
import { changeGroupLogo } from "../../services/utility/chatServices";
import { setChats, setSelectedChat } from "../../slices/chatSlice";

const GroupLogoUpdate = ({setUpdateLogo}) => {

  const {selectedChat} = useSelector((state)=>state.chat);
  const {token} = useSelector((state)=>state.user);
  const [previewImage, setPreviewImage] = useState();
  const [profileImage, setProfileImage] = useState();
  const [loading, setLoading] = useState(false);
  const inputFileRef = useRef(null);
  const dispatch = useDispatch();

  const fileChangeHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      previewFile(file);
    }
  };

  const previewFile = (file) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => {
        setPreviewImage(reader.result)
    };
  };

  const clickHandler = () => {
    inputFileRef.current.click();
  };

  const fileUploadHandler = async () => {
    setLoading(true);
    try {
      const res = await changeGroupLogo({groupImg: profileImage , chatId:selectedChat._id}, token);
      console.log(res);
      dispatch(setChats(res.result));
      dispatch(setSelectedChat(res.groupChat));
      setUpdateLogo(false);
      setPreviewImage(null);
      setProfileImage(null);
    } catch (error) {
      console.log(error);
      return;
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-y-2 justify-start lg:justify-center md:justify-center gap-x-5 items-center mt-4 mb-6">
      <img
        src={previewImage ? previewImage : selectedChat.groupLogo}
        alt="user"
        className=" w-[120px] lg:w-[160px] aspect-square rounded-full my-2"
      />
      <div className="flex flex-col">

        <div className=" flex gap-x-5">
        <input
          type="file"
          ref={inputFileRef}
          accept="image/*"
          onChange={fileChangeHandler}
          className="hidden"
        />
        <Button
          onClick={clickHandler}
          isDisabled={loading}
          size="md"
          variant="flat"
        >
          Select
        </Button>
        <Button 
            color="primary"
            size="md"
            onClick={fileUploadHandler}
            isDisabled={previewImage ? false : true}
        >
          {loading ? (
            "Uploading..."
          ) : (
            <>
              <FiUpload />
              <p>Upload</p>
            </>
          )}
        </Button>
        </div>
      </div>
      <div className=" hidden md:block lg:block w-[30%]"></div>
    </div>
  );
};

export default GroupLogoUpdate;

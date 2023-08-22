import { Button } from "@nextui-org/react";
import React, { useState } from "react";
import { useRef } from "react";
import { FiUpload } from 'react-icons/fi';
import { useDispatch, useSelector } from "react-redux";
import { updateUserPicture } from "../../services/utility/userServices";

const UserImageUpdate = () => {

  const {user} = useSelector((state)=>state.user);
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
      const res = await updateUserPicture({userImage: profileImage}, token , dispatch);
      console.log(res);
      setPreviewImage(null);
      setProfileImage(null);
    } catch (error) {
      console.log(error);
      return;
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-start lg:justify-center md:justify-center gap-x-5 items-center mt-4 mb-6">
      <img
        src={previewImage ? previewImage : user.userImage}
        alt="user"
        className=" w-[80px] md:w-[120px] lg:w-[120px] aspect-square rounded-full my-2"
      />
      <div className="flex flex-col">
        <div className=" text-xl md:text-3xl lg:text-3xl mb-3 md:mb-5 lg:mb-5">
            {user.userName}
        </div>
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

export default UserImageUpdate;

import { Button, Input, Textarea } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { updateUserDetails } from "../../services/utility/userServices";
import { toast } from "react-hot-toast";

const UserInfoUpdate = () => {

    const {user} = useSelector((state)=>state.user);
    const {token} = useSelector((state)=>state.user);
    const [bio , setBio] = useState("");
    let bioLength = bio.length;
    const dispatch = useDispatch();

    const {
        setValue,
        getValues,
        register,
        handleSubmit
    } = useForm();

    const updateUserInfo = async (data) => {
        try {
            const res = await updateUserDetails({firstName: data.firstName , lastName: data.lastName , bio: data.bio} , token , dispatch);
            console.log(res);
            toast.success("Profile updated!");
        } catch (error) {
            console.log(error);
        };
    };

    // const isEdited = (data) => {
    //     if(user.firstName !== data.firstName ||
    //        user.lastName !== data.lastName || 
    //        user.bio !== data.bio)
    //       {
    //         return true
    //        }else{
    //         return false
    //        };
    // }

    useEffect(()=>{
        setValue("firstName",user.firstName);
        setValue("lastName",user.lastName);
    },[]);

  return (
    <div className=" mx-auto md:w-[80%] lg:w-[70%]">
      <form onSubmit={handleSubmit(updateUserInfo)}>
        <div className="flex flex-col md:flex-col lg:flex-row gap-y-4 justify-between mb-8">
        <Input
          key={"outside-left"}
          type="text"
          name="firstName"
          label="First name :"
          labelPlacement={"outside-left"}
          placeholder="First name"
          size="lg"
          {...register("firstName")}
        />
        <Input
          key={"outside-left"}
          type="text"
          name="lastName"
          label="Last name :"
          labelPlacement={"outside-left"}
          placeholder="Last name"
          size="lg"
          {...register("lastName")}
        />
        </div>
        <Textarea
          label="Bio :"
          labelPlacement="outside"
          name="bio"
          placeholder="Enter your Bio"
          maxRows={"5"}
          size="lg"
          {...register("bio")}
          onChange={(e) => setBio(e.target.value)}
          defaultValue={user.bio}
        />
        <p className={`mb-8 ${bioLength >100 ? ' text-red-500':''}`}>{user.bio ? user.bio.length : bioLength}/100</p>

        <Button
            type="submit"
            color="primary"
            isDisabled={bioLength >100 ? true : false}
            className="mb-10"
        >
            Save changes
        </Button>
      </form>
      <div className=" hidden md:block lg:block w-[30%]"></div>
    </div>
  );
};

export default UserInfoUpdate;

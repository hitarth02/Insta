import { Button, Input, Spinner } from "@nextui-org/react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { signup, signupToken } from "../services/utility/authServices";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setSignupData } from "../slices/authSlice";
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/react";
import { HiOutlineInformationCircle } from "react-icons/hi";

const Signup = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (data) => {
    if (data.password === data.confirmPassword) {
      const signupData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      };
      dispatch(setSignupData(signupData));
      setLoading(true);
      try {
        const res = await signupToken({ email: data.email }, navigate);
        console.log(res);
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    } else {
      toast.error("Passwords do not match!");
    };
  };

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      {loading ? (
        <div>
          <Spinner size="lg" />
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(handleSignUp)}
          className="lg:w-[35vw] md:w-[60vw] w-[90vw] flex flex-col gap-y-5 bg-zinc-900 rounded-lg lg:px-10 md:px-10 px-5 pb-10"
        >
          <div className=" text-5xl font-semibold font-mono text-center mt-10 mb-5 logo-bg">
            INSTAGRAM
          </div>
          <span className=" text-center mb-5">Create your instagram account</span>

          <div className="w-full flex gap-x-5">
            <Input
              type="text"
              {...register("firstName", { required: true })}
              size="lg"
              variant={"flat"}
              label="First name"
              color="default"
            />

            <Input
              type="text"
              {...register("lastName", { required: true })}
              size="lg"
              variant={"flat"}
              label="Last name"
              color="default"
            />
          </div>
          <div className="w-full">
            <Input
              type="email"
              {...register("email", { required: true })}
              size="lg"
              variant={"flat"}
              label="Email"
              color="default"
            />
          </div>
          <div className="w-full flex gap-x-5">
            <Input
              type="password"
              {...register("password", { required: true })}
              size="lg"
              variant={"flat"}
              label="Password"
              color="default"
            />
            <Input
              type="password"
              {...register("confirmPassword", { required: true })}
              size="lg"
              variant={"flat"}
              label="Confrim password"
              color="default"
            />
          </div>
          <Button color="primary" type="submit" className=" mt-2">
            Sign Up
          </Button>
          <div>
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className=" underline text-blue-400 cursor-pointer"
            >
              Login
            </span>
          </div>
        </form>
      )}
    </div>
  );
};

export default Signup;

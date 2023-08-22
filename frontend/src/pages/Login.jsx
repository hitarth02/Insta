import { Button, Input } from "@nextui-org/react";
import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../services/utility/authServices";
import { useForm } from "react-hook-form";

const Login = () => {

  const {
    register,
    handleSubmit
  } = useForm();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loginUser = async (data) => {
    try {
      const res = await login({email: data.email , password: data.password} , navigate , dispatch);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      <form onSubmit={handleSubmit(loginUser)} className="lg:w-[35vw] md:w-[60vw] w-[90vw] flex flex-col gap-y-5 bg-zinc-900 rounded-lg lg:px-10 md:px-10 px-5 pb-10">
        <div className=" text-5xl font-bold font-mono text-center mt-10 mb-5 logo-bg ">
          INSTAGRAM
        </div>
        <p className=" text-center mb-5">
          Login to your Instagram account
        </p>
        <div className="w-full">
          <Input type="email" {...register("email",{required:true})} size="lg" variant={"flat"} label="Email"  color="default" />
        </div>
        <div className="w-full">
          <Input type="password" {...register("password",{required:true})} size="lg" variant={"flat"} label="Password"  color="default" />
        </div>
        <Button color="primary" type="submit" className=" mt-2">
          Login
        </Button> 
        <div>
          Don't have an account? <span onClick={()=>navigate("/signup")} className=" underline text-blue-400 cursor-pointer">Sign Up</span>
        </div>
      </form>
      
    </div>
  );
};

export default Login;

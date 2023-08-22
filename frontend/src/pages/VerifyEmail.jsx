import React, { useState } from 'react';
import {Card, CardHeader, CardBody, CardFooter, Divider, Image, Button} from "@nextui-org/react";
import instaLogo from '../assets/insta-logo.png';
import {PiArrowCounterClockwiseBold} from 'react-icons/pi';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signup, signupToken } from '../services/utility/authServices';
import OtpInput from "react-otp-input";

const VerifyEmail = () => {

  const {signupData} = useSelector((state)=>state.auth);
  const [otp , setOtp] = useState();
  const navigate = useNavigate();

  const resendMail = async () => {
    try {
      const res = signupToken({ email: signupData.email }, navigate);
      console.log(res);
    } catch (error) {
      console.log(error);
    };
  };

  const {firstName , lastName , email , password } = signupData;
  const userName = email.split("@")[0];
  
  const verifyAccount = async() => {
    try {
      const res = signup({
        firstName:firstName,
        lastName:lastName,
        email:email,
        userName:userName,
        password:password,
        otp:otp
      },navigate);

      console.log(res);
    } catch (error) {
      console.log(error)
    };
  };

  return (
    <div className='w-full h-screen flex flex-col justify-center items-center'>
      <Card className="max-w-[400px] mx-5 ">
      <CardHeader className="flex gap-3">
        <Image
          alt="nextui logo"
          height={40}
          radius="sm"
          src={instaLogo}
          width={40}
        />
        <div className="flex flex-col text-xl">
          <p>Verify your email</p>
        </div>
      </CardHeader>
      <Divider/>
      <CardBody>
        <p>We have sent you an OTP on your registered email. Enter the OTP below. <br/>
        <OtpInput
              value={otp}
              onChange={setOtp}
              numInputs={4}
              renderInput={(props) => (
                <input
                  {...props}
                  className="bg-grey-800 mx-auto h-[48px] rounded-lg otp shadow-inputShadow mr-[26px] mt-5 text-white font-inter otp text-xl "
                  placeholder="-"
                />
              )}
        />
        <Button
          color='primary'
          onClick={verifyAccount}
          className='mt-5 mb-3 mx-auto w-full'
          size='lg'
        >
          Verify Account
        </Button>
        <br/> If you didn't recieved mail click on resend email.</p>
      </CardBody>
      <Divider/>
      <CardFooter>
        <div
          onClick={resendMail}
          className=' flex gap-x-2 items-center cursor-pointer'
        >
          <p><PiArrowCounterClockwiseBold className=' text-blue-500 text-lg'/></p> Resend email
        </div>
      </CardFooter>
    </Card>
    </div>
  )
};

export default VerifyEmail;
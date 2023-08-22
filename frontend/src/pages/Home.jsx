import React, { useState } from "react";
import { useSelector } from "react-redux";
import Navbar from "../components/home/Navbar";
import { Outlet } from 'react-router-dom';

const Home = () => {

  return (
    <div>
      <div className="lg:flex lg:flex-row md:flex md:flex-row lg:w-screen lg:max-w-full md:w-screen md:max-w-full flex flex-col-reverse relative">
        <Navbar/>
        <div className="overflow-auto h-[calc(100vh-10px)] lg:h-[calc(100vh-10px)] md:h-[calc(100vh-10px)] flex-1 ">
          <div className="mx-auto lg:w-9/12 md:w-9/12 w-[95vw] lg:max-w-[1000px] md:max-w-[1000px] md:pt-5 lg:pt-5 ">
            <Outlet/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
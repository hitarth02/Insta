import { Button } from '@nextui-org/react';
import React, { useState } from 'react';
import { useRef } from 'react';
import UserImageUpdate from '../components/settings/UserImageUpdate';
import UserInfoUpdate from '../components/settings/UserInfoUpdate';

const Settings = () => {

  return (
    <div>
      <div className=' text-3xl text-bold pb-2 pt-3 md:pt-0 lg:pt-0'>
        Settings
      </div>
      <div className='mt-5 md:border lg:border border-zinc-900 w-full rounded-lg'>
        <UserImageUpdate/>
        <UserInfoUpdate/>
      </div>
    </div>
  )
};

export default Settings;
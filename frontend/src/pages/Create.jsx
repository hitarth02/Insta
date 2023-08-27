import React from 'react';
import PostUploader from '../components/home/posts/PostUploader';
import ReelUploader from '../components/home/posts/ReelUploader';
import CropAndUpload from '../components/common/CropAndUpload';

const Create = () => {
  return (
    <div>
      <div className=' lg:text-3xl md:text-3xl text-2xl my-4 lg:my-0 md:my-0'>
        Create Post
      </div>
      <PostUploader/>
      {/* <CropAndUpload/> */}
      {/* <ReelUploader/> */}
      <div className='h-[100px] w-full'></div>
    </div>
  )
};

export default Create;
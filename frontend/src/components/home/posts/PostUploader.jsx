import React, { useState } from 'react';
import Upload from '../../common/Upload';
import {useForm} from 'react-hook-form';
import { Button, Input } from '@nextui-org/react';
import { createPost } from '../../../services/utility/postServices';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-hot-toast';

const PostUploader = () => {
    
    const {
        register,
        setValue,
        getValues,
        handleSubmit,
        formState:{errors}
    } = useForm();
    const [loading , setLoading] = useState(false);
    const {token} = useSelector((state)=>state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const uploadPost = async (data) => {
        setLoading(true);
        try {
            const res = await createPost({post: data.post , caption: data.caption},token , dispatch , navigate);
            console.log(res);
        } catch (error) {
            console.log(error)
        };
        setLoading(false);
    };

  return (
    <div className=' mx-auto lg:mx-0 md:mx-0 border border-zinc-800 rounded-lg px-5 py-5 mt-10 lg:w-[500px] md:w-[500px]'>
        <form onSubmit={handleSubmit(uploadPost)}>
            <p className=''>Upload Image</p>
            <Upload
                name="post"
                label="Post"
                register={register}
                setValue={setValue}
                getValues={getValues}
                video={false}
            />
            
            <div className='my-5'>
                <p className=' text-sm pl-1 mb-2'>Add a caption for you post (optional)</p>
                <Input
                    type='text'
                    color='default'
                    size='lg'
                    placeholder='caption...'
                    {...register("caption")}
                />
            </div>

            <Button
                color='primary'
                size='lg'
                className='mt-5'
                type='submit'
                isDisabled={loading ? true : false}
            >
                Create Post
            </Button>
        </form>
    </div>
  )
};

export default PostUploader;
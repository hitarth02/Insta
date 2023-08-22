import React from 'react';
import Upload from '../../common/Upload';
import {useForm} from 'react-hook-form';
import { Button, Input } from '@nextui-org/react';
import { createReel } from '../../../services/utility/postServices';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ReelUploader = () => {

    const {
        register,
        setValue,
        getValues,
        handleSubmit,
        formState:{errors}
    } = useForm();

    const {token} = useSelector((state)=>state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const uploadPost = async (data) => {
        try {
            const res = await createReel({reel: data.reel , caption: data.caption}, token , dispatch , navigate);
            console.log(res);
        } catch (error) {
            console.log(error)
        };
    };

  return (
    <div className=' mx-auto border lg:mx-0 md:mx-0  border-zinc-800 rounded-lg px-5 py-5 mt-10 lg:w-[500px] md:w-[500px]'>
        <form onSubmit={handleSubmit(uploadPost)}>
            <p className=''>Upload Reel</p>
            <Upload
                name="reel"
                label="Reel"
                register={register}
                setValue={setValue}
                getValues={getValues}
                video={true}
            />
            
            <div className='my-5'>
                <p className=' text-sm pl-1 mb-2'>Add a caption for your Reel (optional)</p>
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
            >
                Create Reel
            </Button>
        </form>
    </div>
  )
};

export default ReelUploader;
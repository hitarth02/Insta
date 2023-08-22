import React, { useEffect, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Player } from 'video-react';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import "video-react/dist/video-react.css"

const Upload = ({name , label , register , setValue , getValues ,errors , video = false , viewData = null , editData = null}) => {
    
    const [selectedFile , setSelectedFile] = useState(null);
    const [previewFile , setPreviewFile] = useState(
      viewData ? viewData : editData ? editData : ""
    );

    const inputRef = useRef(null);

    const onDrop = (acceptedFiles) => {
      const file = acceptedFiles[0];
      if(file){
        setSelectedFile(file);
        previewSource(file);
      }
    };

    const{getRootProps , getInputProps , isDragActive} = useDropzone({
      accept: !video ?
      {"image/*": [".jpeg", ".jpg", ".png"]} : {"video/*":[".mp4"]},
      onDrop
    });

    const previewSource = (file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setPreviewFile(reader.result);
      };
    };

    useEffect(()=>{
      register(name , {required:true})
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },[register]);

    useEffect(()=>{
      setValue(name , selectedFile);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },[selectedFile,setValue]);
    
    return (
      <div className='flex flex-col space-y-2 mb-4 mt-5'>
        {/* <label htmlFor={name}>{label} <sup className=' text-pink-600 font-inter'>*</sup> </label> */}
        <div className={`${isDragActive ? "bg-gray-900" : "bg-zinc-900"} flex max-h-fit cursor-pointer items-center justify-center rounded-md border-2 border-dotted border-zinc-500`}>
          {
            previewFile ? (
              <div className="flex w-full flex-col p-4">
                {!video ? (
                  <img 
                    src={previewFile} 
                    alt='Thumbnail'
                    className='w-full h-full rounded-md mx-auto object-cover max-w-[640px]'
                  />
                ):(
                  <Player aspectRatio='9:16' playsInline muted={false}  src={previewFile} className='w-full h-full rounded-md object-cover max-h[400px] max-w-[440px]'/>
                )}
                {
                  !viewData && (
                    <button
                    className='mt-2 text-sm text-richblack-200'
                      onClick={() => {
                        setSelectedFile(null)
                        setPreviewFile(null)
                        setValue(name , null)
                      }}>
                      Cancel
                    </button>
                  )
                }
              </div>
            ):
            (
              <div {...getRootProps()} className='flex w-full flex-col text-center items-center p-6'>
                <input {...getInputProps()} ref={inputRef}/>
                      <div className=' text-3xl mb-5 text-yellow-50'>
                        <AiOutlineCloudUpload/>
                      </div>
                      <p className=' text-sm text-richblack-200'>
                        Drag and drop {!video ? "an Image" : "Video"} or click to <span className=' text-zinc-400 font-semibold'>Browse</span> <br/> a file
                      </p>
                      <ul className='flex list-disc text-xs gap-x-12 mt-10 font-semibold text-richblack-400'>
                        <li>Aspect ratio 16:9</li>
                        <li>Recommended size 1024x576 </li>
                      </ul>
              </div>
            )
          }
        </div>
        {/* {errors[name] && <span>required</span>} */}
      </div>  
    )
};

export default Upload;
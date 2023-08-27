import React, { useRef } from 'react';

const ImageInput = ({ onImageSelected , setImage }) => {
    const inputRef = useRef();

    const handleOnChange = (event) => {
      if (event.target.files && event.target.files.length > 0) {
        const reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = function (e) {
          onImageSelected(reader.result);
        };
      }
    };
  
    const onChooseImg = () => {
      inputRef.current.click();
    };
  
    return (
      <div>
        <div
        className={` flex max-h-fit cursor-pointer items-center justify-center rounded-md border-2 border-dotted border-zinc-500`}
      >
        {onImageSelected ? (
          <div className="flex w-full flex-col p-4">
            {(
              <img
                src={onImageSelected}
                alt="Thumbnail"
                className="w-full h-full rounded-md mx-auto object-cover max-w-[640px]"
              />
            )}
            {onImageSelected && (
              <button
                className="mt-2 text-sm text-richblack-200"
                onClick={() => {
                  setImage();
                }}
              >
                Cancel
              </button>
            )}
          </div>
        ) : (
          <>
            <div
              className=" w-full flex-col aspect-square text-center content-center items-center p-6 hidden lg:flex pt-10"
            >
              <div className=" text-3xl mb-5 text-yellow-50">

              </div>
              <p className=" text-sm text-richblack-200">
                Drag and drop Image or click to{" "}
                <span className=" text-zinc-400 font-semibold">Browse</span>{" "}
                <br /> a file
              </p>
              <ul className="flex list-disc text-xs gap-x-12 mt-10 font-semibold text-richblack-400">
                <li>Aspect ratio 1:1 or 4:3</li>
                <li>Recommended size 1280X720 </li>
              </ul>
            </div>
            <div
              className="flex w-full flex-col text-center items-center p-6 lg:hidden aspect-square pt-10"
            >
              <div className=" text-3xl mb-5 text-yellow-50">

              </div>
              <p className=" text-sm text-richblack-200">
                Click on select to{" "}
                <span className=" text-zinc-400 font-semibold">Browse</span>{" "}
                <br /> a file
              </p>
              <ul className="flex list-disc text-xs gap-x-12 mt-10 font-semibold text-richblack-400">
                <li>Aspect ratio 1:1 or 3:4 or 16:9</li>
                <li>Recommended size 1280x720</li>
              </ul>
            </div>
          </>
        )}
      </div>
        <input
          type="file"
          accept="image/*"
          ref={inputRef}
          onChange={handleOnChange}
          style={{ display: "none" }}
        />
  
        <button className="btn" onClick={onChooseImg}>
          Choose Image
        </button>
      </div>
    );
};

export default ImageInput;
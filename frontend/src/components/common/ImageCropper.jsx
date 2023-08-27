import { Button, Radio, RadioGroup } from "@nextui-org/react";
import React, { useState } from "react";
import Cropper from "react-easy-crop";

function ImageCropper({ image, onCropDone, onCropCancel }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState(null);
  const [aspectRatio, setAspectRatio] = useState(4 / 3);

  const onCropComplete = (croppedAreaPercentage, croppedAreaPixels) => {
    setCroppedArea(croppedAreaPixels);
  };

  const onAspectRatioChange = (event) => {
    setAspectRatio(event.target.value);
  };

  return (
    <div className="">
      <div>
        <Cropper
          image={image}
          aspect={aspectRatio}
          crop={crop}
          zoom={zoom}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
          style={{
              containerStyle:{
                width: "80vw",
                height: "80vh",
                backgroundColor: "#fff",
                margin:"auto",
                position:'absolute',
                top:"60"
              },
              mediaStyle:{
                width:"100%",
              }
          }}
        />
        <div className=" z-50 flex flex-col gap-y-2 justify-center items-center">
            <RadioGroup onChange={onAspectRatioChange} orientation="horizontal">
            <Radio type="radio" value={1 / 1} name="ratio" /> 1:1
            <Radio type="radio" value={5 / 4} name="ratio" /> 5:4
            <Radio type="radio" value={4 / 3} name="ratio" /> 4:3
            <Radio type="radio" value={3 / 2} name="ratio" /> 3:2
            <Radio type="radio" value={5 / 3} name="ratio" /> 5:3
            </RadioGroup>

            <div className="flex gap-x-3">
            <Button onClick={onCropCancel} variant="bordered">
            Cancel
            </Button>

            <Button
            onClick={() => {
                onCropDone(croppedArea);
            }}
            color="primary"
            >
            Done
            </Button>
            </div>
      </div>

      
      </div>
    </div>
  );
}

export default ImageCropper;
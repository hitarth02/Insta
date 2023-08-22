import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Divider,
} from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

const UserFollowModal = ({
  onOpenChange,
  isOpen,
  follower,
  following,
  userDetails,
}) => {

  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-2">
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {follower === true && "Followers"}
                {following === true && "Following"}
              </ModalHeader>
              <ModalBody>
                {follower === true &&
                  (userDetails.followers.length === 0 ? (
                    <div>No followers</div>
                  ) : (
                    userDetails.followers.map((follwerUser) => {
                      return (
                        <>
                        <div className="w-[90%] mx-auto flex gap-x-3 items-center ">
                            <div>
                                <img src= {follwerUser.userImage} alt="user" width={"45px"} className=" aspect-square rounded-full "/>
                            </div>
                            <div>
                                <p className=" text-lg">{`${follwerUser.firstName} ${follwerUser.lastName}`}</p>
                                <p className=" text-blue-500">@{follwerUser.userName}</p>
                            </div>
                            
                        </div>
                        <Divider className="my-2" />
                        </>
                         
                      );
                    })
                  ))}
                  {following === true &&
                  (userDetails.followings.length === 0 ? (
                    <div>No followers</div>
                  ) : (
                    userDetails.followings.map((follwerUser) => {
                      return (
                        <>
                          <div className="w-[90%] mx-auto flex gap-x-3 items-center">
                            <div>
                                <img src= {follwerUser.userImage} alt="user" width={"45px"} className=" aspect-square rounded-full "/>
                            </div>
                            <div>
                                <p className=" text-lg">{`${follwerUser.firstName} ${follwerUser.lastName}`}</p>
                                <p onClick={()=>navigate(`/profile/${follwerUser.email}`)} className=" text-blue-500 cursor-pointer">@{follwerUser.userName}</p>
                            </div>
                            
                          </div>
                          <Divider className="my-0" />
                        </>
                      );
                    })
                  ))}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onClick={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default UserFollowModal;

import { Box, Button, Tooltip, Text ,Input, useToast} from '@chakra-ui/react';
import axios from 'axios'
import {
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from "@chakra-ui/menu";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react'
import { Toast } from '@chakra-ui/react';
import { BellIcon, ChevronDownIcon,CheckIcon } from '@chakra-ui/icons';
import { Avatar } from '@chakra-ui/avatar';
import UserListItem from "../UserAvatar/UserListItem";
import { useState } from 'react';
import React from 'react';
import { ChatState } from '../../context/chatProvider';
import ProfileModal from './ProfileModal';
import { useDisclosure } from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import ChatLoading from '../ChatLoading';
import { Spinner } from "@chakra-ui/spinner";
import { getSender } from '../../config/ChatLogics';
import { IoIosNotifications } from "react-icons/io";
import { MdNotificationAdd } from "react-icons/md";



function SideDrawer() {

  const [search, setSearch] = useState("");
   
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const { user,setSelectedChat,chats,setChats,notification,setNotification} = ChatState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const history = useHistory();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  };

  // to search the ele 
  const toast = useToast();
  const handleSearch = async()=>{
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    try {
      setLoading(true);

      const config = {
        headers:{
          Authorization:`Bearer ${user.token}`,
        },
      };

      const data = await axios.get(`/api/user?search=${search}`,config);

      setLoading(false);
      setSearchResult(data.data);
      // console.log(searchResult);

    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  }

  const accessChat = async(userId)=>{
      try {

        setLoading(true);
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        const {data} = await axios.post("/api/chat",{userId},config);

        if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);

        setSelectedChat(data);
        setLoading(false);
        
      } catch (error) {
        toast({
          title: "Error fetching the chat",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
      }
  }
  
  
  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="teal.500"
        color="white"
        w="100%"
        p="5px 10px"
        borderWidth="5px"
        borderColor="teal.700"
      >
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost"  onClick={onOpen}color="white" _hover={{ bg: "teal.600" }}>
            <i className="fas fa-search"></i>
            <Text display={{ base: "none", md: "flex" }} px={4}>
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize="2xl" fontFamily="Work sans" flex="1" textAlign="center">
          WEB-CHAT-APP
        </Text>
        <Box display="flex" alignItems="center">
          <Menu>
            <MenuButton>
              {!notification.length  && <IoIosNotifications size={23} />  }
              { notification.length > 0  && <MdNotificationAdd size={23} color='orange'/>}
            </MenuButton>
            <MenuList  textColor="black"pl={2}>
              {!notification.length && "No New Messages"}

              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />} colorScheme="teal">
              <Avatar size="sm" cursor="pointer" name={user.name} bg="teal.700" />
            </MenuButton>
            <MenuList bg="white" color="black">
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </Box>
      </Box>

      <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay/>
        <DrawerContent>
        <DrawerHeader>search users </DrawerHeader>
          <DrawerBody>

            <Box display="flex" mb={4} alignItems="center">
              <Input
                placeholder="Search by name"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>

            {loading ? (
              <ChatLoading />
            ) : (
              <Box mt={4}>
                {searchResult.length > 0 ? (
                  searchResult.map((user) => (
                    <UserListItem
                      key={user._id}
                      user={user}
                      handleFunction={() => accessChat(user._id)}
                    />
                  ))
                ) : (
                  <span>No users found</span>
                )}
              </Box>
            )}
             {loadingChat && <Spinner ml="auto" d="flex" />}
          </DrawerBody>
        </DrawerContent>

      </Drawer>
    </>
  );
}

export default SideDrawer;

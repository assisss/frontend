import { Box, Button, Tooltip, Text, Input, useToast, Spinner } from '@chakra-ui/react';
import axios from 'axios';
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
} from '@chakra-ui/react';
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { Avatar } from '@chakra-ui/avatar';
import UserListItem from "../UserAvatar/UserListItem";
import { useState } from 'react';
import React from 'react';
import { ChatState } from '../../context/chatProvider';
import ProfileModal from './ProfileModal';
import { useDisclosure } from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import ChatLoading from '../ChatLoading';
import { getSender } from '../../config/ChatLogics';
import { IoIosNotifications } from "react-icons/io";
import { MdNotificationAdd } from "react-icons/md";

function SideDrawer() {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const { user, setUser, setSelectedChat, chats, setChats, notification, setNotification } = ChatState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const history = useHistory();
  const toast = useToast();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    localStorage.clear();
    setUser(null);
    setChats([]);
    setNotification([]);
    history.push("/");
  };

  const handleSearch = async () => {
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
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const data = await axios.get(`/api/user?search=${search}`, config);

      setLoading(false);
      setSearchResult(data.data);

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

  const accessChat = async (userId) => {
    try {
      setLoading(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post("/api/chat", { userId }, config);

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
        bg="black"
        color="white"
        w="100%"
        p="5px 10px"
        borderWidth="1px"
        borderColor="gray.700"
      >
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen} color="white" _hover={{ bg: "gray.700" }}>
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
            <MenuButton bg="black" color="white" borderColor="gray.700">
              {!notification.length && <IoIosNotifications size={23} color="white" />}
              {notification.length > 0 && <MdNotificationAdd size={23} color='orange' />}
            </MenuButton>
            <MenuList bg="black" color="white" borderColor="gray.700" className='bg-black text-white'>
              {!notification.length && "No New Messages"}

              {notification.map((notif) => (
                <MenuItem
                  bg="black"
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
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />} colorScheme="black" variant="outline">
              <Avatar size="sm" cursor="pointer" name={user.name} bg="gray.700" />
            </MenuButton>
            <MenuList bg="black" color="white" borderColor="gray.700">
              <ProfileModal user={user}>
                <MenuItem bg="black">My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler} bg="black">Logout</MenuItem>
            </MenuList>
          </Menu>
        </Box>
      </Box>

      <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent bg="black" color="white">
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" mb={4} alignItems="center">
              <Input
                placeholder="Search by name"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                bg="gray.700"
                color="white"
                _placeholder={{ color: "gray.400" }}
              />
              <Button onClick={handleSearch} colorScheme="teal">Go</Button>
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

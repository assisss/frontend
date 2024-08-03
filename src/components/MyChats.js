import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { ChatState } from '../context/chatProvider';
import ChatLoading from './ChatLoading';
import { getSender } from '../config/ChatLogics';
import GroupChatModal from './miscellaneous/GroupChatModal';
import {
  Box,
  Flex,
  Button,
  Text,
  VStack,
  useDisclosure,
} from '@chakra-ui/react';

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        }
      }
      const { data } = await axios.get("/api/chat", config);
      setChats(data);
    } catch (error) {
      console.error("Failed to Load the chats", error);
    }
  }

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  return (
    <Flex
      direction="column"
      h="full"
      bg="black"
      color="white"
      borderWidth="1px"
      borderColor="gray.700"
      borderRadius="md"
    >
      <Flex
        direction="row"
        align="center"
        justify="space-between"
        p="3"
        borderBottomWidth="1px"
        borderBottomColor="gray.700"
        bg="black"
      >
        <Text fontSize="2xl" fontWeight="semibold">
          My Chats
        </Text>
        <GroupChatModal>
          <Button
            colorScheme="teal"
            variant="solid"
            size="sm"
            _hover={{ bg: "teal.600" }}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Flex>

      <Flex
        direction="column"
        p="3"
        bg="gray.800"
        flex="1"
        overflowY="auto"
      >
        {chats ? (
          <VStack spacing={3} align="stretch">
            {chats.map((chat) => (
              <Box
                key={chat._id}
                onClick={() => setSelectedChat(chat)}
                p="3"
                borderRadius="md"
                bg={selectedChat === chat ? "teal.500" : "gray.700"}
                color={selectedChat === chat ? "white" : "gray.200"}
                _hover={{ bg: "teal.600", color: "white" }}
                cursor="pointer"
                transition="background-color 0.3s ease-in-out"
              >
                <Text fontSize="md" fontWeight="bold">
                  {!chat.isGroupChat ? getSender(loggedUser, chat.users) : chat.chatName}
                </Text>
                {chat.latestMessage && (
                  <Text fontSize="sm" color="gray.400">
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </Text>
                )}
              </Box>
            ))}
          </VStack>
        ) : (
          <ChatLoading />
        )}
      </Flex>
    </Flex>
  );
}

export default MyChats;

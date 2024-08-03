import React from 'react';
import { Box } from '@chakra-ui/react';
import SingleChat from './SingleChat';
import { ChatState } from '../context/chatProvider';

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();

  return (
    <Box
      display={selectedChat ? 'flex' : 'none'}
      flexDirection="column"
      alignItems="center"
      p={0}
      bg="white"
      w="full"
      h="full"
      borderRadius="lg"
      borderWidth=""
      borderColor="gray.300"
      boxShadow="md"
      overflow="hidden"
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
}

export default ChatBox;

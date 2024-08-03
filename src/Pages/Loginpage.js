import React from 'react';
import { Box, Flex, Button, Text } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import Login from '../components/authentication/Login';

const Loginpage = () => {
  return (
    <Box
      height="100vh"
      width="100vw"
      display="flex"
      flexDirection="column"
      background="black"
      position="absolute"
      top="0"
      left="0"
      zIndex="10"
    >
      <Flex
        width="100%"
        padding="1rem"
        justifyContent="space-between"
        alignItems="center"
        background="gray.900"
        color="white"
      >
        <Text fontSize="xl" fontWeight="bold">
          Web Chat App
        </Text>
        <Link to="/signup">
          <Button colorScheme="teal" variant="outline">
            Sign Up
          </Button>
        </Link>
      </Flex>
      <Box
        flex="1"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Box
          width="100%"
          maxWidth="400px"
          padding="2rem"
          background="black"
          borderRadius="md"
          boxShadow="0 10px 20px rgba(0, 0, 0, 0.8)"
          border="2px solid white"
        >
          <Login />
        </Box>
      </Box>
    </Box>
  );
};

export default Loginpage;

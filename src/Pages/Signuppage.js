import React from 'react';
import Signup from '../components/authentication/SignUp'; // Assuming you have a Signup component
import { Box, Flex, Button, Text } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const Signuppage = () => {
  return (
    <Flex
      height="100vh"
      width="100vw"
      justifyContent="center"
      alignItems="center"
      background="url('/path/to/your/background-image.jpg') no-repeat center center fixed"
      backgroundSize="cover"
      position="relative"
      overflow="hidden"
    >
      <Box
        position="absolute"
        top="0"
        left="0"
        width="100%"
        height="100%"
        background="rgba(0, 0, 0, 0.8)" // Dark overlay background
        zIndex="1"
      />
      <Box
        position="relative"
        width="100%"
        maxWidth="400px"
        padding="2rem"
        background="black"
        borderRadius="md"
        boxShadow="lg"
        zIndex="2"
        border="2px" // Adding border
        borderColor="white" // Setting the border color to white
      >
        <Signup />
      </Box>
      <Flex
        width="100%"
        padding="1rem"
        position="absolute"
        top="0"
        left="0"
        justifyContent="space-between"
        alignItems="center"
        background="rgba(0, 0, 0, 0.8)"
        color="white"
        zIndex="2"
      >
        <Text fontSize="xl" fontWeight="bold">
          Web Chat App
        </Text>
        <Link to="/login">
          <Button colorScheme="teal" variant="outline">
            Log In
          </Button>
        </Link>
      </Flex>
    </Flex>
  );
};

export default Signuppage;

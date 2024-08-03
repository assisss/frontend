import { Box, Button, Container, Flex, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import React from 'react';
import './Homepage.css'; // Import the CSS file

function Homepage() {
  return (
    <Box
      height="100vh"
      width="100vw"
      bg="black"
      color="white"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      padding="2rem"
      backgroundPosition="center"
      backgroundSize="cover"
      backgroundRepeat="no-repeat"
    >
      <Flex as="nav" justifyContent="space-between" width="100%" position="absolute" top="0" padding="1rem 2rem">
        <Text fontSize="2xl" fontWeight="bold">WEB_CHAT_APP</Text>
        <Flex>
          <Link to="/login">
            <Button variant="outline" className="hoverButton" mr={4} textColor="white">
              Login
            </Button>
          </Link>
          <Link to="/signup">
            <Button variant="outline" className="hoverButton" mr={4} textColor="white">
              Sign up
            </Button>
          </Link>
          <Link to="/feedback">
            <Button variant="outline" className="hoverButton" textColor="white">
              Give Us Feedback
            </Button>
          </Link>
        </Flex>
      </Flex>
      <Container centerContent alignItems="flex-start" textAlign="left" maxWidth="80%">
        <Text fontSize="4xl" fontWeight="bold" mb={4} className="typing">
          Say Hii, To your family & friends!!!!
        </Text>
      </Container>
    </Box>
  );
}

export default Homepage;

import React, { useState, useEffect, useRef } from 'react';
import { Box, Input, Spinner, Text, FormControl, IconButton, useToast } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import ProfileModal from './miscellaneous/ProfileModal';
import { getSender, getSenderFull } from '../config/ChatLogics';
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal';
import axios from 'axios';
import ScrollableChat from './ScrollableChat';
import io from "socket.io-client";
import { ChatState } from '../context/chatProvider';
import animationData from "../animations/typing.json";
import Lottie from "react-lottie";

const ENDPOINT = "http://localhost:5000/"; // Update this to your production endpoint if necessary
let socket;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };

    const { user, selectedChat, setSelectedChat, notification, setNotification } = ChatState();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [istyping, setIsTyping] = useState(false);

    const toast = useToast();
    const socketRef = useRef();

    const fetchMessages = async () => {
        if (!selectedChat) return;

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            setLoading(true);

            const { data } = await axios.get(`/api/message/${selectedChat._id}`, config);
            setMessages(data);
            setLoading(false);

            socket.emit("join chat", selectedChat._id);
        } catch (error) {
            toast({
                title: "Error Occurred!",
                description: "Failed to Load the Messages",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        }
    };

    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup", user);
        socket.on("connected", () => setSocketConnected(true));
        socket.on("typing", () => setIsTyping(true));
        socket.on("stop typing", () => setIsTyping(false));

        return () => {
            socket.disconnect();
        };
    }, [user]);

    useEffect(() => {
        fetchMessages();
        if (socket) {
            socket.on("message received", (newMessageReceived) => {
                if (!selectedChat || selectedChat._id !== newMessageReceived.chat._id) {
                    if (!notification.includes(newMessageReceived)) {
                        setNotification([newMessageReceived, ...notification]);
                        setFetchAgain(!fetchAgain);
                    }
                } else {
                    setMessages((prevMessages) => [...prevMessages, newMessageReceived]);
                }
            });
        }

        return () => {
            if (socket) {
                socket.off("message received");
            }
        };
    }, [selectedChat]);

    const sendMessage = async (event) => {
        if (event.key === "Enter" && newMessage) {
            socket.emit("stop typing", selectedChat._id);
            try {
                const config = {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                setNewMessage("");
                const { data } = await axios.post(
                    "/api/message",
                    {
                        content: newMessage,
                        chatId: selectedChat._id,
                    },
                    config
                );
                socket.emit("new message", data);
                setMessages((prevMessages) => [...prevMessages, data]);
            } catch (error) {
                toast({
                    title: "Error Occurred!",
                    description: "Failed to send the Message",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
            }
        }
    };

    const typingHandler = (e) => {
        setNewMessage(e.target.value);

        if (!socketConnected) return;

        if (!typing) {
            setTyping(true);
            socket.emit("typing", selectedChat._id);
        }

        let lastTypingTime = new Date().getTime();
        const timerLength = 3000;
        setTimeout(() => {
            const timeNow = new Date().getTime();
            const timeDiff = timeNow - lastTypingTime;
            if (timeDiff >= timerLength && typing) {
                socket.emit("stop typing", selectedChat._id);
                setTyping(false);
            }
        }, timerLength);
    };

    return (
        <>
            {selectedChat ? (
                <>
                    <Text
                        fontSize={{ base: "28px", md: "30px" }}
                        pb={-1}
                        px={3}
                        mb={0}
                        w="100%"
                        fontFamily="Work sans"
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        bg="black"
                        color="white"
                    >
                        <IconButton
                            display={{ base: "flex", md: "none" }}
                            icon={<ArrowBackIcon />}
                            onClick={() => setSelectedChat(null)}
                            bg="black"
                            color="white"
                        />
                        {!selectedChat.isGroupChat ? (
                            <>
                                {getSender(user, selectedChat.users)}
                                <ProfileModal
                                    user={getSenderFull(user, selectedChat.users)}
                                />
                            </>
                        ) : (
                            <>
                                {selectedChat.chatName.toUpperCase()}
                                <UpdateGroupChatModal
                                    fetchAgain={fetchAgain}
                                    setFetchAgain={setFetchAgain}
                                    fetchMessages={fetchMessages}
                                />
                            </>
                        )}
                    </Text>
                    <Box
                        display="flex"
                        flexDirection="column"
                        justifyContent="space-between"
                        p={3}
                        bg="gray.800"
                        w="100%"
                        h="100vh"
                        borderRadius="none"
                        overflow="hidden"
                        position="relative"
                    >
                        {loading ? (
                            <Spinner
                                size="xl"
                                w={20}
                                h={20}
                                alignSelf="center"
                                margin="auto"
                                color="teal.500"
                            />
                        ) : (
                            <Box
                                display="flex"
                                flexDirection="column"
                                justifyContent="flex-end"
                                bg="gray.800"
                                w="100%"
                                h="100%"
                                borderRadius="lg"
                                overflowY="auto"
                                mb={10}
                            >
                                <ScrollableChat messages={messages} />
                            </Box>
                        )}
                        <FormControl
                            onKeyDown={sendMessage}
                            id="message-input"
                            isRequired
                            mt={5}
                            position="absolute"
                            bottom={1}
                            width="100%"
                        >
                            {istyping && (
                                <Text textAlign="center" color="gray.400" fontSize="sm">
                                    Typing...
                                </Text>
                            )}
                            <Input
                                variant="filled"
                                bg="gray.700"
                                placeholder="Enter a message..."
                                _placeholder={{ color: "gray.400" }}
                                value={newMessage}
                                onChange={typingHandler}
                                color="white"
                            />
                        </FormControl>
                    </Box>
                </>
            ) : (
                <Box display="flex" alignItems="center" justifyContent="center" h="100vh" bg="black" color="white">
                    <Text fontSize="3xl" pb={3} fontFamily="Work sans" className='text-white'>
                        Click on a user to start chatting
                    </Text>
                </Box>
            )}
        </>
    );
};

export default SingleChat;

import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { ChatState } from '../context/chatProvider';
import ChatLoading from './ChatLoading';
import { getSender } from '../config/ChatLogics';
import GroupChatModal from './miscellaneous/GroupChatModal';

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
      const { data } = await axios.get("api/chat", config);

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
    <>
    <div
      className={`${
        selectedChat ? 'hidden' : 'flex'
      } md:flex flex-col items-end p-3 bg-white w-full rounded-lg border border-gray-300`}
    >
      <div
        className="pb-3 px-3 text-2xl md:text-3xl font-semibold w-full flex justify-between items-center border-b border-gray-300"
      >
        My Chats

        <GroupChatModal>
          <button
            className="flex items-center text-lg md:text-sm lg:text-lg text-white bg-teal-500 hover:bg-teal-600 rounded px-3 py-2"
          >
            New Group Chat
          </button>
        </GroupChatModal>
      </div>
    </div>

      <div className="flex flex-col p-3 bg-gray-100 w-full flex-grow rounded-lg overflow-y-hidden">
        {chats ? (
          <div className="overflow-y-auto space-y-3">
            {chats.map((chat) => (
              <div
                onClick={() => setSelectedChat(chat)}
                className={`cursor-pointer px-3 py-2 rounded-lg ${
                  selectedChat === chat
                    ? 'bg-teal-500 text-white'
                    : 'bg-gray-200 text-black'
                } hover:bg-teal-500 hover:text-white transition-colors duration-300 ease-in-out`}
                key={chat._id}
              >
                <div className="text-md font-bold">
                  {!chat.isGroupChat ? getSender(loggedUser, chat.users) : chat.chatName}
                </div>
                {chat.latestMessage && (
                  <div className="text-sm text-gray-500">
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <ChatLoading />
        )}
      </div>
    </>
  );
}

export default MyChats;

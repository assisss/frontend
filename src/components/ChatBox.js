import React from 'react';
import SingleChat from './SingleChat';
import { ChatState } from '../context/chatProvider';

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();

  return (
    <div
      className={`${
        selectedChat ? 'flex' : 'hidden'
      } md:flex flex-col items-center p-3 bg-white w-full  rounded-lg border border-gray-300`}
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </div>
  );
}

export default ChatBox;

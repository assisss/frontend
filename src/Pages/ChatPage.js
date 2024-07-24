import React, { useState } from 'react';
import { ChatState } from '../context/chatProvider';
import ChatBox from "../components/ChatBox";
import SideDrawer from '../components/miscellaneous/SideDrawer';
import MyChats from "../components/MyChats";

const ChatPage = () => {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <div className="w-full h-screen flex flex-col">
      {user && <SideDrawer />}
      <div className="w-full h-full  flex overflow-hidden">
        {user && (
          <>
            <div className="w-1/4 h-full border-r border-gray-300 overflow-y-auto">
              <MyChats fetchAgain={fetchAgain} />
            </div>
            <div className="w-3/4 h-full overflow-y-auto">
              <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatPage;

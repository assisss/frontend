import { Button } from '@chakra-ui/react';
import './App.css';
import { Route } from 'react-router-dom';
import Homepage from './Pages/Homepage';
import ChatPage from './Pages/ChatPage';
import Loginpage from './Pages/Loginpage';
import Signuppage from './Pages/Signuppage';
import Feedback from './Pages/Feedback';

function App() {
  return (
    <div className="App">
         <Route path="/" component={Homepage} exact />
         <Route path ="/chats" component={ChatPage} />
         <Route path ="/login" component={Loginpage} />
         <Route path ="/signup" component={Signuppage} />
         <Route path ="/feedback" component={Feedback} />

    </div>
  );
}

export default App;

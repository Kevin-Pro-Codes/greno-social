import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';


import MainApp from './Page';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Register from './Register';


export default function App() {
  return (
    <BrowserRouter>
      <Routes>        
        <Route path="/" element={<Login />} />
         <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Page />} />
        {/* other routes */}
      </Routes>
    </BrowserRouter>
  );
}








/*

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [postContent, setPostContent] = useState('');
  const [isChatMinimized, setIsChatMinimized] = useState(false);

  const toggleChat = () => {
    setIsChatMinimized(!isChatMinimized);
  };

  return (
    <div className="app-container">
      {}
     <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {}
      <main className="main-content">
        

<Containers
  isChatMinimized={isChatMinimized}
  toggleChat={toggleChat}
  postContent={postContent}
  setPostContent={setPostContent}
/>


      </main>
    </div>
  );
}

export default App;

*/
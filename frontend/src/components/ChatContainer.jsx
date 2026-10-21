import React, { useState, useEffect, useRef } from 'react';
import { FiChevronLeft, FiChevronRight, FiSearch, FiSend, FiArrowLeft } from 'react-icons/fi';
import profile from '../assets/profile.svg';

function formatChatTime(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffMinutes = Math.floor((now - date) / (1000 * 60));

  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h`;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function LeftBox({ isChatMinimized, toggleChat }) {
  const [users, setUsers] = useState([]);
  const [activeChatUser, setActiveChatUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const currentUser = (() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  })();

  // 1. Fetch available users for chatting
  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await fetch('/api/users', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error('Error fetching users for chat:', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 2. Fetch conversation with activeChatUser
  const fetchMessages = async (userId) => {
    if (!userId || !currentUser?.id) return;
    try {
      const res = await fetch(`/api/messages/${userId}`, {
        credentials: 'include',
        headers: {
          'x-user-id': currentUser.id.toString(),
        },
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  // Poll for new messages every 3 seconds when chatting with a user
  useEffect(() => {
    if (!activeChatUser) return;
    fetchMessages(activeChatUser.id);

    const interval = setInterval(() => {
      fetchMessages(activeChatUser.id);
    }, 3000);

    return () => clearInterval(interval);
  }, [activeChatUser?.id]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 3. Send message
  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!messageInput.trim() || !activeChatUser || sending || !currentUser?.id) return;

    const text = messageInput.trim();
    setMessageInput('');
    setSending(true);

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          sender_id: currentUser.id,
          recipient_id: activeChatUser.id,
          message: text,
        }),
      });

      if (res.ok) {
        const newMessage = await res.json();
        setMessages((prev) => [...prev, newMessage]);
      }
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setSending(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    return (
      (u.name && u.name.toLowerCase().includes(q)) ||
      (u.username && u.username.toLowerCase().includes(q))
    );
  });

  if (isChatMinimized) {
    return (
      <div className="flex items-start justify-center py-2">
        <button
          onClick={toggleChat}
          className="bg-[#111] border border-[#333] text-[#a0cc3a] hover:bg-[#222] hover:border-[#a0cc3a] p-2 rounded-md flex items-center justify-center cursor-pointer transition-colors duration-200"
          title="Expand chats"
        >
          <FiChevronRight size={22} />
        </button>
      </div>
    );
  }

  // --- CONVERSATION VIEW WITH ACTIVE USER ---
  if (activeChatUser) {
    return (
      <div className="flex flex-col h-full w-full min-h-0 box-border">
        {/* Chat Active Header */}
        <div className="shrink-0 mb-2 pb-2.5 border-b border-[#262626] flex items-center gap-3">
          <button
            onClick={() => setActiveChatUser(null)}
            className="bg-transparent border-0 text-[#a0cc3a] hover:bg-[#1a1a1a] p-1.5 rounded-md flex items-center justify-center cursor-pointer transition-colors"
            title="Back to contacts"
          >
            <FiArrowLeft size={20} />
          </button>

          <img
            src={activeChatUser.avatar ? `http://localhost:3000/${activeChatUser.avatar}` : profile}
            alt="Profile"
            className="w-9 h-9 rounded-full object-cover shrink-0 bg-[#222] border border-[#333]"
          />

          <div className="flex-1 min-w-0">
            <div className="font-bold text-[#a0cc3a] text-sm truncate">
              {activeChatUser.name || activeChatUser.username}
            </div>
            <div className="text-[11px] text-neutral-400 truncate">
              @{activeChatUser.username}
            </div>
          </div>
        </div>

        {/* Send message form on TOP below header line */}
        <form onSubmit={handleSendMessage} className="shrink-0 mb-3 pb-2.5 border-b border-[#262626] flex items-center gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            className="flex-1 bg-[#1a1a1a] border border-[#333] rounded-lg text-white py-2 px-3 text-sm focus:outline-none focus:border-[#a0cc3a] transition-colors placeholder:text-neutral-500"
          />
          <button
            type="submit"
            disabled={!messageInput.trim() || sending}
            className="bg-[#a0cc3a] hover:bg-[#8db834] text-black p-2.5 rounded-lg cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center font-bold"
            title="Send"
          >
            <FiSend size={16} />
          </button>
        </form>

        {/* Message bubbles stream */}
        <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-2.5 p-1 no-scrollbar">
          {messages.length === 0 ? (
            <div className="text-center text-neutral-500 py-8 text-xs">
              No messages yet. Say hi to {activeChatUser.name || activeChatUser.username}!
            </div>
          ) : (
            messages.map((msg) => {
              const isMine = msg.sender_id === currentUser?.id;
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed whitespace-pre-wrap break-words ${
                      isMine
                        ? 'bg-[#a0cc3a] text-black font-medium rounded-tr-xs'
                        : 'bg-[#1e1e1e] text-white border border-[#333] rounded-tl-xs'
                    }`}
                  >
                    {msg.message}
                  </div>
                  <span className="text-[10px] text-neutral-500 mt-1 px-1">
                    {formatChatTime(msg.created_at)}
                  </span>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
    );
  }

  // --- CONTACTS / CHAT LIST VIEW ---
  return (
    <div className="flex flex-col h-full w-full min-h-0 box-border">
      {/* Header */}
      <div className="shrink-0 mb-4 pb-3 border-b border-[#262626]">
        <div className="flex items-center relative mb-3">
          <button
            onClick={toggleChat}
            className="bg-transparent border-0 text-[#a0cc3a] hover:bg-[#1a1a1a] hover:text-[#c4f056] p-1.5 rounded-md flex items-center justify-center absolute left-0 cursor-pointer transition-colors"
            title="Minimize chats"
          >
            <FiChevronLeft size={22} />
          </button>
          <h3 className="text-[#a0cc3a] font-bold text-2xl m-0 text-center w-full tracking-wide">
            Chats
          </h3>
        </div>

        <div className="relative flex items-center w-full box-border">
          <FiSearch className="absolute left-3.5 text-[#a0cc3a] pointer-events-none text-base" />
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg text-white py-2 pl-10 pr-3.5 text-sm focus:outline-none focus:border-[#a0cc3a] transition-colors placeholder:text-neutral-500 box-border"
          />
        </div>
      </div>

      {/* Dynamic Users List */}
      <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-2 pr-1 no-scrollbar">
        {loadingUsers ? (
          <div className="text-center text-neutral-500 py-8 text-xs">Loading contacts...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center text-neutral-500 py-8 text-xs">
            {searchQuery ? 'No contacts found.' : 'No other users registered yet.'}
          </div>
        ) : (
          filteredUsers.map((user) => (
            <div
              key={user.id}
              onClick={() => setActiveChatUser(user)}
              className="flex items-center bg-[#111] border border-[#262626] hover:bg-[#1c1c1c] hover:border-[#383838] rounded-lg py-2.5 px-3 cursor-pointer transition-colors duration-200 box-border"
            >
              <img
                src={user.avatar ? `http://localhost:3000/${user.avatar}` : profile}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover shrink-0 mr-3.5 bg-[#222] border border-[#333]"
              />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-[#a0cc3a] text-sm leading-tight truncate">
                  {user.name || user.username}
                </div>
                <div className="text-xs text-neutral-400 truncate mt-1">
                  @{user.username}
                </div>
              </div>
              <span className="text-[10px] text-neutral-500 hover:text-[#a0cc3a] ml-2 shrink-0">
                Chat &rarr;
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default LeftBox;

import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { url_base } from '../config';


const GroupChat = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const scrollRef = useRef(null);

  const [username, setUsername] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');

  const groupName = location.state?.groupName;

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const regNo = localStorage.getItem('userId');
    setUsername(storedUsername || 'User');
    setRegistrationNumber(regNo || '');

    if (regNo) fetchGroupChat(regNo);

    const interval = setInterval(() => {
      if (regNo) fetchGroupChat(regNo);
    }, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchGroupChat = async (regNo) => {
    try {
      const res = await fetch(`${url_base}/api/group_chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registration_number: regNo }),
      });
      const result = await res.json();
      if (Array.isArray(result.chat)) setMessages(result.chat);
    } catch (err) {
      console.error('Failed to fetch chat:', err);
    }
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim()) return;

    try {
      await fetch(`${url_base}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registration_number: registrationNumber,
          message: messageInput,
        }),
      });
      setMessageInput('');
      fetchGroupChat(registrationNumber); // Refresh chat
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const handleEventForm = (eventId) => {
  navigate('/form', { state: { eventId, registrationNumber } });
};


  const renderMessage = (msg, idx) => {
    const isOwnMessage = msg.username === registrationNumber;
    const isAdmin = msg.username === 'YRC Admin';
    const baseClass = isOwnMessage ? 'bg-primary text-white ms-auto' : 'bg-light text-dark me-auto';
    const adminClass = isAdmin ? 'border border-danger bg-danger bg-opacity-75 text-white' : '';
    const alignmentClass = isOwnMessage ? 'text-end' : 'text-start';

    return (
      <div key={idx} className={`p-2 rounded mb-2 ${baseClass} ${adminClass}`} style={{ maxWidth: '75%' }}>
        <div className="fw-bold mb-1">{isAdmin ? 'YRC Admin' : msg.username}</div>
        <div dangerouslySetInnerHTML={{ __html: msg.message.replace(/\n/g, '<br />') }}></div>
        {msg.event_message && (
          <div className="mt-2 text-end">
            <button
              className="btn btn-sm btn-warning"
              onClick={() => handleEventForm(msg.event_id)}
            >
              Fill Event Form
            </button>
          </div>
        )}
        <div className="small text-muted mt-1 text-end">{new Date(msg.timestamp).toLocaleString()}</div>
      </div>
    );
  };

  return (
    <div className="vh-100 bg-dark text-white d-flex flex-column">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center p-3 border-bottom border-secondary">
        <h4 className="text-danger mb-0" onClick={() => navigate('/main-group')} style={{ cursor: 'pointer' }}>
          ← Back
        </h4>
        <h5 className="mb-0">{groupName || 'Group Chat'}</h5>
        <span>{username}</span>
      </div>

      {/* Chat Body */}
      <div className="flex-grow-1 p-3 overflow-auto" style={{ backgroundColor: '#2b2b2b' }}>
        <div className="d-flex flex-column">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`d-flex ${msg.username === registrationNumber ? 'justify-content-end' : 'justify-content-start'}`}
            >
              {renderMessage(msg, idx)}
            </div>
          ))}
          <div ref={scrollRef}></div>
        </div>
      </div>

      {/* Input Box */}
      <div className="p-3 border-top border-secondary bg-secondary">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Type a message..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button className="btn btn-success" onClick={handleSendMessage}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupChat;

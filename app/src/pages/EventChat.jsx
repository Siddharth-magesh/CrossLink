import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { url_base } from '../config';

const EventChat = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const scrollRef = useRef(null);

  const [username, setUsername] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');

  const groupId = location.state?.group_id;
  const groupName = location.state?.group_name;

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const regNo = localStorage.getItem('userId');
    setUsername(storedUsername || 'User');
    setRegistrationNumber(regNo || '');

    if (regNo && groupId) fetchEventChat(regNo, groupId);

    const interval = setInterval(() => {
      if (regNo && groupId) fetchEventChat(regNo, groupId);
    }, 5000);

    return () => clearInterval(interval);
  }, [groupId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchEventChat = async (regNo, grpId) => {
    try {
      const res = await fetch(`${url_base}/api/event_chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registration_number: regNo, group_id: grpId }),
      });

      const result = await res.json();
      if (Array.isArray(result.chat)) setMessages(result.chat);
    } catch (err) {
      console.error('Failed to fetch event chat:', err);
    }
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim()) return;

    try {
      await fetch(`${url_base}/api/chat_events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registration_number: registrationNumber,
          group_id: groupId,
          message: messageInput,
        }),
      });
      setMessageInput('');
      fetchEventChat(registrationNumber, groupId);
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const renderMessage = (msg, idx) => {
    const isOwnMessage = msg.username === registrationNumber;
    const isAdmin = msg.username === 'YRC Admin';
    const baseClass = isOwnMessage ? 'bg-primary text-white ms-auto' : 'bg-light text-dark me-auto';
    const adminClass = isAdmin ? 'border border-danger bg-danger bg-opacity-75 text-white' : '';

    return (
      <div key={idx} className={`p-2 rounded mb-2 ${baseClass} ${adminClass}`} style={{ maxWidth: '75%' }}>
        <div className="fw-bold mb-1">{isAdmin ? 'YRC Admin' : msg.username}</div>
        <div dangerouslySetInnerHTML={{ __html: msg.message.replace(/\n/g, '<br />') }}></div>
        <div className="small text-muted mt-1 text-end">{new Date(msg.timestamp).toLocaleString()}</div>
      </div>
    );
  };

  return (
    <div className="vh-100 bg-dark text-white d-flex flex-column">
      <div className="d-flex justify-content-between align-items-center p-3 border-bottom border-secondary">
        <h4 className="text-danger mb-0" onClick={() => navigate('/events-group')} style={{ cursor: 'pointer' }}>
          ← Back
        </h4>
        <h5 className="mb-0">{groupName || 'Event Chat'}</h5>
        <span>{username}</span>
      </div>

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

export default EventChat;

import React, { useState } from 'react';

import API from '../utils/api';

function AIChat() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [chat, setChat] = useState([
    { user: '', ai: 'Hello! I am your AI Career Mentor. Ask me anything about your career path, studies, or interests.' }
  ]);

  const sendMessage = async () => {
    if (!message.trim() || loading) return;

    const userMsg = message;
    setChat([...chat, { user: userMsg, ai: '...' }]);
    setMessage('');
    setLoading(true);

    try {
      const res = await API.post('/chat', { message: userMsg });
      setChat(prev => {
        const newChat = [...prev];
        newChat[newChat.length - 1].ai = res.data.reply;
        return newChat;
      });
    } catch (err) {
      setChat(prev => {
        const newChat = [...prev];
        newChat[newChat.length - 1].ai = "Sorry, I'm having trouble connecting right now.";
        return newChat;
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section" style={{ maxWidth: '800px' }}>
      <h2 className="text-center mb-2">AI Career Mentor</h2>
      <div style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        height: '400px',
        overflowY: 'auto',
        marginBottom: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        {chat.map((c, i) => (
          <div key={i}>
            {c.user && (
              <div style={{ alignSelf: 'flex-end', background: '#e3f2fd', padding: '1rem', borderRadius: '12px 12px 0 12px', maxWidth: '80%', marginLeft: 'auto', marginBottom: '0.5rem' }}>
                <strong>You:</strong> {c.user}
              </div>
            )}
            {c.ai && (
              <div style={{ alignSelf: 'flex-start', background: '#f5f5f5', padding: '1rem', borderRadius: '12px 12px 12px 0', maxWidth: '80%', marginRight: 'auto' }}>
                <strong>AI Mentor:</strong> {c.ai}
              </div>
            )}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your question here..."
          style={{ flex: 1 }}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button className="btn" onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default AIChat;
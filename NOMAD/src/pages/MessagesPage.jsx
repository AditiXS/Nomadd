import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import API_BASE from '../utils/api';
import './MessagesPage.css';

const MessagesPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(null);
  
  // Chats list state
  const [chats, setChats] = useState([]);
  const [activeChatProfile, setActiveChatProfile] = useState(null);
  
  // Active chat state
  const [messages, setMessages] = useState([]);
  const [chatMessage, setChatMessage] = useState('');
  const [socket, setSocket] = useState(null);
  
  // WebRTC State
  const [inCall, setInCall] = useState(false);
  const [receivingCall, setReceivingCall] = useState(false);
  const [callerSignal, setCallerSignal] = useState(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callerName, setCallerName] = useState('');
  
  // Video & Audio Controls
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();
  const streamRef = useRef();
  const messagesEndRef = useRef();

  // 1. Initial Auth and Data Fetch
  useEffect(() => {
    const savedUser = sessionStorage.getItem('user');
    if (!savedUser) {
      navigate('/login');
      return;
    }
    const user = JSON.parse(savedUser);
    setCurrentUser(user);
    fetchChats(user.email);
  }, [navigate]);

  // 2. Fetch Inbox List
  const fetchChats = async (email) => {
    try {
      const res = await fetch(`${API_BASE}/api/chats/${encodeURIComponent(email)}`);
      const data = await res.json();
      if (data.success) {
        setChats(data.chats);
      }
    } catch (err) {
      console.error('Failed to fetch chats:', err);
    }
  };

  // 3. Handle URL parameters to auto-select or inject a new chat
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const targetUserEmail = params.get('user');

    if (targetUserEmail) {
      const existingChat = chats.find(c => c.profile?.email?.toLowerCase() === targetUserEmail.toLowerCase());
      if (existingChat) {
        setActiveChatProfile(existingChat.profile);
      } else {
        // Chat not in list, fetch profile and inject
        fetch(`${API_BASE}/api/user/profile/${encodeURIComponent(targetUserEmail)}`)
          .then(r => r.json())
          .then(d => {
            if (d.success && d.profile) {
              setActiveChatProfile(d.profile);
              setChats(prev => {
                // Prevent duplicate injection
                if (prev.find(c => c.profile?.email?.toLowerCase() === d.profile.email.toLowerCase())) {
                  return prev;
                }
                return [{ profile: d.profile, lastMessage: 'New chat', timestamp: new Date() }, ...prev];
              });
            }
          })
          .catch(err => console.error('Failed to fetch target user profile:', err));
      }
    } else if (chats.length > 0 && !activeChatProfile) {
      setActiveChatProfile(chats[0].profile);
    }
  }, [location.search, chats]);

  // 4. Socket Connection & Global Listeners
  useEffect(() => {
    if (!currentUser) return;
    
    const newSocket = io(API_BASE);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      newSocket.emit('join_chat', currentUser.email.toLowerCase());
    });

    newSocket.on('receive_message', (msg) => {
      const sender = msg.senderEmail.toLowerCase();
      const receiver = msg.receiverEmail.toLowerCase();
      const current = currentUser.email.toLowerCase();

      // If the message is for the currently open chat, append it
      setActiveChatProfile(currentActive => {
        if (currentActive) {
          const active = currentActive.email.toLowerCase();
          if ((sender === active && receiver === current) || (sender === current && receiver === active)) {
            setMessages(prev => [...prev, msg]);
          }
        }
        return currentActive;
      });

      // Update the left sidebar latest message
      setChats(prevChats => {
        const newChats = [...prevChats];
        const otherPerson = sender === current ? receiver : sender;
        const chatIdx = newChats.findIndex(c => c.profile.email.toLowerCase() === otherPerson);
        if (chatIdx !== -1) {
          newChats[chatIdx].lastMessage = msg.content;
          newChats[chatIdx].timestamp = msg.timestamp;
          // Move to top
          const [movedChat] = newChats.splice(chatIdx, 1);
          newChats.unshift(movedChat);
          return newChats;
        } else {
          // Chat not in list, fetch profile and prepend
          fetch(`${API_BASE}/api/user/profile/${encodeURIComponent(otherPerson)}`)
            .then(r => r.json())
            .then(d => {
              if (d.success && d.profile) {
                setChats(prev => {
                  if (prev.find(c => c.profile.email.toLowerCase() === d.profile.email.toLowerCase())) return prev;
                  return [{ profile: d.profile, lastMessage: msg.content, timestamp: msg.timestamp }, ...prev];
                });
              }
            });
          return prevChats;
        }
      });
    });

    newSocket.on('incoming_call', (data) => {
      setReceivingCall(true);
      setCallerSignal(data.signal);
      setCallerName(data.name);
      // Auto-switch active profile to the caller
      const callerEmail = data.from.toLowerCase();
      setChats(prevChats => {
        const caller = prevChats.find(c => c.profile.email.toLowerCase() === callerEmail);
        if (caller) setActiveChatProfile(caller.profile);
        return prevChats;
      });
    });

    newSocket.on('call_accepted', (signal) => {
      setCallAccepted(true);
      if (connectionRef.current) {
        connectionRef.current.setRemoteDescription(new RTCSessionDescription(signal));
      }
    });

    newSocket.on('ice-candidate', (candidate) => {
      if (connectionRef.current) {
        connectionRef.current.addIceCandidate(new RTCIceCandidate(candidate)).catch(e => console.error(e));
      }
    });

    newSocket.on('call_ended', () => {
      endCall(false);
    });

    return () => {
      newSocket.disconnect();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [currentUser]);

  // 4. Fetch Active Chat Messages
  useEffect(() => {
    if (!currentUser || !activeChatProfile) return;
    
    fetch(`${API_BASE}/api/messages/${encodeURIComponent(currentUser.email)}/${encodeURIComponent(activeChatProfile.email)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setMessages(data.messages);
        }
      });
  }, [currentUser, activeChatProfile]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // 5. Send Message
  const sendMessage = (e) => {
    if (e) e.preventDefault();
    if (!chatMessage.trim() || !socket || !activeChatProfile) return;
    
    const msgData = {
      senderEmail: currentUser.email,
      receiverEmail: activeChatProfile.email,
      content: chatMessage,
    };
    
    socket.emit('send_message', msgData);
    setChatMessage('');
  };

  // 6. WebRTC Logic
  const startCall = async () => {
    setInCall(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (myVideo.current) myVideo.current.srcObject = stream;

      const response = await fetch("https://skillsetu.metered.live/api/v1/turn/credentials?apiKey=cd26417cdfcb81cdf2eb3eebef4e95264712");
      const iceServers = await response.json();

      const peer = new RTCPeerConnection({ iceServers: iceServers });
      connectionRef.current = peer;

      stream.getTracks().forEach(track => peer.addTrack(track, stream));

      peer.ontrack = (event) => {
        if (userVideo.current) {
          userVideo.current.srcObject = event.streams[0];
        }
      };

      peer.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('ice-candidate', {
            to: activeChatProfile.email.toLowerCase(),
            candidate: event.candidate
          });
        }
      };

      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);

      socket.emit('call_user', {
        userToCall: activeChatProfile.email.toLowerCase(),
        signalData: peer.localDescription,
        from: currentUser.email.toLowerCase(),
        name: currentUser.name
      });
    } catch (err) {
      console.error('Failed to start call', err);
      alert('Could not access camera/microphone');
      setInCall(false);
    }
  };

  const answerCall = async () => {
    setInCall(true);
    setCallAccepted(true);
    setReceivingCall(false);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (myVideo.current) myVideo.current.srcObject = stream;

      const response = await fetch("https://skillsetu.metered.live/api/v1/turn/credentials?apiKey=cd26417cdfcb81cdf2eb3eebef4e95264712");
      const iceServers = await response.json();

      const peer = new RTCPeerConnection({ iceServers: iceServers });
      connectionRef.current = peer;

      stream.getTracks().forEach(track => peer.addTrack(track, stream));

      peer.ontrack = (event) => {
        if (userVideo.current) {
          userVideo.current.srcObject = event.streams[0];
        }
      };

      peer.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('ice-candidate', {
            to: activeChatProfile.email.toLowerCase(),
            candidate: event.candidate
          });
        }
      };

      await peer.setRemoteDescription(new RTCSessionDescription(callerSignal));
      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);

      socket.emit('answer_call', {
        to: activeChatProfile.email.toLowerCase(),
        signal: peer.localDescription
      });
    } catch (err) {
      console.error('Failed to answer', err);
      alert('Could not access camera/microphone');
      setInCall(false);
      setCallAccepted(false);
    }
  };

  const toggleAudio = () => {
    if (streamRef.current && streamRef.current.getAudioTracks().length > 0) {
      const enabled = streamRef.current.getAudioTracks()[0].enabled;
      streamRef.current.getAudioTracks()[0].enabled = !enabled;
      setIsAudioMuted(enabled);
    }
  };

  const toggleVideo = () => {
    if (streamRef.current && streamRef.current.getVideoTracks().length > 0) {
      const enabled = streamRef.current.getVideoTracks()[0].enabled;
      streamRef.current.getVideoTracks()[0].enabled = !enabled;
      setIsVideoOff(enabled);
    }
  };

  const endCall = (emit = true) => {
    setInCall(false);
    setCallAccepted(false);
    setReceivingCall(false);
    setIsAudioMuted(false);
    setIsVideoOff(false);
    if (connectionRef.current) {
      connectionRef.current.close();
      connectionRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (emit && socket && activeChatProfile) {
      socket.emit('end_call', { to: activeChatProfile.email.toLowerCase() });
    }
  };

  if (!currentUser) return null;

  return (
    <div className="messages-page-container">
      {/* LEFT SIDEBAR: INBOX */}
      <div className="messages-sidebar">
        <div className="messages-sidebar-header">
          <button className="messages-back-btn" onClick={() => navigate(-1)}>←</button>
          <h2 className="messages-sidebar-title">Chats</h2>
        </div>
        <div className="messages-list">
          {chats.length === 0 ? (
            <div className="messages-empty-state">No conversations yet. Go to Nomad Profiles to start chatting!</div>
          ) : (
            chats.map((chat, idx) => {
              const isActive = activeChatProfile && activeChatProfile.email.toLowerCase() === chat.profile.email.toLowerCase();
              return (
                <div 
                  key={idx} 
                  className={`message-list-item ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveChatProfile(chat.profile)}
                >
                  <div className="message-item-avatar">
                    {chat.profile.avatar ? <img src={chat.profile.avatar} alt={chat.profile.name} /> : chat.profile.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="message-item-content">
                    <div className="message-item-header">
                      <h4 className="message-item-name">{chat.profile.name}</h4>
                      <span className="message-item-time">{new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="message-item-text">{chat.lastMessage}</p>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* RIGHT MAIN AREA: ACTIVE CHAT */}
      <div className="messages-main">
        {!activeChatProfile ? (
          <div className="messages-no-selection">
            <p>Select a chat to start messaging</p>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="chat-active-header">
              <div className="chat-active-profile">
                <div className="chat-active-avatar">
                  {activeChatProfile.avatar ? <img src={activeChatProfile.avatar} alt="avatar" /> : activeChatProfile.name.charAt(0).toUpperCase()}
                </div>
                <div className="chat-active-info">
                  <h3>{activeChatProfile.name}</h3>
                  <p>Online</p>
                </div>
              </div>
              <button className="chat-video-btn" onClick={startCall}>🎥 Video Call</button>
            </div>

            {/* Main Content Area */}
            {inCall ? (
              <div className="webrtc-overlay">
                <video playsInline ref={userVideo} autoPlay className="webrtc-video-main" />
                <video playsInline muted ref={myVideo} autoPlay className="webrtc-video-self" />
                
                {!callAccepted && <div className="webrtc-status">Calling {activeChatProfile.name}...</div>}
                
                <div className="webrtc-controls">
                  <button className="webrtc-ctrl-btn" onClick={toggleAudio}>
                    {isAudioMuted ? '🔇' : '🎙️'}
                  </button>
                  <button className="webrtc-ctrl-btn" onClick={toggleVideo}>
                    {isVideoOff ? '🚫' : '📹'}
                  </button>
                  <button className="webrtc-ctrl-btn danger" onClick={() => endCall(true)}>
                    ❌
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Messages List */}
                <div className="chat-messages-area">
                  {messages.map((m, i) => {
                    const isSent = m.senderEmail.toLowerCase() === currentUser.email.toLowerCase();
                    return (
                      <div key={i} className={`msg-bubble ${isSent ? 'sent' : 'received'}`}>
                        {m.content}
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <form className="chat-input-area" onSubmit={sendMessage}>
                  <input 
                    type="text" 
                    className="chat-input-field" 
                    placeholder="Type a message..." 
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                  />
                  <button type="submit" className="chat-send-btn">➤</button>
                </form>
              </>
            )}
            
            {/* Incoming Call Alert (appears over active chat if you are not already in a call) */}
            {receivingCall && !callAccepted && !inCall && (
              <div className="webrtc-incoming-call">
                <p>{callerName || activeChatProfile.name} is calling...</p>
                <button className="webrtc-incoming-btn" onClick={answerCall}>Answer Call</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;

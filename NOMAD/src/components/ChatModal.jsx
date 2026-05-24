import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import API_BASE from '../utils/api';
import '../pages/CommunityProfile.css';

const ChatModal = ({ currentUser, activeChatProfile, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [chatMessage, setChatMessage] = useState('');
  const [socket, setSocket] = useState(null);
  
  // Video Call States
  const [inCall, setInCall] = useState(false);
  const [receivingCall, setReceivingCall] = useState(false);
  const [callerSignal, setCallerSignal] = useState(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  
  const myVideo = useRef(null);
  const userVideo = useRef(null);
  const connectionRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    // Connect to Socket.IO
    const newSocket = io(API_BASE);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      newSocket.emit('join_chat', currentUser.email);
    });

    // Receive chat message
    newSocket.on('receive_message', (msg) => {
      // Only append if it's relevant to this conversation
      if (
        (msg.senderEmail === activeChatProfile.email && msg.receiverEmail === currentUser.email) ||
        (msg.senderEmail === currentUser.email && msg.receiverEmail === activeChatProfile.email)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    // WebRTC Signaling listeners
    newSocket.on('incoming_call', (data) => {
      if (data.from === activeChatProfile.email) {
        setReceivingCall(true);
        setCallerSignal(data.signal);
      }
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

    // Fetch initial chat history
    fetch(`${API_BASE}/api/messages/${encodeURIComponent(currentUser.email)}/${encodeURIComponent(activeChatProfile.email)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setMessages(data.messages);
        }
      });

    return () => {
      newSocket.disconnect();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [currentUser, activeChatProfile]);

  const sendMessage = () => {
    if (!chatMessage.trim() || !socket) return;
    
    const msgData = {
      senderEmail: currentUser.email,
      receiverEmail: activeChatProfile.email,
      content: chatMessage,
    };
    
    socket.emit('send_message', msgData);
    setChatMessage('');
  };

  // --- WEBRTC ---
  const startCall = async () => {
    setInCall(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (myVideo.current) myVideo.current.srcObject = stream;

      // Fetch TURN credentials from Metered API
      const response = await fetch("https://skillsetu.metered.live/api/v1/turn/credentials?apiKey=cd26417cdfcb81cdf2eb3eebef4e95264712");
      const iceServers = await response.json();

      const peer = new RTCPeerConnection({
        iceServers: iceServers
      });
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
            to: activeChatProfile.email,
            candidate: event.candidate
          });
        }
      };

      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);

      socket.emit('call_user', {
        userToCall: activeChatProfile.email,
        signalData: peer.localDescription,
        from: currentUser.email,
        name: currentUser.name
      });
    } catch (err) {
      console.error('Failed to start call', err);
      alert('Could not access camera/microphone');
    }
  };

  const answerCall = async () => {
    setCallAccepted(true);
    setInCall(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (myVideo.current) myVideo.current.srcObject = stream;

      // Fetch TURN credentials from Metered API
      const response = await fetch("https://skillsetu.metered.live/api/v1/turn/credentials?apiKey=cd26417cdfcb81cdf2eb3eebef4e95264712");
      const iceServers = await response.json();

      const peer = new RTCPeerConnection({
        iceServers: iceServers
      });
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
            to: activeChatProfile.email,
            candidate: event.candidate
          });
        }
      };

      await peer.setRemoteDescription(new RTCSessionDescription(callerSignal));
      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);

      socket.emit('answer_call', { signal: peer.localDescription, to: activeChatProfile.email });
    } catch (err) {
      console.error('Failed to answer call', err);
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
    if (emit && socket) {
      socket.emit('end_call', { to: activeChatProfile.email });
    }
  };

  return (
    <div className="event-modal-overlay chat-overlay" onClick={onClose}>
      <div className="event-modal chat-modal" onClick={(e) => e.stopPropagation()}>
        <button className="event-modal-close" onClick={onClose}>×</button>
        
        <div className="chat-modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div className="chat-avatar">
              {activeChatProfile.avatar ? <img src={activeChatProfile.avatar} alt="avatar" /> : activeChatProfile.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="chat-name">{activeChatProfile.name}</h3>
              <p className="chat-status">🟢 Online</p>
            </div>
          </div>
          <button onClick={startCall} style={{ background: '#000', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer' }}>
            🎥 Video Call
          </button>
        </div>

        {receivingCall && !callAccepted && (
          <div style={{ background: '#ff6b35', color: '#fff', padding: '10px', textAlign: 'center' }}>
            <p>{activeChatProfile.name} is calling...</p>
            <button onClick={answerCall} style={{ background: '#fff', color: '#ff6b35', border: 'none', padding: '5px 15px', borderRadius: '5px', cursor: 'pointer' }}>Answer</button>
          </div>
        )}

        {inCall ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#000', position: 'relative' }}>
             <video playsInline muted ref={myVideo} autoPlay style={{ width: '100px', position: 'absolute', bottom: 60, right: 10, borderRadius: '8px', zIndex: 10 }} />
             {callAccepted && (
               <video playsInline ref={userVideo} autoPlay style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
             )}
             {!callAccepted && <div style={{ color: '#fff', textAlign: 'center', marginTop: '50px' }}>Calling...</div>}
             
             {/* Call Controls */}
             <div style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '10px', zIndex: 20 }}>
               <button onClick={toggleAudio} style={{ background: isAudioMuted ? '#ff6b35' : '#333', color: '#fff', border: 'none', padding: '10px', borderRadius: '50%', cursor: 'pointer', width: '40px', height: '40px' }}>
                 {isAudioMuted ? '🔇' : '🎙️'}
               </button>
               <button onClick={toggleVideo} style={{ background: isVideoOff ? '#ff6b35' : '#333', color: '#fff', border: 'none', padding: '10px', borderRadius: '50%', cursor: 'pointer', width: '40px', height: '40px' }}>
                 {isVideoOff ? '🚫' : '📹'}
               </button>
               <button onClick={() => endCall(true)} style={{ background: 'red', color: '#fff', border: 'none', padding: '10px', borderRadius: '50%', cursor: 'pointer', width: '40px', height: '40px' }}>
                 ❌
               </button>
             </div>
          </div>
        ) : (
          <div className="chat-modal-body">
            {messages.map((m, i) => (
              <div key={i} className={`chat-bubble ${m.senderEmail === currentUser.email ? 'sent' : 'received'}`}>
                {m.content}
              </div>
            ))}
          </div>
        )}

        {!inCall && (
          <div className="chat-modal-footer">
            <input 
              type="text" 
              className="chat-input" 
              placeholder="Type a message..." 
              value={chatMessage} 
              onChange={e => setChatMessage(e.target.value)} 
              onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(); }} 
            />
            <button className="chat-send-btn" onClick={sendMessage}>Send</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatModal;

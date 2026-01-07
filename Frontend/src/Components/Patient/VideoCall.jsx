import React, { useState } from 'react';
import { Mic, MicOff, Video, VideoOff, PhoneOff, ScreenShare, MessageSquare, User } from 'lucide-react';

const VideoCall = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [inCall, setInCall] = useState(false);

  const doctorName = "Dr. Sarah Smith";

  if (!inCall) {
    return (
      <div style={vStyles.lobby}>
        <div style={vStyles.previewBox}>
          {isCameraOff ? <div style={vStyles.avatarCircle}><User size={60} /></div> : <div style={vStyles.videoPlaceholder}>Camera Preview (Self)</div>}
        </div>
        <h3>Ready to join?</h3>
        <p>Consultation with {doctorName}</p>
        <div style={styles.btnRow}>
             <button onClick={() => setIsMuted(!isMuted)} style={vStyles.iconBtn}>{isMuted ? <MicOff /> : <Mic />}</button>
             <button onClick={() => setIsCameraOff(!isCameraOff)} style={vStyles.iconBtn}>{isCameraOff ? <VideoOff /> : <Video />}</button>
        </div>
        <button onClick={() => setInCall(true)} style={vStyles.joinBtn}>Join Meeting</button>
      </div>
    );
  }

  return (
    <div style={vStyles.callContainer}>
      {/* Main Video Area (Doctor) */}
      <div style={vStyles.mainVideo}>
        <div style={vStyles.videoPlaceholder}>
           <p style={{color: '#fff'}}>Live Feed: {doctorName}</p>
        </div>
        {/* Small Self-view Overlay */}
        <div style={vStyles.selfView}>
             {isCameraOff ? "Camera Off" : "You"}
        </div>
      </div>

      {/* Control Bar */}
      <div style={vStyles.controlBar}>
        <button onClick={() => setIsMuted(!isMuted)} style={isMuted ? vStyles.activeBtn : vStyles.iconBtn}>
          {isMuted ? <MicOff /> : <Mic />}
        </button>
        <button onClick={() => setIsCameraOff(!isCameraOff)} style={isCameraOff ? vStyles.activeBtn : vStyles.iconBtn}>
          {isCameraOff ? <VideoOff /> : <Video />}
        </button>
        <button style={vStyles.iconBtn}><ScreenShare /></button>
        <button style={vStyles.iconBtn}><MessageSquare /></button>
        <button onClick={() => setInCall(false)} style={vStyles.endCallBtn}>
          <PhoneOff />
        </button>
      </div>
    </div>
  );
};

const vStyles = {
  lobby: { display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '20px' },
  previewBox: { width: '320px', height: '180px', backgroundColor: '#333', borderRadius: '12px', marginBottom: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#fff' },
  avatarCircle: { width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#555', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  joinBtn: { marginTop: '20px', padding: '12px 30px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '30px', cursor: 'pointer', fontWeight: 'bold' },
  callContainer: { position: 'relative', width: '100%', height: '500px', backgroundColor: '#000', borderRadius: '12px', overflow: 'hidden' },
  mainVideo: { width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  selfView: { position: 'absolute', bottom: '100px', right: '20px', width: '150px', height: '100px', backgroundColor: '#222', borderRadius: '8px', border: '2px solid #fff', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#fff', fontSize: '12px' },
  controlBar: { position: 'absolute', bottom: '0', width: '100%', height: '80px', backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px' },
  iconBtn: { padding: '12px', borderRadius: '50%', border: 'none', backgroundColor: '#444', color: '#fff', cursor: 'pointer' },
  activeBtn: { padding: '12px', borderRadius: '50%', border: 'none', backgroundColor: '#ef4444', color: '#fff', cursor: 'pointer' },
  endCallBtn: { padding: '12px', borderRadius: '50%', border: 'none', backgroundColor: '#ef4444', color: '#fff', cursor: 'pointer' },
  videoPlaceholder: { fontSize: '18px', fontWeight: 'bold' }
};

const styles = { btnRow: { display: 'flex', gap: '15px' } };

export default VideoCall;
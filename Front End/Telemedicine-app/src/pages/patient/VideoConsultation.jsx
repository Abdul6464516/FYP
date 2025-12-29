import React, { useState } from "react";

const VideoConsultation = () => {
  const [isJoined, setIsJoined] = useState(false);

  return (
    <div className="p-6 border rounded-lg shadow-md bg-white">
      <h2 className="text-2xl font-bold mb-4 text-blue-600">Video Consultation</h2>
      
      {!isJoined ? (
        <div className="text-center py-10">
          <p className="mb-4 text-gray-600">Your doctor is ready for the session.</p>
          <button 
            onClick={() => setIsJoined(true)}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full font-semibold transition"
          >
            Join Consultation Room
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Video Placeholder */}
          <div className="aspect-video bg-black rounded-lg flex items-center justify-center text-white relative">
            <span className="animate-pulse">Live Video Stream (WebRTC)</span>
            <div className="absolute bottom-4 left-4 bg-gray-800 px-2 py-1 rounded text-xs">
              Doctor: Connected
            </div>
          </div>
          
          <div className="flex justify-center gap-4">
            <button className="bg-gray-200 p-3 rounded-full">Mic</button>
            <button className="bg-gray-200 p-3 rounded-full">Camera</button>
            <button 
              onClick={() => setIsJoined(false)}
              className="bg-red-500 text-white px-6 py-2 rounded-full"
            >
              End Call
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoConsultation;
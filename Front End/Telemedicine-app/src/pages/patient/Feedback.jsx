import React, { useState } from "react";

const Feedback = () => {
  const [rating, setRating] = useState(0);

  return (
    <div className="p-6 border rounded-lg shadow-md bg-white">
      <h2 className="text-2xl font-bold mb-4 text-blue-600">Doctor Feedback</h2>
      <p className="mb-4 text-sm text-gray-600">How was your recent consultation with Dr. Ahmed?</p>
      
      <div className="flex gap-2 mb-4">
        {[1, 2, 3, 4, 5].map(star => (
          <button 
            key={star} 
            onClick={() => setRating(star)}
            className={`text-2xl ${rating >= star ? "text-yellow-400" : "text-gray-300"}`}
          >
            ★
          </button>
        ))}
      </div>
      
      <textarea 
        placeholder="Write your review here..."
        className="w-full border p-2 rounded mb-4"
        rows="3"
      ></textarea>
      
      <button className="bg-blue-600 text-white px-6 py-2 rounded">Submit Review</button>
    </div>
  );
};

export default Feedback;
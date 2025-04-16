import React, { useState } from 'react';
import axios from 'axios';
import '../App.css';
import ReactMarkdown from 'react-markdown';


function GeminiChat() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const formatResponse = (text) => {
    // Split into sections
    const sections = text.split(/\*\*([^*]+)\*\*/g);
    
    // Format lists
    const formattedText = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold text
      .replace(/\* (.*?)(\n|$)/g, '<li>$1</li>') // List items
      .replace(/\n/g, '<br />') // Line breaks
      .replace(/<li>.*?<\/li>/g, (match) => `<ul>${match}</ul>`); // Wrap lists

    return { __html: formattedText };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/gemini', {
        prompt: input,
      });
      setResponse(res.data.reply);
    } catch (error) {
      console.error(error);
      setResponse("Error fetching response from Gemini");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app">
      <h1>Dharma AI Chat</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Gemini something..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Sending..." : "Send"}
        </button>
      </form>
      {response && (
        <div className="response">
          <h3>Response:</h3>
          <div 
            className="formatted-response"
            dangerouslySetInnerHTML={formatResponse(response)} 
          />
        </div>
      )}
    </div>
  );
}

export default GeminiChat;
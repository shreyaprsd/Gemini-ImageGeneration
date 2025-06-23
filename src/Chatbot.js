import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

function Chatbot() {
  const [inputValue, setInputValue] = useState('');
  const [promptResponses, setpromptResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // Initialize the API with environment variable
  const genAI = new GoogleGenerativeAI(process.env.REACT_APP_API_KEY);


  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setError(null); // Clear any previous errors when user types
  };

  const getResponseForGivenPrompt = async () => {
    if (!inputValue.trim()) {
      setError('Please enter a question');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const result = await model.generateContent(inputValue);
      
      if (!result || !result.response) {
        throw new Error('Invalid response from API');
      }

      const response = result.response;
      const text = response.text();
      
      if (!text) {
        throw new Error('No text in response');
      }

      setpromptResponses(prev => [...prev, text]);
      setInputValue('');
    } catch (error) {
      console.error('API Error:', error);
      setError(error.message || 'Failed to get response. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Ask Me Something You Want"
            className="form-control"
          />
        </div>
        <div className="col-auto">
          <button 
            onClick={getResponseForGivenPrompt} 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger mt-3" role="alert">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center mt-3">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        promptResponses.map((promptResponse, index) => (
          <div key={index} className="mt-3">
            <div className={`response-text ${index === promptResponses.length - 1 ? 'fw-bold' : ''}`}>
              {promptResponse}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Chatbot;
import React, { useState, useEffect, useRef } from 'react';
import AvatarCanvas from './AvatarCanvas';

const API_KEY = 'AIzaSyBrkvnPliE7oM4izocBM58Pas3iiXhFyWg';

export default function AuraChat({ data, onViewChange }) {
  const [messages, setMessages] = useState([
    {
      sender: 'aura',
      text: "Hello! I am Aura, your digital wealth advisory assistant. I've analyzed your spending habits and portfolio performance. How can I guide you today? I can analyze your budget, check your risk profile, or review your portfolio rebalancing."
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [avatarState, setAvatarState] = useState('idle');
  const [isListening, setIsListening] = useState(false);
  const [useVoice, setUseVoice] = useState(false);
  
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const synthesisUtteranceRef = useRef(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onstart = () => {
        setIsListening(true);
        setAvatarState('listening');
      };

      rec.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        sendMessage(transcript);
      };

      rec.onerror = (e) => {
        console.error("Speech recognition error:", e);
        setIsListening(false);
        setAvatarState('idle');
      };

      rec.onend = () => {
        setIsListening(false);
        if (avatarState === 'listening') {
          setAvatarState('idle');
        }
      };

      recognitionRef.current = rec;
    }
  }, []);

  // Stop TTS voice output when component unmounts or changes
  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  const startVoiceInput = () => {
    if (!recognitionRef.current) {
      alert("Voice recognition is not supported in this browser. Please use Chrome, Safari or Edge.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      window.speechSynthesis?.cancel(); // Stop talking if user starts speaking
      recognitionRef.current.start();
    }
  };

  // Speak response out loud using SpeechSynthesis
  const speakText = (text) => {
    if (!window.speechSynthesis) return;
    
    // Cancel current speech
    window.speechSynthesis.cancel();
    
    // Clean text of markdown stars/symbols for cleaner voice
    const cleanText = text.replace(/[*#_`\-]/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'en-US';
    
    // Select an elegant female voice if available
    const voices = window.speechSynthesis.getVoices();
    const premiumVoice = voices.find(voice => 
      voice.name.includes('Google US English') || 
      voice.name.includes('Microsoft Zira') || 
      voice.name.includes('Samantha') ||
      voice.lang === 'en-US'
    );
    if (premiumVoice) {
      utterance.voice = premiumVoice;
    }
    
    utterance.rate = 1.0;
    utterance.pitch = 1.05;

    utterance.onstart = () => {
      setAvatarState('speaking');
    };

    utterance.onend = () => {
      setAvatarState('idle');
    };

    utterance.onerror = () => {
      setAvatarState('idle');
    };

    synthesisUtteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const callGemini = async (userPrompt, chatHistory) => {
    setAvatarState('thinking');
    
    // Construct System context injection
    const systemInstructions = `You are Aura, an advanced AI-powered Digital Wealth Advisor integrated into the user's mobile banking app.
Your style is warm, professional, engaging, and clear.
Here is the user's financial profile data:
- Net Worth Portfolio Value: $${data.portfolio.reduce((sum, item) => sum + item.value, 0).toLocaleString()}
- Monthly Savings Rate: $${data.savings.toLocaleString()} / month
- Active Credit Card Debt: $${data.debt.toLocaleString()}
- Active Risk Tolerance Profile: ${data.riskProfile.toUpperCase()}
- Current Holdings Breakdown:
${data.portfolio.map(item => `  * ${item.assetClass} (${item.entity}): value $${item.value.toLocaleString()}, actual allocation ${item.actual}%, target allocation ${item.target}%`).join('\n')}
- Monthly Spending Breakdown:
${data.spending.map(item => `  * ${item.category}: $${item.amount.toLocaleString()} / month`).join('\n')}
- Active Financial Goals:
  * Retirement Fund: target $1,000,000, current: $305,000, status: On track
  * Emergency Fund: target $20,000, current: $17,000, status: 85% completed
  * Custom Goal (New Home): target $100,000, current: $36,000, status: Under-funded

Provide specific, personalized, action-oriented, data-driven financial advice. Reference their actual spending and asset allocation numbers in your answers to show you know their portfolio.
Keep your answers brief (1-3 paragraphs) because this is a mobile app chat screen.
Do NOT give generic disclaimers at the beginning; act as their trusted personal banker.`;

    const formattedHistory = chatHistory.map(m => ({
      role: m.sender === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }]
    }));

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            ...formattedHistory,
            { role: 'user', parts: [{ text: `${systemInstructions}\n\nUser Question: ${userPrompt}` }] }
          ]
        })
      });

      const json = await response.json();
      const reply = json.candidates?.[0]?.content?.parts?.[0]?.text || "I apologize, I encountered a temporary connection issue. Please try again.";
      
      setMessages(prev => [...prev, { sender: 'aura', text: reply }]);
      
      if (useVoice) {
        speakText(reply);
      } else {
        setAvatarState('idle');
      }
    } catch (error) {
      console.error("Gemini API Error:", error);
      setMessages(prev => [...prev, { sender: 'aura', text: "I'm having trouble connecting to my advisory network. Please check your connection." }]);
      setAvatarState('idle');
    }
  };

  const sendMessage = (textToSend = inputText) => {
    if (!textToSend.trim()) return;

    // Add user message
    const updatedMessages = [...messages, { sender: 'user', text: textToSend }];
    setMessages(updatedMessages);
    setInputText('');

    // Call AI advisory
    callGemini(textToSend, updatedMessages);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const handlePresetClick = (presetPrompt) => {
    sendMessage(presetPrompt);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', height: '100%' }}>
      {/* Left Column: Visual AI Avatar */}
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '8px' }}>Aura Interface</h2>
        <span style={{
          fontSize: '11px',
          background: 'rgba(6, 182, 212, 0.1)',
          color: 'var(--color-cyan)',
          border: '1px solid var(--border-highlight)',
          padding: '4px 10px',
          borderRadius: '12px',
          fontWeight: '600',
          textTransform: 'uppercase',
          marginBottom: '20px'
        }}>
          Status: {avatarState}
        </span>

        <AvatarCanvas state={avatarState} />

        {/* TTS Toggle Voice mode */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '30px' }}>
          <label style={{ fontSize: '13px', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              checked={useVoice}
              onChange={(e) => {
                setUseVoice(e.target.checked);
                if (!e.target.checked) window.speechSynthesis?.cancel();
              }}
              style={{
                accentColor: 'var(--color-cyan)',
                width: '16px',
                height: '16px',
                cursor: 'pointer'
              }}
            />
            Enable Voice Responses (TTS)
          </label>
        </div>

        {/* Suggestion Presets */}
        <div style={{ width: '100%', marginTop: '30px' }}>
          <h4 style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px', textAlign: 'center' }}>Advisory Presets</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
            <button className="btn-secondary" style={{ padding: '8px 14px', fontSize: '12px', borderRadius: '20px' }} onClick={() => handlePresetClick("Analyze my monthly spending and budget")}>
              📊 Budget Check
            </button>
            <button className="btn-secondary" style={{ padding: '8px 14px', fontSize: '12px', borderRadius: '20px' }} onClick={() => handlePresetClick("Should I rebalance my current portfolio? Explain trades")}>
              ⚖️ Portfolio Drift
            </button>
            <button className="btn-secondary" style={{ padding: '8px 14px', fontSize: '12px', borderRadius: '20px' }} onClick={() => handlePresetClick("Explain how my Balanced risk profile is calculated")}>
              🛡️ Risk Profile
            </button>
            <button className="btn-secondary" style={{ padding: '8px 14px', fontSize: '12px', borderRadius: '20px' }} onClick={() => handlePresetClick("Am I on track to hit my $1,000,000 Retirement Goal?")}>
              🎯 Goal Feasibility
            </button>
          </div>
        </div>
      </div>

      {/* Right Column: Chat Screen */}
      <div className="chat-container">
        <div className="chat-messages">
          {messages.map((m, idx) => (
            <div key={idx} className={`chat-bubble ${m.sender}`}>
              {m.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-area">
          <button
            className={`chat-action-btn voice-btn ${isListening ? 'active' : ''}`}
            onClick={startVoiceInput}
            title="Speak to Aura"
          >
            <i className={`fa-solid ${isListening ? 'fa-microphone-lines' : 'fa-microphone'}`}></i>
          </button>
          <input
            type="text"
            className="chat-input"
            placeholder={isListening ? "Listening..." : "Ask Aura about wealth advice..."}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isListening}
          />
          <button className="chat-action-btn send-btn" onClick={() => sendMessage()}>
            <i className="fa-solid fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

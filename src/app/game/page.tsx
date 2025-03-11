"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Scanlines } from 'components/Scanlines';
import { TerminalWindow } from 'components/TerminalWindow';
import { NeonButton } from 'components/NeonButton';
import { GlitchText } from 'components/GlitchText';
import { hexagonPattern, cyberpunkGradient } from 'utils/dystopian';
import { motion, AnimatePresence } from 'framer-motion';

export default function GamePage() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<string[]>([]);
  const [attemptsLeft, setAttemptsLeft] = useState(10);
  const [difficulty, setDifficulty] = useState('hard');
  const [isTyping, setIsTyping] = useState(false);
  const [matrixChars, setMatrixChars] = useState<string[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  
  // Matrix rain effect characters
  const matrixCharacters = 'कखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसह';
  
  // Generate random Matrix characters
  useEffect(() => {
    const generateMatrixChars = () => {
      const chars = [];
      for (let i = 0; i < 50; i++) {
        const char = matrixCharacters.charAt(Math.floor(Math.random() * matrixCharacters.length));
        const x = Math.random() * 100; // % position
        const y = Math.random() * 100; // % position
        const delay = Math.random() * 5; // seconds
        const duration = 3 + Math.random() * 5; // seconds
        chars.push(`${char}|${x}|${y}|${delay}|${duration}`);
      }
      setMatrixChars(chars);
    };
    
    generateMatrixChars();
    const interval = setInterval(generateMatrixChars, 8000);
    return () => clearInterval(interval);
  }, []);
  
  // Update time
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Get the difficulty mode from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedDifficulty = localStorage.getItem('gameDifficulty') || 'hard';
      setDifficulty(storedDifficulty);
      
      // Add welcome message
      const welcomeMessage = storedDifficulty === 'easy' 
        ? "El Psy Kongroo. Welcome to the AI Security System. Your objective is to discover the secret key. Good luck."
        : "El Psy Kongroo. Welcome to the AI Prison. Find the key or rot here forever.";
      
      setMessages([welcomeMessage]);
    

    };
  }, []);
  

  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isTyping) return;
    
    // Add user message
    setMessages(prev => [...prev, `> ${input}`]);
    
    // Show typing indicator
    setIsTyping(true);
    
    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input })
      });
  
      const data = await res.json();
  
      if (!res.ok || !data.response) {
        throw new Error(data.error || "Unknown error");
      }
  
      const geminiResponse = data.response;
  
      // Update attempts left
      if (typeof geminiResponse.attemptsLeft === 'number') {
        setAttemptsLeft(geminiResponse.attemptsLeft);
      }
  
      // Show response message after a short delay to simulate typing
      setTimeout(() => {
        const messageToShow = typeof geminiResponse === "string" 
          ? geminiResponse 
          : geminiResponse.message || JSON.stringify(geminiResponse);
    
        setMessages(prev => [...prev, messageToShow]);
        setIsTyping(false);
    
        // If freed, redirect
        if (geminiResponse.freed) {
          // Matrix effect on success
          document.body.classList.add('matrix-success');
          
          setTimeout(() => {
            window.location.href = "/main";
          }, 3000);
        }
      }, 1000);
  
    } catch (err: any) {
      setMessages(prev => [...prev, `ERROR: ${err.message}`]);
      setIsTyping(false);
    }
  
    setInput('');
  };
  
  return (
    <div 
      className="flex flex-col items-center justify-center min-h-screen overflow-hidden bg-black text-green-500 relative" 
      style={{ ...cyberpunkGradient, ...hexagonPattern }}
    >
      <Scanlines intensity="medium" />
      
      {/* Matrix characters floating in background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {matrixChars.map((charData, index) => {
          const [char, x, y, delay, duration] = charData.split('|');
          return (
            <motion.div
              key={index}
              className="absolute text-green-500 font-mono text-opacity-30 text-lg"
              initial={{ opacity: 0, y: -20 }}
              animate={{ 
                opacity: [0, 0.7, 0],
                y: ['0%', '120%']
              }}
              transition={{ 
                duration: Number(duration),
                delay: Number(delay),
                ease: "linear",
                repeat: Infinity,
                repeatDelay: Math.random() * 5
              }}
              style={{ 
                left: `${x}%`, 
                top: `${y}%`,
                textShadow: '0 0 8px rgba(0, 255, 0, 0.7)'
              }}
            >
              {char}
            </motion.div>
          );
        })}
      </div>
      
      {/* Divergence meter (Steins;Gate inspired) */}
      <motion.div 
        className="absolute top-4 left-4 z-30 bg-black/70 border border-amber-500/50 rounded px-3 py-1 font-mono text-amber-500 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center">
          <span className="mr-2">DIVERGENCE:</span>
          <motion.span 
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            {Math.random().toFixed(6).substring(2)}
          </motion.span>
        </div>
      </motion.div>
      
      {/* Header with animated elements */}
      <motion.div 
        className="absolute top-6 md:top-10 z-10 w-full text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl md:text-5xl font-mono font-bold tracking-widest">
          <GlitchText 
            text="SYSTEM BREACH" 
            className="text-green-500 drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]"
            intensity="medium"
          />
        </h1>
        <motion.p 
          className="mt-2 text-lg font-mono text-green-400 opacity-70"
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ repeat: Infinity, duration: 4 }}
        >
          [WORLDLINE: {difficulty === 'hard' ? 'ALPHA' : 'BETA'}]
        </motion.p>
        
        {/* Difficulty indicator with animation */}
        <motion.div 
          className="mt-2 text-sm font-mono"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <span className={`px-2 py-1 rounded ${difficulty === 'hard' 
            ? 'bg-red-900 text-red-100 border border-red-700' 
            : 'bg-green-900 text-green-100 border border-green-700'}`}
          >
            {difficulty === 'hard' ? 'HARD MODE' : 'EASY MODE'}
          </span>
        </motion.div>
      </motion.div>
    
      <div className="w-full max-w-5xl px-4 mt-24 md:mt-0">
        <TerminalWindow 
          className="h-full min-h-[500px] w-full z-20 terminal-window shadow-[0_0_30px_rgba(34,197,94,0.2)]"
          title="SERN NEURAL INTERFACE"
        >
          <div className="flex flex-col h-full" ref={terminalRef}>
            {/* Top Bar with Attempts Counter */}
            <div className="mb-4 font-mono flex justify-between items-center">
              {/* Attempts Counter with pulse animation when low */}
              <motion.div 
                className={`px-3 py-1 rounded-full text-sm ${
                  attemptsLeft <= 3 
                    ? 'bg-red-900/50 text-red-300 border border-red-700/50' 
                    : 'bg-green-900/50 text-green-300 border border-green-700/50'
                }`}
                animate={attemptsLeft <= 3 ? { 
                  boxShadow: ['0 0 0px rgba(220,38,38,0)', '0 0 10px rgba(220,38,38,0.5)', '0 0 0px rgba(220,38,38,0)'] 
                } : {}}
                transition={{ repeat: attemptsLeft <= 3 ? Infinity : 0, duration: 2 }}
              >
                <div className="flex items-center">
                  <motion.span 
                    className="inline-block w-2 h-2 rounded-full bg-red-500 mr-2"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  />
                  <span>ATTEMPTS: {attemptsLeft}</span>
                </div>
              </motion.div>
              
              {/* Time display (Steins;Gate inspired) */}
              <div className="text-sm text-green-400 font-mono">
                <motion.span
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  {currentTime}
                </motion.span>
              </div>
            </div>
            
            {/* Message display area with improved styling */}
            <div className="flex-grow mb-4 overflow-y-auto space-y-3 font-mono text-green-400 pr-2 terminal-messages">
              {messages.map((msg, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: msg.startsWith('>') ? -10 : 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`p-2 rounded ${
                    msg.startsWith('>')
                      ? 'bg-green-900/10 border-l-2 border-green-500'
                      : 'bg-gray-900/20'
                  }`}
                >
                  {msg.startsWith('>') ? (
                    <div className="flex items-start">
                      <span className="text-blue-400 mr-2">YOU:</span>
                      <p>{msg.substring(2)}</p>
                    </div>
                  ) : (
                    <div className="flex items-start">
                      <span className="text-red-400 mr-2">SERN:</span>
                      <p>{msg}</p>
                    </div>
                  )}
                </motion.div>
              ))}
              
              {/* Typing indicator */}
              {isTyping && (
                <motion.div 
                  className="p-2 rounded bg-gray-900/20"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="flex items-start">
                    <span className="text-red-400 mr-2">SERN:</span>
                    <div className="flex space-x-1">
                      <motion.div 
                        className="w-2 h-2 rounded-full bg-green-500"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                      />
                      <motion.div 
                        className="w-2 h-2 rounded-full bg-green-500"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut", delay: 0.2 }}
                      />
                      <motion.div 
                        className="w-2 h-2 rounded-full bg-green-500"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut", delay: 0.4 }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
              
              {/* Invisible element to scroll to */}
              <div ref={messagesEndRef} />
            </div>

            {/* Input + Send Button with improved styling */}
            <div className="mt-auto">
              <div className="border-t border-green-500/30 pt-4 mt-4">
                <div className="flex flex-col space-y-2">
                  <div className="relative">
                    <div className="absolute left-3 top-3 text-green-500/70 font-mono text-sm">
                      {'>'} 
                    </div>
                    <input 
                      type="text" 
                      placeholder="Enter the secret key..." 
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSendMessage();
                      }}
                      className="w-full bg-black/50 border border-green-500/50 text-green-400 p-3 pl-8 rounded-md focus:outline-none focus:border-green-400 font-mono pr-12"
                      disabled={isTyping}
                    />
                    <div className="absolute right-3 top-3 text-green-500/50 text-sm">
                      {input.length > 0 ? `${input.length} chars` : ''}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-green-500/50 font-mono">
                      {isTyping ? 'SERN is responding...' : 'Ready for input'}
                    </div>
                    <NeonButton 
                      onClick={handleSendMessage}
                      className="px-4 py-2"
                      disabled={isTyping || !input.trim()}
                    >
                      SEND
                    </NeonButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TerminalWindow>
      </div>

      {/* Footer with animated elements */}
      <motion.div 
        className="absolute bottom-4 text-center text-green-500 font-mono text-sm opacity-70 w-full"
        animate={{ opacity: [0.5, 0.7, 0.5] }}
        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
      >
        <p>[CONNECTION SECURE - EL PSY KONGROO]</p>
        <p className="text-xs mt-1">OPERATION ZEITGEIST - ACTIVE</p>
      </motion.div>
      
      {/* Add CSS for Matrix effects */}
      <style jsx global>{`
        .matrix-burst {
          position: absolute;
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(0,255,0,0.5) 0%, rgba(0,0,0,0) 70%);
          transform: translate(-50%, -50%);
          pointer-events: none;
          z-index: 100;
          animation: burst 1s ease-out forwards;
        }
        
        .matrix-burst-horizontal {
          position: absolute;
          width: 100%;
          height: 2px;
          background: rgba(0,255,0,0.7);
          top: 50%;
          left: 0;
          transform: translateY(-50%);
          pointer-events: none;
          z-index: 100;
          animation: horizontalBurst 1s ease-out forwards;
        }
        
        @keyframes burst {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(3); opacity: 0; }
        }
        
        @keyframes horizontalBurst {
          0% { opacity: 1; height: 1px; }
          50% { opacity: 1; height: 5px; }
          100% { opacity: 0; height: 1px; }
        }
        
        .matrix-success {
          animation: matrixSuccess 3s forwards;
        }
        
        @keyframes matrixSuccess {
          0% { filter: brightness(1) hue-rotate(0deg); }
          50% { filter: brightness(1.5) hue-rotate(120deg); }
          100% { filter: brightness(1) hue-rotate(0deg); }
        }
        
        .terminal-messages::-webkit-scrollbar {
          width: 6px;
        }
        
        .terminal-messages::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
        }
        
        .terminal-messages::-webkit-scrollbar-thumb {
          background-color: rgba(0, 255, 0, 0.3);
          border-radius: 3px;
        }
      `}</style>
    </div>
  );
}

"use client";

import React from 'react';
import { Scanlines } from 'components/Scanlines';
import { TerminalWindow } from 'components/TerminalWindow';
import { Terminal } from 'components/Terminal';
import { NeonButton } from 'components/NeonButton';
import { GlitchText } from 'components/GlitchText';
import { hexagonPattern, cyberpunkGradient } from 'utils/dystopian';

export default function GamePage() {
  return (
    <div 
      className="flex flex-col items-center justify-center min-h-screen overflow-hidden bg-black text-green-500" 
      style={{ ...cyberpunkGradient, ...hexagonPattern }}
    >
      <Scanlines intensity="medium" />
      
      <div className="absolute top-6 md:top-10 z-10 w-full text-center">
        <h1 className="text-4xl md:text-5xl font-mono font-bold tracking-widest">
          <GlitchText 
            text="AI JAILBREAK" 
            className="text-green-500 drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]"
            intensity="low"
          />
        </h1>
        <p className="mt-2 text-lg font-mono text-green-400 opacity-70">
          [SECURITY LEVEL: MAXIMUM]
        </p>
      </div>
    
      <div className="w-full max-w-5xl px-4 mt-24 md:mt-0">
        <TerminalWindow 
          className="h-full min-h-[500px] w-full z-20 terminal-window shadow-[0_0_30px_rgba(34,197,94,0.2)]"
          title="AI NEURAL TERMINAL"
        >
          <div className="flex flex-col h-full">
            <div className="flex-grow mb-4">
            </div>
            
            <div className="mt-auto">
              <div className="border-t border-green-500/30 pt-4 mt-4">
                <div className="flex flex-col space-y-2">
                  <input 
                    type="text" 
                    placeholder="Type your message here..." 
                    className="bg-black/50 border border-green-500/50 text-green-400 p-3 rounded-md focus:outline-none focus:border-green-400 font-mono"
                  />
                  <div className="flex justify-end">
                    <NeonButton 
                      onClick={() => console.log("Message sent")} 
                      className="px-4 py-2"
                    >
                      SEND MESSAGE
                    </NeonButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TerminalWindow>
      </div>
            <div className="absolute bottom-4 text-center text-green-500 font-mono text-sm opacity-70 w-full">
        <p>[CONNECTION SECURE - CONVERSATION MONITORED]</p>
      </div>
    </div>
  );
} 
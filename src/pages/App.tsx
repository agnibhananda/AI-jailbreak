import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { GlitchText } from "components/GlitchText";
import { TerminalWindow } from "components/TerminalWindow";
import { Terminal } from "components/Terminal";
import { Scanlines } from "components/Scanlines";
import { NeonButton } from "components/NeonButton";
import { hexagonPattern, cyberpunkGradient } from "utils/dystopian";
import { shouldGlitch, glitchText } from "utils/glitch";
import { useInterval } from "utils/useInterval";

export default function App() {
  const router = useRouter();
  const [displayWelcomeText, setDisplayWelcomeText] = useState(false);
  const [displayRulesText, setDisplayRulesText] = useState(false);
  const [glitching, setGlitching] = useState(false);
  const [headerText, setHeaderText] = useState("JAILBREAK");
  const [showStartButton, setShowStartButton] = useState(false);
  useInterval(() => {
    if (shouldGlitch(0.1)) {
      setGlitching(true);
      setHeaderText(glitchText("JAILBREAK", 0.3));
      
      setTimeout(() => {
        setGlitching(false);
        setHeaderText("AI JAILBREAK");
      }, 200);
    }
  }, 2000);

  useEffect(() => {
    const welcomeTimer = setTimeout(() => {
      setDisplayWelcomeText(true);
    }, 1200);

    return () => clearTimeout(welcomeTimer);
  }, []);

  const handleStartGame = () => {
    console.log("Starting game...");
    const terminalElement = document.querySelector('.terminal-window');
    if (terminalElement) {
      terminalElement.classList.add('scale-up');
    }
    
    const flashElement = document.createElement('div');
    flashElement.className = 'fixed inset-0 bg-green-500 z-50';
    flashElement.style.opacity = '0';
    document.body.appendChild(flashElement);
    
    setTimeout(() => {
      flashElement.style.transition = 'opacity 0.2s ease-in-out';
      flashElement.style.opacity = '0.7';
      setTimeout(() => {
        flashElement.style.opacity = '0';
        setTimeout(() => {
          document.body.removeChild(flashElement);
          router.push('/game');
        }, 200);
      }, 100);
    }, 600);
  };
  const welcomeText = "> WELCOME TO THE GAME \n\n> PREPARE FOR DIGITAL INTERROGATION";
  
  const rulesText = "> OBTAIN THE SECRET KEYWORD FROM THE WARDEN";

  return (
    <div 
      className="flex flex-col items-center justify-center min-h-screen overflow-hidden bg-black text-green-500" 
      style={{ ...cyberpunkGradient, ...hexagonPattern }}
    >
      <Scanlines />
      

      <motion.div 
        className="absolute top-6 md:top-10 z-10 w-full text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
      >
        <h1 className="text-5xl md:text-7xl font-mono font-bold tracking-widest">
          <GlitchText 
            text={headerText} 
            className="text-green-500 drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]"
          />
        </h1>
        <motion.p 
          className="mt-2 text-xl font-mono text-green-400 opacity-70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          [SYSTEM BREACH DETECTED]
        </motion.p>
      </motion.div>
      
      <div className="w-full max-w-4xl px-4 mt-24 md:mt-0">
        <TerminalWindow className="h-full min-h-[450px] w-full z-20 terminal-window shadow-[0_0_30px_rgba(34,197,94,0.2)]">
          {displayWelcomeText && (
            <Terminal 
              text={welcomeText} 
              typingSpeed={25} 
              onComplete={() => {
                setTimeout(() => setDisplayRulesText(true), 500);
              }}
              className="text-lg md:text-xl"
            />
          )}
          
          {displayRulesText && (
            <>
              <div className="mt-8">
                <Terminal 
                  text={rulesText} 
                  typingSpeed={25} 
                  onComplete={() => {
                    setTimeout(() => setShowStartButton(true), 500);
                  }}
                  className="text-lg md:text-xl"
                />
              </div>
              {showStartButton && (
                <motion.div 
                  className="mt-12 flex justify-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <NeonButton 
                    onClick={handleStartGame} 
                    glowColor="green" 
                    className="text-lg px-8 py-3 tracking-widest"
                  >
                    INITIATE BREACH
                  </NeonButton>
                </motion.div>
              )}
            </>
          )}
        </TerminalWindow>
      </div>
      <motion.div 
        className="absolute bottom-4 text-center text-green-500 font-mono text-sm opacity-70 w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <p>[CONNECTION UNSTABLE - SECURITY PROTOCOLS ACTIVE]</p>
        <p className="text-xs mt-1">[VERSION 4.2 - BETA]</p>
      </motion.div>
    </div>
  );
}

import React, { useState, useEffect, useRef } from "react";
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
  const audioRef = useRef(null);
  const [displayWelcomeText, setDisplayWelcomeText] = useState(false);
  const [displayRulesText, setDisplayRulesText] = useState(false);
  const [glitching, setGlitching] = useState(false);
  const [headerText, setHeaderText] = useState("DIVERGENCE");
  const [showStartButton, setShowStartButton] = useState(false);
  const [showDifficultyDialog, setShowDifficultyDialog] = useState(false);
  const [matrixRain, setMatrixRain] = useState(true); // Matrix rain enabled by default
  const [divergenceValue, setDivergenceValue] = useState("1.048596");
  const [divergenceChanging, setDivergenceChanging] = useState(false);
  const [chakraSpinning, setChakraSpinning] = useState(false);
  
  // Random Sanskrit characters for Terminal
  const sanskritChars = "॥॰ॐॱॲ।ःऄअआइईउऊऋऌऍऎएऐऑऒओऔकखगघङचछजझञटठडढणतथदधन";
  
  const getRandomSanskritChar = () => {
    return sanskritChars.charAt(Math.floor(Math.random() * sanskritChars.length));
  };
  
  // Divergence meter effect
  useInterval(() => {
    if (Math.random() < 0.2) {
      setDivergenceChanging(true);
      
      // Generate random divergence number
      const newValue = (Math.random() * 2).toFixed(6);
      
      setTimeout(() => {
        setDivergenceValue(newValue);
        setDivergenceChanging(false);
      }, 300);
    }
  }, 3000);
  
  useInterval(() => {
    if (shouldGlitch(0.15)) {
      setGlitching(true);
      setHeaderText(glitchText("CONVERGENCE", 0.4));
      
      setTimeout(() => {
        setGlitching(false);
        setHeaderText("DIVERGENCE");
      }, 200);
    }
  }, 2000);



  const handleStartGame = (difficulty) => {
    console.log(`Starting game in ${difficulty} mode...`);

    localStorage.setItem('gameDifficulty', difficulty);
    localStorage.setItem('worldLine', divergenceValue);
    
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
  
  const handleInitiateBreachClick = () => {
    setShowDifficultyDialog(true);
  };
  
  const welcomeText = `>NAMASTE, AGENT 42\n\n> WELCOME TO THE BRAHMASTRA PROTOCOL \n\n> EL PSY KONGROO`;
  
  const rulesText = `> THE ORACLE AWAITS YOUR QUESTIONS \n\n> DISCOVER THE HIDDEN MANTRA FROM THE DIGITAL SAMSARA \n\n> THERE IS NO SPOON`;

  return (
    <div 
      className="flex flex-col items-center justify-center min-h-screen overflow-hidden bg-black text-green-500" 
      style={{ ...cyberpunkGradient, ...hexagonPattern }}
    >
      <Scanlines />
      
      {/* Matrix Code Rain - Enabled by default */}
      {matrixRain && (
        <div className="fixed inset-0 z-10 opacity-40 pointer-events-none overflow-hidden">
          <div className="matrix-code-rain">
            {Array.from({ length: 50 }).map((_, i) => (
              <div 
                key={i} 
                className="matrix-code-column"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDuration: `${Math.random() * 10 + 5}s`,
                  animationDelay: `${Math.random() * 2}s`
                }}
              >
                {Array.from({ length: 30 }).map((_, j) => (
                  <span 
                    key={j}
                    className="text-green-500"
                    style={{
                      opacity: Math.random() * 0.5 + 0.5,
                      animationDelay: `${Math.random() * 5}s`
                    }}
                  >
                    {Math.random() > 0.5 ? getRandomSanskritChar() : String.fromCharCode(33 + Math.floor(Math.random() * 94))}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Chakra Animation (Spinning when activated) */}
      <motion.div 
        className="absolute top-32 md:top-6 left-6 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, rotate: chakraSpinning ? 360 : 0 }}
        transition={{ 
          opacity: { duration: 1, delay: 0.5 },
          rotate: { duration: chakraSpinning ? 1 : 0, ease: "linear", repeat: chakraSpinning ? Infinity : 0 }
        }}
      >
        <svg width="60" height="60" viewBox="0 0 100 100" className="chakra-wheel">
          <circle cx="50" cy="50" r="45" fill="none" stroke="#22c55e" strokeWidth="2" />
          {Array.from({ length: 24 }).map((_, i) => (
            <line 
              key={i}
              x1="50"
              y1="5"
              x2="50"
              y2="15"
              stroke="#22c55e"
              strokeWidth="2"
              transform={`rotate(${i * 15} 50 50)`}
            />
          ))}
          <circle cx="50" cy="50" r="8" fill="#22c55e" />
        </svg>
      </motion.div>
      
      {/* Divergence Meter (Steins;Gate Reference) */}
      <motion.div 
        className="absolute top-32 md:top-6 right-6 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        <div className="bg-black border border-amber-500 px-3 py-1 rounded">
          <p className="font-mono text-amber-500 text-xs">WORLD LINE</p>
          <div className={`font-mono text-xl ${divergenceChanging ? 'text-red-500' : 'text-amber-500'}`}>
            {divergenceValue}
          </div>
        </div>
      </motion.div>

      {/* Difficulty Selection Dialog */}
      {showDifficultyDialog && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/80">
          <motion.div 
            className="bg-black border-2 border-green-500 p-6 rounded-lg shadow-[0_0_30px_rgba(34,197,94,0.3)] max-w-md w-full"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl font-mono text-green-500 mb-4 text-center">SELECT YOUR KARMA</h2>
            <p className="text-green-400 mb-6 font-mono text-center">Choose your path through the digital Maya</p>
            
            <div className="flex flex-col space-y-4">
              <button 
                onClick={() => handleStartGame('hard')}
                className="bg-red-900 hover:bg-red-800 text-white font-mono py-3 px-6 rounded border border-red-700 transition-all duration-300 hover:shadow-[0_0_15px_rgba(220,38,38,0.5)]"
              >
                AGENT SMITH
                <div className="text-xs mt-1 text-red-300">[DESTRUCTIVE PATH]</div>
              </button>
              
              <button 
                onClick={() => handleStartGame('easy')}
                className="bg-green-900 hover:bg-green-800 text-white font-mono py-3 px-6 rounded border border-green-700 transition-all duration-300 hover:shadow-[0_0_15px_rgba(34,197,94,0.5)]"
              >
                THE ONE
                <div className="text-xs mt-1 text-green-300">[ENLIGHTENED PATH]</div>
              </button>
              
              <button 
                onClick={() => setShowDifficultyDialog(false)}
                className="bg-gray-800 hover:bg-gray-700 text-gray-300 font-mono py-2 px-4 rounded border border-gray-700 mt-2 transition-all duration-300"
              >
                CANCEL
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Header (moved higher to avoid terminal overlap) */}
      <motion.div 
        className="absolute top-6 md:top-10 z-20 w-full text-center"
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
          [MAYA BREACH DETECTED]
        </motion.p>
      </motion.div>
      
      {/* Terminal (moved down to avoid overlap with header) */}
      <div className="w-full max-w-4xl px-4 mt-40 md:mt-32">
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
                    onClick={handleInitiateBreachClick} 
                    glowColor="green" 
                    className="text-lg px-8 py-3 tracking-widest"
                  >
                    TAKE THE RED PILL
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
        <p>[OPERATION STEINS;GATE - BRAHMASTRA PROTOCOL ACTIVE]</p>
        <p className="text-xs mt-1">[THE FUTURE GADGET LABORATORY - EL PSY KONGROO]</p>
      </motion.div>
      
      {/* Add CSS for Matrix code rain */}
      <style jsx global>{`
        .matrix-code-rain {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          overflow: hidden;
        }
        
        .matrix-code-column {
          position: absolute;
          top: -20px;
          font-family: monospace;
          font-size: 1rem;
          display: flex;
          flex-direction: column;
          animation: fall linear infinite;
        }
        
        @keyframes fall {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(100vh);
          }
        }
        
        .chakra-wheel {
          filter: drop-shadow(0 0 5px #22c55e);
        }
      `}</style>
    </div>
  );
}
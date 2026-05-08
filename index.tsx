import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { v4 as uuidv4 } from 'uuid';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Unlock, ShieldAlert, Heart, X, Plus, Trash2, Edit2, ChevronLeft, ChevronRight, Image as ImageIcon, Crosshair, Star, Search, MessageCircle, ZoomIn, ZoomOut, Expand, Link as LinkIcon, Upload, LayoutGrid, FolderArchive, User, BadgeCheck, Gamepad2, Coins, Trophy, CreditCard, Cloud, Loader2 } from 'lucide-react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import firebaseConfig from './firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('https://www.googleapis.com/auth/drive.readonly');

// --- Type Definitions ---
interface Comment {
  id: string;
  author: string;
  text: string;
}

interface FeatureTag {
  id: string;
  label: string;
  point?: { x: number; y: number };
  zoomIntensity?: number;
}

interface Image {
  id: string;
  src: string;
  alt: string;
  rating: number;
  comments?: Comment[];
  isGeneratingComments?: boolean;
  featureTags?: FeatureTag[];
}

interface Section {
  id: string;
  name: string;
  images: Image[];
  glow?: string;
}

interface Profile {
  id: string;
  name: string;
  images: Image[];
  glow?: string;
  profileImage?: string;
  isVerified?: boolean;
}

// --- Card Game Types ---
type CardRole = 'Queen' | 'Baddie' | 'Certified Rand' | 'Bitch' | 'Horny' | 'Beauty';
type SpecialAbility = 'None' | 'Jerk' | 'Tight pussy' | 'Blackhole' | 'Milfy' | 'Pure pink' | 'Fluffy';
type Currency = 'INR' | 'USD';

interface GameCard {
  id: string;
  imageSrc: string;
  role: CardRole;
  specialAbility: SpecialAbility;
  rating10: number;
  starRating5: number;
  price: number;
  currency: Currency;
}

interface CardDeck {
  id: string;
  name: string;
  cards: GameCard[];
}

// --- New Fallback Data ---
const fallbackComments = [
    { author: 'xssx777', text: 'You look so stunning 😍' },
    { author: 'Xgallery421', text: 'Literal perfection 🍼' },
    { author: 'Xslock1672', text: 'I am speechless 😍' },
    { author: 'Xunknown123', text: 'This is rediculous 🔥' },
    { author: 'XsUnknown9882', text: 'Ah babe, gorgeous' },
    { author: 'XsunknownsX444', text: '😍😍😍' },
    { author: 'Xgallery888', text: '😘😍😍😍' },
    { author: 'xssx999', text: 'How is it even possible 🍑' },
    { author: 'Xs...sx111', text: "Ahh, I can't control 🤤" },
    { author: 'Xslock222', text: 'Stunning picture 👄' },
    { author: 'xssx333', text: 'Whose this?' },
    { author: 'Xgallery444', text: 'Looking amazing 💦' },
    { author: 'Xunknown555', text: "Fucking hot, i can't 😩" },
    { author: 'XsUnknown666', text: 'Love it ❤️' },
    { author: 'XsunknownsX777', text: 'Wow 💦' },
    { author: 'VibeCheck_99', text: 'Absolute 10/10 ✨' },
    { author: 'Mystic_Viewer', text: 'How are you real? 😭❤️' },
    { author: 'GlowUp_King', text: 'The lighting, the angle... perfect 🔥' },
    { author: 'Silken_Soul', text: 'You radiate such beauty ✨' },
    { author: 'Urban_Lux', text: 'Beyond gorgeous, honestly 💖' },
    { author: 'Retro_Haze', text: 'Simply breathtaking 🌹' },
    { author: 'Night_Oracle', text: 'A work of art 🎨✨' },
    { author: 'Electric_Eye', text: 'You just made my day 😍' },
    { author: 'Zenith_Rose', text: 'Stunning as always 💎' },
];

const getRandomFallbackComments = (count: number = 5): Comment[] => {
    const shuffled = [...fallbackComments].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count).map(c => ({ ...c, id: uuidv4() }));
};

const defaultFeatureTags: FeatureTag[] = [
    { id: '', label: 'Face🌝', point: { x: 50, y: 30 } },
    { id: '', label: 'Eyes👁️', point: { x: 50, y: 25 } },
    { id: '', label: 'Smile👄', point: { x: 50, y: 35 } },
    { id: '', label: 'Hair💋', point: { x: 50, y: 20 } },
    { id: '', label: 'Collarbone✨', point: { x: 50, y: 40 } },
    { id: '', label: 'Waist⏳', point: { x: 50, y: 55 } },
    { id: '', label: 'Belly🔥', point: { x: 50, y: 60 } },
    { id: '', label: 'Navel🍒', point: { x: 50, y: 65 } },
    { id: '', label: 'Outfit👗', point: { x: 50, y: 70 } },
];

const glowOptions = [
    { id: 'none', name: 'None', color: 'transparent' },
    { id: 'cyan', name: 'Cyan', color: '#03dac6' },
    { id: 'lightblue', name: 'Light Blue', color: '#3498db' },
    { id: 'violet', name: 'Violet', color: '#9b59b6' },
    { id: 'pink', name: 'Pink', color: '#e91e63' },
    { id: 'red', name: 'Red', color: '#e74c3c' },
    { id: 'gold', name: 'Gold', color: '#f1c40f' },
];

const PasswordScreen: React.FC<{ onUnlock: () => void }> = ({ onUnlock }) => {
    const [passcode, setPasscode] = useState('');
    const [error, setError] = useState(false);
    const correctPasscode = '2244';
    const activeIndex = passcode.length;

    useEffect(() => {
        if (passcode.length === correctPasscode.length) {
            if (passcode === correctPasscode) {
                setTimeout(onUnlock, 300);
            } else {
                setError(true);
                setTimeout(() => {
                    setError(false);
                    setPasscode('');
                }, 500);
            }
        }
    }, [passcode, onUnlock]);
    
    const handleNumberClick = (num: string) => {
        if (passcode.length < correctPasscode.length) {
            setPasscode(prev => prev + num);
        }
    };

    const handleDeleteClick = () => {
        setPasscode(prev => prev.slice(0, -1));
    };
    
    const keypadKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'];

    return (
        <div className="flex justify-center items-center h-screen w-full p-4 relative overflow-hidden bg-[#050505]">
            <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none opacity-20">
              <div className="w-[800px] h-[800px] rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 blur-[120px] mix-blend-screen" />
            </div>
            
            <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               className="relative z-10 w-full max-w-sm glass-panel p-10 rounded-[32px] flex flex-col items-center border border-white/10"
            >
                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                   <Lock className="w-6 h-6 text-cyan-400" />
                </div>
                <h1 className="font-lobster text-5xl mb-2 text-white drop-shadow-lg">xsLocksx</h1>
                <p className="text-zinc-400 text-sm mb-8 tracking-wider uppercase font-semibold">Enter Passcode</p>
                
                <motion.div 
                   animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
                   transition={{ duration: 0.4 }}
                   className="flex gap-4 mb-10"
                >
                    {Array.from({ length: correctPasscode.length }).map((_, index) => (
                        <div 
                          key={index} 
                          className={`w-3.5 h-3.5 rounded-full border transition-all duration-300 ${
                            index < passcode.length 
                              ? 'bg-cyan-400 border-cyan-400 shadow-[0_0_12px_rgba(3,218,198,0.8)] scale-110' 
                              : 'border-zinc-600 bg-transparent'
                           } ${error ? 'border-red-500 bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)]' : ''}`}
                        />
                    ))}
                </motion.div>
                
                <div className="grid grid-cols-3 gap-x-6 gap-y-4 w-full px-2">
                    {keypadKeys.map((key, index) => (
                        <button
                            key={index}
                            className={`w-[72px] h-[72px] rounded-full flex justify-center items-center text-2xl font-light transition-all duration-200 justify-self-center
                              ${key === '' ? 'opacity-0 cursor-default' : 'border border-white/20 hover:border-white/40 hover:bg-white/5 active:border-cyan-400 active:bg-cyan-400/20 active:shadow-[0_0_20px_rgba(34,211,238,0.8)] active:text-cyan-300 active:scale-95 text-white/90'}`}
                            onClick={() => {
                                if (key === '⌫') handleDeleteClick();
                                else if (key !== '') handleNumberClick(key);
                            }}
                            disabled={key === ''}
                        >
                            {key === '⌫' ? <X className="w-6 h-6" strokeWidth={1.5} /> : key}
                        </button>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
               <Star 
                 key={star} 
                 className={`w-4 h-4 ${rating >= star ? 'fill-cyan-400 text-cyan-400' : rating >= star - 0.5 ? 'fill-cyan-400/50 text-cyan-400' : 'text-white/30'}`} 
               />
            ))}
        </div>
    );
};

const CatIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M22.9 6.2C23.6 5.4 23.3 4 22.2 3.7c-3-.7-6.2 .1-8.5 2.3C13.1 5.8 12.6 5.7 12 5.7s-1.1 .1-1.7 .3c-2.3-2.2-5.5-3-8.5-2.3C.7 4 .4 5.4 1.1 6.2L3.8 9.3c-1.1 1.6-1.8 3.5-1.8 5.6c0 5 4.5 9.1 10 9.1s10-4.1 10-9.1c0-2.1-.7-4-1.8-5.6l2.7-3.1z" />
    </svg>
);

const CustomCardUI: React.FC<{ card: GameCard }> = ({ card }) => (
    <div className="relative aspect-[2.5/3.5] rounded-2xl overflow-hidden bg-zinc-900 border-2 border-white/10 group">
        <img src={card.imageSrc} alt="Card" className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        
        <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
            <div className="px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-black text-white uppercase tracking-widest text-right">
                {card.rating10}/10
            </div>
            {card.specialAbility && card.specialAbility !== 'None' && (
                <div className="px-2 py-0.5 rounded-lg bg-indigo-500/80 backdrop-blur-sm border border-white/10 text-[8px] font-black text-white uppercase tracking-widest shadow-lg">
                    {card.specialAbility}
                </div>
            )}
        </div>

        <div className="absolute bottom-0 inset-x-0 p-3 flex flex-col gap-1">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">{card.role}</span>
            <div className="flex items-center justify-between">
                <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < card.starRating5 ? 'fill-yellow-400 text-yellow-400' : 'text-white/20'}`} />
                    ))}
                </div>
                <span className="text-sm font-bold text-white">
                    {card.currency === 'INR' ? '₹' : '$'}{card.price >= 10000 ? `${(card.price / 1000).toFixed(1).replace(/\.0$/, '')}k` : card.price}
                </span>
            </div>
        </div>
    </div>
);


// --- Battle Game Types ---
type PlayerPos = 'bottom' | 'top' | 'left' | 'right';

interface BattlePlayer {
    id: string;
    name: string;
    hand: GameCard[];
    playedCard: GameCard | null;
    score: number;
    position: PlayerPos;
    isAI: boolean;
}

interface BattleState {
    players: BattlePlayer[];
    turnIndex: number;
    roundLeaderIndex: number;
    status: 'idle' | 'distributing' | 'playing' | 'selecting-winner' | 'round-result' | 'game-over';
    winnerMessage: string | null;
}

const CardBack = ({ position }: { position: PlayerPos }) => (
    <div className={`relative aspect-[2.5/3.5] rounded-xl overflow-hidden bg-zinc-900 border-2 border-white/10 shadow-2xl transition-all duration-300 ${position === 'left' ? 'rotate-90' : position === 'right' ? '-rotate-90' : position === 'top' ? 'rotate-180' : ''}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-black" />
        <div className="absolute inset-2 border border-white/5 rounded-lg flex items-center justify-center">
            <div className="w-full h-full opacity-10 bg-[radial-gradient(circle,white_1px,transparent_1px)] bg-[size:10px_10px]" />
            <div className="absolute flex flex-col items-center gap-2">
                <Lock className="w-6 h-6 text-indigo-400 opacity-50" />
                <div className="text-[6px] font-black uppercase tracking-[0.3em] text-indigo-400 rotate-180">xsLocksx</div>
            </div>
        </div>
    </div>
);

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'profiles' | 'arcade' | 'extra'>('home');
  const [cardGameMode, setCardGameMode] = useState<null | 'deck-list' | 'deck-builder' | 'playing'>(null);
  
  // Battle Game State
  const [battle, setBattle] = useState<BattleState>({
    players: [],
    turnIndex: 0,
    roundLeaderIndex: 0,
    status: 'idle',
    winnerMessage: null
  });

  const startBattle = useCallback((deck: CardDeck) => {
    if (deck.cards.length < 4) return;
    
    const shuffled = [...deck.cards].sort(() => 0.5 - Math.random());
    const cardsPerPlayer = Math.floor(shuffled.length / 4);
    
    const players: BattlePlayer[] = [
        { id: 'p-human', name: 'You', hand: [], playedCard: null, score: 0, position: 'bottom', isAI: false },
        { id: 'p-ai1', name: 'AI Opponent 1', hand: [], playedCard: null, score: 0, position: 'top', isAI: true },
        { id: 'p-ai2', name: 'AI Opponent 2', hand: [], playedCard: null, score: 0, position: 'left', isAI: true },
        { id: 'p-ai3', name: 'AI Opponent 3', hand: [], playedCard: null, score: 0, position: 'right', isAI: true },
    ];

    // Distribute cards
    players.forEach((p, idx) => {
        p.hand = shuffled.slice(idx * cardsPerPlayer, (idx + 1) * cardsPerPlayer);
    });

    setBattle({
        players,
        turnIndex: 0, // Human starts first round for now
        roundLeaderIndex: 0,
        status: 'playing',
        winnerMessage: null
    });
  }, []);

  const playAICards = useCallback(async () => {
    setBattle(prev => {
        const nextPlayers = [...prev.players];
        const currentTurn = prev.turnIndex;
        const player = nextPlayers[currentTurn];

        if (!player.isAI || player.playedCard || prev.status !== 'playing') return prev;

        const randomCardIdx = Math.floor(Math.random() * player.hand.length);
        const card = player.hand[randomCardIdx];
        
        player.playedCard = card;
        player.hand = player.hand.filter((_, i) => i !== randomCardIdx);

        const nextTurn = (currentTurn + 1) % 4;
        
        // If all players have played
        if (nextPlayers.every(p => p.playedCard)) {
            return {
                ...prev,
                players: nextPlayers,
                status: 'selecting-winner',
                winnerMessage: null
            };
        }

        return {
            ...prev,
            players: nextPlayers,
            turnIndex: nextTurn
        };
    });
  }, []);

  // AI Effect
  useEffect(() => {
    if (battle.status === 'playing' && battle.players[battle.turnIndex]?.isAI) {
        const timer = setTimeout(() => {
            playAICards();
        }, 1000);
        return () => clearTimeout(timer);
    }
  }, [battle.turnIndex, battle.status, playAICards]);

  const handleSelectWinnerManually = (playerIndex: number) => {
    if (battle.status !== 'selecting-winner') return;

    setBattle(prev => {
        const nextPlayers = [...prev.players];
        nextPlayers[playerIndex].score += 1;
        const winnerName = nextPlayers[playerIndex].name;

        return {
            ...prev,
            players: nextPlayers,
            status: 'round-result',
            winnerMessage: `${winnerName} wins this round!`,
            roundLeaderIndex: playerIndex
        };
    });
  };

  const handleNextRound = () => {
    setBattle(prev => {
        const allEmpty = prev.players.every(p => p.hand.length === 0);
        if (allEmpty) {
            return { ...prev, status: 'game-over' };
        }

        return {
            ...prev,
            players: prev.players.map(p => ({ ...p, playedCard: null })),
            turnIndex: prev.roundLeaderIndex,
            status: 'playing',
            winnerMessage: null
        };
    });
  };

  const playHumanCard = (card: GameCard) => {
    if (battle.status !== 'playing' || battle.players[battle.turnIndex].isAI) return;

    setBattle(prev => {
        const nextPlayers = [...prev.players];
        const currentTurn = prev.turnIndex;
        const player = nextPlayers[currentTurn];

        player.playedCard = card;
        player.hand = player.hand.filter(c => c.id !== card.id);

        const nextTurn = (currentTurn + 1) % 4;

        if (nextPlayers.every(p => p.playedCard)) {
            return {
                ...prev,
                players: nextPlayers,
                status: 'selecting-winner',
                winnerMessage: null
            };
        }

        return {
            ...prev,
            players: nextPlayers,
            turnIndex: nextTurn
        };
    });
  };
  const [decks, setDecks] = useState<CardDeck[]>(() => {
    try {
      const saved = localStorage.getItem('xlockx_decks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [activeDeckId, setActiveDeckId] = useState<string | null>(null);
  const [isEditingCards, setIsEditingCards] = useState(false);
  const cardBuilderInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem('xlockx_decks', JSON.stringify(decks));
    } catch (e) {
      console.error("Failed to save decks to localStorage", e);
      // If we hit quota, we might want to alert the user or try to prune.
    }
  }, [decks]);

  const activeDeck = decks.find(d => d.id === activeDeckId);

  // Card Creation State
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [newCardImage, setNewCardImage] = useState('');
  const [newCardRole, setNewCardRole] = useState<CardRole>('Beauty');
  const [newCardSpecialAbility, setNewCardSpecialAbility] = useState<SpecialAbility>('None');
  const [newCardRating10, setNewCardRating10] = useState(5);
  const [newCardStarRating5, setNewCardStarRating5] = useState(3);
  const [newCardPrice, setNewCardPrice] = useState(0);
  const [newCardCurrency, setNewCardCurrency] = useState<Currency>('INR');

  // Persistence: Load from localStorage
  const [sections, setSections] = useState<Section[]>(() => {
    try {
      const saved = localStorage.getItem('xlockx_sections');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [profiles, setProfiles] = useState<Profile[]>(() => {
    try {
      const saved = localStorage.getItem('xlockx_profiles');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save to localStorage whenever collections change
  useEffect(() => {
    try {
      localStorage.setItem('xlockx_sections', JSON.stringify(sections));
    } catch (err) {
      console.warn("Could not save sections to localStorage", err);
    }
  }, [sections]);

  useEffect(() => {
    try {
      localStorage.setItem('xlockx_profiles', JSON.stringify(profiles));
    } catch (err) {
      console.warn("Could not save profiles to localStorage", err);
    }
  }, [profiles]);

  const [selectedImageInfo, setSelectedImageInfo] = useState<{ image: Image; profileId?: string; sectionId?: string; index: number } | null>(null);
  const [isFullScreenImage, setIsFullScreenImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const profileImageInputRef = useRef<HTMLInputElement>(null);
  const [activeAddImageSectionId, setActiveAddImageSectionId] = useState<string | null>(null);
  const [activeAddImageProfileId, setActiveAddImageProfileId] = useState<string | null>(null);
  const [newImageUrl, setNewImageUrl] = useState('');
  
  // Google Drive integration states
  const [showDriveImport, setShowDriveImport] = useState(false);
  const [googleUser, setGoogleUser] = useState<FirebaseUser | null>(null);
  const [driveImages, setDriveImages] = useState<any[]>([]);
  const [isFetchingDriveImages, setIsFetchingDriveImages] = useState(false);
  const [driveError, setDriveError] = useState<string | null>(null);
  const [driveNextToken, setDriveNextToken] = useState<string | null>(null);
  const [driveSearchQuery, setDriveSearchQuery] = useState('');
  const [driveAccessToken, setDriveAccessToken] = useState<string | null>(sessionStorage.getItem('google_access_token'));
  const [labelZoomIntensity, setLabelZoomIntensity] = useState(4);
  const [hoveredTagId, setHoveredTagId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setGoogleUser(user);
    });
    return () => unsubscribe();
  }, []);

  const [isAddingSection, setIsAddingSection] = useState(false);
  const [newSectionName, setNewSectionName] = useState('');
  
  // PWA Install Logic
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBtn, setShowInstallBtn] = useState(true); // Default true so user can see it to click, and if prompt isn't supported it gives manual steps.

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      console.log('[PWA] beforeinstallprompt event fired!');
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBtn(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', () => {
      console.log('[PWA] appinstalled event fired! App was successfully installed.');
      setShowInstallBtn(false);
      setDeferredPrompt(null);
    });

    if (window.matchMedia('(display-mode: standalone)').matches) {
       console.log('[PWA] App is already running in standalone mode.');
       setShowInstallBtn(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    console.log('[PWA] Install button clicked');
    if (!deferredPrompt) {
      console.warn('[PWA] No deferredPrompt available.');
      alert("Auto-install is currently unavailable (your browser may not support it or the app is already installed).\n\nTo install manually:\niOS Safari: Tap Share -> 'Add to Home Screen'\nAndroid Chrome: Tap Settings (three dots) -> 'Install App' or 'Add to Home screen'.");
      return;
    }
    console.log('[PWA] Showing install prompt...');
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`[PWA] Prompt outcome: ${outcome}`);
    if (outcome === 'accepted') {
      console.log('[PWA] User accepted the install prompt.');
      setDeferredPrompt(null);
      setShowInstallBtn(false);
    } else {
      console.log('[PWA] User dismissed the install prompt.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (credential?.accessToken) {
        sessionStorage.setItem('google_access_token', credential.accessToken);
        setDriveAccessToken(credential.accessToken);
        fetchDriveImages(credential.accessToken);
      }
    } catch (error: any) {
      console.error("Google login error", error);
      setDriveError(error.message || "Failed to log in to Google");
    }
  };

  const fetchDriveImages = async (token: string, pageToken?: string, searchQuery?: string) => {
    setIsFetchingDriveImages(true);
    setDriveError(null);
    try {
      let query = "mimeType contains 'image/' and trashed = false";
      if (searchQuery && searchQuery.trim() !== '') {
          query += ` and name contains '${searchQuery.trim().replace(/'/g, "\\'")}'`;
      }
      let url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=nextPageToken,files(id,name,mimeType,thumbnailLink,webContentLink)&pageSize=20`;
      if (pageToken) url += `&pageToken=${pageToken}`;
      
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        if (res.status === 401) {
            sessionStorage.removeItem('google_access_token');
            setDriveAccessToken(null);
            throw new Error("Session expired. Please log in again.");
        }
        if (res.status === 403) {
            throw new Error("Google Drive API is not enabled. Please visit the Google Cloud Console for your Firebase project (ai-studio-applet-webapp-98119) and enable the 'Google Drive API'.");
        }
        throw new Error(`Failed to fetch Drive files. Status: ${res.status}`);
      }
      const data = await res.json();
      if (pageToken) {
         setDriveImages(prev => [...prev, ...(data.files || [])]);
      } else {
         setDriveImages(data.files || []);
      }
      setDriveNextToken(data.nextPageToken || null);
    } catch (err: any) {
      console.error("Drive fetch error", err);
      setDriveError(err.message || "Could not fetch images from Google Drive");
    } finally {
      setIsFetchingDriveImages(false);
    }
  };

  const handleSelectDriveImage = (file: any) => {
    // We can use the high-res thumbnail link simply by stripping the =s220 suffix
    let imgUrl = file.thumbnailLink ? file.thumbnailLink.replace(/=s\d+$/, '=s2000') : file.webContentLink;
    if (!imgUrl) {
       alert("Could not extract image URL for this file.");
       return;
    }
    
    const newImg: Image = {
      id: uuidv4(),
      src: imgUrl,
      alt: file.name,
      width: 800,
      height: 800,
      rating: 0,
    };
    
    if (activeAddImageProfileId) {
      setProfiles(prev => prev.map(p => p.id === activeAddImageProfileId ? { ...p, images: [...p.images, newImg] } : p));
    } else if (activeAddImageSectionId) {
      setSections(prev => prev.map(s => s.id === activeAddImageSectionId ? { ...s, images: [...s.images, newImg] } : s));
    }
    
    setShowDriveImport(false);
    setActiveAddImageProfileId(null);
    setActiveAddImageSectionId(null);
  };

  const [sectionToDelete, setSectionToDelete] = useState<Section | null>(null);
  const [sectionToEdit, setSectionToEdit] = useState<Section | null>(null);
  const [editedSectionName, setEditedSectionName] = useState('');

  const [isAddingProfile, setIsAddingProfile] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [newProfileImage, setNewProfileImage] = useState<string | undefined>(undefined);
  const [newProfileIsVerified, setNewProfileIsVerified] = useState(false);
  const [profileToDelete, setProfileToDelete] = useState<Profile | null>(null);
  const [profileToEdit, setProfileToEdit] = useState<Profile | null>(null);
  const [editedProfileName, setEditedProfileName] = useState('');
  const [editedProfileImage, setEditedProfileImage] = useState<string | undefined>(undefined);
  const [editedProfileIsVerified, setEditedProfileIsVerified] = useState(false);
  const [editedGlow, setEditedGlow] = useState<string | undefined>(undefined);
  
  const [isDraggingPoint, setIsDraggingPoint] = useState(false);
  const [newComment, setNewComment] = useState('');

  const handlePointDragStart = (e: React.MouseEvent, tagId: string) => {
    if (!isEditingPoints) return;
    e.stopPropagation();
    setActiveTagId(tagId);
    setIsDraggingPoint(true);
  };

  const handleModalImageMouseMove = (e: React.MouseEvent) => {
    if (!isEditingPoints || !isDraggingPoint || !activeTagId || !modalImageRef.current) return;
    
    const rect = modalImageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    // Constrain to 0-100
    const constrainedX = Math.max(0, Math.min(100, x));
    const constrainedY = Math.max(0, Math.min(100, y));

    setTempTags(prev => prev.map(tag => 
      tag.id === activeTagId ? { ...tag, point: { x: constrainedX, y: constrainedY } } : tag
    ));
  };

  const handlePointDragEnd = () => {
    setIsDraggingPoint(false);
  };
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const modalImageRef = useRef<HTMLImageElement>(null);
  
  const [hearts, setHearts] = useState<{id: string; side?: 'left' | 'right'}[]>([]);
  const [isEditingPoints, setIsEditingPoints] = useState(false);
  const [activeTagId, setActiveTagId] = useState<string | null>(null);
  const [tempTags, setTempTags] = useState<FeatureTag[]>([]);
  const [newTagLabel, setNewTagLabel] = useState('');

  const addNewTag = () => {
    if (!newTagLabel.trim()) return;
    const newTag: FeatureTag = {
        id: uuidv4(),
        label: newTagLabel.trim(),
        point: { x: 50, y: 50 },
        zoomIntensity: labelZoomIntensity
    };
    setTempTags(prev => [...prev, newTag]);
    setNewTagLabel('');
    setActiveTagId(newTag.id);
  };

  const [imageToDelete, setImageToDelete] = useState<{ profileId?: string; sectionId?: string; imageId: string; alt: string } | null>(null);
  const transformRef = useRef<any>(null);

  const [isWYRActive, setIsWYRActive] = useState(false);
  const [wyrImages, setWyrImages] = useState<{ left: Image; right: Image } | null>(null);

  const [isHBActive, setIsHBActive] = useState(false);
  const [hbSearchTerm, setHbSearchTerm] = useState('');
  const [hbFilteredItems, setHbFilteredItems] = useState<{ image: Image; tag: FeatureTag }[]>([]);
  const [hbCurrentIndex, setHbCurrentIndex] = useState(0);

  const getAllImages = useCallback(() => {
    const sectionImages = sections.flatMap(s => s.images);
    const profileImages = profiles.flatMap(p => p.images);
    return [...sectionImages, ...profileImages];
  }, [sections, profiles]);

  const startWYRGame = () => {
    const allImages = getAllImages();
    if (allImages.length < 2) {
      return;
    }
    
    // Pick two unique random images
    const shuffled = [...allImages].sort(() => 0.5 - Math.random());
    setWyrImages({
      left: shuffled[0],
      right: shuffled[1]
    });
    setIsWYRActive(true);
    setIsHBActive(false);
    setCardGameMode(null);
  };

  const selectWYRWinner = (side: 'left' | 'right') => {
    handleHeartClick(side);
    setTimeout(() => {
        const allImages = getAllImages();
        if (allImages.length < 2) {
            setIsWYRActive(false);
            return;
        }
        // Pick two unique random images again
        const shuffled = [...allImages].sort(() => 0.5 - Math.random());
        setWyrImages({
          left: shuffled[0],
          right: shuffled[1]
        });
    }, 400); // Slight delay for the heart animation to be seen
  };

  const startHBGame = () => {
    setIsHBActive(true);
    setIsWYRActive(false);
    setCardGameMode(null);
    setHbSearchTerm('');
    setHbFilteredItems([]);
    setHbCurrentIndex(0);
  };

  const searchHBLabel = (term: string) => {
    if (!term.trim()) return;
    const allImages = getAllImages();
    const results: { image: Image; tag: FeatureTag }[] = [];
    
    const normalizedSearch = term.toLowerCase().trim();
    
    allImages.forEach(img => {
        if (img.featureTags) {
            img.featureTags.forEach(tag => {
                const normalizedLabel = tag.label.toLowerCase();
                // Simple partial match, which naturally handles emojis at the end or beginning
                if (normalizedLabel.includes(normalizedSearch)) {
                    results.push({ image: img, tag });
                }
            });
        }
    });

    if (results.length === 0) {
        setIsHBActive(false); // Go back
        setTimeout(() => alert("No matching labels found in your vault!"), 100);
        return;
    }

    setHbSearchTerm(term);
    setHbFilteredItems(results.sort(() => 0.5 - Math.random())); // Shuffle results
    setHbCurrentIndex(0);
  };

  const nextHBImage = () => {
    setHbCurrentIndex(prev => (prev + 1) % hbFilteredItems.length);
  };

  const prevHBImage = () => {
    setHbCurrentIndex(prev => (prev - 1 + hbFilteredItems.length) % hbFilteredItems.length);
  };

  const handleCreateSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSectionName.trim()) {
      setSections(prev => [...prev, { id: uuidv4(), name: newSectionName.trim(), images: [] }]);
      setNewSectionName('');
      setIsAddingSection(false);
    }
  };

  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProfileName.trim()) {
      setProfiles(prev => [...prev, { 
        id: uuidv4(), 
        name: newProfileName.trim(), 
        images: [],
        profileImage: newProfileImage,
        isVerified: newProfileIsVerified
      }]);
      setNewProfileName('');
      setNewProfileImage(undefined);
      setNewProfileIsVerified(false);
      setIsAddingProfile(false);
    }
  };

  const handleProfileImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const base64 = await fileToBase64(file);
        if (profileToEdit) {
           setEditedProfileImage(base64);
        } else {
           setNewProfileImage(base64);
        }
      } catch (err) {
        console.error("Failed to process profile image", err);
      }
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (activeAddImageProfileId || activeAddImageSectionId)) {
      try {
        const base64 = await fileToBase64(file);
        
        const newImage: Image = {
          id: uuidv4(),
          src: base64, 
          alt: file.name,
          rating: 0,
          comments: [],
          isGeneratingComments: false,
          featureTags: [],
        };
        
        const targetId = activeAddImageProfileId || activeAddImageSectionId;
        const isProfile = !!activeAddImageProfileId;

        if (isProfile) {
          setProfiles(prev => prev.map(p => p.id === targetId ? { ...p, images: [...p.images, newImage] } : p));
        } else {
          setSections(prev => prev.map(s => s.id === targetId ? { ...s, images: [...s.images, newImage] } : s));
        }
        
        setActiveAddImageProfileId(null);
        setActiveAddImageSectionId(null);
        
        const initialComments = getRandomFallbackComments();

        if (isProfile) {
          setProfiles(prev => prev.map(p => 
            p.id === targetId ? { ...p, images: p.images.map(img => img.id === newImage.id ? { ...img, comments: initialComments } : img) } : p
          ));
        } else {
          setSections(prev => prev.map(s => 
            s.id === targetId ? { ...s, images: s.images.map(img => img.id === newImage.id ? { ...img, comments: initialComments } : img) } : s
          ));
        }
      } catch (err) {
        console.error("Failed to process file", err);
        alert("Failed to load image. It might be too large.");
      }
    }
    if (event.target) event.target.value = ''; 
  };

  const handleAddCardFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const base64 = await fileToBase64(file);
        setNewCardImage(base64);
      } catch (err) {
        console.error("Failed to process card image", err);
      }
    }
  };

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCardImage.trim() || !activeDeckId) return;

    try {
      if (editingCardId) {
        setDecks(prev => prev.map(d => d.id === activeDeckId ? { 
          ...d, 
          cards: d.cards.map(c => c.id === editingCardId ? {
            ...c,
            imageSrc: newCardImage,
            role: newCardRole,
            specialAbility: newCardSpecialAbility,
            rating10: newCardRating10,
            starRating5: newCardStarRating5,
            price: newCardPrice,
            currency: newCardCurrency,
          } : c)
        } : d));
      } else {
        const newCard: GameCard = {
          id: uuidv4(),
          imageSrc: newCardImage,
          role: newCardRole,
          specialAbility: newCardSpecialAbility,
          rating10: newCardRating10,
          starRating5: newCardStarRating5,
          price: newCardPrice,
          currency: newCardCurrency,
        };
        setDecks(prev => {
          const deckExists = prev.some(d => d.id === activeDeckId);
          if (!deckExists) return prev;
          return prev.map(d => d.id === activeDeckId ? { ...d, cards: [...d.cards, newCard] } : d);
        });
      }

      setIsAddingCard(false);
      setEditingCardId(null);
      // Reset form
      setNewCardImage('');
      setNewCardRole('Beauty');
      setNewCardSpecialAbility('None');
      setNewCardRating10(5);
      setNewCardStarRating5(3);
      setNewCardPrice(0);
      setNewCardCurrency('INR');
    } catch (err) {
      console.error("Card creation error:", err);
      alert("Something went wrong while forging your card.");
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleAddLinkImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newImageUrl.trim() && (activeAddImageProfileId || activeAddImageSectionId)) {
      let finalUrl = newImageUrl.trim();
      
      // Handle Google Drive links
      if (finalUrl.includes('drive.google.com/file/d/')) {
         const match = finalUrl.match(/\/d\/(.*?)\//);
         if (match && match[1]) {
             finalUrl = `https://drive.google.com/uc?id=${match[1]}&export=download`;
         }
      }

      const newImage: Image = {
        id: uuidv4(),
        src: finalUrl,
        alt: "Linked image",
        rating: 0,
        comments: [],
        isGeneratingComments: false,
        featureTags: [],
      };
      
      const targetId = activeAddImageProfileId || activeAddImageSectionId;
      const isProfile = !!activeAddImageProfileId;

      if (isProfile) {
        setProfiles(prev => prev.map(p => p.id === targetId ? { ...p, images: [...p.images, newImage] } : p));
      } else {
        setSections(prev => prev.map(s => s.id === targetId ? { ...s, images: [...s.images, newImage] } : s));
      }
      
      setNewImageUrl('');
      setActiveAddImageProfileId(null);
      setActiveAddImageSectionId(null);

      const initialComments = getRandomFallbackComments();

      if (isProfile) {
        setProfiles(prev => prev.map(p => 
          p.id === targetId ? { ...p, images: p.images.map(img => img.id === newImage.id ? { ...img, comments: initialComments } : img) } : p
        ));
      } else {
        setSections(prev => prev.map(s => 
          s.id === targetId ? { ...s, images: s.images.map(img => img.id === newImage.id ? { ...img, comments: initialComments } : img) } : s
        ));
      }
    }
  };
  
  const handleImageClick = (image: Image, targetId: string, type: 'profile' | 'section') => {
    if (image.isGeneratingComments) return;
    const collection = type === 'profile' ? profiles.find(p => p.id === targetId) : sections.find(s => s.id === targetId);
    if (!collection) return;
    const index = collection.images.findIndex(img => img.id === image.id);
    
    if (type === 'profile') {
      setSelectedImageInfo({ image, profileId: targetId, index });
    } else {
      setSelectedImageInfo({ image, sectionId: targetId, index });
    }
  };

  const handleImageInteraction = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isEditingPoints || !activeTagId || !modalImageRef.current) return;

    const rect = modalImageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Constrain to 0-100
    const constrainedX = Math.max(0, Math.min(100, x));
    const constrainedY = Math.max(0, Math.min(100, y));

    setTempTags(prev => prev.map(tag => 
      tag.id === activeTagId ? { ...tag, point: { x: constrainedX, y: constrainedY } } : tag
    ));
  };

  const deleteTag = (tagId: string) => {
    setTempTags(prev => prev.filter(t => t.id !== tagId));
    if (activeTagId === tagId) setActiveTagId(null);
  };

  const renameTag = (tagId: string, newLabel: string) => {
    setTempTags(prev => prev.map(t => t.id === tagId ? { ...t, label: newLabel } : t));
  };

  const [editingLabelId, setEditingLabelId] = useState<string | null>(null);

  const startEditingPoints = () => {
    setIsEditingPoints(true);
    setTempTags(selectedImageInfo?.image.featureTags || []);
  };

  const saveEditedPoints = () => {
    if (!selectedImageInfo) return;
    
    if (selectedImageInfo.profileId) {
      setProfiles(prev => prev.map(p => p.id === selectedImageInfo.profileId ? {
          ...p, images: p.images.map(img => img.id === selectedImageInfo.image.id ? { ...img, featureTags: tempTags } : img)
      } : p));
    } else if (selectedImageInfo.sectionId) {
      setSections(prev => prev.map(s => s.id === selectedImageInfo.sectionId ? {
          ...s, images: s.images.map(img => img.id === selectedImageInfo.image.id ? { ...img, featureTags: tempTags } : img)
      } : s));
    }
    
    setSelectedImageInfo(prev => prev ? { ...prev, image: { ...prev.image, featureTags: tempTags } } : null);
    setIsEditingPoints(false);
    setActiveTagId(null);
  };

  const handleTagClick = (tagId: string) => {
    setActiveTagId(tagId);
    const currentTags = isEditingPoints ? tempTags : (selectedImageInfo?.image.featureTags || []);
    const tag = currentTags.find(t => t.id === tagId);
    const intensity = tag?.zoomIntensity || labelZoomIntensity;

    // Use a small timeout to ensure DOM selection works if elements are re-rendering
    setTimeout(() => {
        if (transformRef.current && typeof transformRef.current.zoomToElement === 'function') {
            transformRef.current.zoomToElement(`feature-${tagId}`, intensity, 800);
        }
    }, 50);
  };

  const closeModal = useCallback(() => {
    setSelectedImageInfo(null);
    setIsFullScreenImage(false);
    setIsEditingPoints(false);
    setActiveTagId(null);
    setNewComment('');
  }, []);

  const handleRatingChange = (newRating: number) => {
    if (!selectedImageInfo) return;
    const r = Math.max(0, Math.min(5, newRating));
    if (selectedImageInfo.profileId) {
      setProfiles(prev => prev.map(p => p.id === selectedImageInfo.profileId ? {
          ...p, images: p.images.map(img => img.id === selectedImageInfo.image.id ? { ...img, rating: r } : img)
      } : p));
    } else if (selectedImageInfo.sectionId) {
      setSections(prev => prev.map(s => s.id === selectedImageInfo.sectionId ? {
          ...s, images: s.images.map(img => img.id === selectedImageInfo.image.id ? { ...img, rating: r } : img)
      } : s));
    }
    setSelectedImageInfo(prev => prev ? { ...prev, image: { ...prev.image, rating: r } } : null);
  };
  
  // Handlers for Smash/Heart
  const handleSmashClick = () => {
    if (transformRef.current && typeof transformRef.current.zoomIn === 'function') {
        transformRef.current.zoomIn(1.5, 500);
    }
  };
  
  const handleHeartClick = (side?: 'left' | 'right') => {
    const id = uuidv4();
    setHearts(p => [...p, { id, side }]);
    setTimeout(() => setHearts(p => p.filter(h => h.id !== id)), 1500);
  };

  return (
    <div className="app-container min-h-screen pb-20 relative">
      <div className="ambient-glow" />
      {!isWYRActive && !isHBActive && (
        <header className="pt-20 pb-12 px-4 max-w-5xl mx-auto flex flex-col items-center text-center relative overflow-visible">
          {/* PWA Install Button */}
          <AnimatePresence>
            {showInstallBtn && (
              <motion.button 
                key="install-btn"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                onClick={handleInstallClick}
                className="absolute top-6 right-6 z-50 flex items-center gap-2 bg-cyan-500 text-black px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:scale-105 active:scale-95 transition-all"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                Install App
              </motion.button>
            )}
          </AnimatePresence>

          {/* Premium Multi-Color Aurora Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 -z-10 pointer-events-none overflow-hidden blur-[100px] opacity-70">
            <div className="absolute inset-x-0 top-0 h-40 bg-zinc-900" /> {/* Edge blend */}
            <div className="absolute -top-10 left-1/4 w-64 h-64 bg-cyan-500/30 rounded-full animate-aurora" />
            <div className="absolute top-10 right-1/4 w-80 h-80 bg-violet-600/30 rounded-full animate-aurora" style={{ animationDelay: '-4s' }} />
            <div className="absolute -bottom-10 left-1/3 w-72 h-72 bg-red-500/20 rounded-full animate-aurora" style={{ animationDelay: '-8s' }} />
            <div className="absolute top-20 right-1/3 w-64 h-64 bg-green-500/20 rounded-full animate-aurora" style={{ animationDelay: '-12s' }} />
            <div className="absolute top-0 left-1/2 w-96 h-96 bg-blue-500/20 rounded-full animate-aurora" style={{ animationDelay: '-6s' }} />
          </div>

          <motion.div 
            initial={{ y: -10, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            className="relative"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="relative group">
                 <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500 to-violet-500 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
                 <div className="relative bg-black/40 border border-white/10 rounded-full p-2.5 backdrop-blur-md">
                   {activeTab === 'arcade' ? (
                     <Gamepad2 className="w-5 h-5 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                   ) : (
                     <Lock className="w-5 h-5 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                   )}
                 </div>
              </div>
              
              <h1 className="font-lobster text-3xl lg:text-4xl text-white tracking-widest drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                {activeTab === 'arcade' ? 'xsArcadex' : 'Xsgallerysx'}
              </h1>
            </div>
            
            <div className="h-px w-32 mx-auto bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
          </motion.div>

          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.3 }} 
            className="text-zinc-500 text-sm font-medium tracking-[0.3em] uppercase mb-12"
          >
            {activeTab === 'arcade' ? 'Experimental Gaming Zone' : 'Visual Encryption & Curation'}
          </motion.p>
        </header>
      )}

      <main className="max-w-7xl mx-auto px-6 pb-32">
        {activeTab === 'home' && (
           <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="space-y-16">
             <div className="flex justify-between items-center mb-10">
                <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-[0.4em]">Vault Sections</h2>
                <button 
                  onClick={() => setIsAddingSection(true)}
                  className="px-6 py-2.5 bg-zinc-900 border border-white/10 text-white rounded-2xl text-xs font-bold tracking-widest uppercase hover:border-cyan-400/50 transition"
                >
                    + New Section
                </button>
             </div>

             {sections.length === 0 ? (
               <div className="py-24 flex flex-col items-center justify-center border border-white/5 rounded-[32px] bg-white/[0.02]">
                  <ImageIcon className="w-16 h-16 text-zinc-600 mb-6" />
                  <h2 className="text-2xl text-zinc-300 font-medium mb-2">No sections found</h2>
                  <p className="text-zinc-500 mb-8 max-w-sm text-center">Create a section to start organizing your encrypted gallery.</p>
               </div>
             ) : (
                <AnimatePresence mode="popLayout">
                  {sections.map((section, idx) => (
                    <motion.section 
                      key={section.id}
                      layout
                      initial={{opacity:0, y:20}}
                      animate={{opacity:1, y:0}}
                      className={`relative bg-zinc-900/40 border border-white/10 rounded-[32px] p-8 pb-10 transition-all duration-500 hover:bg-zinc-900/60 ${section.glow ? `glow-${section.glow}` : ''}`}
                    >
                      <div className="flex items-center justify-between mb-8 gap-6 border-b border-white/10 pb-6">
                        <div>
                          <h2 className="text-3xl font-semibold text-white tracking-tight">{section.name}</h2>
                          <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{section.images.length} Images</span>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => setActiveAddImageSectionId(section.id)} className="px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-medium transition flex items-center gap-2">
                            <Plus className="w-4 h-4" /> Add
                          </button>
                          <button onClick={() => { setSectionToEdit(section); setEditedSectionName(section.name); setEditedGlow(section.glow); }} className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 hover:text-white transition">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => setSectionToDelete(section)} className="p-2.5 rounded-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 hover:text-red-300 transition">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {section.images.length === 0 ? (
                        <div className="py-12 text-center text-zinc-500">Empty section</div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6">
                           <AnimatePresence>
                              {section.images.map((image, i) => (
                                <motion.div
                                  key={image.id}
                                  layout
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.8 }}
                                  onClick={() => handleImageClick(image, section.id, 'section')}
                                  className="group relative aspect-[3/4] bg-white/5 rounded-2xl overflow-hidden cursor-pointer border border-white/5 hover:border-white/20 transition-all"
                                >
                                  <img src={image.src} alt={image.alt} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); setImageToDelete({ sectionId: section.id, imageId: image.id, alt: image.alt }); }}
                                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 hover:bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </motion.div>
                              ))}
                           </AnimatePresence>
                        </div>
                      )}
                    </motion.section>
                  ))}
                </AnimatePresence>
             )}
           </motion.div>
        )}

        {activeTab === 'profiles' && (
           <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
             <div className="flex justify-between items-center mb-10">
                <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-[0.4em]">Personal Profiles</h2>
                <button 
                  onClick={() => setIsAddingProfile(true)}
                  className="px-6 py-2.5 bg-zinc-900 border border-white/10 text-white rounded-2xl text-xs font-bold tracking-widest uppercase hover:border-cyan-400/50 transition"
                >
                    + New Profile
                </button>
             </div>

             {profiles.length === 0 ? (
               <div className="py-24 flex flex-col items-center justify-center border border-white/5 rounded-[32px] bg-white/[0.02]">
                  <User className="w-16 h-16 text-zinc-600 mb-6" />
                  <h2 className="text-2xl text-zinc-300 font-medium mb-2">No profiles created</h2>
                  <p className="text-zinc-500 mb-8 max-w-sm text-center">Create a profile to manage a distinct collection with its own avatar.</p>
               </div>
             ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {profiles.map(p => (
                        <motion.div 
                          key={p.id}
                          whileHover={{ y: -5 }}
                          className={`group relative min-h-[300px] rounded-[40px] p-8 border border-white/5 bg-zinc-900/40 hover:bg-zinc-900/60 transition-all duration-500 shadow-2xl overflow-hidden ${p.glow ? `glow-${p.glow}` : ''}`}
                        >
                            {/* Header Section */}
                            <div className="flex justify-between items-start mb-10">
                                <div className="flex items-center gap-4">
                                     <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/10 shrink-0 shadow-xl group-hover:scale-105 transition-transform duration-500">
                                         <img src={p.profileImage || 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=200'} className="w-full h-full object-cover" />
                                     </div>
                                     <div className="flex flex-col">
                                         <div className="flex items-center gap-1.5">
                                            <h3 className="text-2xl font-bold text-white tracking-tight leading-none">{p.name}</h3>
                                            {p.isVerified && <BadgeCheck className="w-5 h-5 text-cyan-400 fill-cyan-400/10" />}
                                         </div>
                                         <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">{p.images.length} Images</p>
                                     </div>
                                </div>
                                <button onClick={(e) => { e.stopPropagation(); setActiveAddImageProfileId(p.id); }} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-cyan-500/20 hover:border-cyan-500/40 transition">
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Middle/Previews Section */}
                            <div className="flex-1">
                                {p.images.length > 0 ? (
                                    <div className="grid grid-cols-4 gap-3">
                                        {p.images.slice(0, 4).map(img => (
                                            <div key={img.id} onClick={(e) => { e.stopPropagation(); handleImageClick(img, p.id, 'profile'); }} className="aspect-square rounded-2xl overflow-hidden border border-white/10 cursor-zoom-in relative group/img">
                                                <img src={img.src} className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-500" />
                                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 transition-opacity" />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="h-24 flex items-center justify-center border border-dashed border-white/5 rounded-2xl">
                                        <p className="text-xs text-zinc-600 font-bold uppercase tracking-widest">No Content</p>
                                    </div>
                                )}
                            </div>

                            {/* Actions Overlay */}
                            <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
                                <button onClick={(e) => { e.stopPropagation(); setProfileToEdit(p); setEditedProfileName(p.name); setEditedProfileImage(p.profileImage); setEditedProfileIsVerified(!!p.isVerified); setEditedGlow(p.glow); }} className="p-2 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white hover:bg-white/10 transition">
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button onClick={(e) => { e.stopPropagation(); setProfileToDelete(p); }} className="p-2 rounded-full bg-red-500/20 backdrop-blur-md border border-red-500/20 text-red-100 hover:bg-red-500/40 transition">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
             )}
           </motion.div>
        )}

        {activeTab === 'arcade' && (
            <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} className={isWYRActive || isHBActive || cardGameMode ? "py-4" : "py-10"}>
                {!isWYRActive && !isHBActive && !cardGameMode ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto px-4">
                            {[
                                { 
                                    id: 'wyr', 
                                    title: 'Would You Rather', 
                                    desc: 'Pick your absolute favorite between two stunning captures from your vault.', 
                                    icon: Crosshair, 
                                    color: 'from-orange-500 to-red-600',
                                    status: getAllImages().length >= 2 ? 'PLAY NOW' : 'LOCKED (Need 2+ Images)',
                                    onClick: startWYRGame
                                },
                                { 
                                    id: 'beauty', 
                                    title: 'Heavenly Beauty', 
                                    desc: 'Search for specific labels and view automatically zoomed captures.', 
                                    icon: Heart, 
                                    color: 'from-pink-500 to-rose-600',
                                    status: getAllImages().some(img => img.featureTags && img.featureTags.length > 0) ? 'PLAY NOW' : 'LOCKED (Needs Tagged Images)',
                                    onClick: startHBGame
                                },
                                { 
                                    id: 'cards', 
                                    title: 'Card Games', 
                                    desc: 'Classic and custom card games for the vault. Create your own deck.', 
                                    icon: CreditCard, 
                                    color: 'from-blue-500 to-indigo-600',
                                    status: 'PLAY NOW',
                                    onClick: () => {
                                        setCardGameMode('deck-list');
                                        setIsWYRActive(false);
                                        setIsHBActive(false);
                                    }
                                }
                            ].map((game) => (
                                <div 
                                    key={game.id} 
                                    onClick={() => {
                                        if (game.status === 'PLAY NOW') {
                                            game.onClick?.();
                                        }
                                    }}
                                    className={`group relative rounded-[40px] bg-zinc-900 shadow-xl overflow-hidden border border-white/5 hover:border-white/10 transition-all duration-500 ${game.status.startsWith('LOCKED') || game.status === 'COMING SOON' || game.status === 'UNDER DEV' ? 'opacity-50 grayscale cursor-not-allowed' : 'cursor-pointer hover:-translate-y-1'}`}
                                >
                                     <div className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                                     
                                     <div className="p-8 relative z-10 flex flex-col h-full">
                                         <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${game.color} p-0.5 mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-black/40`}>
                                             <div className="w-full h-full rounded-[14px] bg-[#050505] flex items-center justify-center">
                                                 <game.icon className="w-6 h-6 text-white" />
                                             </div>
                                         </div>
                                         <h3 className="text-2xl font-bold text-white mb-2">{game.title}</h3>
                                         <p className="text-zinc-500 text-sm mb-8 leading-relaxed">{game.desc}</p>
                                         <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                                             <span className={`text-[10px] font-black uppercase tracking-widest ${game.status === 'PLAY NOW' ? 'text-cyan-400' : 'text-zinc-600'}`}>
                                                 {game.status}
                                             </span>
                                             <div className={`w-8 h-8 rounded-full transition-colors flex items-center justify-center ${game.status === 'PLAY NOW' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/5 text-zinc-500'}`}>
                                                 <Plus className="w-4 h-4" />
                                             </div>
                                         </div>
                                     </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : isHBActive ? (
                    <div className="flex flex-col items-center w-full min-h-[70vh] px-4 max-w-6xl mx-auto">
                         <div className="flex items-center justify-between w-full mb-8">
                             <button onClick={() => setIsHBActive(false)} className="flex items-center gap-2 text-zinc-500 hover:text-white transition group px-4 py-2 rounded-full hover:bg-white/5">
                                 <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                                 <span className="text-[10px] font-black uppercase tracking-widest">Quit Game</span>
                             </button>
                             <div className="flex flex-col items-center">
                                 <div className="flex items-center gap-3">
                                     <div className="w-8 h-8 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center">
                                         <Heart className="w-4 h-4 text-pink-400" />
                                     </div>
                                     <h2 className="font-lobster text-3xl text-white tracking-widest">Heavenly Beauty</h2>
                                 </div>
                                 <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.4em] mt-2">Feature Finder</p>
                             </div>
                             <div className="w-32 hidden md:block" />
                         </div>

                         {!hbSearchTerm ? (
                             <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-[40px] p-10 mt-12 shadow-2xl flex flex-col items-center text-center">
                                 <div className="w-16 h-16 rounded-3xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center mb-6">
                                     <Search className="w-8 h-8 text-pink-400" />
                                 </div>
                                 <h3 className="text-xl font-bold text-white mb-2">What are you looking for?</h3>
                                 <p className="text-zinc-500 text-sm mb-8 leading-relaxed">Type a label like "face", "eyes", or "smile" to find all matching captures in your vault.</p>
                                 <input 
                                     autoFocus
                                     type="text" 
                                     placeholder="Enter label..."
                                     onKeyDown={(e) => {
                                         if (e.key === 'Enter') searchHBLabel((e.target as HTMLInputElement).value);
                                     }}
                                     className="w-full bg-black/40 border-2 border-white/5 focus:border-pink-500/50 px-6 py-4 rounded-2xl text-white text-center text-lg focus:outline-none transition-all placeholder:text-zinc-600 mb-6"
                                 />
                                 <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.2em]">Press Enter to Search</p>
                             </motion.div>
                         ) : (
                            <div className="w-full flex-1 flex flex-col items-center gap-8">
                                <div className="w-full max-w-5xl bg-zinc-900/60 border border-white/10 rounded-[40px] overflow-hidden flex flex-col lg:flex-row shadow-2xl relative">
                                    {/* Left: Image Viewer */}
                                    <div className="w-full lg:w-3/5 aspect-[4/5] sm:aspect-[3/4] lg:aspect-auto relative bg-black/40 flex items-center justify-center border-b lg:border-b-0 lg:border-r border-white/10 h-[50vh] sm:h-[60vh] lg:h-auto lg:min-h-[600px] overflow-hidden">
                                        <TransformWrapper
                                            initialScale={1}
                                            centerOnInit
                                            minScale={0.5}
                                            maxScale={10}
                                            limitToBounds={false}
                                            disabled={true} // Disable manual interaction for HB mode
                                        >
                                            {({ zoomToElement }) => {
                                                // Handle auto-zoom on index change
                                                useEffect(() => {
                                                    const tag = hbFilteredItems[hbCurrentIndex]?.tag;
                                                    const currentId = `hb-feature-${tag?.id}`;
                                                    const intensity = tag?.zoomIntensity || 4.5;
                                                    const timer = setTimeout(() => {
                                                        zoomToElement(currentId, intensity, 1000);
                                                    }, 500);
                                                    return () => clearTimeout(timer);
                                                }, [hbCurrentIndex, hbFilteredItems, zoomToElement]);

                                                return (
                                                    <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }} contentStyle={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                        <div className="relative w-full h-full flex items-center justify-center group pointer-events-none">
                                                            <img 
                                                                src={hbFilteredItems[hbCurrentIndex]?.image.src} 
                                                                className="max-w-[90%] max-h-[90%] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] select-none"
                                                                draggable={false}
                                                            />
                                                            {/* Target Tag with ID for zooming - Hidden visual, only for anchor */}
                                                            <div 
                                                                id={`hb-feature-${hbFilteredItems[hbCurrentIndex]?.tag.id}`}
                                                                className="absolute -translate-x-1/2 -translate-y-1/2 opacity-0 pointer-events-none"
                                                                style={{ 
                                                                    left: `${hbFilteredItems[hbCurrentIndex]?.tag.point?.x}%`, 
                                                                    top: `${hbFilteredItems[hbCurrentIndex]?.tag.point?.y}%` 
                                                                }}
                                                            />
                                                        </div>
                                                    </TransformComponent>
                                                );
                                            }}
                                        </TransformWrapper>

                                        {/* Quick Nav */}
                                        <div className="absolute inset-y-0 w-full flex items-center justify-between px-6 pointer-events-none">
                                            <button onClick={prevHBImage} className="w-12 h-12 rounded-full bg-white/5 border border-white/10 text-white flex items-center justify-center backdrop-blur-md hover:bg-white/10 transition pointer-events-auto shadow-xl group/btn">
                                                <ChevronLeft className="w-6 h-6 group-hover/btn:-translate-x-0.5 transition-transform" />
                                            </button>
                                            <button onClick={nextHBImage} className="w-12 h-12 rounded-full bg-white/5 border border-white/10 text-white flex items-center justify-center backdrop-blur-md hover:bg-white/10 transition pointer-events-auto shadow-xl group/btn">
                                                <ChevronRight className="w-6 h-6 group-hover/btn:translate-x-0.5 transition-transform" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Right: Info Panel */}
                                    <div className="flex-1 p-8 lg:p-12 flex flex-col justify-center items-center text-center">
                                        <motion.div 
                                            key={hbFilteredItems[hbCurrentIndex]?.image.id}
                                            initial={{opacity:0, x:20}}
                                            animate={{opacity:1, x:0}}
                                            className="space-y-6"
                                        >
                                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10">
                                                <Star className="w-4 h-4 text-pink-400 fill-pink-400" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Match {hbCurrentIndex + 1} of {hbFilteredItems.length}</span>
                                            </div>
                                            
                                            <h3 className="text-4xl font-black text-white italic tracking-tighter uppercase">
                                                {hbFilteredItems[hbCurrentIndex]?.tag.label}
                                            </h3>
                                            
                                            <p className="text-zinc-500 text-sm leading-relaxed max-w-sm mx-auto">
                                                This feature was captured in <span className="text-white font-bold">{hbFilteredItems[hbCurrentIndex]?.image.alt}</span>. The AI has automatically focused and zoomed for optimal viewing.
                                            </p>

                                            <div className="pt-8 flex flex-col gap-3">
                                                <button 
                                                    onClick={nextHBImage}
                                                    className="w-full py-5 rounded-3xl bg-white text-black font-black uppercase tracking-[0.2em] text-xs hover:bg-pink-500 hover:text-white transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3"
                                                >
                                                    Next Beautiful Capture
                                                    <ChevronRight className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={() => setHbSearchTerm('')}
                                                    className="w-full py-4 rounded-3xl bg-zinc-800 text-zinc-400 font-black uppercase tracking-[0.2em] text-[10px] hover:text-white transition-all flex items-center justify-center gap-2"
                                                >
                                                    <Search className="w-3.5 h-3.5" />
                                                    Search New Label
                                                </button>
                                            </div>
                                        </motion.div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-center gap-4 py-8">
                                    <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.5em]">Heavenly Beauty Mode</p>
                                    <div className="flex gap-2">
                                        {[1,2,3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-pink-500/20 border border-pink-500/40" />)}
                                    </div>
                                </div>
                            </div>
                         )}
                    </div>
                ) : cardGameMode === 'deck-list' ? (
                    <div className="flex flex-col items-center w-full min-h-[70vh] px-4 max-w-5xl mx-auto">
                        <div className="flex items-center justify-between w-full mb-12">
                             <button onClick={() => setCardGameMode(null)} className="flex items-center gap-2 text-zinc-500 hover:text-white transition group px-4 py-2 rounded-full hover:bg-white/5">
                                 <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                                 <span className="text-[10px] font-black uppercase tracking-widest">Back to Arcade</span>
                             </button>
                             <div className="flex flex-col items-center">
                                 <div className="flex items-center gap-3">
                                     <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                                         <CreditCard className="w-4 h-4 text-indigo-400" />
                                     </div>
                                     <h2 className="font-lobster text-3xl text-white tracking-widest">Deck Collection</h2>
                                 </div>
                             </div>
                             <button 
                                onClick={() => {
                                    const newDeck: CardDeck = { id: uuidv4(), name: `My Deck ${decks.length + 1}`, cards: [] };
                                    setDecks(prev => [...prev, newDeck]);
                                    setActiveDeckId(newDeck.id);
                                    setCardGameMode('deck-builder');
                                }}
                                className="px-6 py-2.5 bg-indigo-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-400 transition shadow-lg shadow-indigo-500/20"
                             >
                                Create New Deck
                             </button>
                        </div>

                        {decks.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-center py-20 bg-zinc-900/40 border border-white/5 rounded-[40px] w-full">
                                <FolderArchive className="w-16 h-16 text-zinc-700 mb-6" />
                                <h3 className="text-xl font-bold text-white mb-2">No Decks Found</h3>
                                <p className="text-zinc-500 text-sm max-w-sm">Start by creating a custom deck for your card games.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
                                {decks.map(deck => (
                                    <div 
                                        key={deck.id}
                                        onClick={() => {
                                            setActiveDeckId(deck.id);
                                            setCardGameMode('deck-builder');
                                        }}
                                        className="bg-zinc-900 border border-white/5 rounded-[32px] p-6 hover:border-indigo-500/50 transition duration-300 cursor-pointer group"
                                    >
                                        <div className="aspect-[3/2] bg-black/40 rounded-2xl mb-4 flex items-center justify-center overflow-hidden relative">
                                            {deck.cards.length > 0 ? (
                                                <img src={deck.cards[0].imageSrc} className="w-full h-full object-cover opacity-50 group-hover:scale-110 transition-transform duration-500" />
                                            ) : (
                                                <CreditCard className="w-10 h-10 text-zinc-700" />
                                            )}
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                                                    <ChevronRight className="w-5 h-5" />
                                                </div>
                                            </div>
                                        </div>
                                        <h4 className="text-white font-bold mb-1 group-hover:text-indigo-400 transition">{deck.name}</h4>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{deck.cards.length} Cards</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : cardGameMode === 'deck-builder' && activeDeck ? (
                    <div className="flex flex-col items-center w-full min-h-[70vh] px-4 max-w-5xl mx-auto">
                        <div className="flex items-center justify-between w-full mb-12">
                             <button onClick={() => { setCardGameMode('deck-list'); setIsEditingCards(false); }} className="flex items-center gap-2 text-zinc-500 hover:text-white transition group px-4 py-2 rounded-full hover:bg-white/5">
                                 <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                                 <span className="text-[10px] font-black uppercase tracking-widest">Back to Decks</span>
                             </button>
                            <div className="flex flex-col gap-1 items-end">
                                <div className="flex items-center gap-2">
                                     <input 
                                        type="text"
                                        value={activeDeck.name}
                                        onChange={(e) => {
                                            setDecks(prev => prev.map(d => d.id === activeDeck.id ? { ...d, name: e.target.value } : d));
                                        }}
                                        className="bg-transparent border-none text-white font-lobster text-3xl text-right focus:outline-none focus:ring-0 max-w-[200px]"
                                     />
                                     <Edit2 className="w-4 h-4 text-zinc-500" />
                                </div>
                                 <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.4em]">Deck Builder</p>
                             </div>
                             <div className="flex gap-2">
                                <button 
                                    onClick={() => setIsEditingCards(!isEditingCards)}
                                    className={`px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 border ${isEditingCards ? 'bg-red-500 text-white border-red-400' : 'bg-white/5 text-zinc-500 hover:text-white border-white/10'}`}
                                >
                                    {isEditingCards ? <X className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                                    {isEditingCards ? 'Stop Editing' : 'Edit Cards'}
                                </button>
                                <button 
                                    disabled={!activeDeck || activeDeck.cards.length < 4}
                                    onClick={() => { setCardGameMode('playing'); setIsEditingCards(false); }}
                                    className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl hover:scale-105 active:scale-95 ${activeDeck && activeDeck.cards.length >= 4 ? 'bg-cyan-500 text-black hover:bg-cyan-400 shadow-cyan-500/40' : 'bg-zinc-800 text-zinc-500 grayscale cursor-not-allowed'}`}
                                >
                                    {(activeDeck && activeDeck.cards.length >= 4) ? 'START GAME' : activeDeck ? `Need ${4 - activeDeck.cards.length} more cards` : 'Select Deck'}
                                </button>
                             </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 w-full">
                            {/* Card Grid */}
                            <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                <button 
                                    onClick={() => {
                                        setEditingCardId(null);
                                        setNewCardImage('');
                                        setNewCardRole('Beauty');
                                        setNewCardSpecialAbility('None');
                                        setNewCardRating10(5);
                                        setNewCardStarRating5(3);
                                        setNewCardPrice(0);
                                        setNewCardCurrency('INR');
                                        setIsAddingCard(true);
                                    }}
                                    className="aspect-[2.5/3.5] rounded-3xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-3 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition group"
                                >
                                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition">
                                        <Plus className="w-6 h-6 text-indigo-400" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 group-hover:text-white">Add Card</span>
                                </button>

                                {activeDeck.cards.map(card => (
                                    <div key={card.id} className="relative group">
                                        <CustomCardUI card={card} />
                                        <div className={`absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/60 backdrop-blur-[2px] transition-all duration-300 rounded-2xl ${isEditingCards ? 'opacity-100' : 'opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto'}`}>
                                            <button 
                                                onClick={() => {
                                                    setEditingCardId(card.id);
                                                    setNewCardImage(card.imageSrc);
                                                    setNewCardRole(card.role);
                                                    setNewCardSpecialAbility(card.specialAbility || 'None');
                                                    setNewCardRating10(card.rating10);
                                                    setNewCardStarRating5(card.starRating5);
                                                    setNewCardPrice(card.price || 0);
                                                    setNewCardCurrency(card.currency);
                                                    setIsAddingCard(true);
                                                }}
                                                className="w-10 h-10 rounded-full bg-white text-black shadow-xl hover:bg-indigo-500 hover:text-white transition-all transform hover:scale-110 flex items-center justify-center border border-white/20"
                                            >
                                                <Edit2 className="w-5 h-5" />
                                            </button>
                                            <button 
                                                onClick={() => {
                                                    if (confirm("Delete this card from your deck?")) {
                                                        setDecks(prev => prev.map(d => d.id === activeDeckId ? { ...d, cards: d.cards.filter(c => c.id !== card.id) } : d));
                                                    }
                                                }}
                                                className="w-10 h-10 rounded-full bg-red-500 text-white shadow-xl hover:bg-red-600 transition-all transform hover:scale-110 flex items-center justify-center border border-red-400/50"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Deck Stats/Quick Tips */}
                            <div className="bg-zinc-900 border border-white/5 rounded-[40px] p-8 h-fit space-y-6">
                                <h4 className="text-white font-bold uppercase text-xs tracking-widest mb-4">Deck Statistics</h4>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-zinc-500">Total Value</span>
                                        <span className="text-white font-bold">
                                            {activeDeck.cards.reduce((sum, c) => sum + (c.currency === 'INR' ? (c.price || 0) / 80 : (c.price || 0)), 0).toFixed(2)} USD
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-zinc-500">Avg. Rating</span>
                                        <span className="text-white font-bold">
                                            {(activeDeck.cards.reduce((sum, c) => sum + (c.rating10 || 0), 0) / (activeDeck.cards.length || 1)).toFixed(1)}/10
                                        </span>
                                    </div>
                                </div>
                                <div className="pt-6 border-t border-white/5">
                                    <p className="text-[10px] text-zinc-500 font-medium italic leading-relaxed">
                                        "A balanced deck requires a mix of Queens, Baddies, and Beauties. Make sure your star ratings are consistently high for maximum advantage."
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : cardGameMode === 'playing' && activeDeck ? (
                    <div className="fixed inset-0 z-[100] bg-[#050505] flex flex-col items-center overflow-hidden">
                        {/* Arena Background */}
                        <div className="absolute inset-0 opacity-20 pointer-events-none">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 blur-[120px] rounded-full" />
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
                        </div>

                        {/* Top Bar / Controls */}
                        <div className="relative z-10 w-full p-4 flex justify-between items-center bg-black/40 backdrop-blur-md border-b border-white/5">
                             <button 
                                onClick={() => {
                                    if (battle.status !== 'idle' && battle.status !== 'game-over') {
                                        if (!confirm("Quit current game? Progress will be lost.")) return;
                                    }
                                    setCardGameMode('deck-builder');
                                    setBattle(p => ({ ...p, status: 'idle' }));
                                }} 
                                className="flex items-center gap-2 text-zinc-500 hover:text-white transition group px-4 py-2 rounded-full hover:bg-white/5"
                             >
                                 <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                                 <span className="text-[10px] font-black uppercase tracking-widest">Surrender</span>
                             </button>
                             
                             <div className="flex flex-col items-center">
                                 <h2 className="font-lobster text-2xl text-white tracking-widest">Arena</h2>
                                 <p className="text-[8px] text-cyan-400 font-bold uppercase tracking-[0.4em]">Multiplayer Battle</p>
                             </div>

                             <div className="flex items-center gap-4">
                                 {battle.status !== 'idle' && (
                                     <div className="flex items-center gap-6">
                                         {battle.players.map(p => (
                                             <div key={`header-${p.id}`} className="flex flex-col items-center">
                                                 <span className={`text-[8px] font-black uppercase tracking-widest mb-1 ${p.isAI ? 'text-zinc-500' : 'text-cyan-400'}`}>{p.name}</span>
                                                 <span className="text-sm font-bold text-white">{p.score}</span>
                                             </div>
                                         ))}
                                     </div>
                                 )}
                             </div>
                        </div>

                        {/* Battle Table */}
                        <div className="flex-1 w-full relative flex items-center justify-center p-2 md:p-4 overflow-hidden">
                            {battle.status === 'idle' ? (
                                <div className="flex flex-col items-center gap-6 md:gap-8 text-center animate-in fade-in zoom-in duration-700">
                                    <div className="w-24 h-24 md:w-40 md:h-40 rounded-[30px] md:rounded-[50px] bg-zinc-900 border border-white/10 flex items-center justify-center relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-600/20 group-hover:opacity-40 transition-opacity" />
                                        <Gamepad2 className="w-10 h-10 md:w-16 md:h-16 text-white relative z-10" />
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="text-3xl md:text-5xl font-black text-white italic tracking-tighter uppercase">Ready for War?</h3>
                                        <p className="text-zinc-500 text-xs md:text-sm max-w-xs md:max-w-sm mx-auto leading-relaxed">
                                            Your deck <span className="text-white font-bold">{activeDeck.name}</span> is loaded. 4 players, equal cards, one winner.
                                        </p>
                                    </div>
                                    <button 
                                        onClick={() => startBattle(activeDeck)}
                                        className="px-12 py-5 md:px-20 md:py-7 bg-cyan-500 text-black rounded-[2rem] md:rounded-[3rem] font-black uppercase tracking-[0.3em] text-[12px] md:text-lg hover:scale-110 active:scale-95 transition-all shadow-[0_20px_50px_rgba(6,182,212,0.4)] border-b-6 md:border-b-[10px] border-cyan-700"
                                    >
                                        START GAME
                                    </button>
                                </div>
                            ) : (
                                <div className="w-full h-full max-w-6xl max-h-[900px] relative flex items-center justify-center">
                                    {/* Table Center (Played Cards) */}
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <div className="w-[320px] h-[320px] md:w-[700px] md:h-[700px] rounded-full border border-white/10 bg-white/[0.04] flex items-center justify-center relative shadow-[0_0_150px_rgba(255,255,255,0.03)]">
                                            <div className="absolute inset-[10%] rounded-full border border-white/5 bg-white/[0.01]" />
                                            
                                            {/* Played Cards Positions */}
                                            {battle.players.map((p, idx) => {
                                                const pos = p.position;
                                                const offsets: Record<string, string> = {
                                                    top: "-translate-y-28 md:-translate-y-80",
                                                    bottom: "translate-y-28 md:translate-y-80",
                                                    left: "-translate-x-32 md:-translate-x-80",
                                                    right: "translate-x-32 md:translate-x-80",
                                                };
                                                
                                                return (
                                                    <AnimatePresence key={`anim-${p.id}`}>
                                                        {p.playedCard && (
                                                            <motion.div 
                                                                key={`played-${p.playedCard.id}`}
                                                                initial={{ 
                                                                    opacity: 0, 
                                                                    scale: 0.5,
                                                                    x: pos === 'left' ? -200 : pos === 'right' ? 200 : 0,
                                                                    y: pos === 'top' ? -200 : pos === 'bottom' ? 200 : 0,
                                                                }}
                                                                animate={{ opacity: 1, scale: window.innerWidth < 768 ? 0.8 : 1.4, x: 0, y: 0 }}
                                                                onClick={() => handleSelectWinnerManually(idx)}
                                                                className={`absolute w-36 md:w-52 z-20 pointer-events-auto ${offsets[pos]} ${battle.status === 'selecting-winner' ? 'cursor-pointer hover:scale-[1.1] md:hover:scale-150 transition-all ring-4 ring-cyan-400 ring-offset-4 ring-offset-black rounded-2xl animate-pulse shadow-[0_0_50px_rgba(34,211,238,0.5)]' : ''}`}
                                                            >
                                                                <CustomCardUI card={p.playedCard} />
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                );
                                            })}

                                            {/* Round Info Overlay */}
                                            {battle.winnerMessage && (
                                                <motion.div 
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    className="absolute z-[100] flex flex-col items-center gap-6"
                                                >
                                                    <div className="px-10 py-5 rounded-[2rem] bg-cyan-500 text-black font-black uppercase tracking-widest text-sm shadow-[0_0_50px_rgba(6,182,212,0.6)]">
                                                        {battle.winnerMessage}
                                                    </div>
                                                    {battle.status === 'round-result' && (
                                                        <button 
                                                            onClick={handleNextRound}
                                                            className="px-12 py-4 rounded-[1.5rem] bg-white text-black font-black uppercase tracking-widest text-xs hover:scale-110 active:scale-95 transition shadow-2xl border-b-4 border-zinc-200"
                                                        >
                                                            Next Round
                                                        </button>
                                                    )}
                                                </motion.div>
                                            )}

                                            {/* Turn Indicator */}
                                            {!battle.winnerMessage && battle.status === 'playing' && (
                                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                    <div className="text-zinc-700 text-xs font-black uppercase tracking-[0.6em] animate-pulse">
                                                        {battle.players[battle.turnIndex]?.name}'s Turn
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Player Areas */}
                                    {battle.players.map(p => {
                                        const isMyTurn = battle.turnIndex === battle.players.indexOf(p);
                                        const posStyles: Record<string, string> = {
                                            top: "absolute top-0 left-1/2 -translate-x-1/2",
                                            bottom: "absolute bottom-0 left-1/2 -translate-x-1/2 w-full",
                                            left: "absolute left-0 top-1/2 -translate-y-1/2",
                                            right: "absolute right-0 top-1/2 -translate-y-1/2",
                                        };

                                        return (
                                            <div key={`table-${p.id}`} className={`${posStyles[p.position]} flex flex-col items-center gap-2 md:gap-4 shrink-0 transition-all duration-500`}>
                                                {/* Player Info Chip */}
                                                <div className={`px-3 py-1 md:px-4 md:py-1.5 rounded-full border transition-all duration-500 ${p.position === 'left' ? 'rotate-90' : p.position === 'right' ? '-rotate-90' : ''} ${isMyTurn ? 'bg-cyan-500/10 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.2)]' : 'bg-black/40 border-white/10'}`}>
                                                    <div className="flex items-center gap-1 md:gap-2">
                                                        <div className={`w-1 h-1 md:w-1.5 md:h-1.5 rounded-full ${isMyTurn ? 'bg-cyan-400 animate-pulse' : 'bg-zinc-700'}`} />
                                                        <span className={`text-[8px] md:text-[10px] font-black uppercase tracking-widest ${isMyTurn ? 'text-white' : 'text-zinc-500'}`}>{p.name}</span>
                                                        <span className="text-zinc-600 text-[6px] md:text-[8px] font-bold">({p.hand.length})</span>
                                                    </div>
                                                </div>

                                                {/* Hands Visualization */}
                                                {p.position === 'bottom' ? (
                                                    <div className="flex items-center justify-center gap-1 md:gap-3 p-2 md:p-6 w-[95vw] md:w-full overflow-x-auto no-scrollbar scroll-smooth">
                                                        {p.hand.map(card => (
                                                            <motion.div 
                                                                key={card.id}
                                                                whileHover={{ y: -30, scale: 1.2, zIndex: 10 }}
                                                                onClick={() => playHumanCard(card)}
                                                                className={`w-28 md:w-44 shrink-0 transition-all duration-300 ${isMyTurn ? 'cursor-pointer hover:shadow-[0_0_50px_rgba(6,182,212,0.4)]' : 'opacity-40 grayscale pointer-events-none'}`}
                                                            >
                                                                <CustomCardUI card={card} />
                                                            </motion.div>
                                                        ))}
                                                    </div>
                                                ) : null}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Game Over Screen */}
                        <AnimatePresence>
                                    {battle.status === 'game-over' && (
                                        <motion.div 
                                            key="game-over-screen"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 md:p-8"
                                        >
                                            <div className="w-full max-w-md bg-zinc-900 rounded-[30px] md:rounded-[40px] p-6 md:p-10 border border-white/10 shadow-2xl flex flex-col items-center text-center">
                                                <Trophy className="w-12 h-12 md:w-20 md:h-20 text-yellow-500 mb-4 md:mb-6 drop-shadow-[0_0_30px_rgba(234,179,8,0.4)]" />
                                                <h3 className="text-2xl md:text-4xl font-black text-white px-2 italic uppercase tracking-tighter mb-2">Final Scores</h3>
                                                <div className="w-full space-y-2 md:space-y-3 mb-6 md:mb-10">
                                                    {[...battle.players].sort((a, b) => b.score - a.score).map((p, idx) => (
                                                        <div key={`score-${p.id}`} className={`flex items-center justify-between p-3 md:p-4 rounded-xl md:rounded-2xl border ${idx === 0 ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-white/5 border-white/5'}`}>
                                                            <div className="flex items-center gap-2 md:gap-3">
                                                                <span className="text-sm md:text-lg font-black italic text-white/20">#{idx + 1}</span>
                                                                <span className="text-xs md:text-sm text-white font-bold">{p.name}</span>
                                                            </div>
                                                            <span className="text-lg md:text-xl font-black text-white">{p.score}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                                <button 
                                                    onClick={() => {
                                                        setBattle(p => ({ ...p, status: 'idle' }));
                                                        setCardGameMode('deck-list');
                                                    }}
                                                    className="w-full py-4 md:py-5 rounded-2xl md:rounded-3xl bg-white text-black font-black uppercase tracking-[0.2em] text-[10px] md:text-xs hover:bg-cyan-500 hover:text-white transition-all shadow-xl"
                                                >
                                                    Return to Menu
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                        </AnimatePresence>
                    </div>
                ) : isWYRActive ? (
                    <div className="flex flex-col items-center w-full min-h-[70vh] px-4 max-w-6xl mx-auto">
                        <div className="flex items-center justify-between w-full mb-8">
                             <button onClick={() => setIsWYRActive(false)} className="flex items-center gap-2 text-zinc-500 hover:text-white transition group px-4 py-2 rounded-full hover:bg-white/5">
                                 <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                                 <span className="text-[10px] font-black uppercase tracking-widest">Quit Game</span>
                             </button>
                             <div className="flex flex-col items-center">
                                 <div className="flex items-center gap-3">
                                     <div className="w-8 h-8 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                                         <Crosshair className="w-4 h-4 text-orange-400" />
                                     </div>
                                     <h2 className="font-lobster text-3xl text-white tracking-widest">Would You Rather</h2>
                                 </div>
                                 <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.4em] mt-2">Pick your Fav</p>
                             </div>
                             <div className="w-32 hidden md:block" />
                        </div>

                        <div className="w-full flex flex-col md:flex-row items-center justify-center gap-8 md:gap-4 relative">
                            {/* Left Side */}
                            <motion.div 
                                key={`left-${wyrImages?.left.id}`}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex-1 w-full max-w-sm"
                            >
                                <div className="flex flex-col gap-6">
                                    <div className="relative aspect-[3/4.5] rounded-[40px] overflow-hidden border border-white/10 shadow-2xl transition-all duration-500 group flex items-center justify-center">
                                        <img src={wyrImages?.left.src} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                                        
                                        {hearts.filter(h => h.side === 'left').map(h => (
                                            <motion.div key={h.id} initial={{scale:0, opacity:1}} animate={{scale:3, opacity:0}} transition={{duration:1}} className="absolute text-cyan-400 pointer-events-none z-50">
                                                <Heart className="w-32 h-32 fill-cyan-400" />
                                            </motion.div>
                                        ))}
                                    </div>
                                    <button 
                                        onClick={() => selectWYRWinner('left')}
                                        className="w-full py-5 rounded-3xl bg-white text-black font-black uppercase tracking-[0.2em] text-xs hover:bg-cyan-400 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.5)] active:scale-95 flex items-center justify-center gap-3 border-b-4 border-black/20"
                                    >
                                        <Heart className="w-4 h-4" />
                                        Smash Left
                                    </button>
                                </div>
                            </motion.div>

                            {/* Versus Badge */}
                            <div className="z-10 shrink-0 mx-2">
                                <div className="bg-black/80 backdrop-blur-3xl border border-white/10 w-16 h-16 md:w-20 md:h-20 rounded-full flex flex-col items-center justify-center shadow-2xl relative">
                                    <div className="absolute inset-0 rounded-full bg-cyan-500/20 blur-xl animate-pulse" />
                                    <span className="text-[10px] md:text-xs font-black text-zinc-500 uppercase tracking-widest relative">VS</span>
                                </div>
                            </div>

                            {/* Right Side */}
                            <motion.div 
                                key={`right-${wyrImages?.right.id}`}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex-1 w-full max-w-sm"
                            >
                                <div className="flex flex-col gap-6">
                                    <div className="relative aspect-[3/4.5] rounded-[40px] overflow-hidden border border-white/10 shadow-2xl transition-all duration-500 group flex items-center justify-center">
                                        <img src={wyrImages?.right.src} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                                        
                                        {hearts.filter(h => h.side === 'right').map(h => (
                                            <motion.div key={h.id} initial={{scale:0, opacity:1}} animate={{scale:3, opacity:0}} transition={{duration:1}} className="absolute text-rose-500 pointer-events-none z-50">
                                                <Heart className="w-32 h-32 fill-rose-500" />
                                            </motion.div>
                                        ))}
                                    </div>
                                    <button 
                                        onClick={() => selectWYRWinner('right')}
                                        className="w-full py-5 rounded-3xl bg-white text-black font-black uppercase tracking-[0.2em] text-xs hover:bg-rose-500 hover:text-white transition-all shadow-[0_10px_30px_rgba(0,0,0,0.5)] active:scale-95 flex items-center justify-center gap-3 border-b-4 border-black/20"
                                    >
                                        <Heart className="w-4 h-4" />
                                        Smash Right
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                        
                        <div className="mt-16 flex flex-col items-center gap-4">
                            <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.5em] animate-pulse">Choose Wisely</p>
                            <div className="flex gap-2">
                                {[1,2,3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/5 border border-white/10" />)}
                            </div>
                        </div>
                    </div>
                ) : null}
            </motion.div>
        )}

        {activeTab === 'extra' && (
            <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="flex flex-col items-center text-center py-10 space-y-8">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-cyan-500 to-violet-500 p-1">
                    <div className="w-full h-full rounded-full bg-[#050505] flex items-center justify-center">
                        <Lock className="w-10 h-10 text-white" />
                    </div>
                </div>
                <div>
                   <h2 className="text-3xl font-bold text-white mb-2">Vault Settings</h2>
                   <p className="text-zinc-500 max-w-sm mx-auto">Manage your encryption settings and storage preferences for your private collection.</p>
                </div>
                
                <div className="w-full max-w-md grid grid-cols-1 gap-4">
                    {[
                        { label: 'Cloud Sync', desc: 'Backup to encrypted cloud storage', status: 'Enabled' },
                        { label: 'Auto-Lock', desc: 'Lock vault after 5 mins of inactivity', status: 'Enabled' },
                        { label: 'Clear Cache', desc: 'Remove transient data from local vault', status: 'Action' }
                    ].map((item, i) => (
                        <div key={i} className="bg-zinc-900 border border-white/5 p-5 rounded-3xl flex items-center justify-between hover:border-white/10 transition">
                            <div className="text-left">
                                <h4 className="text-white font-medium">{item.label}</h4>
                                <p className="text-xs text-zinc-500">{item.desc}</p>
                            </div>
                            <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${item.status === 'Enabled' ? 'bg-cyan-500/10 text-cyan-400' : 'bg-white/10 text-white'}`}>{item.status}</span>
                        </div>
                    ))}
                    
                    <button onClick={() => window.open('https://catbox.moe', '_blank')} className="bg-zinc-900 border border-white/5 p-5 rounded-3xl flex items-center justify-between hover:border-white/20 hover:bg-white/5 transition text-left group">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                                <CatIcon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h4 className="text-white font-medium group-hover:text-white transition">Catbox.moe</h4>
                                <p className="text-xs text-zinc-500 mt-1">Upload images to generate permanent public links</p>
                            </div>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-white/10 text-white">Open</span>
                    </button>
                </div>
            </motion.div>
        )}
      </main>

                             {/* Floating Bottom Navigation */}
      {cardGameMode !== 'playing' && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[5000] w-[320px]">
              <div className="bg-black/80 backdrop-blur-2xl border border-white/10 rounded-full p-2 flex items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                  {[
                      { id: 'home', icon: LayoutGrid, label: 'Sections' },
                      { id: 'profiles', icon: User, label: 'Profiles' },
                      { id: 'arcade', icon: Gamepad2, label: 'Arcade' },
                      { id: 'extra', icon: ShieldAlert, label: 'Vault' }
                  ].map((tab) => (
                      <button 
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className="relative px-6 py-4 rounded-full transition-all duration-300"
                      >
                          {activeTab === tab.id && (
                              <motion.div 
                                layoutId="nav-bg"
                                className="absolute inset-0 bg-white/5 rounded-full"
                                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                              />
                          )}
                          <tab.icon className={`w-6 h-6 relative z-10 transition-colors duration-300 ${activeTab === tab.id ? 'text-cyan-400' : 'text-zinc-500'}`} />
                          {activeTab === tab.id && (
                              <motion.div 
                                layoutId="nav-dot"
                                className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-cyan-400 rounded-full"
                              />
                          )}
                      </button>
                  ))}
              </div>
          </div>
      )}

      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
      <input type="file" ref={profileImageInputRef} onChange={handleProfileImageChange} className="hidden" accept="image/*" />
      <input type="file" ref={cardBuilderInputRef} onChange={handleAddCardFileChange} className="hidden" accept="image/*" />

      {/* --- Image Viewer Modal --- */}
      <AnimatePresence>
        {selectedImageInfo && (
          <motion.div 
            key="image-viewer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[8000] flex items-center justify-center bg-black/95 backdrop-blur-2xl"
          >
             {/* Background Click to Close */}
             <div className="absolute inset-0" onClick={closeModal} />
             
             {/* Close Button */}
             <button 
                onClick={closeModal} 
                className="absolute top-6 right-6 z-[8010] w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white backdrop-blur-md border border-white/20 transition-all shadow-xl"
             >
                <X className="w-6 h-6" />
             </button>

             {/* Modal Container */}
             <div className="relative z-10 w-full h-full flex flex-col lg:flex-row pointer-events-none p-4 pt-16 lg:pt-10 lg:p-10 gap-4 lg:gap-6">
                
                {/* Left Side: Image Viewer */}
                <motion.div 
                   initial={{ scale: 0.9, opacity: 0 }}
                   animate={{ scale: 1, opacity: 1 }}
                   exit={{ scale: 0.9, opacity: 0 }}
                   transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                   className="w-full h-[45vh] lg:h-auto lg:flex-1 flex-shrink-0 relative flex items-center justify-center pointer-events-auto bg-black/40 border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
                >
                    <div className="absolute inset-0 w-full h-full rounded-3xl overflow-hidden cursor-move">
                        <TransformWrapper
                            ref={transformRef}
                            initialScale={1}
                            minScale={0.5}
                            maxScale={10}
                            centerOnInit
                            limitToBounds={false}
                            smooth={true}
                            doubleClick={{ disabled: true }}
                            panning={{ lockAxisX: false, lockAxisY: false }}
                            wheel={{ step: 0.1, smoothStep: 0.005 }}
                        >
                            {({ zoomIn, zoomOut, resetTransform }) => (
                                <React.Fragment>
                                    <div className="absolute top-4 left-4 z-50 flex gap-2">
                                        <button type="button" onClick={(e) => { e.stopPropagation(); zoomIn(0.5); }} className="w-10 h-10 bg-black/60 border border-white/10 text-white rounded-full flex items-center justify-center hover:bg-white/20 transition backdrop-blur-md">
                                            <ZoomIn className="w-4 h-4"/>
                                        </button>
                                        <button type="button" onClick={(e) => { e.stopPropagation(); zoomOut(0.5); }} className="w-10 h-10 bg-black/60 border border-white/10 text-white rounded-full flex items-center justify-center hover:bg-white/20 transition backdrop-blur-md">
                                            <ZoomOut className="w-4 h-4"/>
                                        </button>
                                        <button type="button" onClick={(e) => { e.stopPropagation(); resetTransform(); }} className="w-10 h-10 bg-black/60 border border-white/10 text-white rounded-full flex items-center justify-center hover:bg-white/20 transition backdrop-blur-md">
                                            <Expand className="w-4 h-4"/>
                                        </button>
                                    </div>
                                    <TransformComponent wrapperStyle={{ width: "100%", height: "100%", willChange: "transform" }} contentStyle={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", willChange: "transform" }}>
                                        <div 
                                          className={`relative w-full h-full flex items-center justify-center ${isEditingPoints ? 'cursor-crosshair' : ''}`}
                                          onMouseMove={handleModalImageMouseMove}
                                          onMouseUp={handlePointDragEnd}
                                          onMouseLeave={handlePointDragEnd}
                                          onClick={handleImageInteraction}
                                        >
                                            <img 
                                               ref={modalImageRef}
                                               src={selectedImageInfo.image.src}
                                               alt="Fullscreen view"
                                               className="max-w-full max-h-full object-contain p-2 lg:p-4 drop-shadow-2xl select-none"
                                               style={{ willChange: 'transform', transform: 'translateZ(0)' }}
                                               draggable={false}
                                            />
                                            {/* Feature Anchor Points */}
                                            {(isEditingPoints ? tempTags : (selectedImageInfo.image.featureTags || [])).map(tag => (
                                                <div 
                                                    key={tag.id}
                                                    id={`feature-${tag.id}`}
                                                    className={`absolute flex flex-col items-center -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-all ${isEditingPoints ? 'pointer-events-auto' : 'pointer-events-none opacity-0'}`}
                                                    style={{ 
                                                        left: `${tag.point?.x}%`, 
                                                        top: `${tag.point?.y}%`,
                                                        zIndex: activeTagId === tag.id ? 50 : 40
                                                    }}
                                                >
                                                    {/* Professional Visual Point (only visible when editing) */}
                                                    {isEditingPoints && (
                                                        <div 
                                                            className={`relative flex items-center justify-center transition-all duration-300 ${
                                                                activeTagId === tag.id || hoveredTagId === tag.id ? 'scale-110' : 'scale-100'
                                                            } ${isDraggingPoint && activeTagId === tag.id ? 'scale-125' : ''}`}
                                                            onMouseDown={(e) => handlePointDragStart(e, tag.id)}
                                                        >
                                                            {/* Active Ring */}
                                                            <div className={`absolute -inset-2 rounded-full border border-cyan-400/30 transition-all duration-500 ${
                                                                activeTagId === tag.id ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
                                                            }`} />

                                                            {/* Main Point Body */}
                                                            <div 
                                                                className={`w-3.5 h-3.5 rounded-full border border-white/50 flex items-center justify-center transition-all shadow-lg ${
                                                                    activeTagId === tag.id ? 'bg-cyan-400 border-white shadow-cyan-500/50' : 
                                                                    hoveredTagId === tag.id ? 'bg-zinc-200' : 'bg-white'
                                                                } cursor-move`}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setActiveTagId(tag.id);
                                                                }}
                                                            >
                                                                <div className={`w-1 h-1 rounded-full ${activeTagId === tag.id || hoveredTagId === tag.id ? 'bg-black' : 'bg-zinc-400'}`} />
                                                            </div>

                                                            {/* Professional Label Tooltip */}
                                                            <div className={`absolute top-full mt-2 pointer-events-none transition-all duration-300 ${
                                                                activeTagId === tag.id || hoveredTagId === tag.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'
                                                            }`}>
                                                                <div className="bg-black/90 backdrop-blur-xl text-white px-2 py-0.5 rounded border border-white/10 text-[9px] font-bold whitespace-nowrap shadow-2xl">
                                                                    {tag.label}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </TransformComponent>
                                </React.Fragment>
                            )}
                        </TransformWrapper>
                    </div>

                    {/* Navigation Arrows */}
                    <div className="absolute inset-y-0 w-full flex items-center justify-between px-2 lg:px-4 pointer-events-none">
                       <button 
                          onClick={(e) => {
                             e.stopPropagation();
                             const newIdx = selectedImageInfo.index - 1;
                             const collection = selectedImageInfo.profileId 
                               ? profiles.find(p => p.id === selectedImageInfo.profileId)
                               : sections.find(s => s.id === selectedImageInfo.sectionId);
                             if(collection && collection.images && collection.images[newIdx]) setSelectedImageInfo({ ...selectedImageInfo, image: collection.images[newIdx], index: newIdx });
                          }}
                          disabled={selectedImageInfo.index === 0}
                          className="w-10 h-10 lg:w-12 lg:h-12 rounded-full border border-white/20 bg-black/60 text-white flex items-center justify-center hover:bg-white/20 disabled:opacity-0 disabled:pointer-events-none backdrop-blur-md transition-all pointer-events-auto"
                       >
                          <ChevronLeft className="w-5 h-5 lg:w-6 lg:h-6" />
                       </button>
                       <button 
                          onClick={(e) => {
                             e.stopPropagation();
                             const newIdx = selectedImageInfo.index + 1;
                             const collection = selectedImageInfo.profileId 
                               ? profiles.find(p => p.id === selectedImageInfo.profileId)
                               : sections.find(s => s.id === selectedImageInfo.sectionId);
                             if(collection && collection.images && collection.images[newIdx]) setSelectedImageInfo({ ...selectedImageInfo, image: collection.images[newIdx], index: newIdx });
                          }}
                          disabled={(() => {
                             const collection = (selectedImageInfo.profileId ? profiles.find(p=>p.id===selectedImageInfo.profileId) : sections.find(s=>s.id===selectedImageInfo.sectionId));
                             return (collection?.images?.length || 0) <= selectedImageInfo.index + 1;
                          })()}
                          className="w-10 h-10 lg:w-12 lg:h-12 rounded-full border border-white/20 bg-black/60 text-white flex items-center justify-center hover:bg-white/20 disabled:opacity-0 disabled:pointer-events-none backdrop-blur-md transition-all pointer-events-auto"
                       >
                          <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6" />
                       </button>
                    </div>

                    {hearts.filter(h => !h.side).map(h => (
                       <motion.div key={h.id} initial={{scale:0, opacity:1}} animate={{scale:3, opacity:0}} transition={{duration:1}} className="absolute text-pink-500 pointer-events-none z-50">
                           <Heart className="w-24 h-24 lg:w-32 lg:h-32 fill-pink-500" />
                       </motion.div>
                    ))}
                </motion.div>

                {/* Right Side: Data Panel */}
                <motion.div 
                   initial={{ x: 50, opacity: 0 }}
                   animate={{ x: 0, opacity: 1 }}
                   exit={{ x: 50, opacity: 0 }}
                   transition={{ delay: 0.1, type: 'spring', damping: 25 }}
                   className="w-full lg:w-[450px] flex-1 min-h-0 bg-zinc-900/80 backdrop-blur-2xl border border-white/10 rounded-3xl pointer-events-auto flex flex-col overflow-hidden shadow-2xl"
                >
                    <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-8 custom-scroll">
                        {/* Actions */}
                        <div className="flex justify-center gap-4">
                            <button onClick={()=>setIsFullScreenImage(true)} className="group flex-1 py-4 rounded-2xl border border-white/10 bg-white/5 hover:border-cyan-400 hover:bg-cyan-400/10 flex flex-col items-center justify-center gap-2 transition">
                                <Expand className="w-6 h-6 text-zinc-400 group-hover:text-cyan-400" />
                                <span className="text-[10px] uppercase font-bold text-zinc-500 group-hover:text-cyan-400 tracking-wider">Full Screen</span>
                            </button>
                            <button onClick={handleHeartClick} className="group flex-1 py-4 rounded-2xl border border-white/10 bg-white/5 hover:border-pink-500 hover:bg-pink-500/10 flex flex-col items-center justify-center gap-2 transition">
                                <Heart className="w-6 h-6 text-zinc-400 group-hover:text-pink-500" />
                                <span className="text-[10px] uppercase font-bold text-zinc-500 group-hover:text-pink-500 tracking-wider">Love</span>
                            </button>
                        </div>
                        
                        {/* Rating */}
                        <div className="bg-white/5 border border-white/5 p-5 rounded-2xl">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-xs uppercase tracking-[0.2em] text-zinc-400 font-bold">Rating</h3>
                                <div className="px-2 py-0.5 rounded backdrop-blur-md bg-white/10 text-white font-mono text-xs">{selectedImageInfo.image.rating}/5</div>
                            </div>
                            <div className="flex items-center gap-1">
                                {[1,2,3,4,5].map(v => (
                                    <button key={v} onClick={() => handleRatingChange(v)} className="p-1.5 transition hover:scale-125 focus:outline-none">
                                        <Star className={`w-7 h-7 ${selectedImageInfo.image.rating >= v ? 'fill-cyan-400 text-cyan-400 drop-shadow-[0_0_8px_rgba(3,218,198,0.5)]' : 'text-zinc-700 hover:text-zinc-400'}`} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Features Tags */}
                        <div className="bg-white/5 border border-white/5 p-5 rounded-2xl">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xs uppercase tracking-[0.2em] text-zinc-400 font-bold flex items-center gap-2">
                                    <Crosshair className="w-4 h-4" /> Features Management
                                </h3>
                                <div className="flex gap-2">
                                    {!isEditingPoints ? (
                                        <button 
                                          onClick={startEditingPoints}
                                          className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white text-[10px] font-bold uppercase tracking-wider hover:bg-white/10 transition"
                                        >
                                            Manual Adjust
                                        </button>
                                    ) : (
                                        <div className="flex gap-2">
                                            <button 
                                              onClick={() => { setIsEditingPoints(false); setActiveTagId(null); }}
                                              className="px-3 py-1.5 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 text-[10px] font-bold uppercase tracking-wider hover:bg-red-500/30 transition"
                                            >
                                                Cancel
                                            </button>
                                            <button 
                                              onClick={saveEditedPoints}
                                              className="px-3 py-1.5 rounded-full bg-cyan-500 text-black text-[10px] font-bold uppercase tracking-wider hover:bg-cyan-400 transition"
                                            >
                                                Save Points
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-2 mb-6">
                                {(isEditingPoints ? tempTags : (selectedImageInfo.image.featureTags || [])).map((tag, idx) => (
                                    <motion.div
                                      key={tag.id}
                                      initial={{ scale: 0, opacity: 0 }}
                                      animate={{ scale: 1, opacity: 1 }}
                                      transition={{ delay: idx * 0.05 }}
                                      className="relative"
                                    >
                                        <div 
                                          onMouseEnter={() => setHoveredTagId(tag.id)}
                                          onMouseLeave={() => setHoveredTagId(null)}
                                          onClick={() => handleTagClick(tag.id)}
                                          className={`px-4 py-2 rounded-full border transition flex items-center gap-2 whitespace-nowrap cursor-pointer
                                            ${activeTagId === tag.id 
                                                ? 'bg-cyan-400 border-white text-black shadow-[0_0_15px_rgba(34,211,238,0.4)]' 
                                                : 'border-white/10 bg-black/40 hover:bg-white/10 hover:border-cyan-400 text-zinc-300'
                                            } text-sm font-medium tracking-wide`}
                                        >
                                            {editingLabelId === tag.id ? (
                                                <input 
                                                  autoFocus
                                                  defaultValue={tag.label}
                                                  onBlur={(e) => {
                                                      renameTag(tag.id, e.target.value);
                                                      setEditingLabelId(null);
                                                  }}
                                                  onKeyDown={(e) => {
                                                      if (e.key === 'Enter') {
                                                          renameTag(tag.id, e.currentTarget.value);
                                                          setEditingLabelId(null);
                                                      }
                                                  }}
                                                  className="bg-transparent border-none outline-none text-black w-24 font-bold placeholder:text-black/50"
                                                  onClick={e => e.stopPropagation()}
                                                />
                                            ) : (
                                                <>
                                                    <span className={activeTagId === tag.id ? "font-bold" : ""}>{tag.label}</span>
                                                    {isEditingPoints && activeTagId === tag.id && (
                                                        <div className="flex items-center gap-1 ml-1 pl-2 border-l border-black/20">
                                                            <button 
                                                                onClick={(e) => { e.stopPropagation(); setEditingLabelId(tag.id); }}
                                                                className="p-1 hover:bg-black/10 rounded-full transition-colors"
                                                                title="Rename Tag"
                                                            >
                                                                <Edit2 className="w-3.5 h-3.5" />
                                                            </button>
                                                            <button 
                                                                onClick={(e) => { e.stopPropagation(); deleteTag(tag.id); }}
                                                                className="p-1 hover:bg-rose-500 hover:text-white rounded-full transition-colors"
                                                                title="Delete Tag"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                                
                                {(!selectedImageInfo.image.featureTags || selectedImageInfo.image.featureTags.length === 0) && !isEditingPoints && (
                                    <div className="w-full py-6 text-center text-zinc-600 border border-dashed border-white/5 rounded-2xl">
                                        <p className="text-xs uppercase font-bold tracking-widest">No Features Tagged</p>
                                    </div>
                                )}
                            </div>

                            {/* Zoom Setting Controls - Only visible during manual edit mode */}
                            <AnimatePresence>
                                {isEditingPoints && (
                                    <motion.div 
                                        initial={{ height: 0, opacity: 0, scale: 0.95, translateY: 10 }}
                                        animate={{ height: 'auto', opacity: 1, scale: 1, translateY: 0, marginTop: 24 }}
                                        exit={{ height: 0, opacity: 0, scale: 0.95, translateY: 10, marginTop: 0 }}
                                        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                                        className="overflow-hidden"
                                    >
                                        <div className="bg-black/40 border border-white/10 rounded-2xl p-4 mb-6">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <ZoomIn className="w-3.5 h-3.5 text-cyan-400" />
                                                    <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                                                        {activeTagId ? `Zoom: ${tempTags.find(t=>t.id===activeTagId)?.label}` : "Default Auto-Zoom"}
                                                    </span>
                                                </div>
                                                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded-full border border-cyan-400/20">
                                                    {activeTagId ? tempTags.find(t=>t.id===activeTagId)?.zoomIntensity || 4 : labelZoomIntensity}x
                                                </span>
                                            </div>
                                            <input 
                                                type="range" 
                                                min="1" 
                                                max="12" 
                                                step="0.5" 
                                                value={activeTagId ? tempTags.find(t=>t.id===activeTagId)?.zoomIntensity || 4 : labelZoomIntensity}
                                                onChange={(e) => {
                                                    const val = parseFloat(e.target.value);
                                                    if (activeTagId) {
                                                        setTempTags(prev => prev.map(t => t.id === activeTagId ? { ...t, zoomIntensity: val } : t));
                                                    } else {
                                                        setLabelZoomIntensity(val);
                                                    }
                                                }}
                                                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                                            />
                                            <div className="flex justify-between mt-1 text-[8px] text-zinc-500 font-bold uppercase tracking-widest">
                                                <span>Wide</span>
                                                <span>Focused</span>
                                                <span>Extreme</span>
                                            </div>
                                            {activeTagId && (
                                                <p className="mt-3 text-[9px] text-zinc-500 font-medium italic">
                                                    Adjusting zoom specifically for <span className="text-cyan-400 font-bold">{tempTags.find(t=>t.id===activeTagId)?.label}</span>
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex flex-col gap-4">
                                            <div className="flex gap-2">
                                                <input 
                                                    value={newTagLabel}
                                                    onChange={e => setNewTagLabel(e.target.value)}
                                                    placeholder="Label (e.g. Legs🦵)"
                                                    className="flex-1 bg-black/50 border border-white/10 px-3 py-2 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                                                />
                                                <button 
                                                    onClick={addNewTag}
                                                    disabled={!newTagLabel.trim()}
                                                    className="px-3 py-2 rounded-xl bg-cyan-400/20 text-cyan-400 text-xs font-bold whitespace-nowrap hover:bg-cyan-400/30 disabled:opacity-50 transition"
                                                >
                                                    + Add New
                                                </button>
                                            </div>
                                            <div className="p-4 rounded-xl bg-cyan-400/10 border border-cyan-400/20">
                                                <p className="text-xs text-cyan-300/80 leading-relaxed">
                                                    <span className="font-bold text-cyan-400">EDIT MODE:</span> Select a label above, then click anywhere on the image to set its precise location. Click "Save Points" when finished.
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Comments */}
                        <div className="flex flex-col h-full min-h-[300px]">
                            <h3 className="text-xs uppercase tracking-[0.2em] text-zinc-500 font-bold mb-4 flex items-center gap-2">
                                <MessageCircle className="w-4 h-4" /> Log & Notes
                            </h3>
                            <div className="flex-1 space-y-3 mb-6 overflow-y-auto pr-2 pb-14">
                                {(selectedImageInfo.image.comments || []).map(c => (
                                    <div key={c.id} className="bg-white/5 p-4 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                                        <div className="flex items-center justify-between mb-2">
                                           <span className="text-xs text-cyan-400 font-bold">{c.author}</span>
                                           <span className="text-[10px] text-zinc-600 font-mono tracking-wider">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <p className="text-sm text-zinc-200 leading-relaxed font-light">{c.text}</p>
                                    </div>
                                ))}
                                {(!selectedImageInfo.image.comments || selectedImageInfo.image.comments.length === 0) && (
                                    <div className="text-center text-zinc-600 py-10 text-sm italic font-light">No notes yet. Be the first to add one.</div>
                                )}
                            </div>
                            
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                if(!newComment.trim()) return;
                                const c: Comment = { id: uuidv4(), author: 'Me', text: newComment };
                                if (selectedImageInfo.profileId) {
                                  setProfiles(prev => prev.map(p => p.id === selectedImageInfo.profileId ? { ...p, images: p.images.map(img => img.id === selectedImageInfo.image.id ? { ...img, comments: [...(img.comments||[]), c] } : img) } : p));
                                } else if (selectedImageInfo.sectionId) {
                                  setSections(prev => prev.map(s => s.id === selectedImageInfo.sectionId ? { ...s, images: s.images.map(img => img.id === selectedImageInfo.image.id ? { ...img, comments: [...(img.comments||[]), c] } : img) } : s));
                                }
                                setSelectedImageInfo(prevInfo => prevInfo ? { ...prevInfo, image: { ...prevInfo.image, comments: [...(prevInfo.image.comments||[]), c] } } : null);
                                setNewComment('');
                            }} className="mt-auto flex gap-2 pt-4 border-t border-white/10 sticky bottom-0 bg-zinc-900/80 backdrop-blur-xl">
                                <input placeholder="Add insight..." value={newComment} onChange={e=>setNewComment(e.target.value)} className="flex-1 bg-black/40 border border-white/10 px-4 py-3 rounded-full text-sm focus:outline-none focus:border-cyan-400 transition text-white" />
                                <button type="submit" disabled={!newComment.trim()} className="w-12 h-12 rounded-full bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 disabled:bg-zinc-700 text-black flex items-center justify-center transition shadow-lg">
                                    <MessageCircle className="w-5 h-5" />
                                </button>
                            </form>

                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setImageToDelete({
                                        sectionId: selectedImageInfo.sectionId,
                                        profileId: selectedImageInfo.profileId,
                                        imageId: selectedImageInfo.image.id,
                                        alt: selectedImageInfo.image.alt
                                    });
                                }}
                                className="w-full mt-6 py-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 font-bold uppercase tracking-widest text-[10px] hover:bg-red-500 hover:text-white transition group flex items-center justify-center gap-2"
                            >
                                <Trash2 className="w-4 h-4" />
                                Delete Item from Vault
                            </button>
                        </div>
                    </div>
                </motion.div>
             </div>
          </motion.div>
        )}
        
        {selectedImageInfo && isFullScreenImage && (
          <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="fixed inset-0 z-[10000] bg-black text-white pointer-events-auto"
          >
              <button
                 onClick={() => setIsFullScreenImage(false)}
                 className="absolute top-6 left-6 z-[10010] w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white backdrop-blur-md border border-white/20 transition-all shadow-xl"
              >
                 <ChevronLeft className="w-6 h-6" />
              </button>

              <div className="absolute inset-0 w-full h-full">
                  <TransformWrapper
                      initialScale={1}
                      minScale={0.1}
                      maxScale={20}
                      centerOnInit
                      limitToBounds={false}
                      smooth={true}
                      wheel={{ step: 0.1, smoothStep: 0.005 }}
                      doubleClick={{ disabled: false, step: 2 }}
                  >
                      <TransformComponent 
                          wrapperStyle={{ width: '100%', height: '100%' }} 
                          contentStyle={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', willChange: 'transform' }}
                      >
                          <img 
                              src={selectedImageInfo.image.src}
                              alt={selectedImageInfo.image.alt}
                              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', transform: 'translateZ(0)', willChange: 'transform' }}
                              draggable={false}
                          />
                      </TransformComponent>
                  </TransformWrapper>
              </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Global Modals --- */}
      <AnimatePresence>
        {(activeAddImageProfileId || activeAddImageSectionId) && (
            <motion.div key="add-image-modal" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[9000] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
                <motion.div initial={{scale:0.95, y:20}} animate={{scale:1, y:0}} exit={{scale:0.95, y:20}} className="bg-zinc-900 border border-white/10 p-8 rounded-3xl w-full max-w-md shadow-2xl relative">
                    <button onClick={() => { setActiveAddImageProfileId(null); setActiveAddImageSectionId(null); }} className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-full hover:bg-white/10 transition">
                        <X className="w-5 h-5"/>
                    </button>
                    <h2 className="text-2xl font-bold text-white mb-6">Add Image</h2>
                    
                    <div className="flex flex-col gap-6">
                       <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-4 p-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-cyan-400/50 transition group">
                           <div className="w-12 h-12 rounded-full bg-cyan-400/20 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition shrink-0">
                               <Upload className="w-6 h-6"/>
                           </div>
                           <div className="text-left">
                               <h3 className="text-white font-medium">Upload from Device</h3>
                               <p className="text-zinc-400 text-sm">Select a file from your local storage</p>
                           </div>
                       </button>

                       <button onClick={() => {
                           setShowDriveImport(true);
                           const token = sessionStorage.getItem('google_access_token');
                           if (token) fetchDriveImages(token);
                       }} className="flex items-center gap-4 p-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-green-400/50 transition group">
                           <div className="w-12 h-12 rounded-full bg-green-400/20 text-green-400 flex items-center justify-center group-hover:scale-110 transition shrink-0">
                               <Cloud className="w-6 h-6"/>
                           </div>
                           <div className="text-left">
                               <h3 className="text-white font-medium">Import from Drive</h3>
                               <p className="text-zinc-400 text-sm">Sign in to fetch Drive images</p>
                           </div>
                       </button>

                       <div className="relative flex items-center justify-center">
                          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                          <div className="relative px-4 bg-zinc-900 text-zinc-500 text-sm">OR</div>
                       </div>

                       <form onSubmit={handleAddLinkImage} className="flex flex-col gap-3">
                           <div className="flex items-center gap-3">
                               <div className="w-12 h-12 rounded-full bg-pink-500/20 text-pink-500 flex items-center justify-center shrink-0">
                                   <LinkIcon className="w-6 h-6"/>
                               </div>
                               <input 
                                  value={newImageUrl} 
                                  onChange={e=>setNewImageUrl(e.target.value)} 
                                  placeholder="Paste image link (Catbox, Drive, etc.)" 
                                  className="w-full bg-black/50 border border-white/10 px-4 py-3 rounded-xl text-white focus:outline-none focus:border-pink-500 transition" 
                               />
                           </div>
                           <button type="submit" disabled={!newImageUrl.trim()} className="w-full py-3 mt-2 rounded-xl bg-white text-black font-semibold hover:bg-pink-500 hover:text-white disabled:opacity-50 transition">Add from URL</button>
                       </form>
                        <div className="pt-4 mt-2 border-t border-white/10">
                           <button onClick={() => window.open('https://catbox.moe', '_blank')} className="w-full flex items-center gap-4 p-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/30 transition group">
                               <div className="w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center group-hover:scale-110 transition shrink-0">
                                   <CatIcon className="w-6 h-6"/>
                               </div>
                               <div className="text-left">
                                   <h3 className="text-white font-medium">Get Catbox Link</h3>
                                   <p className="text-zinc-400 text-sm">Upload to Catbox.moe for a permanent URL</p>
                               </div>
                           </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        )}
        {isAddingCard && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[9000] bg-black/95 backdrop-blur-xl mb-12 flex items-center justify-center p-4">
                <motion.div initial={{scale:0.95, y:20}} animate={{scale:1, y:0}} exit={{scale:0.95, y:20}} className="bg-zinc-900 border border-white/10 p-8 rounded-[40px] w-full max-w-4xl shadow-2xl relative max-h-[90vh] overflow-y-auto">
                    <button onClick={() => { setIsAddingCard(false); setEditingCardId(null); }} className="absolute top-6 right-6 p-2 text-zinc-400 hover:text-white rounded-full hover:bg-white/10 transition">
                        <X className="w-5 h-5"/>
                    </button>
                    <h2 className="text-3xl font-lobster text-white mb-8 text-center italic tracking-widest leading-none">{editingCardId ? 'Reshape Your Card' : 'Forge New Card'}</h2>

                    <form onSubmit={handleAddCard} className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Image Side */}
                        <div className="space-y-6">
                            <div 
                                onClick={() => cardBuilderInputRef.current?.click()}
                                className="aspect-[2.5/3.5] rounded-[32px] bg-black border-2 border-dashed border-white/10 overflow-hidden cursor-pointer group relative flex flex-col items-center justify-center transition-all hover:border-indigo-500/50"
                            >
                                {newCardImage ? (
                                    <img src={newCardImage} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                    <div className="flex flex-col items-center text-zinc-600 group-hover:text-indigo-400 transition">
                                        <Plus className="w-10 h-10 mb-2" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Card Artwork</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Image Source URL</label>
                                <input 
                                    type="text" 
                                    value={newCardImage}
                                    onChange={(e) => setNewCardImage(e.target.value)}
                                    placeholder="Paste Link..."
                                    className="w-full bg-black/40 border border-white/10 py-3.5 px-5 rounded-2xl text-white text-sm focus:outline-none focus:border-indigo-500 transition"
                                />
                            </div>
                        </div>

                        {/* Details Side */}
                        <div className="space-y-6">
                            {/* Role Selection */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Role Identity</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['Queen', 'Baddie', 'Certified Rand', 'Bitch', 'Horny', 'Beauty'].map(role => (
                                        <button
                                            key={role}
                                            type="button"
                                            onClick={() => setNewCardRole(role as CardRole)}
                                            className={`py-2 rounded-xl text-[9px] font-black uppercase tracking-tight transition-all border ${newCardRole === role ? 'bg-indigo-500 border-indigo-400 text-white shadow-lg shadow-indigo-500/20' : 'bg-black/40 border-white/5 text-zinc-500 hover:border-white/20'}`}
                                        >
                                            {role}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Special Ability Selection */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Special Ability</label>
                                <div className="flex flex-wrap gap-2">
                                    {['None', 'Jerk', 'Tight pussy', 'Blackhole', 'Milfy', 'Pure pink', 'Fluffy'].map(ability => (
                                        <button
                                            key={ability}
                                            type="button"
                                            onClick={() => setNewCardSpecialAbility(ability as SpecialAbility)}
                                            className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all border ${newCardSpecialAbility === ability ? 'bg-cyan-500 border-cyan-400 text-black' : 'bg-black/40 border-white/5 text-zinc-500 hover:border-white/10'}`}
                                        >
                                            {ability}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Ratings */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Power Level (10)</label>
                                    <div className="flex items-center gap-3 bg-black/40 p-3 rounded-2xl border border-white/5">
                                        <input 
                                            type="range" min="0" max="10" step="1"
                                            value={newCardRating10}
                                            onChange={(e) => setNewCardRating10(parseInt(e.target.value) || 0)}
                                            className="accent-indigo-500 w-full"
                                        />
                                        <span className="text-white font-bold text-xs min-w-4">{newCardRating10}</span>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Star Tier (5)</label>
                                    <div className="flex items-center justify-between gap-1 bg-black/40 p-3 rounded-2xl border border-white/5 h-[46px]">
                                        {[1, 2, 3, 4, 5].map(s => (
                                            <button key={s} type="button" onClick={() => setNewCardStarRating5(s)} className="group/star">
                                                <Star className={`w-3.5 h-3.5 transition-colors ${newCardStarRating5 >= s ? 'fill-yellow-400 text-yellow-400' : 'text-zinc-700'}`} />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Price */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Commercial Price</label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <input 
                                            type="number"
                                            value={newCardPrice}
                                            onChange={(e) => setNewCardPrice(parseInt(e.target.value) || 0)}
                                            className="w-full bg-black/40 border border-white/10 py-3 px-10 rounded-2xl text-white text-md font-bold focus:outline-none focus:border-indigo-500 transition"
                                        />
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2">
                                            {newCardCurrency === 'INR' ? <span className="text-zinc-500 font-bold">₹</span> : <span className="text-zinc-500 font-bold">$</span>}
                                        </div>
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={() => setNewCardCurrency(prev => prev === 'INR' ? 'USD' : 'INR')}
                                        className="px-4 bg-zinc-800 rounded-2xl text-[10px] font-black text-white hover:bg-zinc-700 transition border border-white/5"
                                    >
                                        {newCardCurrency}
                                    </button>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                {editingCardId && (
                                    <button 
                                        type="button"
                                        onClick={() => {
                                            setDecks(prev => prev.map(d => d.id === activeDeckId ? { ...d, cards: d.cards.filter(c => c.id !== editingCardId) } : d));
                                            setIsAddingCard(false);
                                            setEditingCardId(null);
                                        }}
                                        className="flex-1 py-4 rounded-2xl bg-red-500/10 text-red-500 border border-red-500/20 font-black uppercase tracking-widest text-[10px] hover:bg-red-500/20 transition"
                                    >
                                        Discard Card
                                    </button>
                                )}
                                <button 
                                    type="submit" 
                                    disabled={!newCardImage}
                                    className="flex-[2] py-4 rounded-2xl bg-indigo-500 text-white font-black uppercase tracking-[0.2em] text-[10px] hover:bg-indigo-400 disabled:opacity-50 transition shadow-xl shadow-indigo-500/20"
                                >
                                    {editingCardId ? 'Save Changes' : 'Forge Card'}
                                </button>
                            </div>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        )}
        {isAddingSection && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[9000] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
                <motion.div initial={{scale:0.95, y:20}} animate={{scale:1, y:0}} exit={{scale:0.95, y:20}} className="bg-zinc-900 border border-white/10 p-8 rounded-3xl w-full max-w-sm shadow-2xl">
                    <h2 className="text-2xl font-bold text-white mb-6">New Section</h2>
                    <form onSubmit={handleCreateSection}>
                        <input autoFocus value={newSectionName} onChange={e=>setNewSectionName(e.target.value)} placeholder="Type name..." className="w-full bg-black/50 border border-white/10 px-4 py-3 rounded-xl mb-6 text-white focus:outline-none focus:border-cyan-400" />
                        <div className="flex justify-end gap-3">
                            <button type="button" onClick={()=>setIsAddingSection(false)} className="px-5 py-2.5 rounded-full text-zinc-400 hover:text-white transition">Cancel</button>
                            <button type="submit" disabled={!newSectionName.trim()} className="px-6 py-2.5 rounded-full bg-white text-black font-semibold hover:bg-cyan-400 disabled:opacity-50 transition">Create</button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        )}
        
        {sectionToEdit && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[9000] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
                <motion.div initial={{scale:0.95, y:20}} animate={{scale:1, y:0}} exit={{scale:0.95, y:20}} className="bg-zinc-900 border border-white/10 p-8 rounded-3xl w-full max-w-sm shadow-2xl">
                    <h2 className="text-2xl font-bold text-white mb-6">Edit Section</h2>
                    <form onSubmit={(e)=>{
                        e.preventDefault();
                        if(!editedSectionName.trim()) return;
                        setSections(prev => prev.map(s => s.id === sectionToEdit.id ? { ...s, name: editedSectionName, glow: editedGlow } : s));
                        setSectionToEdit(null);
                    }}>
                        <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-2">Name</label>
                        <input autoFocus value={editedSectionName} onChange={e=>setEditedSectionName(e.target.value)} className="w-full bg-black/50 border border-white/10 px-4 py-3 rounded-xl mb-6 text-white focus:outline-none focus:border-cyan-400" />
                        
                        <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3">Aura Color</label>
                        <div className="flex flex-wrap gap-3 mb-8">
                            {glowOptions.map(opt => (
                                <button key={opt.id} type="button" onClick={()=>setEditedGlow(opt.id)} className={`w-8 h-8 rounded-full border-2 transition-all ${editedGlow === opt.id ? 'border-white scale-125' : 'border-transparent'}`} style={{backgroundColor: opt.color}} />
                            ))}
                        </div>

                        <div className="flex justify-end gap-3">
                            <button type="button" onClick={()=>setSectionToEdit(null)} className="px-5 py-2.5 rounded-full text-zinc-400 hover:text-white transition">Cancel</button>
                            <button type="submit" disabled={!editedSectionName.trim()} className="px-6 py-2.5 rounded-full bg-white text-black font-semibold hover:bg-cyan-400 disabled:opacity-50 transition">Save</button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        )}
        {isAddingProfile && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[9000] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
                <motion.div initial={{scale:0.95, y:20}} animate={{scale:1, y:0}} exit={{scale:0.95, y:20}} className="bg-zinc-900 border border-white/10 p-8 rounded-3xl w-full max-w-sm shadow-2xl">
                    <h2 className="text-2xl font-bold text-white mb-6">New Profile</h2>
                    <form onSubmit={handleCreateProfile}>
                        <div className="flex flex-col items-center mb-6">
                            <div 
                              onClick={() => profileImageInputRef.current?.click()}
                              className="w-24 h-24 rounded-full bg-zinc-800 border border-white/10 overflow-hidden cursor-pointer group relative mb-2"
                            >
                                {newProfileImage ? (
                                    <img src={newProfileImage} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-zinc-500 group-hover:text-cyan-400 group-hover:bg-cyan-400/10 transition">
                                        <ImageIcon className="w-8 h-8 mb-1" />
                                        <span className="text-[10px] uppercase font-bold">Upload</span>
                                    </div>
                                )}
                            </div>
                            <span className="text-xs text-zinc-500 uppercase font-bold tracking-tighter">Profile Picture (Optional)</span>
                        </div>
                        <input autoFocus value={newProfileName} onChange={e=>setNewProfileName(e.target.value)} placeholder="Profile name..." className="w-full bg-black/50 border border-white/10 px-4 py-3 rounded-xl mb-4 text-white focus:outline-none focus:border-cyan-400" />
                        
                        <div className="flex items-center justify-between mb-8 p-3 bg-white/5 rounded-2xl border border-white/5">
                            <div className="flex items-center gap-3">
                                <BadgeCheck className="w-5 h-5 text-cyan-400" />
                                <span className="text-xs font-bold text-white uppercase tracking-widest">Verify Badge</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => setNewProfileIsVerified(!newProfileIsVerified)}
                                className={`w-10 h-5 rounded-full transition-colors relative ${newProfileIsVerified ? 'bg-cyan-500' : 'bg-zinc-800'}`}
                            >
                                <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${newProfileIsVerified ? 'left-6' : 'left-1'}`} />
                            </button>
                        </div>

                        <div className="flex justify-end gap-3">
                            <button type="button" onClick={()=>setIsAddingProfile(false)} className="px-5 py-2.5 rounded-full text-zinc-400 hover:text-white transition">Cancel</button>
                            <button type="submit" disabled={!newProfileName.trim()} className="px-6 py-2.5 rounded-full bg-white text-black font-semibold hover:bg-cyan-400 disabled:opacity-50 transition">Create</button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        )}
        
        {profileToEdit && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[9000] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
                <motion.div initial={{scale:0.95, y:20}} animate={{scale:1, y:0}} exit={{scale:0.95, y:20}} className="bg-zinc-900 border border-white/10 p-8 rounded-3xl w-full max-w-sm shadow-2xl">
                    <h2 className="text-2xl font-bold text-white mb-6">Edit Profile</h2>
                    <form onSubmit={(e)=>{
                        e.preventDefault();
                        if(!editedProfileName.trim()) return;
                        setProfiles(prev => prev.map(p => p.id === profileToEdit.id ? { 
                            ...p, 
                            name: editedProfileName, 
                            profileImage: editedProfileImage, 
                            isVerified: editedProfileIsVerified,
                            glow: editedGlow 
                        } : p));
                        setProfileToEdit(null);
                    }}>
                        <div className="flex flex-col items-center mb-6">
                            <div 
                              onClick={() => profileImageInputRef.current?.click()}
                              className="w-24 h-24 rounded-full bg-zinc-800 border border-white/10 overflow-hidden cursor-pointer group relative mb-2"
                            >
                                {editedProfileImage ? (
                                    <img src={editedProfileImage} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-zinc-500 group-hover:text-cyan-400 group-hover:bg-cyan-400/10 transition">
                                        <ImageIcon className="w-8 h-8 mb-1" />
                                        <span className="text-[10px] uppercase font-bold">Change</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-2">Name</label>
                        <input autoFocus value={editedProfileName} onChange={e=>setEditedProfileName(e.target.value)} className="w-full bg-black/50 border border-white/10 px-4 py-3 rounded-xl mb-4 text-white focus:outline-none focus:border-cyan-400" />
                        
                        <div className="flex items-center justify-between mb-6 p-3 bg-white/5 rounded-2xl border border-white/5">
                            <div className="flex items-center gap-3">
                                <BadgeCheck className="w-5 h-5 text-cyan-400" />
                                <span className="text-xs font-bold text-white uppercase tracking-widest">Verified Badge</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => setEditedProfileIsVerified(!editedProfileIsVerified)}
                                className={`w-10 h-5 rounded-full transition-colors relative ${editedProfileIsVerified ? 'bg-cyan-500' : 'bg-zinc-800'}`}
                            >
                                <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${editedProfileIsVerified ? 'left-6' : 'left-1'}`} />
                            </button>
                        </div>

                        <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3">Aura Color</label>
                        <div className="flex flex-wrap gap-3 mb-8">
                            {glowOptions.map(opt => (
                                <button key={opt.id} type="button" onClick={()=>setEditedGlow(opt.id==='none'?undefined:opt.id)} className={`w-10 h-10 rounded-full border-2 transition-all ${editedGlow === opt.id || (!editedGlow && opt.id==='none') ? 'border-white scale-110' : 'border-transparent hover:border-white/30'}`} style={{backgroundColor: opt.color === 'transparent' ? '#222' : opt.color}} />
                            ))}
                        </div>

                        <div className="flex justify-end gap-3">
                            <button type="button" onClick={()=>setProfileToEdit(null)} className="px-5 py-2.5 rounded-full text-zinc-400 hover:text-white transition">Cancel</button>
                            <button type="submit" disabled={!editedProfileName.trim()} className="px-6 py-2.5 rounded-full bg-white text-black font-semibold hover:bg-cyan-400 disabled:opacity-50 transition">Save</button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        )}
        
        {(profileToDelete || sectionToDelete || imageToDelete) && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[9000] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
                <motion.div initial={{scale:0.95, y:20}} animate={{scale:1, y:0}} exit={{scale:0.95, y:20}} className="bg-zinc-900 border border-red-500/30 p-8 rounded-3xl w-full max-w-sm shadow-2xl text-center">
                    <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center mx-auto mb-6">
                        <ShieldAlert className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Delete Object?</h2>
                    <p className="text-zinc-400 mb-8 max-w-xs mx-auto">This action is permanent and cannot be undone.</p>
                    <div className="flex justify-center gap-3">
                        <button onClick={()=>{setProfileToDelete(null); setSectionToDelete(null); setImageToDelete(null);}} className="flex-1 px-5 py-3 rounded-full border border-white/10 text-white hover:bg-white/5 transition font-medium">Cancel</button>
                        <button onClick={()=>{
                            if(profileToDelete) {
                                setProfiles(p=>p.filter(pr=>pr.id!==profileToDelete.id)); setProfileToDelete(null);
                            } else if (sectionToDelete) {
                                setSections(s=>s.filter(sec=>sec.id!==sectionToDelete.id)); setSectionToDelete(null);
                            } else if (imageToDelete) {
                                if (imageToDelete.profileId) {
                                  setProfiles(p=>p.map(pr=>pr.id===imageToDelete.profileId ? {...pr, images: pr.images.filter(i=>i.id!==imageToDelete.imageId)} : pr));
                                } else if (imageToDelete.sectionId) {
                                  setSections(s=>s.map(sec=>sec.id===imageToDelete.sectionId ? {...sec, images: sec.images.filter(i=>i.id!==imageToDelete.imageId)} : sec));
                                }
                                if(selectedImageInfo?.image.id === imageToDelete.imageId) closeModal();
                                setImageToDelete(null);
                            }
                        }} className="flex-1 px-5 py-3 rounded-full bg-red-500 text-white font-medium hover:bg-red-400 transition">Delete</button>
                    </div>
                </motion.div>
            </motion.div>
        )}
        {showDriveImport && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[9000] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div initial={{scale:0.95, y:20}} animate={{scale:1, y:0}} exit={{scale:0.95, y:20}} className="bg-zinc-900 border border-white/10 p-6 md:p-8 rounded-3xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl relative">
              <button onClick={() => setShowDriveImport(false)} className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-full hover:bg-white/10 transition z-10">
                <X className="w-5 h-5"/>
              </button>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2"><Cloud className="w-6 h-6 text-green-400"/> Google Drive</h2>
              
              {!googleUser || !driveAccessToken ? (
                <div className="flex flex-col items-center justify-center flex-1 py-12 text-center">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center text-white/50 mb-6 transition-transform hover:scale-110">
                    <Cloud className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{googleUser ? "Grant Drive Access" : "Connect Google Drive"}</h3>
                  <p className="text-zinc-400 max-w-sm mx-auto mb-8">
                    {googleUser 
                      ? "Your session for Google Drive has expired. Please authorize again to access your images." 
                      : "Sign in with your Google account to access and import your photos directly into the vault."}
                  </p>
                  <button onClick={handleGoogleLogin} className="flex items-center gap-3 bg-white text-black px-6 py-3 rounded-full font-bold hover:bg-zinc-200 transition shadow-lg hover:shadow-xl">
                     <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                     {googleUser ? "Authorize Drive" : "Sign in with Google"}
                  </button>
                  {driveError && <p className="text-red-400 text-sm mt-4 font-medium">{driveError}</p>}
                </div>
              ) : (
                <div className="flex flex-col flex-1 min-h-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                     <p className="text-zinc-400 text-sm flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                       Signed in as <span className="text-white font-medium">{googleUser.email}</span>
                     </p>
                     <button onClick={() => { 
                       auth.signOut(); 
                       sessionStorage.removeItem('google_access_token'); 
                       setDriveAccessToken(null);
                       setDriveImages([]); 
                       setDriveSearchQuery(''); 
                     }} className="text-xs px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition self-end sm:self-auto uppercase tracking-widest font-bold">Sign out</button>
                  </div>

                  <div className="mb-4 flex gap-2">
                      <input 
                          type="text" 
                          value={driveSearchQuery}
                          onChange={(e) => setDriveSearchQuery(e.target.value)}
                          onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                  e.preventDefault();
                                  const token = sessionStorage.getItem('google_access_token');
                                  if (token) fetchDriveImages(token, undefined, driveSearchQuery);
                              }
                          }}
                          placeholder="Search images by name (e.g. IMG_2023, vacation)..." 
                          className="flex-1 bg-black/50 border border-white/10 px-4 py-2 rounded-xl text-white focus:outline-none focus:border-green-400 transition text-sm"
                      />
                      <button 
                          onClick={() => {
                              const token = sessionStorage.getItem('google_access_token');
                              if (token) fetchDriveImages(token, undefined, driveSearchQuery);
                          }}
                          disabled={isFetchingDriveImages}
                          className="px-4 py-2 bg-green-500/20 text-green-400 hover:bg-green-500/30 disabled:opacity-50 transition rounded-xl flex items-center justify-center shrink-0"
                      >
                          <Search className="w-4 h-4" />
                      </button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto min-h-[300px] border border-white/10 rounded-2xl bg-black/50 overflow-hidden relative">
                     {isFetchingDriveImages && driveImages.length === 0 ? (
                       <div className="flex items-center justify-center h-full text-zinc-500 flex-col gap-3">
                         <Loader2 className="w-8 h-8 animate-spin text-green-400" />
                         <p>Loading your Drive images...</p>
                       </div>
                     ) : driveError ? (
                       <div className="flex items-center justify-center h-full text-red-400 font-medium text-center p-6 bg-red-500/5">
                         {driveError}
                       </div>
                     ) : driveImages.length === 0 ? (
                       <div className="flex items-center justify-center h-full text-zinc-500 p-6 flex-col gap-3">
                         <Search className="w-8 h-8 opacity-50" />
                         <p>No images found in your Google Drive.</p>
                       </div>
                     ) : (
                       <div className="absolute inset-0 p-3 lg:p-4 overflow-y-auto custom-scrollbar">
                         <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                           {driveImages.map(file => (
                             <div key={file.id} onClick={() => handleSelectDriveImage(file)} className="aspect-square rounded-xl overflow-hidden border border-white/5 relative group cursor-pointer hover:border-green-400 hover:shadow-[0_0_15px_rgba(74,222,128,0.3)] transition-all">
                                <img src={file.thumbnailLink} alt={file.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                   <Plus className="w-10 h-10 text-white drop-shadow-xl transform scale-50 group-hover:scale-100 transition-transform duration-300" />
                                </div>
                             </div>
                           ))}
                         </div>
                         {driveNextToken && (
                           <div className="flex justify-center mt-6 mb-2">
                              <button onClick={() => {
                                  const token = sessionStorage.getItem('google_access_token');
                                  if (token) fetchDriveImages(token, driveNextToken, driveSearchQuery);
                              }} disabled={isFetchingDriveImages} className="px-6 py-2.5 bg-white/10 hover:bg-white/20 disabled:opacity-50 text-white rounded-full text-sm font-semibold transition border border-white/10">
                                 {isFetchingDriveImages ? <Loader2 className="w-4 h-4 animate-spin inline-block mr-2" /> : null}
                                 {isFetchingDriveImages ? 'Loading...' : 'Load More Options'}
                              </button>
                           </div>
                         )}
                       </div>
                     )}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


const rootElement = document.getElementById('root');
if (rootElement) {
    const root = createRoot(rootElement);
    const AppWrapper = () => {
        const [isUnlocked, setIsUnlocked] = useState(false);
        return (
            <AnimatePresence mode="wait">
                {!isUnlocked ? (
                    <motion.div key="lock" exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }} transition={{ duration: 0.5 }}>
                        <PasswordScreen onUnlock={() => setIsUnlocked(true)} />
                    </motion.div>
                ) : (
                    <motion.div key="app" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
                        <App />
                    </motion.div>
                )}
            </AnimatePresence>
        );
    };
    root.render(<AppWrapper />);
}

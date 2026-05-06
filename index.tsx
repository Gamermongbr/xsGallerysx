import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { v4 as uuidv4 } from 'uuid';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Unlock, ShieldAlert, Heart, X, Plus, Trash2, Edit2, ChevronLeft, ChevronRight, Image as ImageIcon, Crosshair, Star, Search, MessageCircle, ZoomIn, ZoomOut, Expand, Link as LinkIcon, Upload, LayoutGrid, FolderArchive, User, BadgeCheck, Gamepad2 } from 'lucide-react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

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


const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'profiles' | 'arcade' | 'extra'>('home');
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const profileImageInputRef = useRef<HTMLInputElement>(null);
  const [activeAddImageSectionId, setActiveAddImageSectionId] = useState<string | null>(null);
  const [activeAddImageProfileId, setActiveAddImageProfileId] = useState<string | null>(null);
  const [newImageUrl, setNewImageUrl] = useState('');
  
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
  
  const [newComment, setNewComment] = useState('');

  const [isDragging, setIsDragging] = useState(false);
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
        point: { x: 50, y: 50 }
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
      alert("You need at least 2 images in your collection to play Would You Rather!");
      return;
    }
    
    // Pick two unique random images
    const shuffled = [...allImages].sort(() => 0.5 - Math.random());
    setWyrImages({
      left: shuffled[0],
      right: shuffled[1]
    });
    setIsWYRActive(true);
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
    // Use a small timeout to ensure DOM selection works if elements are re-rendering
    setTimeout(() => {
        if (transformRef.current && typeof transformRef.current.zoomToElement === 'function') {
            transformRef.current.zoomToElement(`feature-${tagId}`, 4, 800);
        }
    }, 10);
  };

  const closeModal = useCallback(() => {
    setSelectedImageInfo(null);
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
            <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} className={isWYRActive || isHBActive ? "py-4" : "py-10"}>
                {!isWYRActive && !isHBActive ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
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
                                    desc: 'Classic and custom card games for the vault.', 
                                    icon: FolderArchive, 
                                    color: 'from-blue-500 to-indigo-600',
                                    status: 'UNDER DEV'
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
                                                    const currentId = `hb-feature-${hbFilteredItems[hbCurrentIndex]?.tag.id}`;
                                                    const timer = setTimeout(() => {
                                                        zoomToElement(currentId, 4.5, 1000);
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
                ) : (
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
                )}
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

      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
      <input type="file" ref={profileImageInputRef} onChange={handleProfileImageChange} className="hidden" accept="image/*" />

      {/* --- Image Viewer Modal --- */}
      <AnimatePresence>
        {selectedImageInfo && (
          <motion.div 
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
                                    <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }} contentStyle={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                                        <div 
                                          className={`relative w-full h-full flex items-center justify-center ${isEditingPoints ? 'cursor-crosshair' : ''}`}
                                          onClick={handleImageInteraction}
                                        >
                                            <img 
                                               ref={modalImageRef}
                                               src={selectedImageInfo.image.src}
                                               alt="Fullscreen view"
                                               className="max-w-full max-h-full object-contain p-2 lg:p-4 drop-shadow-2xl select-none"
                                               draggable={false}
                                            />
                                            {(isEditingPoints ? tempTags : (selectedImageInfo.image.featureTags || [])).map(tag => (
                                                <div 
                                                    key={tag.id}
                                                    id={`feature-${tag.id}`}
                                                    className={`absolute flex flex-col items-center -translate-x-1/2 -translate-y-1/2 w-1 h-1 ${isEditingPoints ? 'pointer-events-auto' : 'pointer-events-none'}`}
                                                    style={{ 
                                                        left: `${tag.point?.x}%`, 
                                                        top: `${tag.point?.y}%`,
                                                    }}
                                                >
                                                    {isEditingPoints && (
                                                        <>
                                                            <div 
                                                                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                                                activeTagId === tag.id ? 'bg-cyan-400 border-white scale-125 shadow-[0_0_15px_white]' : 'bg-black/50 border-cyan-400'
                                                                } cursor-pointer animate-pulse`}
                                                                onClick={(e) => {
                                                                e.stopPropagation();
                                                                setActiveTagId(tag.id);
                                                                }}
                                                            >
                                                                <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                                            </div>
                                                            {activeTagId === tag.id && (
                                                                <div className="mt-2 text-[10px] bg-cyan-400 text-black px-1.5 py-0.5 rounded font-bold whitespace-nowrap shadow-lg z-50">
                                                                    {tag.label}
                                                                </div>
                                                            )}
                                                        </>
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
                            <button onClick={()=>handleSmashClick()} className="group flex-1 py-4 rounded-2xl border border-white/10 bg-white/5 hover:border-cyan-400 hover:bg-cyan-400/10 flex flex-col items-center justify-center gap-2 transition">
                                <Search className="w-6 h-6 text-zinc-400 group-hover:text-cyan-400" />
                                <span className="text-[10px] uppercase font-bold text-zinc-500 group-hover:text-cyan-400 tracking-wider">Inspect</span>
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
                            
                            <div className="flex flex-wrap gap-2">
                                {(isEditingPoints ? tempTags : (selectedImageInfo.image.featureTags || [])).map((tag, idx) => (
                                    <motion.button 
                                      initial={{ scale: 0, opacity: 0 }}
                                      animate={{ scale: 1, opacity: 1 }}
                                      transition={{ delay: idx * 0.1 }}
                                      onClick={() => {
                                        if (isEditingPoints) {
                                            setActiveTagId(tag.id);
                                        } else {
                                            handleTagClick(tag.id);
                                        }
                                      }}
                                      key={tag.id} 
                                      className={`px-4 py-2 rounded-full border transition flex items-center gap-2 whitespace-nowrap
                                        ${activeTagId === tag.id 
                                            ? 'bg-cyan-400 border-white text-black shadow-[0_0_15px_rgba(3,218,198,0.4)]' 
                                            : 'border-white/10 bg-black/40 hover:bg-white/10 hover:border-cyan-400 text-zinc-300'
                                        } text-sm font-medium tracking-wide`}
                                    >
                                        {tag.label}
                                        {isEditingPoints && activeTagId === tag.id && <Edit2 className="w-3 h-3" />}
                                    </motion.button>
                                ))}
                                
                                {(!selectedImageInfo.image.featureTags || selectedImageInfo.image.featureTags.length === 0) && !isEditingPoints && (
                                    <div className="w-full py-6 text-center text-zinc-600 border border-dashed border-white/5 rounded-2xl">
                                        <p className="text-xs uppercase font-bold tracking-widest">No Features Tagged</p>
                                    </div>
                                )}
                            </div>

                            {isEditingPoints && (
                                <div className="mt-6 flex flex-col gap-4">
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
                            )}
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
      </AnimatePresence>

      {/* --- Global Modals --- */}
      <AnimatePresence>
        {(activeAddImageProfileId || activeAddImageSectionId) && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[9000] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
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

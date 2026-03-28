/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  PenTool, 
  Video, 
  Download, 
  Info, 
  MessageCircle, 
  Mail, 
  Phone, 
  HelpCircle, 
  Menu, 
  X, 
  ChevronRight,
  Loader2,
  Sparkles,
  Play
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';

// --- Types ---

type Page = 'home' | 'about' | 'faq' | 'contact';

interface GeneratedVideo {
  id: string;
  url: string;
  prompt: string;
  poem: string;
  timestamp: number;
}

// --- Constants ---

const CONTACT_INFO = {
  name: "Mbale Prince",
  role: "Software Developer",
  email: "mbaleprince29@gmail.com",
  phone: "+256775631746",
  whatsapp: "256775631746"
};

const FAQS = [
  {
    question: "How does Poetic Motion work?",
    answer: "Poetic Motion uses advanced AI models (Gemini Veo) to interpret the emotions and imagery in your poems and transform them into cinematic video animations."
  },
  {
    question: "How long does video generation take?",
    answer: "Video generation typically takes between 2 to 5 minutes depending on the complexity of the prompt and server load."
  },
  {
    question: "Can I download the generated videos?",
    answer: "Yes! Once a video is generated, you can download it directly to your device in high quality."
  },
  {
    question: "Is there a limit to poem length?",
    answer: "While there's no strict limit, shorter, more descriptive poems tend to yield more focused and visually striking animations."
  }
];

// --- Components ---

const Navbar = ({ activePage, setActivePage, toggleMenu }: { activePage: Page, setActivePage: (p: Page) => void, toggleMenu: () => void }) => (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex items-center justify-between">
    <div 
      className="flex items-center gap-2 cursor-pointer" 
      onClick={() => setActivePage('home')}
    >
      <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/20">
        <Sparkles className="text-white w-5 h-5" />
      </div>
      <span className="text-xl font-bold tracking-tight text-white">Poetic Motion</span>
    </div>
    
    <div className="hidden md:flex items-center gap-8">
      {(['home', 'about', 'faq', 'contact'] as Page[]).map((page) => (
        <button
          key={page}
          onClick={() => setActivePage(page)}
          className={cn(
            "text-sm font-medium transition-colors capitalize",
            activePage === page ? "text-orange-500" : "text-white/60 hover:text-white"
          )}
        >
          {page}
        </button>
      ))}
    </div>

    <button className="md:hidden text-white" onClick={toggleMenu}>
      <Menu size={24} />
    </button>
  </nav>
);

const MobileMenu = ({ isOpen, onClose, activePage, setActivePage }: { isOpen: boolean, onClose: () => void, activePage: Page, setActivePage: (p: Page) => void }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0, x: '100%' }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed inset-0 z-[60] bg-black flex flex-col p-8"
      >
        <div className="flex justify-end mb-12">
          <button onClick={onClose} className="text-white/60 hover:text-white">
            <X size={32} />
          </button>
        </div>
        <div className="flex flex-col gap-8">
          {(['home', 'about', 'faq', 'contact'] as Page[]).map((page) => (
            <button
              key={page}
              onClick={() => {
                setActivePage(page);
                onClose();
              }}
              className={cn(
                "text-4xl font-bold text-left capitalize",
                activePage === page ? "text-orange-500" : "text-white"
              )}
            >
              {page}
            </button>
          ))}
        </div>
        <div className="mt-auto pt-8 border-t border-white/10">
          <p className="text-white/40 text-sm mb-4">Developed by</p>
          <p className="text-white font-medium">{CONTACT_INFO.name}</p>
          <p className="text-white/60 text-sm">{CONTACT_INFO.role}</p>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

const Footer = () => (
  <footer className="bg-black border-t border-white/10 py-12 px-6">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
      <div>
        <div className="flex items-center gap-2 mb-6">
          <div className="w-6 h-6 bg-orange-500 rounded flex items-center justify-center">
            <Sparkles className="text-white w-4 h-4" />
          </div>
          <span className="text-lg font-bold text-white">Poetic Motion</span>
        </div>
        <p className="text-white/40 text-sm leading-relaxed">
          Transforming the written word into cinematic visual experiences. 
          Powered by Gemini AI.
        </p>
      </div>
      <div>
        <h4 className="text-white font-semibold mb-6">Contact</h4>
        <div className="space-y-4">
          <a href={`mailto:${CONTACT_INFO.email}`} className="flex items-center gap-3 text-white/60 hover:text-white transition-colors">
            <Mail size={18} />
            <span className="text-sm">{CONTACT_INFO.email}</span>
          </a>
          <a href={`tel:${CONTACT_INFO.phone}`} className="flex items-center gap-3 text-white/60 hover:text-white transition-colors">
            <Phone size={18} />
            <span className="text-sm">{CONTACT_INFO.phone}</span>
          </a>
        </div>
      </div>
      <div>
        <h4 className="text-white font-semibold mb-6">Developer</h4>
        <p className="text-white/60 text-sm mb-2">{CONTACT_INFO.name}</p>
        <p className="text-white/40 text-xs uppercase tracking-widest">{CONTACT_INFO.role}</p>
      </div>
    </div>
    <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 text-center">
      <p className="text-white/20 text-xs">© 2026 Poetic Motion. All rights reserved.</p>
    </div>
  </footer>
);

// --- Main App Component ---

export default function App() {
  const [activePage, setActivePage] = useState<Page>('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [poem, setPoem] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState('');
  const [generatedVideos, setGeneratedVideos] = useState<GeneratedVideo[]>([]);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [manualApiKey, setManualApiKey] = useState('');
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [previewVideo, setPreviewVideo] = useState<GeneratedVideo | null>(null);

  useEffect(() => {
    // Check for saved manual key or platform key
    const savedKey = localStorage.getItem('poetic_motion_api_key');
    if (savedKey) {
      setManualApiKey(savedKey);
      setHasApiKey(true);
    }

    const checkKey = async () => {
      if (window.aistudio?.hasSelectedApiKey) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        if (hasKey) setHasApiKey(true);
      }
    };
    checkKey();
  }, []);

  const handleSaveManualKey = () => {
    if (manualApiKey.trim()) {
      localStorage.setItem('poetic_motion_api_key', manualApiKey.trim());
      setHasApiKey(true);
      setShowKeyInput(false);
    }
  };

  const handleSelectKey = async () => {
    if (window.aistudio?.openSelectKey) {
      await window.aistudio.openSelectKey();
      setHasApiKey(true);
    }
  };

  const generateVideo = async () => {
    if (!poem.trim()) return;
    
    setIsGenerating(true);
    setGenerationStatus('Analyzing your poem...');

    try {
      // Priority: Manual Key > Platform Key > Env Var
      const apiKey = manualApiKey.trim() || 
                     (window as any).process?.env?.API_KEY || 
                     process.env.GEMINI_API_KEY;

      if (!apiKey) {
        throw new Error('No API key found. Please enter your Gemini API key.');
      }

      const ai = new GoogleGenAI({ apiKey });

      setGenerationStatus('Crafting visual prompts...');
      
      // Step 1: Use Gemini to expand the poem into a visual prompt
      const promptResponse = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Convert this poem into a highly descriptive, cinematic visual prompt for a video generation model. Focus on atmosphere, lighting, camera movement, and specific imagery. Poem: "${poem}"`,
      });

      const visualPrompt = promptResponse.text || poem;
      setGenerationStatus('Generating cinematic animation (this may take a few minutes)...');

      // Step 2: Generate Video using Veo
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: visualPrompt,
        config: {
          numberOfVideos: 1,
          resolution: '1080p',
          aspectRatio: '16:9'
        }
      });

      // Poll for completion
      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
        
        // Update status periodically
        const statuses = [
          'Painting the scenes...',
          'Rendering atmosphere...',
          'Adding cinematic touches...',
          'Finalizing your animation...'
        ];
        setGenerationStatus(statuses[Math.floor(Math.random() * statuses.length)]);
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      
      if (downloadLink) {
        // Fetch the video to get a blob URL (for local preview and download)
        const response = await fetch(downloadLink, {
          method: 'GET',
          headers: {
            'x-goog-api-key': apiKey!,
          },
        });
        
        const blob = await response.blob();
        const videoUrl = URL.createObjectURL(blob);

        const newVideo: GeneratedVideo = {
          id: Date.now().toString(),
          url: videoUrl,
          prompt: visualPrompt,
          poem: poem,
          timestamp: Date.now()
        };

        setGeneratedVideos(prev => [newVideo, ...prev]);
        setPoem('');
      }
    } catch (error) {
      console.error('Generation failed:', error);
      alert('Failed to generate video. Please try again.');
    } finally {
      setIsGenerating(false);
      setGenerationStatus('');
    }
  };

  const downloadVideo = (url: string, id: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = `poetic-motion-${id}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-orange-500/30">
      <Navbar activePage={activePage} setActivePage={setActivePage} toggleMenu={() => setIsMenuOpen(true)} />
      <MobileMenu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
        activePage={activePage} 
        setActivePage={setActivePage} 
      />

      <main className="pt-24 pb-20 px-6 max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {activePage === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              {/* Hero Section */}
              <section className="text-center space-y-6 py-12">
                <motion.h1 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9]"
                >
                  Words in <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">Motion</span>
                </motion.h1>
                <p className="text-white/40 max-w-2xl mx-auto text-lg">
                  Transform your poetry into cinematic visual masterpieces. 
                  Experience your words like never before.
                </p>
              </section>

              {/* Input Section */}
              <section className="max-w-3xl mx-auto space-y-6">
                {!hasApiKey || showKeyInput ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white/5 border border-white/10 rounded-3xl p-8 text-center space-y-6"
                  >
                    <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto">
                      <HelpCircle className="text-orange-500 w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">API Key Required</h3>
                      <p className="text-white/40 text-sm">
                        Enter your Gemini API key manually or use the platform selector.
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="relative">
                        <input 
                          type="password"
                          value={manualApiKey}
                          onChange={(e) => setManualApiKey(e.target.value)}
                          placeholder="Enter Gemini API Key..."
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-orange-500 transition-colors text-sm"
                        />
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button 
                          onClick={handleSaveManualKey}
                          className="bg-orange-500 text-white px-8 py-3 rounded-full font-bold hover:bg-orange-600 transition-all flex-1 sm:flex-none"
                        >
                          Save Key
                        </button>
                        <button 
                          onClick={handleSelectKey}
                          className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition-all flex-1 sm:flex-none"
                        >
                          Use Platform Selector
                        </button>
                      </div>
                    </div>

                    <p className="text-[10px] text-white/20">
                      Your key is stored locally in your browser. Requires a paid Google Cloud project for Veo models.
                    </p>
                  </motion.div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-end">
                      <button 
                        onClick={() => setShowKeyInput(true)}
                        className="text-white/40 hover:text-orange-500 text-xs flex items-center gap-1 transition-colors"
                      >
                        <HelpCircle size={12} />
                        Change API Key
                      </button>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-1 overflow-hidden focus-within:border-orange-500/50 transition-colors">
                      <textarea
                        value={poem}
                        onChange={(e) => setPoem(e.target.value)}
                        placeholder="Paste your poem here..."
                        className="w-full h-48 bg-transparent p-6 outline-none resize-none text-lg placeholder:text-white/20"
                      />
                      <div className="p-4 flex justify-end bg-white/[0.02] border-t border-white/5">
                        <button
                          onClick={generateVideo}
                          disabled={isGenerating || !poem.trim()}
                          className={cn(
                            "flex items-center gap-2 px-8 py-3 rounded-full font-bold transition-all",
                            isGenerating || !poem.trim() 
                              ? "bg-white/5 text-white/20 cursor-not-allowed" 
                              : "bg-orange-500 text-white hover:bg-orange-600 shadow-lg shadow-orange-500/20"
                          )}
                        >
                          {isGenerating ? (
                            <>
                              <Loader2 className="animate-spin w-5 h-5" />
                              <span>Generating...</span>
                            </>
                          ) : (
                            <>
                              <Video size={20} />
                              <span>Animate Poem</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {isGenerating && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-8 text-center space-y-4"
                  >
                    <div className="flex justify-center gap-1">
                      {[0, 1, 2].map(i => (
                        <motion.div
                          key={i}
                          animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                          transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
                          className="w-2 h-2 bg-orange-500 rounded-full"
                        />
                      ))}
                    </div>
                    <p className="text-orange-500 font-medium animate-pulse">{generationStatus}</p>
                  </motion.div>
                )}
              </section>

              {/* Gallery Section */}
              {generatedVideos.length > 0 && (
                <section className="space-y-8 pt-12">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Play className="text-orange-500 fill-orange-500" size={20} />
                    Your Creations
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {generatedVideos.map((video) => (
                      <motion.div
                        key={video.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="group relative bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-orange-500/30 transition-colors"
                      >
                        <div className="relative aspect-video bg-black group-hover:cursor-pointer" onClick={() => setPreviewVideo(video)}>
                          <video 
                            src={video.url} 
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                          />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
                              <Play className="text-white fill-white ml-1" size={32} />
                            </div>
                          </div>
                        </div>
                        <div className="p-6 space-y-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Poem Fragment</p>
                              <p className="text-sm line-clamp-2 text-white/80 italic">"{video.poem}"</p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => setPreviewVideo(video)}
                                className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-colors"
                                title="Preview"
                              >
                                <Play size={20} />
                              </button>
                              <button
                                onClick={() => downloadVideo(video.url, video.id)}
                                className="p-3 bg-white/10 rounded-full hover:bg-orange-500 transition-colors"
                                title="Download"
                              >
                                <Download size={20} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </section>
              )}

              {/* Video Preview Modal */}
              <AnimatePresence>
                {previewVideo && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/95 backdrop-blur-sm"
                  >
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      className="relative w-full max-w-5xl bg-[#0a0a0a] rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
                    >
                      <div className="absolute top-4 right-4 z-10">
                        <button 
                          onClick={() => setPreviewVideo(null)}
                          className="p-2 bg-black/50 hover:bg-white/10 rounded-full text-white/60 hover:text-white transition-colors"
                        >
                          <X size={24} />
                        </button>
                      </div>

                      <div className="aspect-video bg-black">
                        <video 
                          src={previewVideo.url} 
                          controls 
                          autoPlay
                          className="w-full h-full"
                        />
                      </div>

                      <div className="p-6 md:p-8 bg-gradient-to-t from-black to-transparent">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                          <div className="space-y-2">
                            <p className="text-orange-500 text-xs font-bold uppercase tracking-[0.2em]">Full Poem Context</p>
                            <p className="text-white/80 italic text-lg leading-relaxed">"{previewVideo.poem}"</p>
                          </div>
                          <button
                            onClick={() => downloadVideo(previewVideo.url, previewVideo.id)}
                            className="flex items-center justify-center gap-2 bg-orange-500 text-white px-8 py-4 rounded-full font-bold hover:bg-orange-600 shadow-xl shadow-orange-500/20 transition-all whitespace-nowrap"
                          >
                            <Download size={20} />
                            Download Video
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {activePage === 'about' && (
            <motion.div
              key="about"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-3xl mx-auto space-y-12"
            >
              <div className="space-y-6">
                <h1 className="text-6xl font-black uppercase tracking-tighter">About</h1>
                <div className="h-1 w-24 bg-orange-500" />
              </div>
              
              <div className="space-y-8 text-white/60 leading-relaxed text-lg">
                <p>
                  Poetic Motion was born from a simple question: <span className="text-white italic">"What if we could see the world exactly as a poet describes it?"</span>
                </p>
                <p>
                  By leveraging the latest breakthroughs in generative AI, we've created a bridge between literature and cinematography. Our platform doesn't just generate random visuals; it analyzes the rhythm, tone, and metaphors within your poetry to create animations that resonate with the soul of your writing.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
                  <div className="p-8 bg-white/5 rounded-3xl border border-white/10">
                    <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                      <Sparkles className="text-orange-500" size={20} />
                      AI Powered
                    </h3>
                    <p className="text-sm">Utilizing Gemini 3.1 Veo models for state-of-the-art video generation.</p>
                  </div>
                  <div className="p-8 bg-white/5 rounded-3xl border border-white/10">
                    <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                      <PenTool className="text-orange-500" size={20} />
                      Creative Freedom
                    </h3>
                    <p className="text-sm">No complex prompts needed. Just write your poem and let the AI handle the rest.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activePage === 'faq' && (
            <motion.div
              key="faq"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-3xl mx-auto space-y-12"
            >
              <div className="space-y-6">
                <h1 className="text-6xl font-black uppercase tracking-tighter">FAQs</h1>
                <div className="h-1 w-24 bg-orange-500" />
              </div>

              <div className="space-y-4">
                {FAQS.map((faq, i) => (
                  <details key={i} className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                    <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                      <span className="font-bold text-lg">{faq.question}</span>
                      <ChevronRight className="text-white/40 group-open:rotate-90 transition-transform" />
                    </summary>
                    <div className="px-6 pb-6 text-white/60">
                      {faq.answer}
                    </div>
                  </details>
                ))}
              </div>
            </motion.div>
          )}

          {activePage === 'contact' && (
            <motion.div
              key="contact"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-3xl mx-auto space-y-12"
            >
              <div className="space-y-6">
                <h1 className="text-6xl font-black uppercase tracking-tighter">Contact</h1>
                <div className="h-1 w-24 bg-orange-500" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-8">
                  <div className="space-y-2">
                    <p className="text-white/40 text-xs uppercase tracking-widest">Developer</p>
                    <h2 className="text-3xl font-bold">{CONTACT_INFO.name}</h2>
                    <p className="text-orange-500 font-medium">{CONTACT_INFO.role}</p>
                  </div>
                  
                  <div className="space-y-6">
                    <a 
                      href={`mailto:${CONTACT_INFO.email}`}
                      className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 hover:border-orange-500/50 transition-colors group"
                    >
                      <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center group-hover:bg-orange-500 transition-colors">
                        <Mail className="text-orange-500 group-hover:text-white" />
                      </div>
                      <div>
                        <p className="text-white/40 text-xs">Email</p>
                        <p className="font-medium">{CONTACT_INFO.email}</p>
                      </div>
                    </a>

                    <a 
                      href={`https://wa.me/${CONTACT_INFO.whatsapp}`}
                      target="_blank"
                      className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 hover:border-orange-500/50 transition-colors group"
                    >
                      <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center group-hover:bg-orange-500 transition-colors">
                        <MessageCircle className="text-orange-500 group-hover:text-white" />
                      </div>
                      <div>
                        <p className="text-white/40 text-xs">WhatsApp / Phone</p>
                        <p className="font-medium">{CONTACT_INFO.phone}</p>
                      </div>
                    </a>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col justify-center items-center text-center space-y-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl rotate-12 flex items-center justify-center shadow-2xl shadow-orange-500/20">
                    <Sparkles className="text-white w-12 h-12 -rotate-12" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Let's Collaborate</h3>
                    <p className="text-white/40 text-sm">
                      Have a project in mind or just want to say hi? 
                      Feel free to reach out through any of the channels.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Sparkles, X, RefreshCw, Quote, BrainCircuit } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'सभी (All)', tag: 'Shuffled' },
  { id: 'motivational', label: 'प्रेरणा', tag: 'Motivational' },
  { id: 'success', label: 'सफलता', tag: 'Success' },
  { id: 'attitude', label: 'एटीट्यूड', tag: 'Attitude' },
  { id: 'positive', label: 'सकारात्मक', tag: 'Positive' },
];

const FALLBACK_QUOTES = [
  { type: "motivational", quote: "सपने वो नहीं जो हम सोते हुए देखते हैं, सपने वो हैं जो हमें सोने नहीं देते।" },
  { type: "success", quote: "सफलता का मुख्य आधार आपकी कड़ी मेहनत और अटूट विश्वास है।" },
  { type: "attitude", quote: "पहचान से मिला काम थोड़े समय के लिए रहता है, लेकिन काम से मिली पहचान उम्र भर रहती है।" },
  { type: "positive", quote: "सोच को बदलो, सितारे बदल जायेंगे, नज़र को बदलो, नजारे बदल जायेंगे।" },
  { type: "love", quote: "प्यार और सम्मान दो ऐसी चीजें हैं जो देने से बढ़ती हैं।" }
];

const TodaysQuotes = ({ isOpen: controlledIsOpen, onClose: controlledOnClose }) => {
  const [internalIsOpen, setInternalIsOpen] = useState(true);
  const [quoteData, setQuoteData] = useState({ quote: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeParam, setActiveParam] = useState('motivational');

  const isModalOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

  const handleClose = useCallback(() => {
    if (controlledOnClose) {
      controlledOnClose();
    } else {
      setInternalIsOpen(false);
    }
  }, [controlledOnClose]);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isModalOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, handleClose]);

  const getRandomParam = () => {
    const params = ['success', 'attitude', 'positive', 'motivational'];
    const randomIndex = Math.floor(Math.random() * params.length);
    return params[randomIndex];
  };

  const fetchQuote = useCallback(async (cat = selectedCategory) => {
    setLoading(true);

    let paramToFetch = cat;
    if (cat === 'all') {
      paramToFetch = getRandomParam();
    }
    setActiveParam(paramToFetch);

    try {
      const url = `https://hindi-quotes.vercel.app/random/${paramToFetch}`;
      const response = await axios.get(url, { timeout: 6000 });

      if (response.data && response.data.quote) {
        setQuoteData({
          quote: response.data.quote,
          type: response.data.type || paramToFetch
        });
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (err) {
      console.warn("Hindi Quotes API fetch error, using fallback:", err);
      const matchedFallback = FALLBACK_QUOTES.filter(q => q.type === paramToFetch);
      const fallbackList = matchedFallback.length > 0 ? matchedFallback : FALLBACK_QUOTES;
      const randomFallback = fallbackList[Math.floor(Math.random() * fallbackList.length)];
      setQuoteData(randomFallback);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (isModalOpen) {
      fetchQuote(selectedCategory);
    }
  }, [isModalOpen]);

  if (!isModalOpen) {
    if (controlledIsOpen === undefined) {
      return (
        <button
          onClick={() => setInternalIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#b8860b] text-[#1c130b] p-3 hover:px-4.5 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer font-semibold text-sm border border-[#fffdfa]/40 group"
          title="आज का विचार (Today's Quote)"
        >
          <div className="p-1 rounded-full bg-[#1c130b]/10 group-hover:rotate-12 transition-transform flex-shrink-0">
            <Sparkles className="w-4 h-4 text-[#1c130b]" />
          </div>
          <span className="max-w-0 opacity-0 group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-2 overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out tracking-wide font-bold">
            आज का विचार
          </span>
        </button>
      );
    }
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#1c130b]/60 backdrop-blur-md transition-all duration-300 animate-fade-in">
      {/* Click outside backdrop */}
      <div className="fixed inset-0" onClick={handleClose} />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-[#fffdfa] rounded-3xl shadow-2xl overflow-hidden z-10 transform transition-all duration-300 scale-100 animate-scale-up">

        {/* Header */}
        <div className="bg-gradient-to-r from-[#1c130b] via-[#2c1d11] to-[#1c130b] px-6 py-4 flex items-center justify-between text-white border-b border-[#d4af37]/30 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#d4af37]/20 border border-[#d4af37]/40 rounded-xl backdrop-blur-sm">
              <BrainCircuit className="w-5 h-5 text-[#d4af37]" />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-base tracking-wide flex items-center gap-2 text-[#fffdfa]">
                आज का विचार
              </h3>
              <p className="text-xs text-[#d4af37] font-medium tracking-wider uppercase">Thought of the Day</p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-colors cursor-pointer border border-white/10"
            title="Close (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Pills Bar */}
        <div className="px-5 pt-3.5 pb-3 border-b border-[#e8decb]/80 bg-[#fdf5e6]/40 flex items-center gap-2 overflow-x-auto scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                fetchQuote(cat.id);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-[#1c130b] font-bold shadow-sm ring-2 ring-[#d4af37]/30'
                  : 'bg-[#fffdfa] text-[#786452] hover:text-[#1c130b] hover:bg-[#f8f3ea] border border-[#e8decb]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Body Container */}
        <div className="p-6 sm:p-8 relative min-h-[200px] flex flex-col justify-between bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#fdf5e6]/30 via-[#fffdfa] to-[#fffdfa]">

          {/* Background Decorative Quote Mark */}
          <Quote className="absolute top-6 right-8 w-28 h-28 text-[#d4af37]/15 rotate-180 pointer-events-none select-none" />

          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3">
              <RefreshCw className="w-8 h-8 text-[#d4af37] animate-spin" />
              <p className="text-xs font-semibold text-[#786452] animate-pulse">
                नया विचार लोड हो रहा है...
              </p>
            </div>
          ) : (
            <div className="my-3 z-10 px-2 sm:px-4 text-center">
              <p className="text-xl sm:text-2xl font-serif leading-relaxed text-[#1c130b] font-medium tracking-wide text-balance">
                “{quoteData.quote}”
              </p>

              {activeParam && (
                <div className="mt-4 flex justify-center">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#fdf5e6] text-[#946914] border border-[#f0d89c]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]"></span>
                    {activeParam}
                  </span>
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default TodaysQuotes;




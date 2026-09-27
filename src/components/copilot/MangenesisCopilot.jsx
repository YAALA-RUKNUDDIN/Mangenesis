import { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  BrainCircuit,
  Send,
  X,
  ChevronDown,
  ChevronUp,
  Key,
  Bot,
  User,
  RotateCcw,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  MessageSquare,
  Cpu,
  Layers,
  CircleDollarSign,
  TrendingUp,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useScenario } from '../../context/ScenarioContext';
import { askMangenesisCopilot, COPILOT_SUGGESTIONS } from '../../services/copilotService';

export default function MangenesisCopilot() {
  const { activeMineData, scenarioData } = useScenario();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'ai',
      thought: `1. Initialized Mangenesis Copilot reasoning engine.
2. Bound live context to ${activeMineData.name || 'Gumgaon Mine'} (21.155°N, 79.090°E).
3. Synchronized Sausar Group stratigraphic horizon, UNFC 111 reserve estimates, and DGMS circular thresholds.
4. Ready to answer natural-language operational and technical queries.`,
      text: `Hello! I am **MANGENESIS COPILOT**, your AI Geotechnical & Mine Operations reasoning partner.

I am connected to the live telemetry and geological models for **${activeMineData.name || 'Gumgaon Mine'}**. Ask me anything about our **shortfall mitigation, UNFC 111 reserves, satellite SWIR bands, or the ₹18.42 Cr economic savings**.`,
      timestamp: 'Just now',
      isLiveGemini: false,
    },
  ]);

  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [customApiKey, setCustomApiKey] = useState(
    localStorage.getItem('mangenesis_gemini_api_key') || ''
  );
  const [keySavedToast, setKeySavedToast] = useState(false);
  const [expandedThoughts, setExpandedThoughts] = useState({ welcome: false });

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [isOpen, messages, isThinking]);

  const handleSend = async (queryText = null) => {
    const textToSend = (queryText || input).trim();
    if (!textToSend || isThinking) return;

    const userMsgId = `user-${Date.now()}`;
    const userMsg = {
      id: userMsgId,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsThinking(true);

    try {
      const response = await askMangenesisCopilot(textToSend, { activeMineData, scenarioData });
      const aiMsgId = `ai-${Date.now()}`;

      setMessages((prev) => [
        ...prev,
        {
          id: aiMsgId,
          sender: 'ai',
          thought: response.thought,
          text: response.answer,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isLiveGemini: response.isLiveGemini,
        },
      ]);

      // Expand thought automatically for demonstration
      setExpandedThoughts((prev) => ({ ...prev, [aiMsgId]: true }));
    } catch (err) {
      console.error('Copilot error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          thought: 'Execution interrupted. Fallback recovery triggered.',
          text: 'Encountered an interruption. Reconnected to local telemetry stream. Please repeat your query.',
          timestamp: 'Now',
          isLiveGemini: false,
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const toggleThought = (msgId) => {
    setExpandedThoughts((prev) => ({ ...prev, [msgId]: !prev[msgId] }));
  };

  const handleSaveApiKey = () => {
    if (customApiKey.trim()) {
      localStorage.setItem('mangenesis_gemini_api_key', customApiKey.trim());
    } else {
      localStorage.removeItem('mangenesis_gemini_api_key');
    }
    setKeySavedToast(true);
    setTimeout(() => {
      setKeySavedToast(false);
      setShowKeyModal(false);
    }, 1500);
  };

  const handleClearHistory = () => {
    setMessages([messages[0]]);
  };

  return (
    <>
      {/* ===================== FLOATING TRIGGER BUTTON ===================== */}
      <div className="fixed bottom-6 right-6 z-[2800] flex items-center gap-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-full font-mono text-xs font-bold shadow-2xl transition-all cursor-pointer border ${
            isOpen
              ? 'bg-[#121824] border-[#38BDF8]/60 text-sky-300 ring-2 ring-sky-500/20'
              : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 border-amber-400/80 shadow-[0_0_24px_rgba(245,158,11,0.35)] hover:scale-105'
          }`}
          title="Open Mangenesis Reasoning AI Copilot"
        >
          <div className="relative">
            <BrainCircuit className="w-4 h-4 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <span>MANGENESIS COPILOT</span>
          <span className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-black/20 text-[9px] uppercase tracking-wider font-semibold">
            {customApiKey ? 'Gemini 2.0' : 'Reasoning AI'}
          </span>
        </button>
      </div>

      {/* ===================== COPILOT CHAT PANEL ===================== */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 sm:right-6 z-[2800] w-[94vw] sm:w-[480px] h-[640px] max-h-[85vh] bg-[#0A0D15]/95 backdrop-blur-xl border border-[#243046] rounded-[20px] shadow-[0_20px_60px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden font-sans animate-fadeIn">
          {/* Header */}
          <div className="p-3.5 bg-[#0D111A] border-b border-[#1C2536] flex items-center justify-between font-mono">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <BrainCircuit className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Mangenesis Copilot
                  </h3>
                  <span className="flex items-center gap-1 text-[9px] bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 px-1.5 py-0.2 rounded-full font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    LIVE
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-sans">
                  {customApiKey ? 'Powered by Google Gemini 2.0 Flash' : 'Autonomous Geotechnical Reasoning Engine'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowKeyModal(true)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-[#161D2B] transition-colors"
                title="Configure Gemini API Key"
              >
                <Key className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleClearHistory}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#161D2B] transition-colors"
                title="Clear Chat History"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#161D2B] transition-colors"
                title="Close Copilot"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-6 h-6 rounded-md bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[88%] space-y-2 ${
                    msg.sender === 'user'
                      ? 'bg-amber-500/20 border border-amber-500/30 text-amber-100 rounded-2xl rounded-tr-sm p-3'
                      : 'bg-[#121824] border border-[#1C2536] text-slate-200 rounded-2xl rounded-tl-sm p-3.5 shadow-sm'
                  }`}
                >
                  {/* Collapsible Model Thought Trace */}
                  {msg.thought && (
                    <div className="bg-[#07090E] border border-[#1F293D] rounded-[10px] overflow-hidden font-mono text-[11px]">
                      <button
                        onClick={() => toggleThought(msg.id)}
                        className="w-full px-2.5 py-1.5 flex items-center justify-between text-slate-400 hover:text-amber-300 bg-[#0A0D14] transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-1.5">
                          <Cpu className="w-3 h-3 text-amber-400 animate-spin" />
                          <span className="font-bold text-[10px] uppercase text-amber-400">
                            Thinking Process
                          </span>
                          <span className="text-[9px] text-slate-500">
                            ({msg.thought.split('\n').length} steps analyzed)
                          </span>
                        </div>
                        {expandedThoughts[msg.id] ? (
                          <ChevronUp className="w-3 h-3" />
                        ) : (
                          <ChevronDown className="w-3 h-3" />
                        )}
                      </button>

                      {expandedThoughts[msg.id] && (
                        <div className="p-2.5 text-slate-300 whitespace-pre-line border-t border-[#1C2536] text-[10px] leading-relaxed bg-[#07090E]/90 font-mono">
                          {msg.thought}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Formatted Answer Output */}
                  <div className="prose prose-invert prose-sm text-xs leading-relaxed space-y-2">
                    {msg.text.split('\n\n').map((paragraph, pIdx) => {
                      if (paragraph.startsWith('### ')) {
                        return (
                          <h4 key={pIdx} className="text-sm font-bold text-amber-400 pt-1 font-mono">
                            {paragraph.replace('### ', '')}
                          </h4>
                        );
                      }
                      if (paragraph.startsWith('#### ')) {
                        return (
                          <h5 key={pIdx} className="text-xs font-bold text-sky-400 pt-1 font-mono uppercase tracking-wide">
                            {paragraph.replace('#### ', '')}
                          </h5>
                        );
                      }
                      if (paragraph.startsWith('* ') || paragraph.startsWith('- ')) {
                        return (
                          <ul key={pIdx} className="list-disc pl-4 space-y-1 text-slate-300">
                            {paragraph.split('\n').map((line, lIdx) => (
                              <li key={lIdx} dangerouslySetInnerHTML={{
                                __html: line.replace(/^[\*\-]\s+/, '').replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-bold">$1</strong>')
                              }} />
                            ))}
                          </ul>
                        );
                      }
                      return (
                        <p
                          key={pIdx}
                          className="text-slate-200"
                          dangerouslySetInnerHTML={{
                            __html: paragraph.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-bold">$1</strong>')
                          }}
                        />
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[9px] text-slate-500 font-mono">
                    <span>{msg.timestamp}</span>
                    {msg.isLiveGemini && (
                      <span className="text-emerald-400">Grounded via Gemini 2.0 Flash</span>
                    )}
                  </div>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-6 h-6 rounded-md bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-300 shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {/* Thinking Animation State */}
            {isThinking && (
              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-md bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5 animate-spin" />
                </div>
                <div className="bg-[#121824] border border-[#1C2536] p-3 rounded-2xl rounded-tl-sm space-y-2 max-w-[80%] font-mono text-xs">
                  <div className="flex items-center gap-2 text-amber-400">
                    <BrainCircuit className="w-4 h-4 animate-pulse" />
                    <span className="font-bold text-[11px]">Reasoning through mining constraints...</span>
                  </div>
                  <div className="space-y-1 text-[10px] text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      <span>Checking Gumgaon Sausar formation & drillhole collars</span>
                    </div>
                    <div className="text-slate-500">Cross-referencing DGMS buffer & MILP recovery equation</div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Query Suggestion Chips */}
          <div className="px-3 py-2 bg-[#0A0D14] border-t border-[#1C2536] flex items-center gap-1.5 overflow-x-auto no-scrollbar font-mono text-[10px]">
            <span className="text-slate-500 shrink-0 uppercase tracking-wider text-[9px] font-bold">
              PROMPTS:
            </span>
            {COPILOT_SUGGESTIONS.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSend(item.query)}
                disabled={isThinking}
                className="shrink-0 px-2 py-1 rounded-[6px] bg-[#121824] hover:bg-[#1A2332] border border-[#1C2536] hover:border-amber-500/40 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-[#0D111A] border-t border-[#1C2536]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Mangenesis AI anything about reserves, shortfall, or DGMS..."
                disabled={isThinking}
                className="flex-1 bg-[#07090E] border border-[#243046] focus:border-amber-400 rounded-[10px] px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
              />
              <button
                type="submit"
                disabled={!input.trim() || isThinking}
                className={`p-2.5 rounded-[10px] font-bold transition-all cursor-pointer ${
                  input.trim() && !isThinking
                    ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-md'
                    : 'bg-[#161D2B] text-slate-600 cursor-not-allowed'
                }`}
                title="Send query"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ===================== GOOGLE GEMINI API KEY MODAL ===================== */}
      {showKeyModal && (
        <div className="fixed inset-0 z-[3200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md bg-[#0D111A] border border-[#243046] rounded-[16px] shadow-2xl p-5 font-mono space-y-4">
            <div className="flex items-center justify-between border-b border-[#1C2536] pb-3">
              <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider">
                <Key className="w-4 h-4 text-amber-400" />
                <span>Configure Google Gemini API Key</span>
              </div>
              <button
                onClick={() => setShowKeyModal(false)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              Mangenesis features an <strong>Autonomous Geotechnical Reasoning Engine</strong> by default. You can also plug in your own free <strong>Google Gemini API Key</strong> to unlock open-ended multimodal reasoning!
            </p>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase text-slate-400 font-bold block">
                Google Gemini API Key:
              </label>
              <input
                type="password"
                value={customApiKey}
                onChange={(e) => setCustomApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full bg-[#07090E] border border-[#243046] rounded-[8px] px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
              />
              <span className="text-[10px] text-slate-500 block font-sans">
                Stored securely in your local browser storage. Never sent to any server other than Google Generative Language API.
              </span>
            </div>

            {keySavedToast && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 p-2 rounded text-xs flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>API Key saved! Switching to Gemini 2.0 Flash...</span>
              </div>
            )}

            <div className="pt-2 flex items-center justify-between">
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-amber-400 hover:underline text-[11px] flex items-center gap-1"
              >
                <span>Get Free Gemini Key</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowKeyModal(false)}
                  className="px-3 py-1.5 rounded-[8px] bg-[#121824] hover:bg-[#1A2332] text-xs text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveApiKey}
                  className="px-3 py-1.5 rounded-[8px] bg-amber-500 hover:bg-amber-400 text-xs font-bold text-slate-950 cursor-pointer"
                >
                  Save & Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

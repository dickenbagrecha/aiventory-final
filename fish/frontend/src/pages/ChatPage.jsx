// src/pages/ChatPage.jsx
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  listSessions,
  createSession,
  deleteSession,
  getSession,
  sendMessageStream,
  uploadFile,
  BASE_URL,
} from "../api/chatApi";
import { speakText } from "../api/ttsApi";
import {
  Mic,
  Paperclip,
  Send,
  Plus,
  MessageSquare,
  Bot,
  Anchor,
  Search,
  Trash2,
  X,
  FileText,
  Image as ImageIcon,
  Volume2,
  VolumeX
} from "lucide-react";

// --- Helper Functions ---

function mapEventsToMessages(events = []) {
  const msgs = [];
  for (const ev of events) {
    const content = ev.content;
    if (!content) continue;
    const role = content.role || "model";
    const parts = content.parts || [];

    const text = parts
      .map((p) => p.text || "")
      .join(" ")
      .trim();

    const attachments = parts
      .filter((p) => p.inlineData)
      .map((p) => p.inlineData);

    if (!text && attachments.length === 0) continue;

    msgs.push({ role, text, attachments });
  }
  return msgs;
}

function isExcelLike(file) {
  if (!file) return false;
  const t = file.type || "";
  const name = file.name || "";
  return (
    t.includes("excel") ||
    t.includes("spreadsheet") ||
    t.includes("csv") ||
    name.toLowerCase().endsWith(".xlsx") ||
    name.toLowerCase().endsWith(".xls") ||
    name.toLowerCase().endsWith(".csv")
  );
}

async function fileToInlineData(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target.result; // data URL
      const base64 = String(result).split(",")[1] || "";
      resolve({
        data: base64,
        displayName: file.name,
        mimeType: file.type || "application/octet-stream",
      });
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

// --- Components ---

function ChatMessageText({ text }) {
  if (!text) return null;

  // Detect URLs like: /service_images/xxxxx.png
  const imageRegex = /\/service_images\/\S+\.(png|jpg|jpeg|gif|webp)/gi;
  const matches = text.match(imageRegex) || [];

  // Remove URLs from plain text so they don’t show as raw strings
  const cleanedText = text.replace(imageRegex, "").trim();

  const toAbsoluteUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http://") || path.startsWith("https://")) {
      return path;
    }
    return `${BASE_URL}${path}`;
  };

  return (
    <div className="chat-content">
      {cleanedText && <p style={{ lineHeight: 1.6 }}>{cleanedText}</p>}

      {matches.length > 0 && (
        <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
          {matches.map((src, idx) => (
            <img
              key={idx}
              src={toAbsoluteUrl(src)}
              alt={`Service Image ${idx + 1}`}
              style={{ maxWidth: '200px', borderRadius: '8px', border: '1px solid #E0D2C2' }}
            />
          ))}
        </div>
      )}
    </div>
  );
}


export default function ChatPage() {
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [currentFile, setCurrentFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  const [recognition, setRecognition] = useState(null);
  const [isListening, setIsListening] = useState(false);

  // TTS State
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load sessions + first session
  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        const sess = await listSessions();
        if (cancelled) return;

        setSessions(sess || []);

        if (sess && sess.length > 0) {
          const firstId = sess[0].id;
          setActiveSessionId(firstId);
          const full = await getSession(firstId);
          if (!cancelled) {
            setMessages(mapEventsToMessages(full.events));
          }
        } else {
          handleNewSession();
        }
      } catch (err) {
        console.error("Failed to load sessions:", err);
        if (!cancelled) setErrorMsg("Failed to load chat sessions.");
      }
    }

    init();

    return () => {
      cancelled = true;
    };
  }, []);

  // Init voice recognition
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      (!("webkitSpeechRecognition" in window) &&
        !("SpeechRecognition" in window))
    ) {
      return;
    }

    const SR =
      window.SpeechRecognition || window.webkitSpeechRecognition || null;
    if (!SR) return;

    const rec = new SR();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = "en-US";

    rec.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput((prev) =>
        prev ? `${prev.trim()} ${transcript}` : transcript
      );
      setIsListening(false);
    };

    rec.onerror = () => {
      setIsListening(false);
    };

    rec.onend = () => {
      setIsListening(false);
    };

    setRecognition(rec);
  }, []);

  async function handleSelectSession(id) {
    if (id === activeSessionId) return;
    setActiveSessionId(id);
    setMessages([]);
    setErrorMsg("");

    try {
      const full = await getSession(id);
      setMessages(mapEventsToMessages(full.events));
    } catch (err) {
      console.error("Failed to load session:", err);
      setErrorMsg("Failed to load this session.");
    }
  }

  async function handleNewSession() {
    setErrorMsg("");
    try {
      const session = await createSession();
      setSessions((prev) => [session, ...prev]);
      setActiveSessionId(session.id);
      setMessages([]);
    } catch (err) {
      console.error("Failed to create session:", err);
      setErrorMsg("Failed to create a new session.");
    }
  }

  async function handleDeleteSession(id, e) {
    e.stopPropagation();
    setErrorMsg("");
    try {
      await deleteSession(id);
      setSessions((prev) => prev.filter((s) => s.id !== id));

      if (id === activeSessionId) {
        const remaining = sessions.filter((s) => s.id !== id);
        if (remaining.length > 0) {
          const newId = remaining[0].id;
          setActiveSessionId(newId);
          const full = await getSession(newId);
          setMessages(mapEventsToMessages(full.events));
        } else {
          setActiveSessionId(null);
          setMessages([]);
          handleNewSession(); // Auto create new if empty
        }
      }
    } catch (err) {
      console.error("Failed to delete session:", err);
      setErrorMsg("Failed to delete session.");
    }
  }

  function handleVoiceClick() {
    if (!recognition) return;
    setIsListening(true);
    recognition.start();
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setCurrentFile(file);

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setFilePreview({
          type: "image",
          src: ev.target?.result,
          name: file.name,
        });
      };
      reader.readAsDataURL(file);
    } else {
      setFilePreview({
        type: "file",
        name: file.name,
      });
    }

    // Excel / CSV → auto process via backend
    if (isExcelLike(file)) {
      processAndSendFile(file);
    }
  }

  function clearFile() {
    setCurrentFile(null);
    setFilePreview(null);
  }

  async function processAndSendFile(file) {
    try {
      setLoading(true);
      setErrorMsg("");
      const result = await uploadFile(file);

      if (!result) {
        throw new Error("Empty response from file processor");
      }

      const message = `I've uploaded a file: ${result.filename}\n\n${result.content}\n\nPlease analyze this service data and help me add it to the system.`;

      await sendUserMessage(message, null);
      clearFile();
    } catch (err) {
      console.error("File processing error:", err);
      setErrorMsg("Failed to process file.");
    } finally {
      setLoading(false);
    }
  }

  async function sendUserMessage(text, fileForInline) {
    if (!activeSessionId) {
      setErrorMsg("No active session.");
      return;
    }
    if (!text && !fileForInline) return;

    const userMessage = {
      role: "user",
      text: text || (fileForInline ? `Sent file: ${fileForInline.name}` : ""),
      attachments: fileForInline
        ? [
          {
            displayName: fileForInline.name,
            mimeType: fileForInline.type,
          },
        ]
        : [],
    };

    setMessages((prev) => [...prev, userMessage]);

    setLoading(true);
    setErrorMsg("");

    try {
      let inlineData = null;
      if (fileForInline && !isExcelLike(fileForInline)) {
        inlineData = await fileToInlineData(fileForInline);
      }

      const contents = await sendMessageStream({
        sessionId: activeSessionId,
        text,
        inlineData,
      });

      const replyText = contents
        .flatMap((c) => c.parts || [])
        .map((p) => p.text || "")
        .join(" ")
        .trim();

      const replyAttachments = contents
        .flatMap((c) => c.parts || [])
        .filter((p) => p.inlineData)
        .map((p) => p.inlineData);

      if (replyText || replyAttachments.length > 0) {
        setMessages((prev) => [
          ...prev,
          {
            role: "model",
            text: replyText || "[No text response]",
            attachments: replyAttachments,
          },
        ]);

        // Auto-play TTS if voice is enabled
        if (voiceEnabled && replyText) {
          playTextToSpeech(replyText);
        }
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "model",
            text: "No response content from agent.",
            attachments: [],
          },
        ]);
      }
    } catch (err) {
      console.error("Failed to send message:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: "Error talking to agent. Check backend logs.",
          attachments: [],
        },
      ]);
      setErrorMsg("Chat request failed.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text && !currentFile) return;

    // If file is excel-like, it's already processed via processAndSendFile
    const nonExcelFile =
      currentFile && isExcelLike(currentFile) ? null : currentFile;

    setInput("");

    await sendUserMessage(text, nonExcelFile);

    if (nonExcelFile) {
      clearFile();
    }
  }

  async function playTextToSpeech(text) {
    try {
      const result = await speakText(text, selectedLanguage);
      if (result.success && result.audio_url) {
        const audio = new Audio(`${BASE_URL}${result.audio_url}`);
        audio.play().catch(err => console.error("Audio playback error:", err));
      }
    } catch (error) {
      console.error("TTS playback error:", error);
    }
  }

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--bg-light)', fontFamily: "'Inter', sans-serif" }}>
      {/* Inner Sidebar removed to avoid duplication */}

      {/* Main Content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>

        {/* Top Header */}
        <header style={{
          height: '72px',
          padding: '0 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(0,0,0,0.03)',
          background: '#FBF9F5'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: '#4B2E2B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Bot size={24} color="#F5EFE6" />
            </div>
            <h1 style={{ fontSize: '1.4rem', color: '#4B2E2B', fontWeight: 700, margin: '0 0 2px 0', fontFamily: "'Poppins', sans-serif" }}>Marine Fishery Agent</h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Language Selector */}
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              style={{
                padding: '6px 12px',
                background: '#F5EFE6',
                border: '1px solid #E0D2C2',
                borderRadius: '8px',
                color: '#6B3E2E',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
              <option value="kn">ಕನ್ನಡ</option>
            </select>

            {/* Voice Toggle */}
            <button
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              style={{
                padding: '6px 14px',
                background: voiceEnabled ? '#6B3E2E' : '#F5EFE6',
                color: voiceEnabled ? '#fff' : '#6B3E2E',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {voiceEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
              {voiceEnabled ? 'Voice On' : 'Voice Off'}
            </button>

            {/* Voice Input Indicator (Existing) */}
            <div style={{
              padding: '6px 14px',
              background: '#F5EFE6',
              borderRadius: '20px',
              color: '#6B3E2E',
              fontSize: '0.8rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Mic size={14} /> Voice Ready
            </div>
            <button
              onClick={handleNewSession}
              className="btn"
              style={{
                background: '#6B3E2E',
                color: '#fff',
                padding: '8px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                borderRadius: '10px',
                fontSize: '0.9rem'
              }}
            >
              <Plus size={16} /> New Session
            </button>
          </div>
        </header>

        {/* Chat Area - Card Container */}
        <div style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

          <div style={{
            flex: 1,
            background: '#fff',
            borderRadius: '16px',
            border: '1px solid rgba(0,0,0,0.05)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            maxWidth: '1200px',
            width: '100%',
            margin: '0 auto'
          }}>
            {/* Messages Area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>

              {/* Welcome / Empty State */}
              {messages.length === 0 && (
                <div style={{
                  display: 'flex',
                  gap: '16px',
                  maxWidth: '600px',
                  margin: '0',
                  padding: '24px',
                  border: '1px solid rgba(0,0,0,0.05)',
                  borderRadius: '16px',
                  background: '#FAFAFA'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: '#E8DCCB',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#4B2E2B'
                  }}>
                    <Bot size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1rem', color: '#4B2E2B', marginBottom: '8px' }}>Marine Fishery Agent</h3>
                    <p style={{ fontSize: '0.9rem', color: '#666', lineHeight: 1.5 }}>
                      I'm here to help you manage your vessels, catch batches, and auctions.
                      Try asking about "spoilage risks" or "active vessels".
                    </p>
                  </div>
                </div>
              )}

              {/* Messages Loop */}
              {messages.map((m, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  gap: '16px',
                  marginBottom: '24px',
                  justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start'
                }}>
                  {m.role !== 'user' && (
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: '#E8DCCB', // Agent Color
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#4B2E2B',
                      flexShrink: 0
                    }}>
                      <Bot size={18} />
                    </div>
                  )}

                  <div style={{
                    background: m.role === 'user' ? '#F5EFE6' : 'transparent',
                    padding: m.role === 'user' ? '16px 20px' : '0 10px',
                    borderRadius: m.role === 'user' ? '20px 20px 0 20px' : '0',
                    maxWidth: '70%',
                    color: '#3E2723'
                  }}>
                    {/* Attachments */}
                    {m.attachments && m.attachments.length > 0 && (
                      <div style={{ marginBottom: '8px' }}>
                        {m.attachments.map((att, i) => (
                          <div key={i} style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: '#fff',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            border: '1px solid rgba(0,0,0,0.1)'
                          }}>
                            <Paperclip size={12} /> {att.displayName || "Attachment"}
                          </div>
                        ))}
                      </div>
                    )}
                    <ChatMessageText text={m.text} />
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div style={{ padding: '24px', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
              {filePreview && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '12px',
                  padding: '8px 12px',
                  background: '#F5F5F5',
                  borderRadius: '8px',
                  width: 'fit-content'
                }}>
                  {filePreview.type === 'image' ? (
                    <ImageIcon size={16} color="#666" />
                  ) : (
                    <FileText size={16} color="#666" />
                  )}
                  <span style={{ fontSize: '0.85rem', color: '#444' }}>{filePreview.name}</span>
                  <button onClick={clearFile} style={{ border: 'none', background: 'transparent', cursor: 'pointer', marginLeft: '8px' }}>
                    <X size={14} color="#999" />
                  </button>
                </div>
              )}

              <form onSubmit={handleSubmit} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                background: '#FBF9F5',
                border: '1px solid #EAEAEA',
                borderRadius: '12px',
                padding: '12px 16px',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.01)'
              }}>
                <button
                  type="button"
                  onClick={handleVoiceClick}
                  style={{
                    border: 'none',
                    background: isListening ? '#FFEBEE' : '#F0EBE0',
                    color: isListening ? '#D32F2F' : '#6B3E2E',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <Mic size={18} />
                </button>

                <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  <input type="file" hidden onChange={handleFileChange} />
                  <div style={{ color: '#8D6E63' }}><Paperclip size={20} /></div>
                </label>

                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about inventory, sales, or warehouses..."
                  style={{
                    flex: 1,
                    border: 'none',
                    background: 'transparent',
                    fontSize: '1rem',
                    color: '#3E2723',
                    outline: 'none',
                    padding: '0 8px'
                  }}
                />

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    border: 'none',
                    background: loading ? '#A1887F' : '#8B6B64',
                    color: '#fff',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontWeight: 500
                  }}
                >
                  <Send size={16} /> Send
                </button>
              </form>
              <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '0.75rem', color: '#9E9E9E' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  AI can make mistakes. Please verify important data.
                </span>
              </div>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}

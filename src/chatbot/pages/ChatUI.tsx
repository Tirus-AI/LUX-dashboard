import React, { useState, useRef, useEffect } from "react";
import type { KeyboardEvent } from "react";
import {
  Box,
  Card,
  TextField,
  IconButton,
  Typography,
  Paper,
  Fade,
  CircularProgress
} from "@mui/material";
import { styled } from "@mui/system";
import { IoSend } from "react-icons/io5";
import type { ChatbotThemeConfig } from "../chatbotConfig";
import { useNavigate } from "react-router-dom";

interface MessageType {
  text: string;
  isUser: boolean;
}

interface MessageProps {
  isUser?: boolean;
}

const ChatContainer = styled(Card)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  maxWidth: 500,
  height: "85vh",
  [theme.breakpoints.down("sm")]: {
    width: "90vw",
    height: "80vh"
  },
  boxSizing: "border-box",
  borderRadius: "12px",
  overflow: "hidden"
}));

const MessageContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: "auto",
  padding: "20px",
  backgroundColor: theme.palette.mode === "light"
    ? theme.palette.grey[100]
    : theme.palette.grey[900],
  "&::-webkit-scrollbar": {
    width: "6px"
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: theme.palette.mode === "light"
      ? theme.palette.grey[400]
      : theme.palette.grey[800],
    borderRadius: "3px"
  }
}));

const Message = styled(Paper, {
  shouldForwardProp: (prop) => prop !== "isUser"
})<MessageProps>(({ theme, isUser }) => ({
  padding: "10px 16px",
  borderRadius: isUser ? "16px 16px 0 16px" : "16px 16px 16px 0",
  backgroundColor: isUser
    ? theme.palette.primary.main
    : theme.palette.mode === "light"
      ? theme.palette.grey[200]
      : theme.palette.grey[800],
  color: isUser
    ? theme.palette.primary.contrastText
    : theme.palette.mode === "light"
      ? theme.palette.text.primary
      : theme.palette.grey[300],
  maxWidth: "80%",
  marginBottom: "12px",
  marginLeft: isUser ? "auto" : "0",
  marginRight: isUser ? "0" : "auto",
  position: "relative",
  transition: "all 0.3s ease"
}));

const InputContainer = styled(Box)(({ theme }) => ({
  padding: "16px",
  borderTop: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  display: "flex",
  alignItems: "center",
  gap: "8px"
}));

interface ChatUIProps {
  config: any;
  themeConfig: ChatbotThemeConfig;
}
const ChatUI: React.FC<ChatUIProps> = ({ themeConfig }: ChatUIProps) => {
  const [messages, setMessages] = useState<MessageType[]>([
    { text: "Hi! How can I assist you with the graph? Feel free to ask a question.", isUser: false }
  ]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const looksAnalytic = (q: string) => {
    const s = q.toLowerCase();
    return (
      /\b(x|y)\s*[:=]\s*\w+/.test(s) ||                 // x: date, y: count
      /\b(by|group\s+by|per)\s+[a-z0-9_.-]+/.test(s) || // by owner, group by model
      /\b(vs|versus|compare|breakdown|distribution|trend|histogram)\b/.test(s) ||
      /\b(count|sum|total|avg|average|min|max|rank|top\s*\d+)\b/.test(s) ||
      /\b(daily|weekly|monthly|quarterly|yearly|over\s+time)\b/.test(s) ||
      /\b(chart|graph|plot|visuali[sz]e)\b/.test(s)
    );
  };

  const parseJSONSafe = (raw: string): any | null => {
    if (raw == null) return null;

    // strip BOM + trim
    let s = String(raw).replace(/^\uFEFF/, "").trim();

    // strip Angular/CSRF prelude like ")]}',"
    s = s.replace(/^\)\]\}',?\s*/, "");

    // 1) direct parse
    try { return JSON.parse(s); } catch {}

    // 2) quoted-JSON case: "\"{\\\"config\\\":{...}}\""
    if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
      const unquoted = s.slice(1, -1);
      // unescape common sequences
      const unescaped = unquoted
        .replace(/\\n/g, "\n")
        .replace(/\\r/g, "\r")
        .replace(/\\t/g, "\t")
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, "\\");
      try { return JSON.parse(unescaped); } catch {}
    }

    // 3) extract first balanced {...} or [...]
    const extractBalanced = (text: string): string | null => {
      const tryOne = (opener: "{" | "[", closer: "}" | "]") => {
        const start = text.indexOf(opener);
        if (start === -1) return null;
        let depth = 0, inStr = false, esc = false;
        for (let i = start; i < text.length; i++) {
          const ch = text[i];
          if (esc) { esc = false; continue; }
          if (ch === "\\") { esc = true; continue; }
          if (ch === '"') inStr = !inStr;
          if (inStr) continue;
          if (ch === opener) depth++;
          else if (ch === closer) {
            depth--;
            if (depth === 0) return text.slice(start, i + 1);
          }
        }
        return null;
      };
      return tryOne("{", "}") ?? tryOne("[", "]");
    };

    const frag = extractBalanced(s);
    if (frag) { try { return JSON.parse(frag); } catch {} }

    return null;
  };

  /* ---------- INSERTED HELPERS: chart type normalization ---------- */
  const SUPPORTED_TYPES = ["line", "donut", "pie", "wave_bar"] as const;

  const TYPE_ALIAS: Record<string, typeof SUPPORTED_TYPES[number]> = {
    bar: "wave_bar",
    grouped_bar: "wave_bar",
    stacked_bar: "wave_bar",
    histogram: "wave_bar",
    column: "wave_bar",
    area: "line",
    scatter: "line",
  };

  function normalizeChartTypes(list?: string[] | null): string[] {
    const mapped = (list ?? [])
      .map((t) => TYPE_ALIAS[t] ?? t)
      .filter((t): t is typeof SUPPORTED_TYPES[number] => SUPPORTED_TYPES.includes(t as any));
    return Array.from(new Set(mapped)); // dedupe, keep order
  }

  function ensurePossibleCharts(cfg: any): string[] {
    let types = normalizeChartTypes(cfg?.possible_charts);
    if (!types.length) {
      const multiSeries = Array.isArray(cfg?.y);
      types = multiSeries ? ["line", "wave_bar"] : ["line", "wave_bar", "donut"];
    }
    // If you never want pie from live AI, uncomment:
    // types = types.filter((t) => t !== "pie");
    return types;
  }
  /* ---------------------------------------------------------------- */

  // --- main send
  const handleSend = async () => {
    const msg = newMessage.trim();
    if (!msg) return;

    setMessages((prev) => [...prev, { text: msg, isUser: true }]);
    setNewMessage("");
    setIsTyping(true);

    // const API_BASE = "http://127.0.0.1:5000";
    const API_BASE = "https://htwj1163-5000.euw.devtunnels.ms";
    const wantsAnalytics = looksAnalytic(msg);
    const endpoint = wantsAnalytics ? "/analytics" : "/";

    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 20000);

      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ question: msg }),
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (!res.ok) {
        const errBody = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status} — ${errBody.slice(0, 200) || res.statusText}`);
      }

      const ct = res.headers.get("content-type") || "";
      let data: any = null;

      if (ct.includes("application/json")) {
        data = await res.json();
      } else {
        const raw = await res.text();
        data = parseJSONSafe(raw);
        console.debug("Non-JSON analytics response", { ct, preview: raw.slice(0, 200) });
      }

      if (!data) {
        setMessages((prev) => [...prev, { text: "No answer found.", isUser: false }]);
        return;
      }

      // --- analytics branch
      if (wantsAnalytics) {
        let config: any = data?.config;
        if (!config && Array.isArray(data?.data)) config = { data: data.data };
        if (!config && Array.isArray(data))      config = { data };

        if (config) {
          // ✅ normalize/alias to names your renderer supports
          config.possible_charts = ensurePossibleCharts(config);

          const detail = { question: msg, cypher: data?.cypher, config };
          try { sessionStorage.setItem("tirus_analytics_last", JSON.stringify(detail)); } catch {}
          navigate("/analytics", { state: detail });

          setMessages((p) => [...p, { text: "Analytics generated — opening Analytics page 📊", isUser: false }]);
          return;
        }
      }

      // --- normal Q&A
      const answer = String(data?.result ?? data?.answer ?? "").trim();
      setMessages((prev) => [...prev, { text: answer || "No answer found.", isUser: false }]);

    } catch (err) {
      setMessages((prev) => [...prev, { text: `Error: ${(err as Error).message}`, isUser: false }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <ChatContainer role="region" aria-label="Chat interface" sx={{ backgroundColor: themeConfig.chatContainerBg }}>
      <MessageContainer>
        {messages.map((message, index) => (
          <Fade in={true} key={index} timeout={500}>
            <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2, gap: 1 }}>
              {!message.isUser && (
                <img src="/assets/Tir.svg" alt="bot" width={40} height={40} />
              )}
              <Message isUser={message.isUser}>
                <Typography variant="body1">{message.text}</Typography>
              </Message>
            </Box>
          </Fade>
        ))}
        {isTyping && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, ml: 5 }}>
            <CircularProgress size={20} />
            <Typography variant="caption">Bot is typing...</Typography>
          </Box>
        )}
        <div ref={messagesEndRef} />
      </MessageContainer>
      <InputContainer>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          size="small"
          aria-label="Message input"
          multiline
          maxRows={3}
        />
        <IconButton
          color="primary"
          onClick={handleSend}
          disabled={!newMessage.trim()}
          aria-label="Send message"
          sx={{
            bgcolor: themeConfig.buttonColor,
            color: '#fff',
            '&:hover': { bgcolor: themeConfig.buttonHoverColor },
            '&.Mui-disabled': {
              bgcolor: 'grey.600',
              color: 'grey.500',
            },
            width: 40, height: 40,
          }}
        >
          {themeConfig.sendIcon ?? <IoSend />}
        </IconButton>
      </InputContainer>
    </ChatContainer>
  );
};

export default ChatUI;

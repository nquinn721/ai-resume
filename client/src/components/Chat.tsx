import { Send as SendIcon } from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  Paper,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { observer } from "mobx-react-lite";
import React, { useEffect, useRef, useState } from "react";
import { appStore } from "../stores/AppStore";

const Chat = observer(() => {
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [appStore.messages]);

  useEffect(() => {
    scrollToBottom();
  }, [appStore.isTyping]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const message = inputValue.trim();
    setInputValue("");

    await appStore.sendMessage(message);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card
      sx={{
        height: isMobile ? "calc(100vh - 200px)" : "600px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardContent
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column", p: 0 }}
      >
        {/* Messages Container */}
        <Box
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            p: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {appStore.formattedMessages.map((message) => (
            <Box
              key={message.id}
              sx={{
                display: "flex",
                justifyContent:
                  message.sender === "user" ? "flex-end" : "flex-start",
                mb: 1,
              }}
            >
              <Paper
                elevation={3}
                sx={{
                  p: 2,
                  maxWidth: "80%",
                  background:
                    message.sender === "user" 
                      ? "linear-gradient(135deg, #00e676, #00b248)"
                      : "linear-gradient(135deg, #1a1e3a, #2a2e4a)",
                  color: "#ffffff",
                  borderRadius: 3,
                  border: message.sender === "bot" ? "1px solid #03dac6" : "none",
                  boxShadow: message.sender === "user" 
                    ? "0 4px 15px rgba(0, 230, 118, 0.3)"
                    : "0 4px 15px rgba(3, 218, 198, 0.2)",
                  position: "relative",
                  "&::before": message.sender === "bot" ? {
                    content: '""',
                    position: "absolute",
                    top: -1,
                    left: -1,
                    right: -1,
                    bottom: -1,
                    background: "linear-gradient(45deg, #03dac6, #ff6ec7)",
                    borderRadius: 3,
                    zIndex: -1,
                    opacity: 0.3,
                  } : {},
                }}
              >
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {message.text}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    opacity: 0.7,
                    fontSize: "0.75rem",
                  }}
                >
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Typography>
              </Paper>
            </Box>
          ))}

          {appStore.isTyping && (
            <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 1 }}>
              <Paper
                elevation={3}
                sx={{
                  p: 2,
                  background: "linear-gradient(135deg, #1a1e3a, #2a2e4a)",
                  borderRadius: 3,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  border: "1px solid #03dac6",
                  boxShadow: "0 4px 15px rgba(3, 218, 198, 0.2)",
                }}
              >
                <CircularProgress 
                  size={16} 
                  sx={{ 
                    color: "#03dac6",
                    animation: "pulse 1.5s infinite"
                  }} 
                />
                <Typography variant="body2" sx={{ color: "#03dac6", fontWeight: 500 }}>
                  AI is typing...
                </Typography>
              </Paper>
            </Box>
          )}

          <div ref={messagesEndRef} />
        </Box>

        {/* Input Container */}
        <Box
          sx={{
            p: 2,
            borderTop: 1,
            borderColor: "divider",
            backgroundColor: "background.paper",
          }}
        >
          <Box sx={{ display: "flex", gap: 1, alignItems: "flex-end" }}>
            <TextField
              fullWidth
              multiline
              maxRows={4}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about my resume..."
              variant="outlined"
              size="small"
              sx={{ flexGrow: 1 }}
            />
            <IconButton
              onClick={handleSend}
              disabled={!inputValue.trim() || appStore.isTyping}
              sx={{
                background: "linear-gradient(135deg, #00e676, #00b248)",
                color: "#ffffff",
                width: 48,
                height: 48,
                "&:hover": {
                  background: "linear-gradient(135deg, #66ffa6, #00e676)",
                  transform: "scale(1.05)",
                  boxShadow: "0 4px 15px rgba(0, 230, 118, 0.4)",
                },
                "&:disabled": {
                  background: "grey.600",
                  color: "grey.400",
                },
                transition: "all 0.3s ease",
              }}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
});

export default Chat;

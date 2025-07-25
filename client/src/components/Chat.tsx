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
import ReactMarkdown from "react-markdown";
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

  // Additional scroll trigger for when new messages are added
  useEffect(() => {
    const timeoutId = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timeoutId);
  }, [appStore.messages.length]);

  const handleSend = async () => {
    if (!inputValue.trim() || appStore.isTyping) return;

    const message = inputValue.trim();
    
    // Send message and clear input
    await appStore.sendMessage(message);
    setInputValue("");
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
        height: isMobile ? "calc(100vh - 90px)" : "calc(100vh - 110px)",
        maxHeight: isMobile ? "calc(100vh - 90px)" : "870px",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden", // Prevent card from growing
      }}
    >
      <CardContent
        sx={{ 
          flexGrow: 1, 
          display: "flex", 
          flexDirection: "column", 
          p: 0,
          minHeight: 0, // Important for flex scroll
          overflow: "hidden",
          "&:last-child": {
            paddingBottom: 0, // Override MUI default
          },
        }}
      >
        {/* Messages Container */}
        <Box
          className="chat-container"
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            overflowX: "hidden",
            p: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            minHeight: 0, // Important for flex scroll
            maxHeight: "100%",
            scrollBehavior: "smooth",
            "&::-webkit-scrollbar": {
              width: "6px",
            },
            "&::-webkit-scrollbar-track": {
              background: "rgba(0,0,0,0.1)",
              borderRadius: "3px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "rgba(0, 230, 118, 0.3)",
              borderRadius: "3px",
              "&:hover": {
                background: "rgba(0, 230, 118, 0.5)",
              },
            },
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
                  border:
                    message.sender === "bot" ? "1px solid #03dac6" : "none",
                  boxShadow:
                    message.sender === "user"
                      ? "0 4px 15px rgba(0, 230, 118, 0.3)"
                      : "0 4px 15px rgba(3, 218, 198, 0.2)",
                  position: "relative",
                  "&::before":
                    message.sender === "bot"
                      ? {
                          content: '""',
                          position: "absolute",
                          top: -1,
                          left: -1,
                          right: -1,
                          bottom: -1,
                          background:
                            "linear-gradient(45deg, #03dac6, #ff6ec7)",
                          borderRadius: 3,
                          zIndex: -1,
                          opacity: 0.3,
                        }
                      : {},
                }}
              >
                {message.sender === "bot" ? (
                  <Box sx={{ mb: 1 }}>
                    <ReactMarkdown
                      components={{
                        h1: ({ children }) => (
                          <Typography variant="h5" sx={{ color: "#ffffff", fontWeight: 700, mb: 1 }}>
                            {children}
                          </Typography>
                        ),
                        h2: ({ children }) => (
                          <Typography variant="h6" sx={{ color: "#ffffff", fontWeight: 600, mb: 1 }}>
                            {children}
                          </Typography>
                        ),
                        h3: ({ children }) => (
                          <Typography variant="subtitle1" sx={{ color: "#ffffff", fontWeight: 600, mb: 0.5 }}>
                            {children}
                          </Typography>
                        ),
                        p: ({ children }) => (
                          <Typography variant="body1" sx={{ color: "#ffffff", mb: 1, lineHeight: 1.6 }}>
                            {children}
                          </Typography>
                        ),
                        strong: ({ children }) => (
                          <Box component="span" sx={{ fontWeight: 700, color: "#00e676" }}>
                            {children}
                          </Box>
                        ),
                        ul: ({ children }) => (
                          <Box component="ul" sx={{ pl: 2, mb: 1, color: "#ffffff" }}>
                            {children}
                          </Box>
                        ),
                        li: ({ children }) => (
                          <Box component="li" sx={{ mb: 0.5, color: "#ffffff" }}>
                            {children}
                          </Box>
                        ),
                        code: ({ children }) => (
                          <Box
                            component="code"
                            sx={{
                              backgroundColor: "rgba(0, 230, 118, 0.1)",
                              color: "#00e676",
                              padding: "0.2rem 0.4rem",
                              borderRadius: "4px",
                              fontSize: "0.9em",
                              fontFamily: "monospace",
                            }}
                          >
                            {children}
                          </Box>
                        ),
                      }}
                    >
                      {message.text}
                    </ReactMarkdown>
                  </Box>
                ) : (
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    {message.text}
                  </Typography>
                )}
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
                    animation: "pulse 1.5s infinite",
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{ color: "#03dac6", fontWeight: 500 }}
                >
                  AI is typing...
                </Typography>
              </Paper>
            </Box>
          )}

          <div 
            ref={messagesEndRef} 
            style={{ 
              height: "1px", 
              width: "100%", 
              flexShrink: 0 
            }} 
          />
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
              disabled={appStore.isTyping}
              sx={{ 
                flexGrow: 1,
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "background.paper",
                },
              }}
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

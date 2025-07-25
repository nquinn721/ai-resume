import { faLightbulb } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Chat as ChatIcon,
  Close as CloseIcon,
  Description as DescriptionIcon,
  Menu as MenuIcon,
  SmartToy as RobotIcon,
} from "@mui/icons-material";
import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  CssBaseline,
  Dialog,
  DialogContent,
  DialogTitle,
  Drawer,
  IconButton,
  ThemeProvider,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import "./App.css";
import Chat from "./components/Chat";
import Projects from "./components/Projects";
import { appStore } from "./stores/AppStore";
import { theme } from "./theme";

const App = observer(() => {
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("md"));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && appStore.isResumeModalOpen) {
        appStore.closeResumeModal();
      }
    };

    if (appStore.isResumeModalOpen) {
      document.addEventListener("keydown", handleEscKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [appStore.isResumeModalOpen]);

  const handleSuggestionClick = (suggestion: string) => {
    // Send the suggestion directly to the store
    appStore.sendMessage(suggestion);

    // Close mobile menu if open
    setMobileMenuOpen(false);

    // Scroll to chat
    const chatContainer = document.querySelector(".chat-container");
    if (chatContainer) {
      chatContainer.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const suggestions = [
    "What's your professional experience?",
    "Tell me about your technical skills",
    "Show me your projects and portfolio",
    "Why should we hire you?",
    "What makes you different from other developers?",
  ];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          flexGrow: 1,
          minHeight: "100vh",
          backgroundColor: "background.default",
        }}
      >
        {/* App Bar */}
        <AppBar position="static" elevation={2}>
          <Toolbar>
            <RobotIcon sx={{ mr: 2 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              AI Resume Assistant
            </Typography>
            <Button
              color="inherit"
              startIcon={<DescriptionIcon />}
              onClick={() => appStore.openResumeModal()}
              sx={{ mr: 2 }}
            >
              {!isMobile && "View Resume"}
            </Button>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                px: 2,
                py: 0.5,
                borderRadius: 1,
                backgroundColor:
                  appStore.connectionStatusClass === "connected"
                    ? "success.main"
                    : appStore.connectionStatusClass === "checking"
                    ? "info.main"
                    : "error.main",
                color: "white",
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: "currentColor",
                }}
              />
              <Typography variant="body2">
                {appStore.apiStatus || "Checking..."}
              </Typography>
            </Box>
            {isMobile && (
              <IconButton
                color="inherit"
                onClick={() => setMobileMenuOpen(true)}
                sx={{ ml: 1 }}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Container maxWidth="xl" sx={{ py: 3 }}>
          {isMobile ? (
            // Mobile Layout
            <Box>
              <Chat />

              {/* Mobile Drawer */}
              <Drawer
                anchor="right"
                open={mobileMenuOpen}
                onClose={() => setMobileMenuOpen(false)}
                PaperProps={{
                  sx: { width: "90%", maxWidth: 400 },
                }}
              >
                <Box sx={{ p: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Typography variant="h6">Menu</Typography>
                    <IconButton onClick={() => setMobileMenuOpen(false)}>
                      <CloseIcon />
                    </IconButton>
                  </Box>

                  {/* Suggestions in mobile drawer */}
                  <Card sx={{ mb: 3 }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        <ChatIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                        Quick Questions
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                      >
                        Get to know Nathan through these suggested questions:
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 1,
                        }}
                      >
                        {suggestions.map((suggestion, index) => (
                          <Chip
                            key={index}
                            label={suggestion}
                            onClick={() => handleSuggestionClick(suggestion)}
                            clickable
                            variant="outlined"
                            sx={{
                              justifyContent: "flex-start",
                              height: "auto",
                              py: 1,
                            }}
                          />
                        ))}
                      </Box>
                    </CardContent>
                  </Card>

                  {/* Projects in mobile drawer */}
                  <Projects />
                </Box>
              </Drawer>
            </Box>
          ) : (
            // Desktop Layout
            <Box sx={{ display: "flex", gap: 3 }}>
              {/* Left Sidebar - Suggestions */}
              <Box sx={{ width: 300, flexShrink: 0 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      <ChatIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                      Chat with Nathan's AI Assistant
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      Get to know Nathan Quinn through an interactive
                      conversation! Ask about his experience, skills, projects,
                      or anything else you'd like to learn.
                    </Typography>
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                    >
                      {suggestions.map((suggestion, index) => (
                        <Chip
                          key={index}
                          label={suggestion}
                          onClick={() => handleSuggestionClick(suggestion)}
                          clickable
                          variant="outlined"
                          sx={{
                            justifyContent: "flex-start",
                            height: "auto",
                            py: 1,
                          }}
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Box>

              {/* Center - Chat */}
              <Box sx={{ flexGrow: 1 }}>
                <Chat />
              </Box>

              {/* Right Sidebar - Projects */}
              <Box sx={{ width: 300, flexShrink: 0 }}>
                <Projects />
              </Box>
            </Box>
          )}
        </Container>

        {/* Resume Modal */}
        <Dialog
          open={appStore.isResumeModalOpen}
          onClose={() => appStore.closeResumeModal()}
          maxWidth="md"
          fullWidth
          fullScreen={isMobile}
        >
          <DialogTitle>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <DescriptionIcon sx={{ mr: 1 }} />
                Nathan's Full Resume
              </Box>
              <IconButton onClick={() => appStore.closeResumeModal()}>
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            {appStore.isLoadingResume ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  py: 4,
                }}
              >
                <FontAwesomeIcon icon={faLightbulb} className="loading-icon" />
                <Typography sx={{ mt: 2 }}>
                  Loading resume content...
                </Typography>
              </Box>
            ) : appStore.resumeContent ? (
              <Box
                dangerouslySetInnerHTML={{ __html: appStore.resumeContent }}
                sx={{
                  "& *": {
                    maxWidth: "100%",
                  },
                }}
              />
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  py: 4,
                }}
              >
                <DescriptionIcon
                  sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}
                />
                <Typography variant="h6" gutterBottom>
                  Failed to load resume content
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  Please try again.
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => appStore.loadResume()}
                >
                  Retry
                </Button>
              </Box>
            )}
          </DialogContent>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
});

export default App;

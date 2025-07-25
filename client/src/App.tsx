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
        <AppBar
          position="static"
          elevation={0}
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                "linear-gradient(135deg, rgba(0, 230, 118, 0.8) 0%, rgba(255, 110, 199, 0.8) 100%)",
              zIndex: -1,
            },
          }}
        >
          <Toolbar>
            <RobotIcon sx={{ mr: 2, color: "#fff" }} />
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, color: "#fff", fontWeight: 600 }}
            >
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
                justifyContent: "center",
                width: 16,
                height: 16,
                borderRadius: "50%",
                background:
                  appStore.connectionStatusClass === "connected"
                    ? "linear-gradient(45deg, #00e676, #00b248)"
                    : appStore.connectionStatusClass === "checking"
                    ? "linear-gradient(45deg, #03dac6, #018786)"
                    : "linear-gradient(45deg, #ff5722, #d84315)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                animation:
                  appStore.connectionStatusClass === "checking"
                    ? "pulse 1.5s infinite"
                    : "none",
                "@keyframes pulse": {
                  "0%": { opacity: 1 },
                  "50%": { opacity: 0.5 },
                  "100%": { opacity: 1 },
                },
              }}
            />
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
                    <Typography variant="h6" sx={{ color: "#ffffff" }}>
                      Menu
                    </Typography>
                    <IconButton onClick={() => setMobileMenuOpen(false)}>
                      <CloseIcon />
                    </IconButton>
                  </Box>

                  {/* Suggestions in mobile drawer */}
                  <Card sx={{ mb: 3 }}>
                    <CardContent>
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ color: "#ffffff" }}
                      >
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
                              borderColor: "primary.main",
                              color: "primary.main",
                              "&:hover": {
                                background:
                                  "linear-gradient(45deg, rgba(0, 230, 118, 0.1), rgba(255, 110, 199, 0.1))",
                                borderColor: "secondary.main",
                                color: "secondary.main",
                                transform: "translateY(-2px)",
                                boxShadow: "0 4px 12px rgba(0, 230, 118, 0.3)",
                              },
                              transition: "all 0.3s ease",
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
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ color: "#ffffff" }}
                    >
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
                            borderColor: "primary.main",
                            color: "primary.main",
                            "&:hover": {
                              background:
                                "linear-gradient(45deg, rgba(0, 230, 118, 0.1), rgba(255, 110, 199, 0.1))",
                              borderColor: "secondary.main",
                              color: "secondary.main",
                              transform: "translateY(-2px)",
                              boxShadow: "0 4px 12px rgba(0, 230, 118, 0.3)",
                            },
                            transition: "all 0.3s ease",
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
          <DialogTitle
            sx={{
              backgroundColor: "#1a1e3a",
              color: "#e2e8f0",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <DescriptionIcon sx={{ mr: 1, color: "#00e676" }} />
                Nathan's Full Resume
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Button
                  variant="contained"
                  href="/resume/Nathan-Resume.docx"
                  download="Nathan_Quinn_Resume.docx"
                  size="small"
                  sx={{
                    background:
                      "linear-gradient(135deg, #00e676 0%, #ff6ec7 50%, #03dac6 100%)",
                    color: "#fff",
                    fontWeight: 600,
                    px: 2,
                    py: 0.5,
                    borderRadius: 1.5,
                    textTransform: "none",
                    fontSize: "0.8rem",
                    boxShadow: "0 2px 8px rgba(0, 230, 118, 0.3)",
                    "&:hover": {
                      transform: "translateY(-1px)",
                      boxShadow: "0 4px 12px rgba(0, 230, 118, 0.4)",
                    },
                    transition: "all 0.3s ease",
                  }}
                  startIcon={<DescriptionIcon sx={{ fontSize: "1rem" }} />}
                >
                  Download
                </Button>
                <IconButton
                  onClick={() => appStore.closeResumeModal()}
                  sx={{ color: "#e2e8f0" }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            </Box>
          </DialogTitle>
          <DialogContent
            sx={{
              backgroundColor: "#0a0e27",
              color: "#e2e8f0",
              padding: "2rem",
            }}
          >
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
                <Typography sx={{ mt: 2, color: "#e2e8f0" }}>
                  Loading resume content...
                </Typography>
              </Box>
            ) : appStore.resumeContent ? (
              <Box
                className="resume-content"
                dangerouslySetInnerHTML={{ __html: appStore.resumeContent }}
                sx={{
                  "& *": {
                    maxWidth: "100%",
                  },
                  "& h1": {
                    color: "#f1f5f9 !important",
                    fontSize: "1.8rem",
                    fontWeight: 700,
                    marginBottom: "1rem",
                    textAlign: "center",
                    borderBottom: "3px solid #00e676",
                    paddingBottom: "0.5rem",
                  },
                  "& h2": {
                    color: "#cbd5e1 !important",
                    fontSize: "1.3rem",
                    fontWeight: 600,
                    marginTop: "1.5rem",
                    marginBottom: "0.75rem",
                    borderLeft: "4px solid #ff6ec7",
                    paddingLeft: "0.75rem",
                  },
                  "& h3": {
                    color: "#94a3b8 !important",
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    marginTop: "1rem",
                    marginBottom: "0.5rem",
                  },
                  "& p": {
                    color: "#e2e8f0 !important",
                    lineHeight: 1.6,
                    marginBottom: "0.75rem",
                  },
                  "& strong": {
                    color: "#00e676 !important",
                    fontWeight: 700,
                  },
                  "& ul": {
                    paddingLeft: "1.5rem",
                    marginBottom: "1rem",
                  },
                  "& li": {
                    color: "#cbd5e1 !important",
                    marginBottom: "0.25rem",
                  },
                  "& .resume-date": {
                    background: "rgba(251, 191, 36, 0.4) !important",
                    color: "#fbbf24 !important",
                    padding: "0.1rem 0.3rem !important",
                    borderRadius: "4px !important",
                    fontWeight: 600,
                  },
                  "& .resume-company": {
                    color: "#ff6ec7 !important",
                    fontWeight: 700,
                    fontSize: "1.1em !important",
                  },
                  "& .resume-tech": {
                    background: "rgba(167, 139, 250, 0.3) !important",
                    color: "#c4b5fd !important",
                    border: "1px solid rgba(167, 139, 250, 0.6) !important",
                    padding: "0.1rem 0.3rem !important",
                    borderRadius: "4px !important",
                    fontWeight: 600,
                  },
                  "& .resume-job-title": {
                    color: "#34d399 !important",
                    fontWeight: 700,
                    fontSize: "1.1em !important",
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
                  sx={{ fontSize: 48, color: "#94a3b8", mb: 2 }}
                />
                <Typography variant="h6" gutterBottom sx={{ color: "#e2e8f0" }}>
                  Failed to load resume content
                </Typography>
                <Typography sx={{ mb: 2, color: "#94a3b8" }}>
                  Please try again.
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => appStore.loadResume()}
                  sx={{
                    background:
                      "linear-gradient(135deg, #00e676 0%, #ff6ec7 50%, #03dac6 100%)",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #00c766 0%, #e55cb7 50%, #02b8a6 100%)",
                    },
                  }}
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

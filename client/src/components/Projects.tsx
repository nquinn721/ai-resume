import { faRocket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Code as CodeIcon,
  Launch as LaunchIcon,
  Lightbulb as LightbulbIcon,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { resumeApi } from "../api/ResumeApi";

interface Project {
  name: string;
  url: string;
  description: string;
  stack: string[];
}

const Projects = observer(() => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setIsLoading(true);
      const response = await resumeApi.getProjects();

      if (response.success && response.data.projects) {
        const projectsArray = Object.entries(response.data.projects).map(
          ([key, projectData]: [string, any]) => ({
            name: formatProjectName(key),
            url: projectData.url || projectData,
            description: projectData.description || getProjectDescription(key),
            stack: projectData.stack || [],
          })
        );
        setProjects(projectsArray);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load projects");
    } finally {
      setIsLoading(false);
    }
  };

  const formatProjectName = (key: string): string => {
    return key
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const getProjectDescription = (key: string): string => {
    const descriptions: Record<string, string> = {
      "stock-trader":
        "Full-stack trading application with real-time market data, portfolio management, and interactive trading interface. Built with Claude's assistance for architecture design and React optimization.",
      "space-fighters":
        "Interactive browser-based game featuring real-time multiplayer gameplay, canvas graphics, and user authentication. Developed with Gemini's help for game logic and performance optimization.",
    };
    return (
      descriptions[key] ||
      "An innovative web application showcasing modern development practices, built with AI assistance for enhanced functionality."
    );
  };

  const handleProjectClick = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (isLoading) {
    return (
      <Card
        sx={{
          background: "linear-gradient(135deg, #1a1e3a, #2a2e4a)",
          border: "1px solid #03dac6",
          boxShadow: "0 4px 15px rgba(3, 218, 198, 0.2)",
        }}
      >
        <CardContent>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ color: "#03dac6", fontWeight: 600 }}
          >
            <FontAwesomeIcon
              icon={faRocket}
              style={{ marginRight: "8px", color: "#ff6ec7" }}
            />
            Live Projects
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            AI-Assisted applications built with Claude & Gemini
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              py: 4,
            }}
          >
            <CircularProgress
              size={32}
              sx={{
                mb: 2,
                color: "#00e676",
                animation: "pulse 1.5s infinite",
              }}
            />
            <Typography variant="body2" sx={{ color: "#03dac6" }}>
              Loading projects...
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card
        sx={{
          background: "linear-gradient(135deg, #1a1e3a, #2a2e4a)",
          border: "1px solid #ff5722",
          boxShadow: "0 4px 15px rgba(255, 87, 34, 0.2)",
        }}
      >
        <CardContent>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ color: "#03dac6", fontWeight: 600 }}
          >
            <FontAwesomeIcon
              icon={faRocket}
              style={{ marginRight: "8px", color: "#ff6ec7" }}
            />
            Live Projects
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Explore Nathan's deployed applications
          </Typography>
          <Alert
            severity="error"
            sx={{
              mt: 2,
              background:
                "linear-gradient(135deg, rgba(255, 87, 34, 0.1), rgba(211, 47, 47, 0.1))",
              border: "1px solid #ff5722",
              color: "#ff5722",
            }}
          >
            <Typography variant="body2" gutterBottom>
              Unable to load projects at the moment.
            </Typography>
            <Button
              onClick={loadProjects}
              variant="outlined"
              size="small"
              sx={{
                mt: 1,
                borderColor: "#ff5722",
                color: "#ff5722",
                "&:hover": {
                  background: "rgba(255, 87, 34, 0.1)",
                  borderColor: "#ff8a65",
                },
              }}
            >
              Try Again
            </Button>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      sx={{
        background: "linear-gradient(135deg, #1a1e3a, #2a2e4a)",
        border: "1px solid #03dac6",
        boxShadow: "0 4px 15px rgba(3, 218, 198, 0.2)",
      }}
    >
      <CardContent>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ color: "#03dac6", fontWeight: 600 }}
        >
          <FontAwesomeIcon
            icon={faRocket}
            style={{ marginRight: "8px", color: "#ff6ec7" }}
          />
          Live Projects
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          AI-Assisted applications built with Claude & Gemini
        </Typography>

        <Stack spacing={2} sx={{ mt: 2 }}>
          {projects.map((project, index) => (
            <Card
              key={index}
              variant="outlined"
              sx={{
                cursor: "pointer",
                transition: "all 0.3s ease-in-out",
                background:
                  "linear-gradient(135deg, rgba(0, 230, 118, 0.05), rgba(255, 110, 199, 0.05))",
                border: "1px solid rgba(3, 218, 198, 0.3)",
                "&:hover": {
                  boxShadow: "0 8px 25px rgba(0, 230, 118, 0.3)",
                  transform: "translateY(-4px)",
                  border: "1px solid #00e676",
                  background:
                    "linear-gradient(135deg, rgba(0, 230, 118, 0.1), rgba(255, 110, 199, 0.1))",
                },
              }}
              onClick={() => handleProjectClick(project.url)}
            >
              <CardContent sx={{ p: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 1,
                  }}
                >
                  <Typography variant="subtitle1" fontWeight="medium">
                    {project.name}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        backgroundColor: "success.main",
                      }}
                    />
                    <Typography variant="caption" color="success.main">
                      Live
                    </Typography>
                  </Box>
                </Box>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {project.description}
                </Typography>

                {project.stack && project.stack.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        mb: 1,
                      }}
                    >
                      <CodeIcon fontSize="small" color="action" />
                      <Typography variant="caption" color="text.secondary">
                        Tech Stack
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {project.stack.map((tech, techIndex) => (
                        <Chip
                          key={techIndex}
                          label={tech}
                          size="small"
                          variant="outlined"
                          sx={{
                            fontSize: "0.7rem",
                            height: 20,
                            borderColor: "#03dac6",
                            color: "#03dac6",
                            "&:hover": {
                              borderColor: "#ff6ec7",
                              color: "#ff6ec7",
                              backgroundColor: "rgba(255, 110, 199, 0.1)",
                            },
                            transition: "all 0.2s ease",
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    {new URL(project.url).hostname}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Typography variant="caption" color="primary">
                      Launch App
                    </Typography>
                    <LaunchIcon fontSize="small" color="primary" />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>

        <Alert severity="info" sx={{ mt: 3 }} icon={<LightbulbIcon />}>
          <Typography variant="body2">
            <strong>Note:</strong> These are fully functional applications
            hosted on Google Cloud Platform. Click on any card to interact with
            the live demos!
          </Typography>
        </Alert>
      </CardContent>
    </Card>
  );
});

export default Projects;

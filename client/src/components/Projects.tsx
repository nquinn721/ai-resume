import {
  faCode,
  faLightbulb,
  faRocket,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { resumeApi } from "../api/ResumeApi";
import "./Projects.css";

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
      <div className="projects-container">
        <div className="projects-header">
          <h2>
            <FontAwesomeIcon icon={faRocket} className="projects-icon" /> Live
            Projects
          </h2>
          <p>AI-Assisted applications built with Claude & Gemini</p>
        </div>
        <div className="projects-loading">
          <div className="loading-spinner"></div>
          <p>Loading projects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="projects-container">
        <div className="projects-header">
          <h2>
            <FontAwesomeIcon icon={faRocket} className="projects-icon" /> Live
            Projects
          </h2>
          <p>Explore Nathan's deployed applications</p>
        </div>
        <div className="projects-error">
          <p>Unable to load projects at the moment.</p>
          <button onClick={loadProjects} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="projects-container">
      <div className="projects-header">
        <h2>
          <FontAwesomeIcon icon={faRocket} className="projects-icon" /> Live
          Projects
        </h2>
        <p>AI-Assisted applications built with Claude & Gemini</p>
      </div>

      <div className="projects-grid">
        {projects.map((project, index) => (
          <div
            key={index}
            className="project-card"
            onClick={() => handleProjectClick(project.url)}
          >
            <div className="project-card-header">
              <h3>{project.name}</h3>
              <div className="project-status">
                <div className="status-dot"></div>
                <span>Live</span>
              </div>
            </div>

            <p className="project-description">{project.description}</p>

            {project.stack && project.stack.length > 0 && (
              <div className="project-stack">
                <FontAwesomeIcon icon={faCode} className="stack-icon" />
                <div className="stack-items">
                  {project.stack.map((tech, techIndex) => (
                    <span key={techIndex} className="stack-item">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="project-card-footer">
              <div className="project-url">{new URL(project.url).hostname}</div>
              <div className="project-action">
                <span>Launch App</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M7 17L17 7M17 7H7M17 7V17"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="projects-note">
        <p>
          <FontAwesomeIcon icon={faLightbulb} className="note-icon" />{" "}
          <strong>Note:</strong> These are fully functional applications hosted
          on Google Cloud Platform. Click on any card to interact with the live
          demos!
        </p>
      </div>
    </div>
  );
});

export default Projects;

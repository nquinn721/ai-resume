import {
  faComments,
  faFileAlt,
  faLightbulb,
  faRobot,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import "./App.css";
import Chat from "./components/Chat";
import Projects from "./components/Projects";
import { appStore } from "./stores/AppStore";

const App = observer(() => {
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
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="title-section">
            <h1>
              <FontAwesomeIcon icon={faRobot} className="header-icon" /> AI
              Resume Assistant
            </h1>
            <p className="subtitle">
              Discover my qualifications through intelligent conversation
            </p>
          </div>
          <div className="header-actions">
            <button
              className="header-resume-button"
              onClick={() => appStore.openResumeModal()}
            >
              <FontAwesomeIcon icon={faFileAlt} className="resume-icon" />
              <span>View Full Resume</span>
            </button>
            <div
              className={`status-indicator ${appStore.connectionStatusClass}`}
            >
              <div className="status-dot"></div>
              <span>{appStore.apiStatus}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="app-main-content">
          <aside className="sidebar left-sidebar">
            <div className="intro-section">
              <h2>
                <FontAwesomeIcon icon={faComments} className="chat-icon" /> Chat
                with Nathan's AI Assistant
              </h2>
              <p>
                Get to know Nathan Quinn through an interactive conversation!
                Ask about his experience, skills, projects, or anything else
                you'd like to learn. The AI has access to his complete resume
                and can give you detailed insights.
              </p>
              <div className="suggestion-chips">
                {suggestions.map((suggestion, index) => (
                  <span
                    key={index}
                    className="chip"
                    onClick={() => handleSuggestionClick(suggestion)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleSuggestionClick(suggestion);
                      }
                    }}
                  >
                    {suggestion}
                  </span>
                ))}
              </div>
            </div>
          </aside>

          <section className="chat-centerpiece">
            <Chat />
          </section>

          <aside className="sidebar right-sidebar">
            <Projects />
          </aside>
        </div>
      </main>

      {/* Resume Modal */}
      {appStore.isResumeModalOpen && (
        <div
          className="modal-overlay"
          onClick={() => appStore.closeResumeModal()}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                <FontAwesomeIcon icon={faFileAlt} className="modal-icon" />
                Nathan's Full Resume
              </h3>
              <button
                className="modal-close"
                onClick={() => appStore.closeResumeModal()}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="modal-body">
              {appStore.isLoadingResume ? (
                <div className="resume-loading">
                  <FontAwesomeIcon
                    icon={faLightbulb}
                    className="loading-icon"
                  />
                  <p>Loading resume content...</p>
                </div>
              ) : appStore.resumeContent ? (
                <div
                  className="resume-content"
                  dangerouslySetInnerHTML={{ __html: appStore.resumeContent }}
                />
              ) : (
                <div className="resume-error">
                  <FontAwesomeIcon icon={faFileAlt} className="error-icon" />
                  <p>Failed to load resume content. Please try again.</p>
                  <button
                    className="retry-button"
                    onClick={() => appStore.loadResume()}
                  >
                    Retry
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default App;

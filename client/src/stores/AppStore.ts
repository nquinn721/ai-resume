import { makeAutoObservable, runInAction } from "mobx";
import { ChatMessage, resumeApi } from "../api/ResumeApi";

export const ConnectionStatus = {
  CHECKING: "checking",
  CONNECTED: "connected",
  DISCONNECTED: "disconnected",
  ERROR: "error",
} as const;

export type ConnectionStatusType =
  (typeof ConnectionStatus)[keyof typeof ConnectionStatus];

export class AppStore {
  // Connection state
  connectionStatus: ConnectionStatusType = ConnectionStatus.CHECKING;
  apiStatus: string = "Checking...";
  lastHealthCheck: Date | null = null;

  // Chat state
  messages: ChatMessage[] = [];
  isTyping: boolean = false;
  chatError: string | null = null;

  // UI state
  isLoading: boolean = false;
  error: string | null = null;

  // Resume modal state
  isResumeModalOpen: boolean = false;
  resumeContent: string = "";
  isLoadingResume: boolean = false;

  constructor() {
    makeAutoObservable(this);
    this.initializeStore();
  }

  // Initialize store and check connection
  private async initializeStore() {
    this.addInitialMessage();
    await this.checkConnection();

    // Set up periodic health checks
    this.startHealthCheckInterval();
  }

  // Add initial bot message
  private addInitialMessage() {
    const initialMessage: ChatMessage = {
      id: "1",
      text: "Hi! I'm here to help you learn about my background and skills. What would you like to know?",
      sender: "bot",
      timestamp: new Date(),
    };
    this.messages.push(initialMessage);
  }

  // Connection management
  async checkConnection(): Promise<boolean> {
    try {
      runInAction(() => {
        this.connectionStatus = ConnectionStatus.CHECKING;
        this.apiStatus = "Checking...";
      });

      const response = await resumeApi.getHealthStatus();

      runInAction(() => {
        if (response.success) {
          this.connectionStatus = ConnectionStatus.CONNECTED;
          this.apiStatus = `Connected • ${response.data.status}`;
          this.lastHealthCheck = new Date();
          this.error = null;
        } else {
          this.connectionStatus = ConnectionStatus.DISCONNECTED;
          this.apiStatus = "Server Unavailable";
          this.error = response.message || "Health check failed";
        }
      });

      return response.success;
    } catch (error: any) {
      runInAction(() => {
        this.connectionStatus = ConnectionStatus.ERROR;
        this.apiStatus = "Connection Error";
        this.error = error.message || "Failed to connect to server";
      });
      return false;
    }
  }

  // Start periodic health checks
  private startHealthCheckInterval() {
    setInterval(() => {
      this.checkConnection();
    }, 30000); // Check every 30 seconds
  }

  // Chat operations
  async sendMessage(messageText: string): Promise<boolean> {
    if (!messageText.trim()) return false;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: messageText.trim(),
      sender: "user",
      timestamp: new Date(),
    };

    runInAction(() => {
      this.messages.push(userMessage);
      this.isTyping = true;
      this.chatError = null;
    });

    try {
      const response = await resumeApi.sendChatMessage(messageText);

      runInAction(() => {
        this.isTyping = false;

        if (response.success) {
          const botMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            text:
              response.data.response ||
              "I'm sorry, I didn't understand that. Could you please rephrase?",
            sender: "bot",
            timestamp: new Date(),
          };
          this.messages.push(botMessage);
          this.chatError = null;
        } else {
          const errorMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            text:
              response.message ||
              "Sorry, I'm having trouble connecting right now. Please try again later.",
            sender: "bot",
            timestamp: new Date(),
          };
          this.messages.push(errorMessage);
          this.chatError = response.message || "Failed to send message";
        }
      });

      return response.success;
    } catch (error: any) {
      runInAction(() => {
        this.isTyping = false;
        const errorMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          text: "Sorry, I'm having trouble connecting right now. Please try again later.",
          sender: "bot",
          timestamp: new Date(),
        };
        this.messages.push(errorMessage);
        this.chatError = error.message || "Network error occurred";
      });
      return false;
    }
  }

  // Clear chat history
  clearMessages() {
    runInAction(() => {
      this.messages = [];
      this.addInitialMessage();
      this.chatError = null;
    });
  }

  // Resume modal operations
  openResumeModal() {
    runInAction(() => {
      this.isResumeModalOpen = true;
      if (!this.resumeContent) {
        this.loadResume();
      }
    });
  }

  closeResumeModal() {
    runInAction(() => {
      this.isResumeModalOpen = false;
    });
  }

  async loadResume() {
    try {
      runInAction(() => {
        this.isLoadingResume = true;
      });

      console.log("Attempting to fetch resume from backend...");

      const baseURL =
        process.env.NODE_ENV === "production" ? "" : "http://localhost:3000";

      const response = await fetch(`${baseURL}/api/chat/resume/formatted`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(
          `Failed to load resume: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("Resume data received:", data);

      runInAction(() => {
        this.resumeContent = this.enhanceResumeFormatting(data.html);
      });
    } catch (err: any) {
      console.error("Error loading resume:", err);
      runInAction(() => {
        this.resumeContent = `<p style="color: red;">Failed to load resume content: ${err.message}</p><p>Please try again.</p>`;
      });
    } finally {
      runInAction(() => {
        this.isLoadingResume = false;
      });
    }
  }

  // Enhance resume content formatting
  private enhanceResumeFormatting(html: string): string {
    if (!html) return html;

    // Create a temporary DOM element to parse the HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // Define patterns for common resume elements
    const datePattern = /\b(19|20)\d{2}\b/g; // Years
    const dateRangePattern = /\b(19|20)\d{2}\s*[-–—]\s*(19|20)\d{2}\b/g; // Date ranges
    const monthYearPattern =
      /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(19|20)\d{2}\b/gi;

    // Common company indicators (case insensitive)
    const companyIndicators = [
      "Inc\\.?",
      "LLC",
      "Corp\\.?",
      "Corporation",
      "Company",
      "Co\\.?",
      "Ltd\\.?",
      "Limited",
      "Technologies",
      "Tech",
      "Solutions",
      "Systems",
      "Services",
      "Group",
      "Partners",
      "Associates",
      "Consulting",
      "Consultants",
    ];

    // Common job title patterns
    const jobTitlePatterns = [
      "Developer",
      "Engineer",
      "Manager",
      "Director",
      "Analyst",
      "Specialist",
      "Coordinator",
      "Administrator",
      "Consultant",
      "Lead",
      "Senior",
      "Junior",
      "Associate",
      "Principal",
      "Chief",
      "Vice President",
      "VP",
      "President",
    ];

    // Common technologies
    const technologies = [
      "JavaScript",
      "TypeScript",
      "Python",
      "Java",
      "C#",
      "PHP",
      "Ruby",
      "Go",
      "React",
      "Angular",
      "Vue",
      "Node.js",
      "Express",
      "Django",
      "Flask",
      "Spring",
      "Laravel",
      "Rails",
      "MongoDB",
      "PostgreSQL",
      "MySQL",
      "Redis",
      "AWS",
      "Azure",
      "GCP",
      "Docker",
      "Kubernetes",
      "Git",
      "Jenkins",
      "CI/CD",
    ];

    // Function to wrap text with styling class
    const wrapWithClass = (text: string, className: string) => {
      return `<span class="${className}">${text}</span>`;
    };

    // Process all text nodes
    const processTextNode = (node: Text) => {
      let content = node.textContent || "";

      // Highlight date ranges first (more specific)
      content = content.replace(dateRangePattern, (match) =>
        wrapWithClass(match, "resume-date")
      );

      // Highlight individual years
      content = content.replace(datePattern, (match) =>
        wrapWithClass(match, "resume-date")
      );

      // Highlight month-year combinations
      content = content.replace(monthYearPattern, (match) =>
        wrapWithClass(match, "resume-date")
      );

      // Highlight technologies
      technologies.forEach((tech) => {
        const techRegex = new RegExp(
          `\\b${tech.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
          "gi"
        );
        content = content.replace(techRegex, (match) =>
          wrapWithClass(match, "resume-tech")
        );
      });

      return content;
    };

    // Walk through all text nodes and enhance them
    const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT, null);

    const textNodes: Text[] = [];
    let node;
    while ((node = walker.nextNode())) {
      textNodes.push(node as Text);
    }

    textNodes.forEach((textNode) => {
      const enhanced = processTextNode(textNode);
      if (enhanced !== textNode.textContent) {
        const wrapper = doc.createElement("span");
        wrapper.innerHTML = enhanced;
        textNode.parentNode?.replaceChild(wrapper, textNode);
      }
    });

    // Enhance headings that might be job titles
    const headings = doc.querySelectorAll("h3, h4, h5");
    headings.forEach((heading) => {
      const text = heading.textContent || "";

      // Check if it contains job title patterns
      const hasJobTitle = jobTitlePatterns.some((pattern) =>
        new RegExp(`\\b${pattern}\\b`, "i").test(text)
      );

      if (hasJobTitle) {
        heading.classList.add("resume-job-title");
      }
    });

    // Enhance paragraphs that might contain company names
    const paragraphs = doc.querySelectorAll("p");
    paragraphs.forEach((p) => {
      const text = p.textContent || "";

      // Check if it contains company indicators
      const hasCompanyIndicator = companyIndicators.some((indicator) =>
        new RegExp(`\\b${indicator}\\b`, "i").test(text)
      );

      if (hasCompanyIndicator && text.length < 100) {
        // Likely a company name line
        // Find strong elements within this paragraph and enhance them
        const strongElements = p.querySelectorAll("strong");
        strongElements.forEach((strong) => {
          strong.classList.add("resume-company");
        });
      }
    });

    // Return the enhanced HTML
    return doc.body.innerHTML;
  }

  // Get formatted messages for display
  get formattedMessages(): ChatMessage[] {
    return this.messages.map((msg) => ({
      ...msg,
      timestamp: new Date(msg.timestamp),
    }));
  }

  // Connection status helpers
  get isConnected(): boolean {
    return this.connectionStatus === ConnectionStatus.CONNECTED;
  }

  get isDisconnected(): boolean {
    return (
      this.connectionStatus === ConnectionStatus.DISCONNECTED ||
      this.connectionStatus === ConnectionStatus.ERROR
    );
  }

  get isCheckingConnection(): boolean {
    return this.connectionStatus === ConnectionStatus.CHECKING;
  }

  // UI state helpers
  get hasError(): boolean {
    return this.error !== null || this.chatError !== null;
  }

  get currentError(): string | null {
    return this.error || this.chatError;
  }

  // Clear errors
  clearError() {
    runInAction(() => {
      this.error = null;
      this.chatError = null;
    });
  }

  // Retry connection
  async retryConnection(): Promise<boolean> {
    this.clearError();
    return await this.checkConnection();
  }

  // Get connection status display text
  get connectionStatusText(): string {
    switch (this.connectionStatus) {
      case ConnectionStatus.CHECKING:
        return "Checking...";
      case ConnectionStatus.CONNECTED:
        return "Connected";
      case ConnectionStatus.DISCONNECTED:
        return "Disconnected";
      case ConnectionStatus.ERROR:
        return "Error";
      default:
        return "Unknown";
    }
  }

  // Get connection status CSS class
  get connectionStatusClass(): string {
    switch (this.connectionStatus) {
      case ConnectionStatus.CONNECTED:
        return "connected";
      case ConnectionStatus.DISCONNECTED:
      case ConnectionStatus.ERROR:
        return "disconnected";
      case ConnectionStatus.CHECKING:
      default:
        return "checking";
    }
  }
}

// Create and export store instance
export const appStore = new AppStore();
export default appStore;

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

      const response = await fetch(
        "http://localhost:3000/api/chat/resume/formatted",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

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
        this.resumeContent = data.html;
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

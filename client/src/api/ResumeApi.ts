import { ApiResponse, BaseApi } from "./BaseApi";

export interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export interface ChatRequest {
  message: string;
}

export interface ChatResponse {
  response: string;
  id?: string;
  timestamp?: string;
}

export interface HealthResponse {
  status: string;
  timestamp: string;
  uptime?: number;
  version?: string;
}

export class ResumeApi extends BaseApi {
  constructor() {
    super();
  }

  // Send a chat message to the AI
  async sendChatMessage(message: string): Promise<ApiResponse<ChatResponse>> {
    const payload: ChatRequest = { message };
    return this.post<ChatResponse, ChatRequest>("/chat", payload);
  }

  // Get health status
  async getHealthStatus(): Promise<ApiResponse<HealthResponse>> {
    return this.get<HealthResponse>("/health");
  }

  // Get chat history (if implemented on backend)
  async getChatHistory(limit?: number): Promise<ApiResponse<ChatMessage[]>> {
    const params = limit ? { limit } : undefined;
    return this.get<ChatMessage[]>("/chat/history", { params });
  }

  // Clear chat history (if implemented on backend)
  async clearChatHistory(): Promise<ApiResponse<{ success: boolean }>> {
    return this.delete<{ success: boolean }>("/chat/history");
  }

  // Get resume data (if you want to expose resume info via API)
  async getResumeData(): Promise<ApiResponse<any>> {
    return this.get("/chat/resume");
  }

  // Get projects data
  async getProjects(): Promise<
    ApiResponse<{ projects: Record<string, string> }>
  > {
    return this.get("/chat/projects");
  }
}

// Create and export a singleton instance
export const resumeApi = new ResumeApi();
export default resumeApi;

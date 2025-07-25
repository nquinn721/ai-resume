import { Body, Controller, Get, Post } from "@nestjs/common";
import * as fs from "fs";
import * as path from "path";
import { AiChatService } from "./ai-chat.service";
import { ResumeService } from "./resume.service";

interface ChatRequest {
  message: string;
}

interface ChatResponse {
  response: string;
  timestamp: string;
}

@Controller("api/chat")
export class ChatController {
  constructor(
    private readonly aiChatService: AiChatService,
    private readonly resumeService: ResumeService
  ) {}

  @Post()
  async chat(@Body() chatRequest: ChatRequest): Promise<ChatResponse> {
    try {
      const response = await this.aiChatService.generateResponse(
        chatRequest.message
      );

      return {
        response,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Chat error:", error);
      return {
        response:
          "I'm sorry, I encountered an error while processing your request. Please try again.",
        timestamp: new Date().toISOString(),
      };
    }
  }

  @Get("resume")
  async getResumeContent(): Promise<{ content: string }> {
    try {
      const content = await this.resumeService.loadResume();
      return { content };
    } catch (error) {
      console.error("Resume loading error:", error);
      throw new Error("Failed to load resume content");
    }
  }

  @Get("resume/formatted")
  async getFormattedResume(): Promise<{ html: string }> {
    try {
      const html = await this.resumeService.getFormattedResume();
      return { html };
    } catch (error) {
      console.error("Formatted resume loading error:", error);
      throw new Error("Failed to load formatted resume");
    }
  }

  @Get("analysis")
  async getResumeAnalysis(): Promise<{ analysis: string }> {
    try {
      const analysis = await this.resumeService.analyzeResume();
      return { analysis };
    } catch (error) {
      console.error("Resume analysis error:", error);
      throw new Error("Failed to analyze resume");
    }
  }

  @Get("projects")
  async getProjects(): Promise<{ projects: Record<string, string> }> {
    try {
      const projectsPath = path.join(process.cwd(), "resume", "projects.json");
      const projectsData = fs.readFileSync(projectsPath, "utf8");
      const projects = JSON.parse(projectsData);
      return { projects };
    } catch (error) {
      console.error("Projects loading error:", error);
      throw new Error("Failed to load projects");
    }
  }

  @Get("ai-status")
  async getAIStatus(): Promise<{
    status: { enabled: boolean; model: string };
  }> {
    try {
      const status = this.aiChatService.getAIStatus();
      return { status };
    } catch (error) {
      console.error("AI status error:", error);
      return {
        status: {
          enabled: false,
          model: "error",
        },
      };
    }
  }
}

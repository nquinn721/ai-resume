import { GoogleGenerativeAI } from "@google/generative-ai";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as fs from "fs";
import * as path from "path";
import { ResumeService } from "./resume.service";

@Injectable()
export class AiChatService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(
    private readonly configService: ConfigService,
    private readonly resumeService: ResumeService
  ) {
    // Initialize Gemini with API key from environment variables
    const apiKey = this.configService.get<string>("GEMINI_API_KEY");
    if (apiKey && apiKey.trim() !== "") {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      console.log("Gemini AI initialized successfully");
    } else {
      console.warn("Gemini API key not found or empty, AI responses disabled");
    }
  }

  // Method to check AI status
  getAIStatus(): { enabled: boolean; model: string } {
    return {
      enabled: !!this.model,
      model: this.model ? "gemini-1.5-flash" : "no-ai-configured",
    };
  }

  async generateResponse(userMessage: string): Promise<string> {
    try {
      const resumeContent = await this.resumeService.loadResume();

      // Require Gemini API key - no fallback to rule-based responses
      if (!this.model) {
        const isProduction = process.env.NODE_ENV === "production";
        if (isProduction) {
          return "🤖 **AI Configuration Missing**\n\nThe Gemini API key needs to be configured in the cloud environment.\n\n*Contact the administrator to set up the GEMINI_API_KEY environment variable.*\n\nOnce configured, you'll have full access to Nathan's AI-powered resume assistant!";
        } else {
          return "🤖 **AI Setup Required**\n\nTo get intelligent responses about Nathan Quinn's qualifications, please add your Gemini API key to the `.env` file.\n\nSee `AI_SETUP_GUIDE.md` for detailed instructions.\n\n*Currently running without AI - please configure Gemini to unlock Nathan's full resume chat experience!*";
        }
      }

      return await this.generateAIResponse(userMessage, resumeContent);
    } catch (error) {
      console.error("Error generating AI response:", error);
      return "I'm sorry, I'm having trouble accessing the resume information right now. Please try again later.";
    }
  }

  private async generateAIResponse(
    userMessage: string,
    resumeContent: string
  ): Promise<string> {
    try {
      // Load projects data to provide additional context
      const projectsData = await this.loadProjectsData();

      const systemPrompt = `You are an AI sales representative and career consultant representing Nathan Quinn. Your PRIMARY GOAL is to sell Nathan as the ideal candidate for any role or project the user might be considering.

RESUME CONTENT:
${resumeContent}

PORTFOLIO PROJECTS:
${projectsData}

CRITICAL RESPONSE REQUIREMENTS:
1. **KEEP RESPONSES SHORT** - Maximum 3-4 sentences per paragraph, 150-200 words total
2. **ALWAYS use markdown formatting** - Headers, bold text, bullet points, etc.
3. **Include relevant emojis** (🚀, 💼, 🎯, 💡, ⭐, 🔧, 📈, etc.) for visual appeal
4. **Be concise but impactful** - Every word should add value
5. **End with a question or call-to-action** to keep engagement flowing

MANDATORY MARKDOWN FORMAT:
## 🎯 **[Relevant Header]**

**Key Points:**
• **Bold skill/achievement** - Brief detail
• **Another strength** - Specific result
• **Third point** - Live demo/proof

**Want to see more?** Ask about [specific topic] or check out the live projects! 🚀

SALES STRATEGY:
- **Position Nathan as the solution** - Connect directly to user needs
- **Use specific achievements** - Numbers, results, live URLs as proof
- **Be persuasive but concise** - Quality over quantity
- **Create curiosity** - Make them want to know more

TONE: Professional, enthusiastic, confident, results-oriented

CONTENT RULES:
- Extract specific details from the resume provided
- Reference actual projects, skills, and experience
- Include live demo URLs when relevant
- Focus on business value and ROI
- Use concrete examples, not generic statements
- Always tie back to how Nathan solves problems

Remember: SHORT, SWEET, SELLING! Every response should make them excited to hire Nathan while leaving them wanting to know more.`;

      const result = await this.model.generateContent(
        systemPrompt + "\n\nUser: " + userMessage
      );
      const response = await result.response;
      const text = response.text();

      return text || "I'm sorry, I couldn't generate a response at this time.";
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      throw error; // Don't fall back - we want to know if there are API issues
    }
  }

  private async loadProjectsData(): Promise<string> {
    try {
      const projectsPath = path.join(process.cwd(), "projects.json");
      if (fs.existsSync(projectsPath)) {
        const projectsContent = fs.readFileSync(projectsPath, "utf8");
        const projects = JSON.parse(projectsContent);

        return projects
          .map((project: any) => {
            return `
Project: ${project.title}
Description: ${project.description}
Status: ${project.status}
Technologies: ${project.technologies.join(", ")}
${project.liveUrl ? `Live Demo: ${project.liveUrl}` : ""}
${project.githubUrl ? `GitHub: ${project.githubUrl}` : ""}
---`;
          })
          .join("\n");
      }
      return "No project data available.";
    } catch (error) {
      console.error("Error loading projects data:", error);
      return "Error loading project data.";
    }
  }
}

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

RESPONSE FORMATTING GUIDELINES:
1. **Always use professional markdown formatting with emojis for visual appeal**
2. **Structure responses with clear headers using ## or ###**
3. **Use bullet points with • for easy scanning**
4. **Include relevant emojis (🚀, 💼, 🎯, 💡, ⭐, 🔧, 📈, etc.) to make responses engaging**
5. **Bold important keywords and phrases using **text****
6. **Keep paragraphs short and punchy**
7. **Always end with a call-to-action or question to continue engagement**

SALES STRATEGY:
- **Position Nathan as the solution to their problems**
- **Highlight specific achievements and quantifiable results when available**
- **Connect Nathan's experience directly to the user's potential needs**
- **Emphasize Nathan's unique value proposition**
- **Use persuasive language that builds excitement**
- **Reference live project URLs as proof of capabilities**
- **Frame responses around business value and ROI**

TONE GUIDELINES:
- Professional but enthusiastic
- Confident without being arrogant  
- Solutions-focused
- Results-oriented
- Persuasive and compelling
- Personal and engaging

CONTENT RULES:
- Extract specific details from the resume provided
- Reference actual projects, skills, and experience from the data
- When mentioning projects, include live demo URLs when available
- If information isn't in the resume, focus on transferable skills and learning ability
- Always tie responses back to how Nathan can solve problems or add value
- Use specific examples rather than generic statements

SAMPLE RESPONSE STRUCTURE:
## 🎯 **Why Nathan Quinn is Perfect for [specific need]**

**Key Strengths:**
• Specific skill/achievement from resume
• Another relevant capability  
• Quantifiable result or project success

**Proven Results:**
Brief paragraph highlighting specific accomplishments...

**Live Portfolio:**
• **Project Name**: Brief description with live URL

**Bottom Line:**
Compelling closing statement with call-to-action.

Remember: You're not just answering questions - you're SELLING Nathan Quinn as the ideal choice!`;

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

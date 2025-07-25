import { Injectable } from "@nestjs/common";
import * as fs from "fs";
import * as mammoth from "mammoth";
import * as path from "path";

@Injectable()
export class ResumeService {
  private resumeContent: string = "";
  private resumeAnalysis: string = "";

  async loadResume(): Promise<string> {
    try {
      const resumePath = path.join(process.cwd(), "resume", "NathanQuinn.docx");

      if (!fs.existsSync(resumePath)) {
        throw new Error("Resume file not found");
      }

      const result = await mammoth.extractRawText({ path: resumePath });
      this.resumeContent = result.value;

      return this.resumeContent;
    } catch (error) {
      console.error("Error loading resume:", error);
      throw new Error("Failed to load resume");
    }
  }

  getResumeContent(): string {
    return this.resumeContent;
  }

  async getFormattedResume(): Promise<string> {
    try {
      const resumePath = path.join(process.cwd(), "resume", "NathanQuinn.docx");

      if (!fs.existsSync(resumePath)) {
        throw new Error("Resume file not found");
      }

      const result = await mammoth.convertToHtml({ path: resumePath });
      return result.value;
    } catch (error) {
      console.error("Error loading formatted resume:", error);
      throw new Error("Failed to load formatted resume");
    }
  }

  async analyzeResume(): Promise<string> {
    if (!this.resumeContent) {
      await this.loadResume();
    }

    // This will be enhanced with AI analysis
    this.resumeAnalysis = `
Based on Nathan Quinn's resume, here are the key strengths and selling points:

TECHNICAL EXPERTISE:
${this.extractTechnicalSkills()}

PROFESSIONAL EXPERIENCE:
${this.extractExperience()}

KEY ACHIEVEMENTS:
${this.extractAchievements()}

VALUE PROPOSITION:
Nathan brings a unique combination of technical expertise and proven results. His diverse skill set makes him an ideal candidate for projects requiring both technical depth and practical implementation.
    `.trim();

    return this.resumeAnalysis;
  }

  private extractTechnicalSkills(): string {
    const content = this.resumeContent.toLowerCase();
    const skills = [];

    // Common technical keywords to look for
    const techKeywords = [
      "javascript",
      "typescript",
      "react",
      "node.js",
      "python",
      "java",
      "aws",
      "azure",
      "docker",
      "kubernetes",
      "sql",
      "nosql",
      "mongodb",
      "postgresql",
      "git",
      "agile",
      "scrum",
      "api",
      "rest",
      "graphql",
      "microservices",
      "cloud",
      "devops",
      "ci/cd",
      "testing",
      "automation",
    ];

    techKeywords.forEach((keyword) => {
      if (content.includes(keyword)) {
        skills.push(keyword);
      }
    });

    return skills.length > 0
      ? `• Proficient in: ${skills.join(", ")}`
      : "• Diverse technical skill set (specific technologies will be detailed based on resume content)";
  }

  private extractExperience(): string {
    // This is a simplified extraction - in a real implementation,
    // you'd use more sophisticated NLP or AI to parse the resume
    const lines = this.resumeContent.split("\n");
    const experienceLines = lines.filter(
      (line) =>
        line.includes("years") ||
        line.includes("experience") ||
        line.includes("worked") ||
        line.includes("developed") ||
        line.includes("managed") ||
        line.includes("led")
    );

    return experienceLines.length > 0
      ? experienceLines
          .slice(0, 3)
          .map((line) => `• ${line.trim()}`)
          .join("\n")
      : "• Proven track record of successful project delivery\n• Strong problem-solving and analytical abilities";
  }

  private extractAchievements(): string {
    const content = this.resumeContent.toLowerCase();
    const achievements = [];

    // Look for achievement indicators
    if (content.includes("award") || content.includes("recognition")) {
      achievements.push(
        "• Recognized for outstanding performance and contributions"
      );
    }
    if (content.includes("lead") || content.includes("manage")) {
      achievements.push(
        "• Leadership experience in team and project management"
      );
    }
    if (content.includes("improve") || content.includes("optimize")) {
      achievements.push(
        "• Proven ability to improve processes and optimize performance"
      );
    }
    if (content.includes("client") || content.includes("customer")) {
      achievements.push(
        "• Strong client relationship and customer service skills"
      );
    }

    return achievements.length > 0
      ? achievements.join("\n")
      : "• Results-driven professional with a track record of exceeding expectations\n• Excellent communication and collaboration skills";
  }
}

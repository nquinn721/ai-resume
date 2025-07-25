import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AiChatService } from "./ai-chat.service";
import { ChatController } from "./chat.controller";
import { ResumeService } from "./resume.service";

@Module({
  imports: [ConfigModule],
  controllers: [ChatController],
  providers: [AiChatService, ResumeService],
  exports: [ResumeService, AiChatService],
})
export class ResumeModule {}

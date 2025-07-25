import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for the React frontend
  app.enableCors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:3000",
    ], // Vite default ports + backend port
    credentials: true,
  });

  await app.listen(3000);
  console.log("NestJS server is running on http://localhost:3000");
}
bootstrap();

import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "path";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Set global prefix for API routes
  app.setGlobalPrefix("api");

  // Enable CORS
  const isProduction = process.env.NODE_ENV === "production";
  
  if (isProduction) {
    // Production CORS - more restrictive
    app.enableCors({
      origin: process.env.FRONTEND_URL || false,
      credentials: true,
    });
    
    // Serve static files from React build
    app.useStaticAssets(join(__dirname, "..", "public"));
  } else {
    // Development CORS - allow local development
    app.enableCors({
      origin: [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:3000",
      ],
      credentials: true,
    });
  }

  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  console.log(`NestJS server is running on http://localhost:${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`API available at: http://localhost:${port}/api`);
}
bootstrap();
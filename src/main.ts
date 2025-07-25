import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "path";
import { AppModule } from "./app.module";

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

    // Serve static files from React build (Docker maps client/dist to ./public)
    const clientDistPath = join(__dirname, "..", "public");
    console.log(`Looking for static files at: ${clientDistPath}`);

    // Check if index.html exists
    const fs = require("fs");
    const indexPath = join(clientDistPath, "index.html");
    console.log(`Index.html exists: ${fs.existsSync(indexPath)}`);
    if (fs.existsSync(clientDistPath)) {
      console.log(`Public directory contents:`, fs.readdirSync(clientDistPath));
    }

    app.useStaticAssets(clientDistPath, {
      index: false, // Don't serve index.html automatically
    });

    // Fallback route for SPA - serve index.html for all non-API routes
    app.use((req: any, res: any, next: any) => {
      console.log(`Request path: ${req.path}`);
      if (!req.path.startsWith("/api") && !req.path.includes(".")) {
        console.log(`Serving index.html for: ${req.path}`);
        res.sendFile(join(clientDistPath, "index.html"));
      } else {
        next();
      }
    });
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

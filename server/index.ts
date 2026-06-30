import cors from "cors";
import express, { type NextFunction, type Request, type Response } from "express";
import helmet from "helmet";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { z } from "zod";
import {
  auditEvents,
  healthMetrics,
  recommendations,
  revisionEvents,
  roles,
  transferPackages,
  type UserRole
} from "../lib/platform-data";

const app = express();
const httpServer = createServer(app);
const allowedOrigins = process.env.CORS_ORIGINS?.split(",").map((origin) => origin.trim()).filter(Boolean) ?? [];

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins.length > 0 ? allowedOrigins : true,
    credentials: true
  }
});

const roleSchema = z.enum(roles as [UserRole, ...UserRole[]]);
const approvalSchema = z.object({
  decision: z.enum(["approve", "reject", "request_changes"]),
  reason: z.string().min(4).max(800),
  approverId: z.string().min(2)
});
const recommendationRequestSchema = z.object({
  assetId: z.string().min(2),
  constraints: z.array(z.string()).default([]),
  priority: z.enum(["cost", "weight", "speed", "quality"]).default("quality")
});
const signedUploadSchema = z.object({
  fileName: z.string().min(3),
  contentType: z.string().min(3),
  transferId: z.string().min(2),
  classification: z.string().min(3)
});

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
  })
);
app.use(
  cors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : true,
    credentials: true
  })
);
app.use(express.json({ limit: "20mb" }));

function requireRole(allowedRoles: UserRole[]) {
  return (request: Request, response: Response, next: NextFunction) => {
    const parsedRole = roleSchema.safeParse(request.header("x-user-role") ?? "Viewer");

    if (!parsedRole.success || !allowedRoles.includes(parsedRole.data)) {
      response.status(403).json({
        error: "Forbidden",
        message: "The active role cannot perform this engineering data operation."
      });
      return;
    }

    next();
  };
}

app.get("/health", (_request, response) => {
  response.json({
    status: "ok",
    service: "industrial-3d-transfer-api",
    realtime: "socket.io",
    timestamp: new Date().toISOString()
  });
});

app.get("/api/transfers", requireRole(["Super Admin", "Organization Admin", "Engineer", "Viewer"]), (_request, response) => {
  response.json({ data: transferPackages });
});

app.post(
  "/api/transfers/:transferId/approval",
  requireRole(["Super Admin", "Organization Admin"]),
  (request, response) => {
    const payload = approvalSchema.parse(request.body);
    const transfer = transferPackages.find((item) => item.id === request.params.transferId);

    if (!transfer) {
      response.status(404).json({ error: "Transfer package not found" });
      return;
    }

    response.json({
      data: {
        transferId: transfer.id,
        title: transfer.title,
        decision: payload.decision,
        reason: payload.reason,
        approverId: payload.approverId,
        recordedAt: new Date().toISOString()
      }
    });
  }
);

app.get("/api/assets/:assetId/revisions", requireRole(["Super Admin", "Organization Admin", "Engineer", "Viewer"]), (request, response) => {
  const assetId = String(request.params.assetId).toLowerCase();

  response.json({
    data: revisionEvents.filter((event) => event.asset.toLowerCase().replaceAll(" ", "-").includes(assetId))
  });
});

app.post("/api/ai/recommendations", requireRole(["Super Admin", "Organization Admin", "Engineer"]), (request, response) => {
  const payload = recommendationRequestSchema.parse(request.body);
  const scopedRecommendations = recommendations.filter((item) => item.partId === payload.assetId);
  const prioritized = (scopedRecommendations.length > 0 ? scopedRecommendations : recommendations)
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 4);

  response.json({
    data: prioritized,
    meta: {
      priority: payload.priority,
      constraints: payload.constraints,
      model: "engineering-assistant-rules-plus-ai",
      generatedAt: new Date().toISOString()
    }
  });
});

app.get("/api/digital-twins/:machineId/health", requireRole(["Super Admin", "Organization Admin", "Engineer", "Technician", "Viewer"]), (request, response) => {
  response.json({
    data: {
      machineId: request.params.machineId,
      metrics: healthMetrics,
      status: "maintenance-watch",
      recommendedAction: "Inspect bearing cartridge and hydraulic manifold seal ring."
    }
  });
});

app.post("/api/storage/signed-upload", requireRole(["Super Admin", "Organization Admin", "Engineer"]), (request, response) => {
  const payload = signedUploadSchema.parse(request.body);
  const storagePath = `transfers/${payload.transferId}/${Date.now()}-${payload.fileName}`;

  response.json({
    data: {
      provider: "supabase-storage",
      bucket: "engineering-assets",
      path: storagePath,
      expiresInSeconds: 900,
      classification: payload.classification,
      nextStep: "Request a Supabase signed upload URL with the service key in production."
    }
  });
});

app.get("/api/security/audit", requireRole(["Super Admin", "Organization Admin", "Engineer", "Viewer"]), (_request, response) => {
  response.json({
    data: auditEvents.map((message, index) => ({
      id: `AUD-${2400 + index}`,
      message,
      recordedAt: new Date(Date.now() - index * 1000 * 60 * 42).toISOString()
    }))
  });
});

app.use((error: unknown, _request: Request, response: Response, _next: NextFunction) => {
  if (error instanceof z.ZodError) {
    response.status(400).json({ error: "Validation failed", issues: error.issues });
    return;
  }

  response.status(500).json({
    error: "Unexpected server error",
    message: error instanceof Error ? error.message : "Unknown error"
  });
});

io.on("connection", (socket) => {
  socket.on("session:join", (payload: { sessionId: string; userId: string; role: UserRole }) => {
    socket.join(payload.sessionId);
    socket.to(payload.sessionId).emit("presence:update", {
      userId: payload.userId,
      role: payload.role,
      status: "joined",
      timestamp: new Date().toISOString()
    });
  });

  socket.on("annotation:create", (payload: { sessionId: string; partId: string; message: string; marker: string }) => {
    socket.to(payload.sessionId).emit("annotation:created", {
      ...payload,
      timestamp: new Date().toISOString()
    });
  });

  socket.on("repair:step-update", (payload: { sessionId: string; stepId: string; status: string }) => {
    socket.to(payload.sessionId).emit("repair:step-updated", {
      ...payload,
      timestamp: new Date().toISOString()
    });
  });
});

const port = Number(process.env.PORT ?? 4000);
httpServer.listen(port, () => {
  console.log(`Industrial 3D transfer API listening on http://localhost:${port}`);
});

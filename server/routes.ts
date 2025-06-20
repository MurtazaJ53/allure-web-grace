import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTaskSchema, insertHabitSchema, insertActivitySchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.get("/api/profile/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.put("/api/profile/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await storage.updateUser(userId, req.body);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Task routes
  app.get("/api/tasks/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const tasks = await storage.getTasks(userId);
      res.json(tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/tasks", async (req, res) => {
    try {
      const validatedTask = insertTaskSchema.parse(req.body);
      const task = await storage.createTask(validatedTask);
      res.status(201).json(task);
    } catch (error) {
      console.error("Error creating task:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.put("/api/tasks/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const task = await storage.updateTask(id, req.body);
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.json(task);
    } catch (error) {
      console.error("Error updating task:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.delete("/api/tasks/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteTask(id);
      if (!deleted) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting task:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Habit routes
  app.get("/api/habits/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const habits = await storage.getHabits(userId);
      res.json(habits);
    } catch (error) {
      console.error("Error fetching habits:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/habits", async (req, res) => {
    try {
      const validatedHabit = insertHabitSchema.parse(req.body);
      const habit = await storage.createHabit(validatedHabit);
      res.status(201).json(habit);
    } catch (error) {
      console.error("Error creating habit:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.put("/api/habits/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const habit = await storage.updateHabit(id, req.body);
      if (!habit) {
        return res.status(404).json({ error: "Habit not found" });
      }
      res.json(habit);
    } catch (error) {
      console.error("Error updating habit:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.delete("/api/habits/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteHabit(id);
      if (!deleted) {
        return res.status(404).json({ error: "Habit not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting habit:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Activity routes
  app.get("/api/activities/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const activities = await storage.getActivities(userId);
      res.json(activities);
    } catch (error) {
      console.error("Error fetching activities:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/activities", async (req, res) => {
    try {
      const validatedActivity = insertActivitySchema.parse(req.body);
      const activity = await storage.createActivity(validatedActivity);
      res.status(201).json(activity);
    } catch (error) {
      console.error("Error creating activity:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

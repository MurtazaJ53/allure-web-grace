import { eq } from "drizzle-orm";
import { db } from "./db";
import { 
  profiles, 
  tasks, 
  habits, 
  userActivityFeed,
  type Profile, 
  type InsertProfile,
  type Task,
  type InsertTask,
  type Habit,
  type InsertHabit,
  type Activity,
  type InsertActivity,
  type User,
  type InsertUser
} from "@shared/schema";

export interface IStorage {
  // User/Profile methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<InsertUser>): Promise<User | undefined>;
  
  // Task methods
  getTasks(userId: string): Promise<Task[]>;
  getTask(id: string): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: string, task: Partial<InsertTask>): Promise<Task | undefined>;
  deleteTask(id: string): Promise<boolean>;
  
  // Habit methods
  getHabits(userId: string): Promise<Habit[]>;
  getHabit(id: string): Promise<Habit | undefined>;
  createHabit(habit: InsertHabit): Promise<Habit>;
  updateHabit(id: string, habit: Partial<InsertHabit>): Promise<Habit | undefined>;
  deleteHabit(id: string): Promise<boolean>;
  
  // Activity methods
  getActivities(userId: string): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;
}

export class DatabaseStorage implements IStorage {
  // User/Profile methods
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(profiles).where(eq(profiles.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(profiles).where(eq(profiles.username, username)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(profiles).where(eq(profiles.email, email)).limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const [result] = await db.insert(profiles).values({
      id: crypto.randomUUID(),
      ...user,
    }).returning();
    return result;
  }

  async updateUser(id: string, user: Partial<InsertUser>): Promise<User | undefined> {
    const result = await db.update(profiles).set({
      ...user,
      updatedAt: new Date()
    }).where(eq(profiles.id, id)).returning();
    return result[0];
  }

  // Task methods
  async getTasks(userId: string): Promise<Task[]> {
    return await db.select().from(tasks).where(eq(tasks.userId, userId));
  }

  async getTask(id: string): Promise<Task | undefined> {
    const result = await db.select().from(tasks).where(eq(tasks.id, id)).limit(1);
    return result[0];
  }

  async createTask(task: InsertTask): Promise<Task> {
    const result = await db.insert(tasks).values(task).returning();
    return result[0];
  }

  async updateTask(id: string, task: Partial<InsertTask>): Promise<Task | undefined> {
    const result = await db.update(tasks).set({
      ...task,
      updatedAt: new Date()
    }).where(eq(tasks.id, id)).returning();
    return result[0];
  }

  async deleteTask(id: string): Promise<boolean> {
    const result = await db.delete(tasks).where(eq(tasks.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Habit methods
  async getHabits(userId: string): Promise<Habit[]> {
    return await db.select().from(habits).where(eq(habits.userId, userId));
  }

  async getHabit(id: string): Promise<Habit | undefined> {
    const result = await db.select().from(habits).where(eq(habits.id, id)).limit(1);
    return result[0];
  }

  async createHabit(habit: InsertHabit): Promise<Habit> {
    const result = await db.insert(habits).values(habit).returning();
    return result[0];
  }

  async updateHabit(id: string, habit: Partial<InsertHabit>): Promise<Habit | undefined> {
    const result = await db.update(habits).set({
      ...habit,
      updatedAt: new Date()
    }).where(eq(habits.id, id)).returning();
    return result[0];
  }

  async deleteHabit(id: string): Promise<boolean> {
    const result = await db.delete(habits).where(eq(habits.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Activity methods
  async getActivities(userId: string): Promise<Activity[]> {
    return await db.select().from(userActivityFeed).where(eq(userActivityFeed.userId, userId));
  }

  async createActivity(activity: InsertActivity): Promise<Activity> {
    const result = await db.insert(userActivityFeed).values(activity).returning();
    return result[0];
  }
}

export const storage = new DatabaseStorage();

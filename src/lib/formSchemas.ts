import { z } from "zod";

// ============================================================
// BASE SCHEMAS
// ============================================================

/**
 * Base fields included in ALL form submissions
 */
export const baseFormSchema = z.object({
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  submitted_at: z.string(),
  source_url: z.string(),
});

// ============================================================
// ACTION FORM SCHEMAS (Department Actions)
// ============================================================

/**
 * Request Form - "Submit Request" from department core actions
 * Supports three request types: done_for_you, self_service, delegated
 */
export const actionRequestSchema = baseFormSchema.extend({
  form_type: z.literal("action_request"),
  form_category: z.literal("department_action"),
  
  // Department context
  department: z.string().max(100),
  department_slug: z.string().max(50),
  action_title: z.string().max(200),
  request_type: z.enum(["done_for_you", "self_service", "delegated"]).nullable(),
  
  // Done for you fields
  request_category: z.string().max(100).optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
  title: z.string().max(200).optional(),
  description: z.string().max(2000).optional(),
  target_date: z.string().optional(),
  
  // Self-service fields
  goals: z.string().max(2000).optional(),
  experience: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  timeline: z.string().max(50).optional(),
  
  // Delegation fields (request type: delegated)
  delegate_name: z.string().max(100).optional(),
  delegate_email: z.string().email().optional().or(z.literal("")),
  delegate_role: z.string().max(50).optional(),
  project_title: z.string().max(200).optional(),
  instructions: z.string().max(2000).optional(),
  due_date: z.string().optional(),
  delegate_priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
  additional_notes: z.string().max(1000).optional(),
});

/**
 * Idea Form - "Share Idea" from department core actions
 */
export const actionIdeaSchema = baseFormSchema.extend({
  form_type: z.literal("action_idea"),
  form_category: z.literal("department_action"),
  
  // Department context
  department: z.string().max(100),
  department_slug: z.string().max(50),
  action_title: z.string().max(200),
  
  // Idea fields
  idea_title: z.string().max(200, "Idea title must be less than 200 characters"),
  area_of_impact: z.string().max(100),
  problem: z.string().max(2000, "Problem description must be less than 2000 characters"),
  solution: z.string().max(2000, "Solution description must be less than 2000 characters"),
  benefits: z.string().max(1000).optional(),
});

/**
 * Delegate Form - "Delegate Task" from department core actions
 */
export const actionDelegateSchema = baseFormSchema.extend({
  form_type: z.literal("action_delegate"),
  form_category: z.literal("department_action"),
  
  // Department context
  department: z.string().max(100),
  department_slug: z.string().max(50),
  action_title: z.string().max(200),
  
  // Task details
  task_title: z.string().max(200, "Task title must be less than 200 characters"),
  assign_to: z.string().max(100),
  task_priority: z.enum(["low", "medium", "high", "urgent"]),
  delegate_due_date: z.string(),
  task_description: z.string().max(2000, "Task description must be less than 2000 characters"),
  deliverables: z.string().max(1000).optional(),
});

/**
 * Hire Form - Hiring request for a role
 */
export const actionHireSchema = baseFormSchema.extend({
  form_type: z.literal("action_hire"),
  form_category: z.literal("department_action"),
  
  // Department context
  department: z.string().max(100),
  department_slug: z.string().max(50),
  action_title: z.string().max(200),
  
  // Hiring details
  role_title: z.string().max(100),
  job_description: z.string().max(3000).optional(),
  start_date: z.string().optional(),
  employment_type: z.enum(["full-time", "part-time", "contract"]).optional(),
});

// ============================================================
// SERVICE INTAKE SCHEMAS
// ============================================================

/**
 * Service Intake Form - Generic service request form
 * Supports dynamic service-specific fields via passthrough()
 */
export const serviceIntakeSchema = baseFormSchema.extend({
  form_type: z.string(), // e.g., "service_intake_paid-ads"
  form_category: z.literal("service_intake"),
  
  // Service context
  service_name: z.string().max(100),
  service_slug: z.string().max(50),
  request_type: z.enum(["done_for_you", "self_service", "delegated"]).nullable().optional(),
  
  // Common fields
  company_name: z.string().max(200).optional(),
  budget: z.string().max(50).optional(),
  timeline: z.string().max(50).optional(),
  goals: z.string().max(2000).optional(),
  current_challenges: z.string().max(2000).optional(),
  additional_info: z.string().max(2000).optional(),
  
  // Self-service fields
  experience: z.string().max(50).optional(),
  
  // Delegation fields
  delegate_name: z.string().max(100).optional(),
  delegate_email: z.string().email().optional().or(z.literal("")),
  delegate_role: z.string().max(50).optional(),
  project_title: z.string().max(200).optional(),
  instructions: z.string().max(2000).optional(),
  delegate_priority: z.string().max(20).optional(),
  due_date: z.string().optional(),
}).passthrough(); // Allow additional service-specific fields

// ============================================================
// VISION INTAKE SCHEMA
// ============================================================

/**
 * Vision Intake Form - High-level vision/goal intake
 */
export const visionIntakeSchema = baseFormSchema.extend({
  form_type: z.literal("vision_intake"),
  form_category: z.literal("vision"),
  
  // Vision details
  vision_title: z.string().max(200, "Vision title must be less than 200 characters"),
  description: z.string().max(5000, "Description must be less than 5000 characters"),
  timeframe: z.string().max(50).optional(),
  revenue_target: z.string().max(50).optional(),
  available_hours: z.string().max(20).optional(),
  challenges: z.string().max(2000).optional(),
  raw_paste: z.string().max(10000).optional(),
});

// ============================================================
// UNION TYPES
// ============================================================

export const actionFormSchema = z.discriminatedUnion("form_type", [
  actionRequestSchema,
  actionIdeaSchema,
  actionDelegateSchema,
  actionHireSchema,
]);

// ============================================================
// TYPE EXPORTS
// ============================================================

export type ActionRequestData = z.infer<typeof actionRequestSchema>;
export type ActionIdeaData = z.infer<typeof actionIdeaSchema>;
export type ActionDelegateData = z.infer<typeof actionDelegateSchema>;
export type ActionHireData = z.infer<typeof actionHireSchema>;
export type ServiceIntakeData = z.infer<typeof serviceIntakeSchema>;
export type VisionIntakeData = z.infer<typeof visionIntakeSchema>;

export type FormCategory = "department_action" | "service_intake" | "vision";

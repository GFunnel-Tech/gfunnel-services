import { z } from "zod";
import type { FormCategory } from "./formSchemas";

// ============================================================
// WEBHOOK ENDPOINTS
// ============================================================

const WEBHOOKS = {
  DEFAULT: "https://apihub.gfunnel.com/webhook-test/e996d857-0666-4224-b63c-31ab5296b067",
  HIRING: "https://apihub.gfunnel.com/webhook-test/4da968a1-bc07-420c-9697-762ace996e95",
} as const;

// ============================================================
// TYPES
// ============================================================

export interface SubmissionResult {
  success: boolean;
  error?: string;
  validationErrors?: Record<string, string>;
}

export interface SubmissionOptions {
  webhookUrl?: string;
  useHiringWebhook?: boolean;
}

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

/**
 * Convert camelCase field names to snake_case
 */
export function toSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

/**
 * Normalize all field names in an object from camelCase to snake_case
 */
export function normalizeFieldNames(data: Record<string, unknown>): Record<string, unknown> {
  const normalized: Record<string, unknown> = {};
  
  for (const [key, value] of Object.entries(data)) {
    const snakeKey = toSnakeCase(key);
    normalized[snakeKey] = value;
  }
  
  return normalized;
}

/**
 * Build metadata fields for any form submission
 */
export function buildMetadata(): { submitted_at: string; source_url: string } {
  return {
    submitted_at: new Date().toISOString(),
    source_url: typeof window !== "undefined" ? window.location.href : "",
  };
}

// ============================================================
// MAIN SUBMISSION FUNCTION
// ============================================================

/**
 * Submit form data with validation and error handling
 * 
 * @param data - The form data to submit (will be validated against schema)
 * @param schema - Zod schema to validate the data against
 * @param options - Optional configuration for submission
 * @returns SubmissionResult indicating success or failure with error details
 */
export async function submitForm<T extends z.ZodSchema>(
  data: unknown,
  schema: T,
  options?: SubmissionOptions
): Promise<SubmissionResult> {
  // Step 1: Validate data against schema
  const validationResult = schema.safeParse(data);
  
  if (!validationResult.success) {
    const errors: Record<string, string> = {};
    
    for (const issue of validationResult.error.issues) {
      const path = issue.path.join(".");
      errors[path] = issue.message;
    }
    
    console.error("[webhookService] Validation failed:", errors);
    
    return {
      success: false,
      error: "Validation failed. Please check your inputs.",
      validationErrors: errors,
    };
  }
  
  // Step 2: Determine webhook URL
  const webhookUrl = options?.webhookUrl || 
    (options?.useHiringWebhook ? WEBHOOKS.HIRING : WEBHOOKS.DEFAULT);
  
  // Step 3: Submit to webhook
  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      mode: "no-cors",
      body: JSON.stringify(validationResult.data),
    });
    
    console.log("[webhookService] Form submitted successfully:", {
      form_type: (validationResult.data as Record<string, unknown>).form_type,
      form_category: (validationResult.data as Record<string, unknown>).form_category,
    });
    
    return { success: true };
  } catch (error) {
    console.error("[webhookService] Submission failed:", error);
    
    return {
      success: false,
      error: "Failed to submit form. Please try again.",
    };
  }
}

// ============================================================
// CONVENIENCE BUILDERS
// ============================================================

/**
 * Build a complete action form payload
 */
export function buildActionPayload(
  formType: "action_request" | "action_idea" | "action_delegate" | "action_hire",
  departmentName: string,
  departmentSlug: string,
  actionTitle: string,
  formData: Record<string, unknown>
): Record<string, unknown> {
  const metadata = buildMetadata();
  const normalizedData = normalizeFieldNames(formData);
  
  return {
    form_type: formType,
    form_category: "department_action" as FormCategory,
    department: departmentName,
    department_slug: departmentSlug,
    action_title: actionTitle,
    ...metadata,
    ...normalizedData,
  };
}

/**
 * Build a complete service intake form payload
 */
export function buildServiceIntakePayload(
  serviceName: string,
  serviceSlug: string,
  requestType: string | null,
  formData: Record<string, unknown>
): Record<string, unknown> {
  const metadata = buildMetadata();
  const normalizedData = normalizeFieldNames(formData);
  
  return {
    form_type: `service_intake_${serviceSlug}`,
    form_category: "service_intake" as FormCategory,
    service_name: serviceName,
    service_slug: serviceSlug,
    request_type: requestType,
    ...metadata,
    ...normalizedData,
  };
}

/**
 * Build a complete vision intake form payload
 */
export function buildVisionIntakePayload(
  formData: Record<string, unknown>
): Record<string, unknown> {
  const metadata = buildMetadata();
  const normalizedData = normalizeFieldNames(formData);
  
  return {
    form_type: "vision_intake",
    form_category: "vision" as FormCategory,
    ...metadata,
    ...normalizedData,
  };
}

// ============================================================
// WEBHOOK URLS EXPORT
// ============================================================

export { WEBHOOKS };

import { z } from 'zod';

export const approvedServicesEnum = z.enum([
  'GST Compliance Services',
  'Income Tax Return and Computation',
  'TDS/TCS Quarterly Returns',
  'Bookkeeping and Accounting'
]);

export type ApprovedServiceType = z.infer<typeof approvedServicesEnum>;

export const businessTypeEnum = z.enum([
  'Private Limited',
  'LLP',
  'Proprietorship / Partnership',
  'Individual'
]);

export type BusinessType = z.infer<typeof businessTypeEnum>;

// Phone regex allowing Indian 10-digit numbers with optional +91 / 0 prefix, or valid 10-15 digit phone formats
const PHONE_REGEX = /^(?:\+91[\s-]?)?[6789]\d{9}$|^[+]?[0-9\s-]{10,15}$/;

// Name regex: Letters, spaces, hyphens, and apostrophes
const NAME_REGEX = /^[a-zA-Z\s.'-]+$/;

/**
 * Zod schema for ContactFormAndOffices (Homepage Contact Desk)
 */
export const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: 'Full name must be at least 2 characters.' })
    .max(70, { message: 'Full name cannot exceed 70 characters.' })
    .regex(NAME_REGEX, { message: 'Please enter a valid name with letters only.' }),

  company: z
    .string()
    .trim()
    .max(100, { message: 'Company name cannot exceed 100 characters.' })
    .optional()
    .or(z.literal('')),

  phone: z
    .string()
    .trim()
    .min(10, { message: 'Phone number must be at least 10 digits.' })
    .max(16, { message: 'Phone number cannot exceed 16 digits.' })
    .refine((val) => PHONE_REGEX.test(val.replace(/\s+/g, '')), {
      message: 'Please enter a valid 10-digit mobile or WhatsApp number (e.g. +91 98765 43210).'
    }),

  email: z
    .string()
    .trim()
    .min(1, { message: 'Email address is required.' })
    .email({ message: 'Please provide a valid email address (e.g. name@company.com).' })
    .max(100, { message: 'Email address cannot exceed 100 characters.' }),

  serviceNeeded: approvedServicesEnum,

  message: z
    .string()
    .trim()
    .max(1000, { message: 'Message details cannot exceed 1000 characters.' })
    .optional()
    .or(z.literal(''))
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

/**
 * Zod schema for ContactConsultationModal (Schedule Service Consultation Modal)
 */
export const consultationModalSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, { message: 'Full name must be at least 2 characters.' })
    .max(70, { message: 'Full name cannot exceed 70 characters.' })
    .regex(NAME_REGEX, { message: 'Please enter a valid name with letters only.' }),

  workEmail: z
    .string()
    .trim()
    .min(1, { message: 'Email address is required.' })
    .email({ message: 'Please provide a valid work or personal email (e.g. name@domain.com).' })
    .max(100, { message: 'Email address cannot exceed 100 characters.' }),

  phone: z
    .string()
    .trim()
    .min(10, { message: 'Phone number must be at least 10 digits.' })
    .max(16, { message: 'Phone number cannot exceed 16 digits.' })
    .refine((val) => PHONE_REGEX.test(val.replace(/\s+/g, '')), {
      message: 'Please enter a valid 10-digit mobile or WhatsApp number (e.g. +91 98765 43210).'
    }),

  businessType: businessTypeEnum,

  serviceNeeded: approvedServicesEnum,

  message: z
    .string()
    .trim()
    .max(1000, { message: 'Specific notes cannot exceed 1000 characters.' })
    .optional()
    .or(z.literal(''))
});

export type ConsultationModalData = z.infer<typeof consultationModalSchema>;

/**
 * Helper to validate a single field against a Zod schema in real-time
 */
export function validateField(
  schema: z.ZodObject<any>,
  fieldName: string,
  value: unknown
): string | null {
  const shape = schema.shape;
  const fieldSchema = shape[fieldName] as z.ZodTypeAny | undefined;
  if (!fieldSchema) return null;

  const result = fieldSchema.safeParse(value);
  if (!result.success) {
    const issue = result.error.issues[0];
    return issue ? issue.message : 'Invalid field value';
  }
  return null;
}

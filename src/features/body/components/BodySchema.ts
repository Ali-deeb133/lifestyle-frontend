
import { z } from 'zod'
export const bodySchema = z.object({
  birth_date: z.string().min(1, 'Enter your birth date'),

  gender: z.enum(['male', 'female']),

  height: z.number().min(1, 'Enter a valid height'),

  weight: z.number().min(1, 'Enter a valid weight'),

  neck_circumference: z.number().min(1, 'Enter a valid neck measurement'),

  waist_circumference: z.number().min(1, 'Enter a valid waist measurement'),

  hip_circumference: z.number().optional(),

  activity_level: z.enum([
    'very_low',
    'light',
    'moderate',
    'high',
    'very_high',
    'none',
  ]),
})
.superRefine((data, ctx) => {
  if (data.gender === 'female') {
    if (!data.hip_circumference || data.hip_circumference <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Hip measurement is required',
        path: ['hip_circumference'],
      })
    }
  }
})


import { z } from 'zod'
export const bodySchema = z.object({
  birth_date: z.string().min(1, 'أدخل تاريخ الميلاد'),

  gender: z.enum(['male', 'female']),

  height: z.number().min(1, 'الطول غير صالح'),

  weight: z.number().min(1, 'الوزن غير صالح'),

  neck_circumference: z.number().min(1, 'قياس الرقبة غير صالح'),

  waist_circumference: z.number().min(1, 'قياس الخصر غير صالح'),

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
        message: 'قياس الورك مطلوب',
        path: ['hip_circumference'],
      })
    }
  }
})

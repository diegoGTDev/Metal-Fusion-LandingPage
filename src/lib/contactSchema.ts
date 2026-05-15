import { z } from 'zod';

export const contactSchema = z.object({
  nombre: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .regex(/^[a-záéíóúñ\s]+$/i, 'El nombre solo puede contener letras y espacios'),
  
  correo: z
    .string()
    .email('Por favor ingresa un correo electrónico válido')
    .max(100, 'El correo no puede exceder 100 caracteres')
    .toLowerCase(),
  
  telefono: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[\d\s\-\+\(\)]+$/.test(val),
      'El teléfono contiene caracteres inválidos'
    )
    .refine(
      (val) => !val || val.replace(/\D/g, '').length >= 7,
      'El teléfono debe contener al menos 7 dígitos'
    )
    .transform((val) => val?.trim() || ''),
  
  mensaje: z
    .string()
    .min(10, 'El mensaje debe tener al menos 10 caracteres')
    .max(5000, 'El mensaje no puede exceder 5000 caracteres')
    .trim(),
});

export type ContactFormData = z.infer<typeof contactSchema>;

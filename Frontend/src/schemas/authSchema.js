import { z } from 'zod';

export const authSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .max(100, 'Password is too long')
});

export const signupSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters long')
    .max(50, 'Username is too long')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .max(100, 'Password is too long')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z
    .string()
    .min(1, 'Please confirm your password')
}).refine((data) => {
  return data.password === data.confirmPassword;
}, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

export const signinSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
});

export const validateAuth = (data) => {
  const result = authSchema.safeParse(data);
  return {
    success: result.success,
    data: result.data,
    errors: result.error?.flatten().fieldErrors || {}
  };
};

export const validateSignup = (data) => {
  const result = signupSchema.safeParse(data);
  return {
    success: result.success,
    data: result.data,
    errors: result.error?.flatten().fieldErrors || {}
  };
};

export const validateSignin = (data) => {
  const result = signinSchema.safeParse(data);
  return {
    success: result.success,
    data: result.data,
    errors: result.error?.flatten().fieldErrors || {}
  };
};

export const validateField = (fieldName, value, schema) => {
  try {
    const fieldSchema = schema.shape[fieldName];
    fieldSchema.parse(value);
    return { isValid: true, error: null };
  } catch (error) {
    return { 
      isValid: false, 
      error: error.errors[0]?.message || 'Invalid input' 
    };
  }
};

export const validateEmail = (email) => {
  return validateField('email', email, authSchema);
};

export const validatePassword = (password) => {
  return validateField('password', password, authSchema);
};

export const validateUsername = (username) => {
  return validateField('username', username, signupSchema);
};
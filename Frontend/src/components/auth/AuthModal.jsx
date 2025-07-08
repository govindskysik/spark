import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signinSchema, signupSchema } from '../../schemas/authSchema';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

const AuthModal = ({ isOpen, onClose }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formValues, setFormValues] = useState({
    email: '',
    password: '',
    username: '',
    confirmPassword: ''
  });
  
  const { signup, signin, isLoading, error, clearError } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
    setValue
  } = useForm({
    resolver: zodResolver(isSignUp ? signupSchema : signinSchema),
    mode: 'onChange',
    defaultValues: formValues
  });

  // Watch password for requirements validation
  const watchPassword = watch('password') || '';

  const onSubmit = async (data) => {
    console.log('Form submitted with data:', data);
    
    // Remove confirmPassword from data before sending to backend
    const { confirmPassword, ...submitData } = data;
    
    clearError();
    
    try {
      let result;
      if (isSignUp) {
        console.log('Attempting signup...');
        result = await signup(submitData);
      } else {
        console.log('Attempting signin...');
        result = await signin(submitData);
      }

      console.log('Auth result:', result);

      if (result.success) {
        toast.success(
          isSignUp ? 'Account created successfully!' : 'Welcome back!',
          {
            duration: 3000,
            position: 'top-right',
          }
        );
        reset();
        onClose();
      } else {
        toast.error(result.error || 'Something went wrong', {
          duration: 4000,
          position: 'top-right',
        });
      }
    } catch (err) {
      console.error('Auth error:', err);
      toast.error('An unexpected error occurred', {
        duration: 4000,
        position: 'top-right',
      });
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    reset();
    clearError();
    setShowPassword(false);
    setShowConfirmPassword(false);
    setFormValues({
      email: '',
      password: '',
      username: '',
      confirmPassword: ''
    });
  };

  const handleClose = () => {
    reset();
    clearError();
    setShowPassword(false);
    setShowConfirmPassword(false);
    onClose();
  };

  // Animation variants
  const backdropVariants = {
    closed: { 
      opacity: 0,
      backdropFilter: "blur(0px)"
    },
    open: { 
      opacity: 1,
      backdropFilter: "blur(8px)"
    }
  };

  const modalVariants = {
    closed: { 
      opacity: 0, 
      scale: 0.8, 
      y: -50,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    open: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  const inputVariants = {
    focus: {
      scale: 1.02,
      borderColor: "#0053E2",
      boxShadow: "0 0 0 3px rgba(0, 83, 226, 0.1)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 20
      }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.02,
      y: -2,
      boxShadow: "0 10px 25px rgba(0, 83, 226, 0.3)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    tap: {
      scale: 0.98,
      y: 0
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with Blur Effect - Higher Z-Index */}
          <motion.div
            variants={backdropVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-0 bg-white/20 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
            onClick={handleClose}
            style={{
              backdropFilter: "blur(8px)",
              background: "rgba(255, 255, 255, 0.1)"
            }}
          >
            {/* Modal - Even Higher Z-Index */}
            <motion.div
              variants={modalVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="bg-white rounded-2xl p-8 w-full max-w-md mx-auto shadow-2xl relative z-[10000]"
              onClick={(e) => e.stopPropagation()}
              style={{
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)"
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <motion.h2 
                  className="text-2xl font-walmart font-bold text-gray-800"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {isSignUp ? 'Create Account' : 'Welcome Back'}
                </motion.h2>
                <motion.button
                  onClick={handleClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-5 h-5 text-gray-500" />
                </motion.button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Username (Sign Up Only) */}
                {isSignUp && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Username
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <motion.input
                        {...register('username')}
                        type="text"
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                          errors.username ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter your username"
                        variants={inputVariants}
                        whileFocus="focus"
                      />
                    </div>
                    {errors.username && (
                      <motion.p 
                        className="text-red-500 text-sm mt-1"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        {errors.username.message}
                      </motion.p>
                    )}
                  </motion.div>
                )}

                {/* Email */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <motion.input
                      {...register('email')}
                      type="email"
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your email"
                      variants={inputVariants}
                      whileFocus="focus"
                      onChange={(e) => {
                        // Update both form state and local state
                        setValue('email', e.target.value);
                        setFormValues(prev => ({ ...prev, email: e.target.value }));
                      }}
                    />
                  </div>
                  {errors.email && (
                    <motion.p 
                      className="text-red-500 text-sm mt-1"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {errors.email.message}
                    </motion.p>
                  )}
                </motion.div>

                {/* Password */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <motion.input
                      {...register('password')}
                      type={showPassword ? 'text' : 'password'}
                      className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                        errors.password ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder={isSignUp ? "Create a password" : "Enter your password"}
                      variants={inputVariants}
                      whileFocus="focus"
                      onChange={(e) => {
                        // Update both form state and local state
                        setValue('password', e.target.value);
                        setFormValues(prev => ({ ...prev, password: e.target.value }));
                      }}
                    />
                    <motion.button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </motion.button>
                  </div>
                  {errors.password && (
                    <motion.p 
                      className="text-red-500 text-sm mt-1"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {errors.password.message}
                    </motion.p>
                  )}
                </motion.div>

                {/* Password Requirements Hint - Only show in signup mode */}
                {isSignUp && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-xs text-gray-500 mt-1 space-y-1 bg-gray-50 p-3 rounded-lg"
                  >
                    <p className="font-medium">Password must contain:</p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li className={watchPassword.length >= 6 ? "text-green-500" : ""}>
                        At least 6 characters
                      </li>
                      <li className={/[A-Z]/.test(watchPassword) ? "text-green-500" : ""}>
                        At least one uppercase letter
                      </li>
                      <li className={/[a-z]/.test(watchPassword) ? "text-green-500" : ""}>
                        At least one lowercase letter
                      </li>
                      <li className={/\d/.test(watchPassword) ? "text-green-500" : ""}>
                        At least one number
                      </li>
                    </ul>
                  </motion.div>
                )}

                {/* Confirm Password (Sign Up Only) */}
                {isSignUp && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <motion.input
                        {...register('confirmPassword')}
                        type={showConfirmPassword ? 'text' : 'password'}
                        className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                          errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Confirm your password"
                        variants={inputVariants}
                        whileFocus="focus"
                      />
                      <motion.button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </motion.button>
                    </div>
                    {errors.confirmPassword && (
                      <motion.p 
                        className="text-red-500 text-sm mt-1"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        {errors.confirmPassword.message}
                      </motion.p>
                    )}
                  </motion.div>
                )}

                {/* Error Message */}
                {error && (
                  <motion.div 
                    className="bg-red-50 border border-red-200 rounded-lg p-3"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <p className="text-red-600 text-sm">{error}</p>
                  </motion.div>
                )}

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isLoading || (isSignUp && !isValid)}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  variants={buttonVariants}
                  whileHover={!isLoading && (isSignUp ? isValid : true) ? "hover" : {}}
                  whileTap={!isLoading && (isSignUp ? isValid : true) ? "tap" : {}}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      {isSignUp ? 'Creating Account...' : 'Signing In...'}
                    </>
                  ) : (
                    isSignUp ? 'Create Account' : 'Sign In'
                  )}
                </motion.button>

                {/* Debug info - remove in production */}
                {/*
                <div className="text-xs text-gray-400 mt-2">
                  <p>Form valid: {isValid ? 'Yes' : 'No'}</p>
                  <p>Errors: {Object.keys(errors).length > 0 ? JSON.stringify(Object.keys(errors)) : 'None'}</p>
                </div>
                */}
              </form>

              {/* Toggle Mode */}
              <motion.div 
                className="mt-6 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <p className="text-gray-600">
                  {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                  <motion.button
                    onClick={toggleMode}
                    className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isSignUp ? 'Sign In' : 'Sign Up'}
                  </motion.button>
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
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

  const watchPassword = watch('password') || '';

  const onSubmit = async (data) => {
    console.log('Form submitted with data:', data);
    
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

  const backdropVariants = {
    closed: { opacity: 0, backdropFilter: "blur(0px)" },
    open: { opacity: 1, backdropFilter: "blur(8px)" }
  };

  const modalVariants = {
    closed: { 
      opacity: 0, scale: 0.8, y: -50,
      transition: { type: "spring", stiffness: 300, damping: 30 }
    },
    open: { 
      opacity: 1, scale: 1, y: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 }
    }
  };

  const inputVariants = {
    focus: {
      scale: 1.01,
      borderColor: "#0053E2",
      boxShadow: "0 0 0 2px rgba(0, 83, 226, 0.1)",
    }
  };

  const buttonVariants = {
    hover: { scale: 1.01, y: -1 },
    tap: { scale: 0.99, y: 0 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            variants={backdropVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-0 bg-white backdrop-blur-sm z-[9999] flex items-center justify-center p-3"
            onClick={handleClose}
            style={{
              backdropFilter: "blur(8px)",
              background: "rgba(255, 255, 255, 0.1)"
            }}
          >
            <motion.div
              variants={modalVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="bg-white rounded-lg p-5 w-full max-w-sm mx-auto shadow-xl relative z-[10000]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <motion.h2 
                  className="text-lg font-walmart font-bold text-gray-800"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {isSignUp ? 'Create Account' : 'Welcome Back'}
                </motion.h2>
                <motion.button
                  onClick={handleClose}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-4 h-4 text-gray-500" />
                </motion.button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                {/* Username (Sign Up Only) */}
                {isSignUp && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Username
                    </label>
                    <div className="relative">
                      <User className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <motion.input
                        {...register('username')}
                        type="text"
                        className={`w-full pl-8 pr-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                          errors.username ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter your username"
                        variants={inputVariants}
                        whileFocus="focus"
                      />
                    </div>
                    {errors.username && (
                      <motion.p 
                        className="text-red-500 text-xs mt-0.5"
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        {errors.username.message}
                      </motion.p>
                    )}
                  </motion.div>
                )}

                {/* Email */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <motion.input
                      {...register('email')}
                      type="email"
                      className={`w-full pl-8 pr-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your email"
                      variants={inputVariants}
                      whileFocus="focus"
                      onChange={(e) => {
                        setValue('email', e.target.value);
                        setFormValues(prev => ({ ...prev, email: e.target.value }));
                      }}
                    />
                  </div>
                  {errors.email && (
                    <motion.p 
                      className="text-red-500 text-xs mt-0.5"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {errors.email.message}
                    </motion.p>
                  )}
                </motion.div>

                {/* Password */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <motion.input
                      {...register('password')}
                      type={showPassword ? 'text' : 'password'}
                      className={`w-full pl-8 pr-8 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                        errors.password ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder={isSignUp ? "Create a password" : "Enter your password"}
                      variants={inputVariants}
                      whileFocus="focus"
                      onChange={(e) => {
                        setValue('password', e.target.value);
                        setFormValues(prev => ({ ...prev, password: e.target.value }));
                      }}
                    />
                    <motion.button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </motion.button>
                  </div>
                  {errors.password && (
                    <motion.p 
                      className="text-red-500 text-xs mt-0.5"
                      initial={{ opacity: 0, y: -5 }}
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
                    className="text-xs text-gray-500 mt-1 bg-gray-50 p-2 rounded-md"
                  >
                    <p className="text-xs font-medium">Password must contain:</p>
                    <ul className="list-disc pl-4 text-xs space-y-0.5 mt-0.5">
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
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <motion.input
                        {...register('confirmPassword')}
                        type={showConfirmPassword ? 'text' : 'password'}
                        className={`w-full pl-8 pr-8 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                          errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Confirm your password"
                        variants={inputVariants}
                        whileFocus="focus"
                      />
                      <motion.button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </motion.button>
                    </div>
                    {errors.confirmPassword && (
                      <motion.p 
                        className="text-red-500 text-xs mt-0.5"
                        initial={{ opacity: 0, y: -5 }}
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
                    className="bg-red-50 border border-red-200 rounded-md p-2"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <p className="text-red-600 text-xs">{error}</p>
                  </motion.div>
                )}

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isLoading || (isSignUp && !isValid)}
                  className="w-full bg-blue-600 text-white py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mt-2"
                  variants={buttonVariants}
                  whileHover={!isLoading && (isSignUp ? isValid : true) ? "hover" : {}}
                  whileTap={!isLoading && (isSignUp ? isValid : true) ? "tap" : {}}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-1" />
                      <span className="text-sm">{isSignUp ? 'Creating Account...' : 'Signing In...'}</span>
                    </>
                  ) : (
                    <span className="text-sm">{isSignUp ? 'Create Account' : 'Sign In'}</span>
                  )}
                </motion.button>
              </form>

              {/* Toggle Mode */}
              <motion.div 
                className="mt-4 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <p className="text-gray-600 text-xs">
                  {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                  <motion.button
                    onClick={toggleMode}
                    className="text-blue-600 hover:text-blue-700 text-xs font-medium transition-colors"
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
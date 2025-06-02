import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { FiEye, FiEyeOff, FiMail, FiLock, FiUser, FiArrowRight } from 'react-icons/fi';

const RegisterPage: React.FC = () => {
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
        first_name: '',
        last_name: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { register } = useAuth();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);

        try {
            await register({
                email: formData.email,
                username: formData.username,
                password: formData.password,
                first_name: formData.first_name,
                last_name: formData.last_name,
            });
            navigate('/');
        } catch (err: any) {
            console.error('RegisterPage: Registration error:', err);
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900">
                <div className="absolute inset-0 opacity-20"></div>
                
                {/* Floating orbs */}
                <div className="absolute top-20 left-20 w-72 h-72 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
                <div className="absolute top-40 right-20 w-72 h-72 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
                <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-2000"></div>
            </div>

            <div className="relative min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    {/* Logo/Brand */}
                    <div className="text-center">
                        <div className="mx-auto h-16 w-16 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-2xl flex items-center justify-center mb-8 shadow-2xl">
                            <span className="text-2xl font-bold text-white">M</span>
                        </div>
                        <h2 className="text-4xl font-bold text-white mb-2">
                            Join MindScribe
                        </h2>
                        <p className="text-emerald-200">
                            Start your mental wellness journey today
                        </p>
                    </div>

                    {/* Register Form */}
                    <div className="backdrop-blur-lg bg-white/10 p-8 rounded-3xl shadow-2xl border border-white/20">
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            {/* Name Fields */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label htmlFor="first_name" className="block text-sm font-medium text-emerald-100">
                                        First Name
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FiUser className="h-5 w-5 text-emerald-300" />
                                        </div>
                                        <input
                                            id="first_name"
                                            name="first_name"
                                            type="text"
                                            className="block w-full pl-10 pr-3 py-3 border-0 rounded-xl bg-white/10 backdrop-blur-sm text-white placeholder-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-white/20 transition-all duration-200"
                                            placeholder="First name"
                                            value={formData.first_name}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="last_name" className="block text-sm font-medium text-emerald-100">
                                        Last Name
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FiUser className="h-5 w-5 text-emerald-300" />
                                        </div>
                                        <input
                                            id="last_name"
                                            name="last_name"
                                            type="text"
                                            className="block w-full pl-10 pr-3 py-3 border-0 rounded-xl bg-white/10 backdrop-blur-sm text-white placeholder-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-white/20 transition-all duration-200"
                                            placeholder="Last name"
                                            value={formData.last_name}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Username Input */}
                            <div className="space-y-2">
                                <label htmlFor="username" className="block text-sm font-medium text-emerald-100">
                                    Username
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiUser className="h-5 w-5 text-emerald-300" />
                                    </div>
                                    <input
                                        id="username"
                                        name="username"
                                        type="text"
                                        required
                                        className="block w-full pl-10 pr-3 py-3 border-0 rounded-xl bg-white/10 backdrop-blur-sm text-white placeholder-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-white/20 transition-all duration-200"
                                        placeholder="Choose a username"
                                        value={formData.username}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Email Input */}
                            <div className="space-y-2">
                                <label htmlFor="email" className="block text-sm font-medium text-emerald-100">
                                    Email address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiMail className="h-5 w-5 text-emerald-300" />
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        className="block w-full pl-10 pr-3 py-3 border-0 rounded-xl bg-white/10 backdrop-blur-sm text-white placeholder-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-white/20 transition-all duration-200"
                                        placeholder="Enter your email"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Password Input */}
                            <div className="space-y-2">
                                <label htmlFor="password" className="block text-sm font-medium text-emerald-100">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiLock className="h-5 w-5 text-emerald-300" />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        autoComplete="new-password"
                                        required
                                        className="block w-full pl-10 pr-12 py-3 border-0 rounded-xl bg-white/10 backdrop-blur-sm text-white placeholder-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-white/20 transition-all duration-200"
                                        placeholder="Create a password"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <FiEyeOff className="h-5 w-5 text-emerald-300 hover:text-white transition-colors" />
                                        ) : (
                                            <FiEye className="h-5 w-5 text-emerald-300 hover:text-white transition-colors" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password Input */}
                            <div className="space-y-2">
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-emerald-100">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiLock className="h-5 w-5 text-emerald-300" />
                                    </div>
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        autoComplete="new-password"
                                        required
                                        className="block w-full pl-10 pr-12 py-3 border-0 rounded-xl bg-white/10 backdrop-blur-sm text-white placeholder-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-white/20 transition-all duration-200"
                                        placeholder="Confirm your password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? (
                                            <FiEyeOff className="h-5 w-5 text-emerald-300 hover:text-white transition-colors" />
                                        ) : (
                                            <FiEye className="h-5 w-5 text-emerald-300 hover:text-white transition-colors" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="text-red-300 text-sm text-center bg-red-500/20 backdrop-blur-sm py-2 px-4 rounded-lg border border-red-400/30">
                                    {error}
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 transform transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                            >
                                {isLoading ? (
                                    <div className="flex items-center">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Creating account...
                                    </div>
                                ) : (
                                    <div className="flex items-center">
                                        Create account
                                        <FiArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                )}
                            </button>
                        </form>

                        {/* Footer */}
                        <div className="mt-6 text-center">
                            <p className="text-emerald-200 text-sm">
                                Already have an account?{' '}
                                <Link
                                    to="/login"
                                    className="font-semibold text-emerald-300 hover:text-white transition-colors underline decoration-emerald-400 underline-offset-2"
                                >
                                    Sign in here
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
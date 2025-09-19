'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { toast } from 'sonner';

type Variant = 'LOGIN' | 'REGISTER';

export default function AuthForm() {
    const [variant, setVariant] = useState<Variant>('LOGIN');
    const [email, setEmail] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const toggleVariant = () => {
        setVariant(variant === 'LOGIN' ? 'REGISTER' : 'LOGIN');
        resetForm();
    };

    const resetForm = () => {
        setEmail('')
        setDisplayName('')
        setPassword('')
        setConfirmPassword('')
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        if (variant === 'REGISTER') {
            try {
                const res = await fetch('/api/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, displayName, password, confirmPassword }),
                });
                if (res.ok) {
                    toast.success("Registration Successful", { description: "Registration successful! Please login." });
                    resetForm();
                    setVariant('LOGIN');
                } else {
                    toast.error("Registration failed", { description: "Registration failed." });
                }
            } catch (error) {
                toast.error("Error", { description: "An error occurred." });
            }
        } else if (variant === 'LOGIN') {
            const result = await signIn('credentials', {
                redirect: false,
                email,
                password,
            });

            if (result?.error) {
                toast.error("Login Error", { description: result.error });
            } else if (result?.ok) {
                resetForm();
                router.push('/');
            }
        }
        setIsLoading(false);
    };

    return (
        <div className='w-screen h-screen bg-gray-100'>
            <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                        {variant === 'LOGIN' ? 'Sign in to your account' : 'Create a new account'}
                    </h2>
                </div>
                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            {variant === 'REGISTER' && (
                                <div>
                                    <label
                                        htmlFor="displayName"
                                        className="block text-sm font-medium leading-6 text-gray-900"
                                    >
                                        Display Name
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            id="displayName"
                                            name="displayName"
                                            type="text"
                                            required
                                            value={displayName}
                                            onChange={(e) => setDisplayName(e.target.value)}
                                            className="block w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>
                            )}

                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    Email address
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    Password
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            {variant === 'REGISTER' && (
                                <div>
                                    <label
                                        htmlFor="confirmPassword"
                                        className="block text-sm font-medium leading-6 text-gray-900"
                                    >
                                        Confirm Password
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type="password"
                                            required
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="block w-full px-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>
                            )}

                            <div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex w-full justify-center rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-sky-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 disabled:opacity-50"
                                >
                                    {isLoading ? 'Loading...' : (variant === 'LOGIN' ? 'Sign in' : 'Register')}
                                </button>
                            </div>
                        </form>

                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300" />
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 flex gap-2 justify-center text-sm text-gray-500">
                            <div>
                                {variant === 'LOGIN' ? 'New to our app?' : 'Already have an account?'}
                            </div>
                            <div
                                onClick={toggleVariant}
                                className="cursor-pointer font-semibold text-sky-600 hover:text-sky-500"
                            >
                                {variant === 'LOGIN' ? 'Create an account' : 'Sign in'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
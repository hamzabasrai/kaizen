import React, { createContext, useContext, useEffect, useState } from 'react';

import { Session, User } from '@supabase/supabase-js';

import * as authService from '~/services/auth';
import { useCountdownsStore } from '~/store/useCountdownsStore';
import { useHabitsStore } from '~/store/useHabitsStore';

interface AuthContextType {
	user: User | null;
	session: Session | null;
	isLoading: boolean;
	isAuthenticated: boolean;
	signIn: (email: string, password: string) => Promise<void>;
	signUp: (email: string, password: string) => Promise<void>;
	signInAnonymously: () => Promise<void>;
	signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [session, setSession] = useState<Session | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		let initialLoadDone = false;

		// Listen for auth changes — takes priority once fired
		const {
			data: { subscription },
		} = authService.onAuthStateChange((_event, session) => {
			initialLoadDone = true;
			setSession(session);
			setUser(session?.user ?? null);
			setIsLoading(false);
		});

		// Server-verify the current user on startup
		authService
			.getCurrentUser()
			.then(user => {
				if (initialLoadDone) return;
				setUser(user);
				return authService.getSession();
			})
			.then(session => {
				if (initialLoadDone || !session) return;
				setSession(session);
			})
			.catch(() => {
				if (initialLoadDone) return;
				setUser(null);
				setSession(null);
			})
			.finally(() => {
				if (!initialLoadDone) {
					setIsLoading(false);
				}
			});

		return () => subscription.unsubscribe();
	}, []);

	const signIn = async (email: string, password: string) => {
		await authService.signInWithEmail(email, password);
	};

	const signUp = async (email: string, password: string) => {
		await authService.signUpWithEmail(email, password);
	};

	const signInAnonymously = async () => {
		await authService.signInAnonymously();
	};

	const signOut = async () => {
		await authService.signOut();
		useHabitsStore.getState().reset();
		useCountdownsStore.getState().reset();
	};

	const value = {
		user,
		session,
		isLoading,
		isAuthenticated: !!user,
		signIn,
		signUp,
		signInAnonymously,
		signOut,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
}

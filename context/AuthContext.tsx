import { Session, User } from '@supabase/supabase-js';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '~/lib/supabase';
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
		// Server-verify the current user on startup
		supabase.auth
			.getUser()
			.then(({ data: { user } }) => {
				setUser(user);
				// Also fetch session for token access
				return supabase.auth.getSession();
			})
			.then(({ data: { session } }) => {
				setSession(session);
			})
			.catch(() => {
				setUser(null);
				setSession(null);
			})
			.finally(() => {
				setIsLoading(false);
			});

		// Listen for auth changes
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session);
			setUser(session?.user ?? null);
			setIsLoading(false);
		});

		return () => subscription.unsubscribe();
	}, []);

	const signIn = async (email: string, password: string) => {
		const { error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});
		if (error) throw error;
	};

	const signUp = async (email: string, password: string) => {
		const { error } = await supabase.auth.signUp({
			email,
			password,
		});
		if (error) throw error;
	};

	const signInAnonymously = async () => {
		const { error } = await supabase.auth.signInAnonymously();
		if (error) throw error;
	};

	const signOut = async () => {
		const { error } = await supabase.auth.signOut();
		if (error) throw error;
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

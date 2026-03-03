import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

import { Database } from './database.types';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
	throw new Error(
		'Missing Supabase environment variables. Please set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_KEY',
	);
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
	auth: {
		storage: AsyncStorage,
		autoRefreshToken: true,
		persistSession: true,
		detectSessionInUrl: false,
	},
});

export type SupabaseClient = typeof supabase;

let cachedUserIdPromise: Promise<string> | null = null;

export function requireUserId(): Promise<string> {
	if (!cachedUserIdPromise) {
		cachedUserIdPromise = supabase.auth
			.getUser()
			.then(({ data: { user } }) => {
				if (!user) throw new Error('Not authenticated');
				return user.id;
			})
			.finally(() => {
				cachedUserIdPromise = null;
			});
	}
	return cachedUserIdPromise;
}

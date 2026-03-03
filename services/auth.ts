import { Database } from '~/lib/database.types';
import { supabase } from '~/lib/supabase';
import { Profile, UserSettings } from '~/types';

export async function signInAnonymously() {
	const { data, error } = await supabase.auth.signInAnonymously();
	if (error) throw error;
	return data;
}

export async function signInWithEmail(email: string, password: string) {
	const { data, error } = await supabase.auth.signInWithPassword({
		email,
		password,
	});
	if (error) throw error;
	return data;
}

export async function signUpWithEmail(email: string, password: string) {
	const { data, error } = await supabase.auth.signUp({
		email,
		password,
	});
	if (error) throw error;
	return data;
}

export async function signOut() {
	const { error } = await supabase.auth.signOut();
	if (error) throw error;
}

export async function getCurrentUser() {
	const {
		data: { user },
	} = await supabase.auth.getUser();
	return user;
}

export async function getSession() {
	const {
		data: { session },
	} = await supabase.auth.getSession();
	return session;
}

export async function getProfile(userId: string): Promise<Profile | null> {
	const { data, error } = await supabase
		.from('profiles')
		.select('*')
		.eq('id', userId)
		.single();

	if (error) throw error;
	return data as Profile | null;
}

export async function updateProfile(
	userId: string,
	updates: Partial<Profile>,
): Promise<Profile> {
	const { data, error } = await supabase
		.from('profiles')
		.update(updates as Database['public']['Tables']['profiles']['Update'])
		.eq('id', userId)
		.select()
		.single();

	if (error) throw error;
	return data as Profile;
}

export async function updateUserSettings(
	userId: string,
	settings: Partial<UserSettings>,
): Promise<Profile> {
	const profile = await getProfile(userId);
	if (!profile) throw new Error('Profile not found');

	const currentSettings = (profile.settings as unknown as UserSettings) || {};
	const newSettings = { ...currentSettings, ...settings };

	return await updateProfile(userId, {
		settings: newSettings as unknown as Profile['settings'],
	});
}

export function onAuthStateChange(
	callback: (event: string, session: any) => void,
) {
	return supabase.auth.onAuthStateChange(callback);
}

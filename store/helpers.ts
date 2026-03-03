type SetFn<T> = (
	partial: Partial<T> | ((state: T) => Partial<T>),
) => void;

interface WithLoading {
	loadingCount: number;
	error: string | null;
}

export async function withAsync<T extends WithLoading>(
	set: SetFn<T>,
	errorLabel: string,
	fn: () => Promise<Partial<T> | void>,
): Promise<void> {
	set(s => ({ ...s, loadingCount: s.loadingCount + 1, error: null }));
	try {
		const result = await fn();
		set(s => ({ ...s, ...result, loadingCount: s.loadingCount - 1 }));
	} catch (err) {
		set(s => ({
			...s,
			error: err instanceof Error ? err.message : errorLabel,
			loadingCount: s.loadingCount - 1,
		}));
	}
}

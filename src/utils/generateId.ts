export function generateId() {
	const array = new Uint8Array(16);
	window.crypto.getRandomValues(array);
	return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
		"",
	);
}
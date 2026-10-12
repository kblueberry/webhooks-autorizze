
export type User = { id: string; email: string; first_name: string; last_name: string; name: string };
export type LoginResult = { fieldErrors?: { email?: string; password?: string }; message?: string };

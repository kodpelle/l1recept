export async function login(email: string, password: string) {
  const response = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) throw new Error("Login failed");
  return response.json();
}

export async function logout() {
  const response = await fetch("/api/login", { method: "DELETE" });
  if (!response.ok) throw new Error("Logout failed");
}
export async function getCurrentUser() {
  const response = await fetch("/api/login");
  if (!response.ok) return null; 
  return response.json();
}

export async function register(email: string, password: string, firstName: string, lastName: string) {
  const response = await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, firstName, lastName }),
  });
  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Registration failed (${response.status}): ${errorData}`);
  }
  return response.json();
}
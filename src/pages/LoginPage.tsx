import { useState } from "react";
import { login } from "../services/auth";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); 

async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  try {
    const data = await login(email, password);
    console.log("Logged in:", data);
  } catch (err) {
    console.error(err);
  }
}

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

LoginPage.route = {
  path: "/login",
  menuLabel: "Login",
  index: 1,
};

export default LoginPage;

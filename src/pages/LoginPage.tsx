import { useState } from "react";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

 async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); 
    console.log("Email:", email);
    console.log("Password:", password);
  

const response = await fetch("/api/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: email.toString(),
    password: password.toString(),
  }),
});

    if (response.ok) {
      const data = await response.json();
      console.log('Login successful:', data);
      // Handle successful login (e.g., redirect, store token)
    } else {
      console.error('Login failed');
      // Handle login failure (e.g., show error message)
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

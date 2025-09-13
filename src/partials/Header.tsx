import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();
  return(

    <header>
    {user ? (
      <>
        <span>Inloggad som {user.email}</span>
        <button onClick={logout}>Logga ut</button>
        </>
    ) : (
      <a href="/login">Logga in</a>
      
    )}  
  </header>
  );
}
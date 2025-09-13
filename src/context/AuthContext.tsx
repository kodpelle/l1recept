import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState, } from "react";
import { login as loginRequest, logout as logoutRequest, getCurrentUser } from "../services/auth";

//typescript interface som beskriver en användare
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

//vad kontexten ska innehålla
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

//skapa kontexten med defaultvärde undefined
const AuthContext = createContext<AuthContextType | undefined>(undefined);

//komponent som tillhandahåller kontexten till sina barn, dvs resten av appen, och hanterar inloggning och utloggning av användare
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function checkLogin(){
      const currentUser = await getCurrentUser();
      if (currentUser) setUser(currentUser);      
    }
    checkLogin();
  })

  //funktion för att logga in en användare, anropar loginRequest(fetch mot backend) och uppdaterar user state
  const login = async (email: string, password: string) => {
    const user = await loginRequest(email, password);
    setUser(user);
  };

  //funktion för att logga ut en användare, anropar logoutRequest(fetch mot backend) och sätter user state till null
  const logout = async () => {
  await logoutRequest();
  setUser(null);
};

//tillhandahåller kontextvärdena till barnkomponenter
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

//custom hook för att använda auth kontexten i komponenter
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}

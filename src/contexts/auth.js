import { useState, createContext, useEffect } from "react";
import { toast } from "react-toastify";

export const AuthContext = createContext({});

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    function loadStorage() {
      const storageUser = localStorage.getItem("SistemaUser");

      if (storageUser) {
        setUser(JSON.parse(storageUser));
        setLoading(false);
      }

      setLoading(false);
    }

    loadStorage();
  }, []);

  function storageUser(data) {
    localStorage.setItem("SistemaUser", JSON.stringify(data));
  }

  //fazer login
  async function signIn(email, password) {
    setLoadingAuth(true);

    if (email === "adm" && password === "123") {
      let data = {
        uid: 1,
        nome: "ADM",
        avatarUrl: null,
        email: "adm@adm.com",
      };

      setUser(data);
      storageUser(data);
      setLoadingAuth(false);
      toast.success("Bem vindo de volta!");
    } else {
      toast.error("Ops! Algo deu errado!");
      setLoadingAuth(false);
    }
  }

  //fazer logout
  async function signOut() {
    localStorage.removeItem("SistemaUser");
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        signed: !!user,
        user,
        loading,
        signIn,
        signOut,
        loadingAuth,
        setUser,
        storageUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;

import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { doc, getDoc } from "firebase/firestore";

import { useAuth } from "../context/AuthContext";
import { db } from "../services/firebase";

export default function BarberRoute({ children }) {
  const { user, loading } = useAuth();

  // null = ainda não verificou
  // true = é barbeiro
  // false = não é barbeiro
  const [isBarber, setIsBarber] = useState(null);

  useEffect(() => {
    async function checkRole() {
      if (!user) {
        setIsBarber(false);
        return;
      }

      try {
        const userRef = doc(db, "users", user.uid);
        const userSnapshot = await getDoc(userRef);

        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();

          setIsBarber(userData.role === "barbeiro");
        } else {
          setIsBarber(false);
        }
      } catch (error) {
        console.error("Erro ao verificar permissão:", error);
        setIsBarber(false);
      }
    }

    if (!loading) {
      checkRole();
    }
  }, [user, loading]);

  // Ainda carregando o Firebase Auth
  if (loading) {
    return <p>Carregando...</p>;
  }

  // Ainda verificando o role no Firestore
  if (isBarber === null) {
    return <p>Verificando acesso...</p>;
  }

  // Não está logado
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Está logado, mas não é barbeiro
  if (!isBarber) {
    return <Navigate to="/home" replace />;
  }

  // É barbeiro
  return children;
}
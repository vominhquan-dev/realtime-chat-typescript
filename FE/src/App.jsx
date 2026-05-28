// App.jsx

import { useEffect } from "react";
import { Provider, useSelector } from "react-redux";
import { Toaster } from "sonner";
import { useNavigate } from "react-router-dom";

import { store } from "@/app/store";
import { AppRoutes } from "@/routes";
import { useSocketConnection } from "@/hooks/useSocketConnection";

function AppContent() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const navigate = useNavigate();

  // Connect socket
  useSocketConnection();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  return (
    <>
      <AppRoutes />
      <Toaster position="top-right" theme="light" richColors />
    </>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;

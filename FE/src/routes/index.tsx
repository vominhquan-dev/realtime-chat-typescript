import { Routes, Route } from "react-router-dom";

import { authRoutes } from "./auth.routes";
import { dashboardRoutes } from "./dashboard.routes";
import { chatRoutes } from "./chat.routes";

export function AppRoutes() {
  return (
    <Routes>
      {authRoutes.map((route) => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}

      {dashboardRoutes.map((route) => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}

      {chatRoutes.map((route) => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}
    </Routes>
  );
}

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import HomeAuthenticated from "./pages/HomeAuthenticated";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CreateGraph from "./pages/CreateGraph";

// Компонент-защитник для приватных страниц
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = !!localStorage.getItem("access");
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// Компонент-защитник для публичных страниц (Login/Register)
// Чтобы авторизованный юзер не мог зайти на страницу логина
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = !!localStorage.getItem("access");
  return !isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
};

function App() {
  const isAuthenticated = !!localStorage.getItem("access");

  return (
    <BrowserRouter>
      <Routes>
        {/* 1. ГЛАВНЫЙ РОУТ: Решает, что показать на "/" */}
        <Route 
          path="/" 
          element={isAuthenticated ? <HomeAuthenticated /> : <HomePage />} 
        />
        
        {/* 2. Для обратной совместимости, если ты уже используешь "/home" в navigate */}
        <Route 
          path="/home" 
          element={<Navigate to="/" replace />} 
        />

        {/* 3. Защищенные страницы */}
        <Route 
          path="/create" 
          element={
            <PrivateRoute>
              <CreateGraph />
            </PrivateRoute>
          } 
        />

        {/* 4. Публичные страницы с защитой от "перелогина" */}
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          } 
        />
        <Route 
          path="/register" 
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          } 
        />

        {/* Редирект для любых других путей */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
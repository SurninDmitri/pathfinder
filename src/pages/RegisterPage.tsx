import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { Header } from "@/components/ui/Header";

export default function RegisterPage() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isStarted, setIsStarted] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // 1. Создаем аккаунт
      const regRes = await fetch("/api/auth/users/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: login, password: password }),
      });

      if (!regRes.ok) {
        const errorData = await regRes.json();
        // Djoser обычно возвращает ошибки в виде массивов по полям
        setError(errorData.username?.[0] || errorData.password?.[0] || "Ошибка регистрации");
        setIsLoading(false);
        return;
      }

      // 2. СРАЗУ запрашиваем токен, чтобы юзер не вводил данные второй раз
      const authRes = await fetch("/api/auth/jwt/create/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: login, password: password }),
      });

      if (authRes.ok) {
        const tokens = await authRes.json();
        
        // 3. Сохраняем всё необходимое
        localStorage.setItem("access", tokens.access);
        localStorage.setItem("refresh", tokens.refresh);
        localStorage.setItem("username", login);
        
        // 4. Используем href для сброса состояния App.tsx
        window.location.href = "/"; 
      } else {
        // Если аккаунт создан, но токен не получен — шлем на логин
        navigate("/login");
      }
    } catch (err) {
      setError("Сервер недоступен. Проверьте соединение.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-zinc-50 flex flex-col overflow-hidden">
      <Header isStarted={isStarted} />

      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-md border border-zinc-200 shadow-sm">
          <CardContent className="pt-10 pb-10 px-10">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-semibold text-zinc-900 mb-2">
                Создание аккаунта
              </h2>
              <p className="text-zinc-600">Присоединяйтесь к PathFinder</p>
            </div>

            {error && (
              <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {error}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="login" className="text-zinc-700 font-medium">
                  Логин
                </Label>
                <Input
                  id="login"
                  type="text"
                  placeholder="Придумайте логин"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  className="h-12 text-base"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-zinc-700 font-medium">
                  Пароль
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Придумайте пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 text-base pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-700 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full h-12 text-base font-medium bg-blue-600 hover:bg-blue-700 text-white mt-4"
                disabled={isLoading}
              >
                {isLoading ? "Регистрируем..." : "Зарегистрироваться"}
              </Button>
            </form>

            <div className="text-center mt-8 text-sm text-zinc-600">
              Уже есть аккаунт?{" "}
              <button 
                onClick={() => navigate("/login")}
                className="text-blue-600 hover:underline font-medium"
              >
                Войти
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
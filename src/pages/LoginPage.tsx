import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/jwt/create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: login,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("access", data.access);
        localStorage.setItem("refresh", data.refresh);
        localStorage.setItem("username", login);

        // ВАЖНО: Используем window.location.href для жесткой перезагрузки страницы.
        // Это заставит App.tsx заново проверить localStorage и отрендерить нужную страницу.
        window.location.href = "/"; 
      } else {
        // ... твоя обработка ошибок без изменений
        if (data.detail === "No active account found with the given credentials") {
          setError("Неверный логин или пароль.");
        } else {
          setError("Ошибка авторизации.");
        }
      }
    } catch (err) {
      setError("Не удалось связаться с сервером.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-zinc-50 flex flex-col overflow-hidden">
      <header className="h-16 border-b border-zinc-200 bg-white px-8 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2 -ml-4">
          <img 
            src="/graph.svg" 
            alt="PathFinder" 
            className="w-12 h-12 object-contain" 
          />
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
            PathFinder
          </h1>
        </div>

        {/* Цвет кнопки изменен на синий, как ты просил */}
        <Button 
          variant="default" 
          size="lg" 
          className="gap-2 bg-blue-600 hover:bg-blue-700 text-white border-0"
          onClick={() => navigate("/register")}
        >
          <User className="w-4 h-4" />
          Регистрация
        </Button>
      </header>

      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-md border border-zinc-200 shadow-sm">
          <CardContent className="pt-10 pb-10 px-10">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-semibold text-zinc-900 mb-2">
                С возвращением!
              </h2>
              <p className="text-zinc-600">Войдите в свой аккаунт</p>
            </div>

            {error && (
              <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="login" className="text-zinc-700 font-medium">
                  Логин
                </Label>
                <Input
                  id="login"
                  type="text"
                  placeholder="Ваш логин"
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
                    placeholder="Ваш пароль"
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
                {isLoading ? "Вход..." : "Войти"}
              </Button>
            </form>

            <div className="text-center mt-8 text-sm text-zinc-600">
              Нет аккаунта?{" "}
              <button 
                onClick={() => navigate("/register")}
                className="text-blue-600 hover:underline font-medium"
              >
                Зарегистрироваться
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
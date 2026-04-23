import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/users/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: login, // Djoser по умолчанию ждет username
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Регистрация прошла успешно!");
        navigate("/login");
      } else {
        // Обработка ошибок валидации (пароль короткий, юзер занят и т.д.)
        if (data.username) {
          setError(`Логин: ${data.username.join(" ")}`);
        } else if (data.password) {
          setError(`Пароль: ${data.password.join(" ")}`);
        } else if (data.non_field_errors) {
          setError(data.non_field_errors.join(" "));
        } else {
          setError("Ошибка регистрации. Попробуйте другой логин.");
        }
      }
    } catch (err) {
      setError("Нет связи с сервером. Проверьте, запущен ли Docker.");
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

        <Button 
          variant="default" 
          size="lg" 
          className="gap-2 bg-blue-600 hover:bg-blue-700 text-white border-0"
          onClick={() => navigate("/login")}
        >
          Войти
        </Button>
      </header>

      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-md border border-zinc-200 shadow-sm">
          <CardContent className="pt-10 pb-10 px-10">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-semibold text-zinc-900 mb-2">
                Создать аккаунт
              </h2>
              <p className="text-zinc-600">Придумайте логин и пароль</p>
            </div>

            {/* Блок для отображения ошибок */}
            {error && (
              <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {error}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="login" className="text-zinc-700 font-medium">
                  Придумайте логин:
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
                  Придумайте пароль:
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
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-700"
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
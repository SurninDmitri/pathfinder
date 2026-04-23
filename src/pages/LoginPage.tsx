import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Здесь будет твоя логика авторизации
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    console.log("Вход:", { login, password });
    setIsLoading(false);
    // После успешного входа можно редиректить на главную
    // router.push("/");
  };

  return (
    <div className="fixed inset-0 bg-zinc-50 flex flex-col overflow-hidden">
      {/* Header — точно такая же шапка, как на главной странице */}
      <header className="h-16 border-b border-zinc-200 bg-white px-8 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2 -ml-4">
          <img 
            src="/graph.svg" 
            alt="PathFinder" 
            className="w-12 h-12 object-contain" 
          />
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
              PathFinder
            </h1>
          </div>
        </div>

        <Button 
          variant="default" 
          size="lg" 
          className="gap-2 bg-blue-600 hover:bg-blue-700 text-white border-0"
        >
          <User className="w-4 h-4" />
          Войти
        </Button>
      </header>

      {/* Основная область с формой */}
      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-md border border-zinc-200 shadow-sm">
          <CardContent className="pt-10 pb-10 px-10">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-semibold text-zinc-900 mb-2">
                Добро пожаловать
              </h2>
              <p className="text-zinc-600">
                Войдите в аккаунт, чтобы продолжить
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Поле логина */}
              <div className="space-y-2">
                <Label htmlFor="login" className="text-zinc-700 font-medium">
                  Логин
                </Label>
                <Input
                  id="login"
                  type="text"
                  placeholder="Введите логин"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  className="h-12 text-base border-zinc-300 focus:border-blue-600"
                  required
                />
              </div>

              {/* Поле пароля */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-zinc-700 font-medium">
                    Пароль
                  </Label>
                  <a 
                    href="#" 
                    className="text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                  >
                    Восстановить пароль
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Введите пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 text-base border-zinc-300 focus:border-blue-600"
                  required
                />
              </div>

              {/* Кнопка Войти */}
              <Button
                type="submit"
                size="lg"
                className="w-full h-12 text-base font-medium bg-blue-600 hover:bg-blue-700 text-white mt-4"
                disabled={isLoading}
              >
                {isLoading ? "Вход..." : "Войти"}
              </Button>
            </form>

            {/* Ссылка на регистрацию */}
            <div className="text-center mt-8 text-sm text-zinc-600">
                            Если нет аккаунта:{" "}
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
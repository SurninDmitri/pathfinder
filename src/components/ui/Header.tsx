import { Link, useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  isStarted?: boolean;
  username?: string;    // Если передано — пользователь авторизован
  handleLogout?: () => void; // Функция для выхода
}

export const Header = ({ isStarted, username, handleLogout }: HeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="h-16 border-b border-zinc-200 bg-white px-8 flex items-center justify-between flex-shrink-0">
      {/* Логотип-ссылка */}
      <Link 
        to="/" 
        className="flex items-center gap-2 -ml-4 hover:opacity-80 transition-opacity"
      >
        <img src="/graph.svg" alt="PathFinder" className="w-12 h-12 object-contain" />
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">PathFinder</h1>
      </Link>

      {/* Правая часть: меняется в зависимости от авторизации */}
      <div className={`flex items-center gap-3 needs-overlay relative overflow-hidden ${isStarted ? 'active' : ''}`}>
        
        {username ? (
          /* Вариант для АВТОРИЗОВАННОГО пользователя */
          <>
            <Button 
              variant="default" 
              size="lg" 
              className="gap-2 bg-blue-600 hover:bg-blue-700 text-white border-0 h-10 px-4 shadow-sm"
              onClick={() => navigate("/profile")} // Опционально: переход в профиль
            >
              <User className="w-5 h-5" />
              {username}
            </Button>

            <Button 
              variant="destructive" 
              size="lg" 
              className="bg-red-600 hover:bg-red-700 text-white border-0 h-10 px-4 shadow-sm"
              onClick={handleLogout}
            >
              Выйти
            </Button>
          </>
        ) : (
          /* Вариант для ГОСТЯ (как было раньше) */
          <Button 
            variant="default" 
            size="lg" 
            className="gap-2 bg-blue-600 hover:bg-blue-700 text-white border-0"
            onClick={() => navigate("/login")}
          >
            <User className="w-4 h-4" />
            Войти
          </Button>
        )}
      </div>
    </header>
  );
};
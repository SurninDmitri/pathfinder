import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CreateGraph() {
  const navigate = useNavigate();
  const [graphName, setGraphName] = useState("");

  return (
    <div className="fixed inset-0 bg-zinc-50 flex flex-col overflow-hidden">
      {/* Header — точно как на главной */}
      <header className="h-16 border-b border-zinc-200 bg-white px-8 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(-1)}
            className="text-zinc-600 -ml-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <div className="flex items-center gap-2 -ml-1">
            <img src="/graph.svg" alt="PathFinder" className="w-12 h-12 object-contain" />
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">PathFinder</h1>
          </div>
        </div>

        {/* Иконка пользователя */}
        <Button 
          variant="default" 
          size="lg" 
          className="gap-2 bg-blue-600 hover:bg-blue-700 text-white border-0 h-10 w-12 p-0"
        >
          <User className="w-5 h-5" />
        </Button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        
        {/* Область графа (большая левая часть) */}
        <div className="flex-1 flex flex-col p-4 pr-4 overflow-hidden">
          <Card className="flex-1 shadow-sm border border-zinc-200 overflow-hidden flex flex-col">
            <CardHeader className="pb-4 border-b bg-white">
              <div className="flex items-center justify-between w-full">
                <CardTitle className="text-xl text-zinc-800">Граф</CardTitle>
                
                <Input
                  placeholder="Название графа"
                  value={graphName}
                  onChange={(e) => setGraphName(e.target.value)}
                  className="w-80 text-base"
                />
              </div>
            </CardHeader>

            <CardContent className="flex-1 p-0 bg-white flex items-center justify-center overflow-hidden">
              <div className="text-center">
                <div className="w-28 h-28 mx-auto mb-6 rounded-3xl bg-zinc-100 flex items-center justify-center">
                  <span className="text-6xl opacity-40">📊</span>
                </div>
                <p className="text-zinc-600 text-2xl font-medium">Здесь будет интерактивный холст графа</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Правая панель управления — только 2 кнопки внизу */}
        <div className="w-96 border-l border-zinc-200 bg-white p-8 overflow-y-auto flex-shrink-0 flex flex-col">
          <div className="flex-1">
            {/* Здесь потом будут инструменты создания графа */}
            <div className="text-sm text-zinc-500 mb-6">ИНСТРУМЕНТЫ</div>
            {/* Пока пусто, как ты просил */}
          </div>

          {/* Две кнопки внизу */}
          <div className="space-y-4 mt-auto">
            <Button 
              size="lg" 
              className="w-full py-7 text-lg font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
            >
              Добавить
            </Button>

            <Button 
              size="lg" 
              variant="outline"
              className="w-full py-7 text-lg font-medium border-emerald-300 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-400 shadow-sm"
            >
              Сохранить
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
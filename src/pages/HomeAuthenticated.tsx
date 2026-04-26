import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Play, Pause } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/ui/Header"; 
// 1. Импортируем модалку
import { LoadGraphModal } from "@/components/ui/LoadGraphModal";

export default function HomeAuthenticated() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Профиль";

  // Состояния
  const [startVertex, setStartVertex] = useState("");
  const [finishVertex, setFinishVertex] = useState("");
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("dijkstra");
  const [isShortestPath, setIsShortestPath] = useState(true);
  const [isStarted, setIsStarted] = useState(false);
  
  // 2. Стейт для модалки
  const [isLoadModalOpen, setIsLoadModalOpen] = useState(false);

  const handleStart = () => setIsStarted(true);
  const handlePause = () => setIsStarted(false);

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("username");
    window.location.href = "/"; 
  };

  // 3. Функция выбора графа из модалки
  const handleGraphSelect = (graph: any) => {
    console.log("Выбран граф для загрузки:", graph);
    setIsLoadModalOpen(false);
    // Тут в будущем добавим логику отрисовки на канвас
  };

  return (
    <div className="fixed inset-0 bg-zinc-50 flex flex-col overflow-hidden">
      
      <Header 
        isStarted={isStarted} 
        username={username} 
        handleLogout={handleLogout} 
      />

      <div className="flex flex-1 overflow-hidden">
        
        {/* Область графа */}
        <div className="flex-1 flex flex-col p-4 pr-4 overflow-hidden">
          <Card className="flex-1 shadow-sm border border-zinc-200 overflow-hidden flex flex-col">
            <CardHeader className="pb-4 border-b bg-white">
                <div className="flex items-center justify-between w-full">
                    <div className="flex-1"></div>
                    <CardTitle className="text-xl text-zinc-800 font-semibold">
                      Граф
                    </CardTitle>
                    <div className={`needs-overlay relative overflow-hidden ${isStarted ? 'active' : ''} flex-1 flex justify-end`}>
                      <Button
                        variant="outline"
                        size="lg"
                        className="bg-orange-200 text-zinc-800 border-0 hover:bg-orange-300 hover:text-zinc-900 shadow-sm"
                        onClick={() => navigate("/create")}
                      >
                        Редактировать
                      </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex-1 p-0 bg-white flex items-center justify-center overflow-hidden">
              <div className="text-center">
                <div className="w-28 h-28 mx-auto mb-6 rounded-3xl bg-zinc-100 flex items-center justify-center">
                  <span className="text-6xl opacity-40">📊</span>
                </div>
                <p className="text-zinc-600 text-2xl font-medium">Здесь будет интерактивный граф</p>
              </div>
            </CardContent>
          </Card>

          <div className={`needs-overlay relative overflow-hidden ${isStarted ? 'active' : ''}`}>
            <div className="mt-6 flex-shrink-0 flex gap-3">
                <Button
                  size="lg"
                  className="flex-1 py-7 text-lg font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                  onClick={() => navigate("/create")}
                >
                  Создать граф
                </Button>

                {/* 4. Вешаем открытие модалки на кнопку */}
                <Button
                  size="lg"
                  className="flex-1 py-7 text-lg font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                  onClick={() => setIsLoadModalOpen(true)}
                >
                  Загрузить свой граф
                </Button>
            </div>
          </div>
        </div>

        {/* Правая панель */}
        <div className="w-96 border-l border-zinc-200 bg-white p-8 overflow-y-auto flex-shrink-0">
          <div className="space-y-8">
            <div className={`needs-overlay relative overflow-hidden ${isStarted ? 'active' : ''}`}>
              <div>
                <h2 className="text-xl font-semibold text-zinc-900 mb-4">Выберите алгоритм</h2>
                <RadioGroup value={selectedAlgorithm} onValueChange={setSelectedAlgorithm} className="space-y-5">
                  {/* ... (радио-кнопки без изменений) ... */}
                  <div className="flex items-center space-x-4">
                    <RadioGroupItem value="dijkstra" id="dijkstra" className="w-6 h-6 border-zinc-400 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600" />
                    <Label htmlFor="dijkstra" className="cursor-pointer text-lg font-medium text-zinc-800">Дейкстры</Label>
                  </div>
                  <div className="flex items-center space-x-4">
                    <RadioGroupItem value="dfs" id="dfs" className="w-6 h-6 border-zinc-400 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600" />
                    <Label htmlFor="dfs" className="cursor-pointer text-lg font-medium text-zinc-800">DFS</Label>
                  </div>
                  <div className="flex items-center space-x-4">
                    <RadioGroupItem value="bfs" id="bfs" className="w-6 h-6 border-zinc-400 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600" />
                    <Label htmlFor="bfs" className="cursor-pointer text-lg font-medium text-zinc-800">BFS</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <Separator />
            {/* ... (остальной UI без изменений) ... */}
            <div className={`needs-overlay relative overflow-hidden ${isStarted ? 'active' : ''}`}>
              <div className="flex items-center space-x-4 pt-2">
                <Checkbox id="shortest" checked={isShortestPath} onCheckedChange={(checked) => setIsShortestPath(!!checked)} className="w-6 h-6 border-zinc-400 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600" />
                <Label htmlFor="shortest" className="cursor-pointer text-lg font-medium text-zinc-800">Кратчайший путь</Label>
              </div>
            </div>
            <Separator />

            {isStarted ? (
              <Button size="lg" variant="default" className="w-full gap-3 py-7 text-lg shadow-sm" onClick={handlePause}>
                <Pause className="w-6 h-6" /> Пауза
              </Button>
            ) : (
              <Button size="lg" className="w-full gap-3 bg-emerald-600 hover:bg-emerald-700 text-white py-7 text-lg shadow-sm" onClick={handleStart}>
                <Play className="w-6 h-6" /> Старт
              </Button>
            )}

            <div className={`needs-overlay relative overflow-hidden ${isStarted ? 'active' : ''}`}>
              <div className="pt-6 space-y-10">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-full bg-emerald-100 border-4 border-emerald-500 flex items-center justify-center overflow-hidden shadow-sm">
                      <input type="text" value={startVertex} onChange={(e) => setStartVertex(e.target.value.toUpperCase())} maxLength={1} className="w-12 h-12 text-center text-3xl font-bold bg-transparent focus:outline-none text-emerald-700 placeholder-emerald-400" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-500">Стартовая вершина</p>
                    <p className="font-medium text-zinc-900">Начало пути</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-full bg-purple-100 border-4 border-purple-500 flex items-center justify-center overflow-hidden shadow-sm">
                      <input type="text" value={finishVertex} onChange={(e) => setFinishVertex(e.target.value.toUpperCase())} maxLength={1} className="w-12 h-12 text-center text-3xl font-bold bg-transparent focus:outline-none text-purple-700 placeholder-purple-400" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-500">Конечная вершина</p>
                    <p className="font-medium text-zinc-900">Конец пути</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Добавляем саму модалку в конец компонента */}
      <LoadGraphModal 
        isOpen={isLoadModalOpen}
        onClose={() => setIsLoadModalOpen(false)}
        onSelect={handleGraphSelect}
      />
    </div>
  );
}
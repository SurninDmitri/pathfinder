  import { useState } from "react";
  import { Button } from "@/components/ui/button";
  import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
  import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
  import { Checkbox } from "@/components/ui/checkbox";
  import { Label } from "@/components/ui/label";
  import { Separator } from "@/components/ui/separator";
  import { Play, Pause, User } from "lucide-react";
  import { useNavigate } from "react-router-dom";   // ← добавь этот импорт в начало файла

  export default function HomePage() {
    const navigate = useNavigate();
    const [startVertex, setStartVertex] = useState("");
    const [finishVertex, setFinishVertex] = useState("");
    const [selectedAlgorithm, setSelectedAlgorithm] = useState("dijkstra");
    const [isShortestPath, setIsShortestPath] = useState(true);
    const [isStarted, setIsStarted] = useState(false);

    const handleStart = () => setIsStarted(true);
    const handlePause = () => setIsStarted(false);

    return (
      <div className="fixed inset-0 bg-zinc-50 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-zinc-200 bg-white px-8 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2 -ml-4">
            <img src="/graph.svg" alt="PathFinder" className="w-12 h-12 object-contain" />
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">PathFinder</h1>
            </div>
          </div>

          {/* Область профиля покрывается */}
          <div className={`needs-overlay relative overflow-hidden ${isStarted ? 'active' : ''}`}>
            <Button 
              variant="default" 
              size="lg" 
              className="gap-2 bg-blue-600 hover:bg-blue-700 text-white border-0"
              onClick={() => navigate("/login")}
            >
              <User className="w-4 h-4" />
              Войти
            </Button>
          </div>
          {/* Область профиля покрывается */}
        </header>

        <div className="flex flex-1 overflow-hidden">
          
          {/* Область графа */}
          <div className="flex-1 flex flex-col p-4 pr-4 overflow-hidden">
            <Card className="flex-1 shadow-sm border border-zinc-200 overflow-hidden flex flex-col">
              <CardHeader className="pb-4 border-b bg-white">
                <CardTitle className="text-xl text-zinc-800">Граф</CardTitle>
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

            {/* Область выбора алгоритма — покрывается */}
            <div className={`needs-overlay relative overflow-hidden ${isStarted ? 'active' : ''}`}>
              <div className="mt-6 flex-shrink-0">
                <Button size="lg" className="w-full py-7 text-lg font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
                  Создать граф
                </Button>
              </div>
            </div>
            {/* Перестаёём покрывать полотном */}

          </div>

          {/* Правая панель */}
          <div className="w-96 border-l border-zinc-200 bg-white p-8 overflow-y-auto flex-shrink-0">
            <div className="space-y-8">
              
              {/* Область выбора алгоритма — покрывается */}
              <div className={`needs-overlay relative overflow-hidden ${isStarted ? 'active' : ''}`}>
                {/* Область выбора алгоритма */}
                <div>
                  <h2 className="text-xl font-semibold text-zinc-900 mb-4">Выберите алгоритм</h2>
                  <RadioGroup value={selectedAlgorithm} onValueChange={setSelectedAlgorithm} className="space-y-5">
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
                {/* Область выбора алгоритма */}
              </div>
              {/* Перестаёём покрывать полотном */}

              {/* Область кратчайшего пути — покрывается */}
                <Separator />
                <div className={`needs-overlay relative overflow-hidden ${isStarted ? 'active' : ''}`}>

                  {/* Область выбора кратчайшего пути */}
                  <div className="flex items-center space-x-4 pt-2">
                    <Checkbox id="shortest" checked={isShortestPath} onCheckedChange={(checked) => setIsShortestPath(!!checked)} className="w-6 h-6 border-zinc-400 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600" />
                    <Label htmlFor="shortest" className="cursor-pointer text-lg font-medium text-zinc-800">Кратчайший путь</Label>
                  </div>
                  {/* Область выбора кратчайшего пути */}

                </div>
                <Separator />
              {/* Перестаёём покрывать полотном */}

              {/* Кнопка Старт / Паузы */}
              {isStarted ? (
                <Button
                  size="lg"
                  variant="default"
                  className="w-full gap-3 py-7 text-lg shadow-sm"
                  onClick={handlePause}
                >
                  <Pause className="w-6 h-6" />
                  Пауза
                </Button>
              ) : (
                <Button
                  size="lg"
                  className="w-full gap-3 bg-emerald-600 hover:bg-emerald-700 text-white py-7 text-lg shadow-sm"
                  onClick={handleStart}
                >
                  <Play className="w-6 h-6" />
                  Старт
                </Button>
              )}

              {/* Старт и Финиш вершины — покрывается */}
              <div className={`needs-overlay relative overflow-hidden ${isStarted ? 'active' : ''}`}>
                {/* Старт и Финиш вершины */}
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
                {/* Старт и Финиш вершины */}
              </div>
              {/* Перестаёём покрывать полотном */}

            </div>
          </div>
        </div>
      </div>
    );
  }
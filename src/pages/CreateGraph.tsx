import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRightLeft, ArrowRight, X, User } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type LinkType = "bidirectional" | "unidirectional" | "none";

interface Edge {
  id: number;
  from: string;
  to: string;
  type: LinkType;
}

export default function CreateGraph() {
  const navigate = useNavigate();
  const [graphName, setGraphName] = useState("");
  const [edges, setEdges] = useState<Edge[]>([]);
  const username = localStorage.getItem("username") || "Профиль";

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("username");
    window.location.href = "/";
  };

  const addEdge = () => {
    const newEdge: Edge = {
      id: Date.now(),
      from: "",
      to: "",
      type: "bidirectional",
    };
    setEdges([...edges, newEdge]);
  };

  const updateEdge = (id: number, field: keyof Edge, value: any) => {
    setEdges(edges.map((edge) => (edge.id === id ? { ...edge, [field]: value } : edge)));
  };

  const removeEdge = (id: number) => {
    setEdges(edges.filter((edge) => edge.id !== id));
  };

  // Функция для отрисовки иконки вместо текста
  const renderTypeIcon = (type: LinkType) => {
    switch (type) {
      case "bidirectional":
        return <ArrowRightLeft className="w-5 h-5 text-blue-500" />;
      case "unidirectional":
        return <ArrowRight className="w-5 h-5 text-blue-500" />;
      case "none":
        return <X className="w-5 h-5 text-red-400" />;
    }
  };

const handleSave = async () => {
  // 1. Собираем карту узлов
  const nodesMap: Record<string, { id: string; x: number; y: number; neighbors: Record<string, number> }> = {};

  edges.forEach((edge) => {
    const fromId = edge.from.trim();
    const toId = edge.to.trim();

    // Создаем запись для начальной вершины, если её нет
    if (fromId && !nodesMap[fromId]) {
      nodesMap[fromId] = { id: fromId, x: 0, y: 0, neighbors: {} };
    }

    if (edge.type !== "none" && fromId && toId) {
      // Создаем запись для конечной вершины, если её нет
      if (!nodesMap[toId]) {
        nodesMap[toId] = { id: toId, x: 0, y: 0, neighbors: {} };
      }

      // Добавляем связь (вес по умолчанию 1.0)
      nodesMap[fromId].neighbors[toId] = 1.0;

      // Если двунаправленная — добавляем и в обратную сторону
      if (edge.type === "bidirectional") {
        nodesMap[toId].neighbors[fromId] = 1.0;
      }
    }
  });

  // Превращаем объект в массив, который ждет сериализатор
  const payload = {
    nodes: Object.values(nodesMap),
  };

  // 2. Отправляем на бэкенд
  try {
    const token = localStorage.getItem("access");
    console.log("Пытаюсь отправить токен:", token);
    const response = await fetch("http://127.0.0.1:8000/api/graph/", { // Замени на свой URL
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Не забываем токен авторизации
        "Authorization": `Bearer ${localStorage.getItem("access")}`,
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      alert("Граф успешно сохранен!");
      navigate("/home"); // или куда тебе нужно после сохранения
    } else {
      const errorData = await response.json();
      // Выводим ошибку валидации от бэкенда (например, "Вершины не уникальны")
      alert(`Ошибка: ${JSON.stringify(errorData)}`);
    }
  } catch (error) {
    console.error("Ошибка при сохранении:", error);
    alert("Не удалось связаться с сервером");
  }
  
};

  return (
    <div className="fixed inset-0 bg-zinc-50 flex flex-col overflow-hidden">
      {/* Header — кнопка назад вернулась в ряд */}
      <header className="h-16 border-b border-zinc-200 bg-white px-8 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(-1)}
            className="text-zinc-600 -ml-2 shadow-none"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <Link to="/" className="flex items-center gap-2 -ml-1 hover:opacity-80 transition-opacity">
            <img src="/graph.svg" alt="PathFinder" className="w-12 h-12 object-contain" />
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">PathFinder</h1>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            variant="default" 
            size="lg" 
            className="gap-2 bg-blue-600 hover:bg-blue-700 text-white border-0 h-10 px-4 shadow-sm"
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
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Область графа */}
        <div className="flex-1 flex flex-col p-4 pr-4 overflow-hidden">
          <Card className="flex-1 shadow-sm border border-zinc-200 overflow-hidden flex flex-col">
            <CardHeader className="pb-4 border-b bg-white">
              <div className="flex items-center justify-between w-full">
                <CardTitle className="text-xl text-zinc-800">Редактор графа</CardTitle>
                <Input
                  placeholder="Название графа"
                  value={graphName}
                  onChange={(e) => setGraphName(e.target.value)}
                  className="w-80 text-base shadow-none"
                />
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-0 bg-white flex items-center justify-center overflow-hidden">
              <div className="text-center">
                <div className="w-28 h-28 mx-auto mb-6 rounded-3xl bg-zinc-100 flex items-center justify-center">
                  <span className="text-6xl opacity-40">📊</span>
                </div>
                <p className="text-zinc-600 text-2xl font-medium">Визуализация появится здесь</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Правая панель управления */}
        <div className="w-96 border-l border-zinc-200 bg-white p-8 overflow-y-auto flex-shrink-0 flex flex-col">
          <div className="flex-1 overflow-y-auto">
            <div className="text-xs font-bold text-zinc-400 tracking-wider mb-6">ИНСТРУМЕНТЫ</div>
            
            <div className="space-y-6 pl-16">
              {edges.map((edge) => (
                <div key={edge.id} className="flex items-center gap-4 group animate-in fade-in slide-in-from-right-4 duration-200">
                  
                  {/* Вершина А - всегда видна */}
                  <Input 
                    value={edge.from}
                    onChange={(e) => updateEdge(edge.id, "from", e.target.value.toUpperCase().slice(0, 1))}
                    placeholder="A"
                    className="w-12 h-12 rounded-full text-center font-bold text-lg border-2 border-zinc-200 focus-visible:border-blue-500 p-0 shadow-none flex-shrink-0"
                  />

                  {/* Иконка связи с Popover - всегда видна, чтобы можно было сменить тип */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="w-16 h-10 flex items-center justify-center border-b-2 border-zinc-100 hover:border-blue-400 transition-colors flex-shrink-0">
                        {renderTypeIcon(edge.type)}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-48 p-2 shadow-md border-zinc-200" side="bottom">
                      <div className="flex flex-col gap-1">
                        <Button variant="ghost" size="sm" className="justify-start gap-2 text-xs shadow-none" onClick={() => updateEdge(edge.id, "type", "bidirectional")}>
                          <ArrowRightLeft className="w-4 h-4 text-blue-500" /> Двунаправленный
                        </Button>
                        <Button variant="ghost" size="sm" className="justify-start gap-2 text-xs shadow-none" onClick={() => updateEdge(edge.id, "type", "unidirectional")}>
                          <ArrowRight className="w-4 h-4 text-blue-500" /> Однонаправленный
                        </Button>
                        <Button variant="ghost" size="sm" className="justify-start gap-2 text-xs text-red-500 hover:text-red-600 shadow-none" onClick={() => updateEdge(edge.id, "type", "none")}>
                          <X className="w-4 h-4" /> Нет связи
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>

                  {/* Вершина B - скрываем, если типа связи 'none' */}
                  {edge.type !== "none" ? (
                    <Input 
                      value={edge.to}
                      onChange={(e) => updateEdge(edge.id, "to", e.target.value.toUpperCase().slice(0, 1))}
                      placeholder="B"
                      className="w-12 h-12 rounded-full text-center font-bold text-lg border-2 border-zinc-200 focus-visible:border-blue-500 p-0 shadow-none flex-shrink-0"
                    />
                  ) : (
                    /* Заглушка, чтобы кнопка удаления не прыгала влево */
                    <div className="w-12 h-12 flex-shrink-0" />
                  )}

                  {/* Удаление строки */}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="w-8 h-8 text-zinc-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                    onClick={() => removeEdge(edge.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 mt-auto pt-6 bg-white">
            <Button 
              size="lg" 
              onClick={addEdge}
              className="w-full py-7 text-lg font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
            >
              Добавить
            </Button>
            <Button 
              size="lg" 
              onClick={handleSave} // Добавили обработчик
              className="w-full py-7 text-lg font-medium bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-colors"
            >
              Сохранить
          </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
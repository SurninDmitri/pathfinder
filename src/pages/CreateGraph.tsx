import { useState, useMemo } from "react"; // Добавил useMemo
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowLeft, ArrowRightLeft, ArrowRight, X, User, AlertCircle } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
// --- НОВАЯ БИБЛИОТЕКА ---
import ForceGraph2D from "react-force-graph-2d";

type LinkType = "bidirectional" | "unidirectional" | "none";

interface Edge {
  id: number;
  from: string;
  weight: string;
  to: string;
  type: LinkType;
}

export default function CreateGraph() {
  const navigate = useNavigate();
  const [graphName, setGraphName] = useState("");
  const [edges, setEdges] = useState<Edge[]>([]);
  const [errors, setErrors] = useState<{ name?: string; global?: string }>({});
  const username = localStorage.getItem("username") || "Профиль";

  // --- ПОДГОТОВКА ДАННЫХ ДЛЯ ГРАФА ---
  const graphData = useMemo(() => {
    const nodesSet = new Set<string>();
    const links: any[] = [];

    edges.forEach((edge) => {
      const from = edge.from.trim();
      const to = edge.to.trim();

      if (from) nodesSet.add(from);
      if (to && edge.type !== "none") nodesSet.add(to);

      if (from && to && edge.type !== "none") {
        links.push({
          source: from,
          target: to,
          label: edge.weight,
          curvature: edge.type === "bidirectional" ? 0.2 : 0, // Чтобы стрелки не накладывались
        });
      }
    });

    return {
      nodes: Array.from(nodesSet).map((id) => ({ id })),
      links: links,
    };
  }, [edges]);

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
      weight: "1.0",
      type: "bidirectional",
    };
    setEdges([...edges, newEdge]);
    setErrors({});
  };

  const updateEdge = (id: number, field: keyof Edge, value: any) => {
    setEdges(edges.map((edge) => (edge.id === id ? { ...edge, [field]: value } : edge)));
    if (errors.global) setErrors({});
  };

  const removeEdge = (id: number) => {
    setEdges(edges.filter((edge) => edge.id !== id));
  };

  const renderTypeIcon = (type: LinkType) => {
    switch (type) {
      case "bidirectional": return <ArrowRightLeft className="w-5 h-5 text-blue-500" />;
      case "unidirectional": return <ArrowRight className="w-5 h-5 text-blue-500" />;
      case "none": return <X className="w-5 h-5 text-red-400" />;
    }
  };

  const handleSave = async () => {
    if (!graphName.trim()) {
      setErrors({ name: "Введите название" });
      return;
    }

    const nodesMap: Record<string, any> = {};

    edges.forEach((edge) => {
      const fromId = edge.from.trim();
      const toId = edge.to.trim();
      let weightValue = parseFloat(edge.weight);
      if (isNaN(weightValue) || weightValue < 1.0) weightValue = 1.0;

      if (fromId && !nodesMap[fromId]) {
        nodesMap[fromId] = { id: fromId, x: 0, y: 0, neighbors: {} };
      }

      if (edge.type !== "none" && fromId && toId) {
        if (!nodesMap[toId]) {
          nodesMap[toId] = { id: toId, x: 0, y: 0, neighbors: {} };
        }
        if (fromId !== toId) {
          nodesMap[fromId].neighbors[toId] = weightValue;
          if (edge.type === "bidirectional") {
            nodesMap[toId].neighbors[fromId] = weightValue;
          }
        }
      }
    });

    try {
      const response = await fetch("http://127.0.0.1:8000/api/graph/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("access")}`,
        },
        body: JSON.stringify({ name: graphName, nodes: Object.values(nodesMap) }),
      });

      if (response.ok) {
        navigate("/home");
      } else {
        const errorData = await response.json();
        setErrors({ global: JSON.stringify(errorData) });
      }
    } catch (error) {
      setErrors({ global: "Ошибка соединения с сервером" });
    }
  };

  return (
    <div className="fixed inset-0 bg-zinc-50 flex flex-col overflow-hidden">
      <header className="h-16 border-b border-zinc-200 bg-white px-8 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="text-zinc-600 -ml-2 shadow-none">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <Link to="/" className="flex items-center gap-2 -ml-1 hover:opacity-80 transition-opacity">
            <img src="/graph.svg" alt="PathFinder" className="w-12 h-12 object-contain" />
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">PathFinder</h1>
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="default" size="lg" className="gap-2 bg-blue-600 text-white h-10 px-4 shadow-sm border-0">
            <User className="w-5 h-5" /> {username}
          </Button>
          <Button variant="destructive" size="lg" className="bg-red-600 text-white h-10 px-4 shadow-sm border-0" onClick={handleLogout}>Выйти</Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 flex flex-col p-4 pr-4 overflow-hidden">
          <Card className="flex-1 shadow-sm border border-zinc-200 overflow-hidden flex flex-col">
            <CardHeader className="pb-4 border-b bg-white flex justify-center">
              <div className="flex flex-col items-center relative">
                <Input
                  placeholder="Название графа"
                  value={graphName}
                  onChange={(e) => {
                    setGraphName(e.target.value);
                    if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                  }}
                  className={cn(
                    "w-80 text-base text-center shadow-none transition-all placeholder:text-zinc-400",
                    errors.name 
                      ? "border-red-500 ring-2 ring-red-100 focus-visible:ring-red-500" 
                      : "border-zinc-200 focus-visible:ring-blue-500"
                  )}
                />
                {errors.name && (
                  <span className="absolute -bottom-6 text-[11px] font-medium text-red-500 animate-in fade-in slide-in-from-top-1">
                    {errors.name}
                  </span>
                )}
              </div>

            </CardHeader>
            
            <CardContent className="flex-1 p-0 bg-white relative">
              {/* --- ВИЗУАЛИЗАЦИЯ --- */}
              {graphData.nodes.length > 0 ? (
                <ForceGraph2D
                  graphData={graphData}
                  nodeLabel="id"
                  nodeColor={() => "#2563eb"} // blue-600
                   nodeCanvasObject={(node: any, ctx, globalScale) => {
                    const label = node.id;
                    const fontSize = 12 / globalScale;
                    const radius = 12; // Твой размер

                    // Рисуем круг (светло-серый)
                    ctx.beginPath();
                    ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false);
                    ctx.fillStyle = "#f4f4f5"; // zinc-100
                    ctx.fill();

                    // Рисуем обводку (чуть темнее)
                    ctx.lineWidth = 2 / globalScale;
                    ctx.strokeStyle = "#d4d4d8"; // zinc-300
                    ctx.stroke();

                    // Текст внутри круга
                    ctx.font = `bold ${fontSize}px Inter, sans-serif`;
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.fillStyle = "#18181b"; // zinc-900
                    ctx.fillText(label, node.x, node.y);
                  }}
                  linkDirectionalArrowLength={6}
                  linkDirectionalArrowRelPos={1}
                  linkCurvature="curvature"
                  linkLabel="label"
                  width={window.innerWidth - 400} // Вычитаем ширину сайдбара и отступы
                  height={window.innerHeight - 150} // Вычитаем хедер и паддинги
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-28 h-28 mx-auto mb-6 rounded-3xl bg-zinc-100 flex items-center justify-center text-6xl opacity-40">📊</div>
                  <p className="text-zinc-600 text-2xl font-medium">Визуализация появится здесь</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="w-96 border-l border-zinc-200 bg-white p-8 overflow-y-auto flex-shrink-0 flex flex-col">
          <div className="flex flex-1 overflow-y-auto flex-col">
            <div className="flex flex-col gap-1 mb-8">
              <div className="text-[10px] font-bold text-zinc-600 tracking-[0.2em] uppercase">Список связей</div>
              {edges.length === 0 && <div className="text-sm text-zinc-500 italic">Нажмите «Добавить» для создания связей</div>}
            </div>
            
            <div className="space-y-4">
              {edges.map((edge) => (
                <div key={edge.id} className="flex items-center justify-center gap-4 group animate-in fade-in slide-in-from-right-4 duration-200">
                <Input 
                  value={edge.from}
                  onChange={(e) => updateEdge(edge.id, "from", e.target.value.toUpperCase().slice(0, 1))}
                  placeholder="A"
                  className="w-11 h-11 rounded-full text-center font-bold text-base border-2 border-zinc-200 p-0 shadow-none flex-shrink-0"
                />

                <div className="flex flex-col items-center w-20 flex-shrink-0">
                  <Popover>
                    <PopoverTrigger className="w-full h-10 flex items-center justify-center border-b-2 border-zinc-100 hover:border-blue-400 transition-colors">
                      {renderTypeIcon(edge.type)}
                    </PopoverTrigger>
                    <PopoverContent className="w-48 p-2 shadow-md border-zinc-200" side="bottom">
                      <div className="flex flex-col gap-1">
                        <Button variant="ghost" size="sm" className="justify-start gap-2 text-xs shadow-none" onClick={() => updateEdge(edge.id, "type", "bidirectional")}>
                          <ArrowRightLeft className="w-4 h-4 text-blue-500" /> Двунаправленный
                        </Button>
                        <Button variant="ghost" size="sm" className="justify-start gap-2 text-xs shadow-none" onClick={() => updateEdge(edge.id, "type", "unidirectional")}>
                          <ArrowRight className="w-4 h-4 text-blue-500" /> Однонаправленный
                        </Button>
                        <Button variant="ghost" size="sm" className="justify-start gap-2 text-xs text-red-500 shadow-none" onClick={() => updateEdge(edge.id, "type", "none")}>
                          <X className="w-4 h-4" /> Нет связи
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                  
                  {edge.type !== "none" && (
                    <input
                      type="text"
                      value={edge.weight}
                      onChange={(e) => updateEdge(edge.id, "weight", e.target.value.replace(/[^0-9.]/g, ""))}
                      className="w-full text-[14px] font-bold text-center text-zinc-900 bg-transparent border-none outline-none mt-2"
                      placeholder="1.0"
                    />
                  )}
                </div>

                {edge.type !== "none" ? (
                  <Input 
                    value={edge.to}
                    onChange={(e) => updateEdge(edge.id, "to", e.target.value.toUpperCase().slice(0, 1))}
                    placeholder="B"
                    className="w-11 h-11 rounded-full text-center font-bold text-base border-2 border-zinc-200 p-0 shadow-none flex-shrink-0"
                  />
                ) : (
                  <div className="w-11 h-11 flex-shrink-0" />
                )}

                <div className="relative">
                  <Button 
                    variant="ghost" size="icon" 
                    className="absolute left-2 -top-4 w-8 h-8 text-zinc-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                    onClick={() => removeEdge(edge.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 mt-auto pt-6 bg-white">
            {errors.global && (
              <div className="flex items-center gap-2 p-3 text-xs text-red-600 bg-red-50 rounded-xl animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0" /> {errors.global}
              </div>
            )}
            <Button size="lg" onClick={addEdge} className="w-full py-7 text-lg font-medium bg-blue-600 text-white rounded-2xl shadow-sm transition-all active:scale-95 border-0">Добавить</Button>
            <Button size="lg" onClick={handleSave} className="w-full py-7 text-lg font-medium bg-emerald-600 text-white rounded-2xl shadow-md transition-all active:scale-95 border-0">Сохранить</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
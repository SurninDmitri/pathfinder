  import { useState, useEffect } from "react";
  import { X, Loader2, Share2, Trash2, Plus } from "lucide-react";
  import { Button } from "@/components/ui/button";
  import { useNavigate } from "react-router-dom";

  interface GraphData {
    id: number;
    name: string;
    nodes: any[];
  }

  export function LoadGraphModal({ isOpen, onClose, onSelect }: any) {
    const [graphs, setGraphs] = useState<GraphData[]>([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const fetchGraphs = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://127.0.0.1:8000/api/graph/", {
          headers: { "Authorization": `Bearer ${localStorage.getItem("access")}` },
        });
        if (response.ok) {
          const data = await response.json();
          setGraphs(data);
        }
      } catch (e) { console.error(e); } finally { setLoading(false); }
    };

    const handleDelete = async (e: React.MouseEvent, id: number) => {
      e.stopPropagation(); 
      if (!id) return;
      if (!window.confirm("Удалить этот граф?")) return;

      try {
        const response = await fetch(`http://127.0.0.1:8000/api/graph/${id}/`, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${localStorage.getItem("access")}` },
        });

        if (response.ok) {
          setGraphs(prev => prev.filter(g => g.id !== id));
        }
      } catch (e) { console.error(e); }
    };

    useEffect(() => { if (isOpen) fetchGraphs(); }, [isOpen]);

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
        <div className="bg-white w-full max-w-4xl rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
          
          {/* Header */}
          <div className="px-8 py-5 border-b border-zinc-100 flex items-center justify-between">
            <h2 className="text-xl font-bold text-zinc-900">Мои графы</h2>
            <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-full transition-colors"><X className="w-5 h-5"/></button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-8 bg-zinc-50/30">
            {loading ? (
              <div className="flex h-60 items-center justify-center"><Loader2 className="animate-spin text-blue-600 w-10 h-10" /></div>
            ) : graphs.length > 0 ? (
              /* Сетка с компактными карточками */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {graphs.map((graph) => (
                  <div
                    key={graph.id}
                    onClick={() => onSelect(graph)}
                    className="group relative cursor-pointer rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm transition-all hover:border-blue-500 hover:shadow-md hover:-translate-y-1"
                  >
                    <button
                      onClick={(e) => handleDelete(e, graph.id)}
                      className="absolute top-2 right-2 z-50 p-2 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>

                    <div className="h-10 w-10 items-center justify-center rounded-xl bg-blue-50 flex group-hover:bg-blue-600 transition-colors mb-4">
                      <Share2 className="h-5 w-5 text-blue-600 group-hover:text-white" />
                    </div>
                    
                    <h3 className="font-bold text-zinc-900 text-lg truncate mb-4 pr-8">
                      {graph.name || "Без названия"}
                    </h3>
                    
                    <div className="pt-3 border-t border-zinc-50 flex items-center justify-between">
                      <div className="flex items-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2" />
                          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                          Узлов: {graph.nodes?.length || 0}
                          </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Состояние, когда графов нет */
              <div className="flex flex-col items-center justify-center h-80 py-20 text-center">
              <div className="bg-blue-50 p-6 rounded-full mb-6">
                <Share2 className="w-12 h-12 text-blue-400" />
              </div>
              
              <h3 className="text-2xl font-bold text-zinc-900 mb-3">Графов пока нет</h3>
              
              <p className="text-zinc-500 max-w-[300px] leading-relaxed">
                Создайте свой первый граф, чтобы сохранить его в библиотеку
              </p>
              

              <Button
                size="lg"
                className="mt-10 py-7 px-10 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-xl shadow-blue-200 transition-all hover:scale-105 active:scale-95"
                onClick={() => navigate("/create")}
              >
                Создать граф
              </Button>
            </div>
            )}
          </div>
        </div>
      </div>
    );
  }
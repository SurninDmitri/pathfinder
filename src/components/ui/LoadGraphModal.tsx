import { useState, useEffect } from "react";
import { X, Loader2, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GraphData {
  id: number;
  nodes: any[];
}

interface LoadGraphModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (graph: GraphData) => void;
}

export function LoadGraphModal({ isOpen, onClose, onSelect }: LoadGraphModalProps) {
  const [graphs, setGraphs] = useState<GraphData[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchGraphs = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/api/graph/", {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("access")}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setGraphs(data);
      }
    } catch (error) {
      console.error("Ошибка загрузки списка графов:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) fetchGraphs();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md transition-all">
      {/* Контейнер модалки увеличен до max-w-4xl */}
      <div className="bg-white w-full max-w-4xl rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in duration-200">
        
        {/* Header с увеличенными отступами */}
        <div className="px-10 py-7 border-b border-zinc-100 flex items-center justify-between bg-white">
          <div>
            <h2 className="text-2xl font-bold text-zinc-900">Мои графы</h2>
            <p className="text-sm text-zinc-500 mt-1">Выберите сохраненную конфигурацию для работы</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-3 hover:bg-zinc-100 rounded-full transition-all active:scale-90"
          >
            <X className="w-6 h-6 text-zinc-400" />
          </button>
        </div>

        {/* Основной контент */}
        <div className="flex-1 overflow-y-auto p-10 bg-zinc-50/30">
          {loading ? (
            <div className="flex h-80 flex-col items-center justify-center">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
              <p className="text-zinc-500 font-medium">Загружаем список...</p>
            </div>
          ) : graphs.length > 0 ? (
            /* Сетка: 1 колонка на мобилках, 2 на планшетах, 3 на десктопах */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {graphs.map((graph, index) => (
                <div
                  key={graph.id || index}
                  onClick={() => onSelect(graph)}
                  className="group cursor-pointer rounded-3xl border-2 border-transparent bg-white p-7 shadow-sm transition-all hover:border-blue-500 hover:shadow-xl hover:-translate-y-1 active:scale-[0.97]"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 flex group-hover:bg-blue-600 transition-colors">
                      <Share2 className="h-7 w-7 text-blue-600 group-hover:text-white transition-colors" />
                    </div>
                    <div className="px-3 py-1 bg-zinc-100 rounded-full">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                        ID: {graph.id}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-bold text-zinc-900 text-xl tracking-tight">
                      Граф №{index + 1}
                    </h3>
                    <div className="flex items-center text-zinc-500">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2" />
                      <p className="text-sm">
                        Узлов: <span className="font-bold text-zinc-700">{graph.nodes?.length || 0}</span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-8 pt-5 border-t border-zinc-50 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
                      Автор: {localStorage.getItem("username") || "Пользователь"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-80 flex-col items-center justify-center text-zinc-400">
              <div className="w-24 h-24 bg-zinc-100 rounded-full flex items-center justify-center mb-6 text-4xl">
                📂
              </div>
              <p className="text-xl font-semibold text-zinc-600">Графов пока нет</p>
              <p className="text-zinc-400 mt-2">Создайте что-нибудь крутое в редакторе!</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-10 py-6 border-t border-zinc-100 bg-white flex justify-end items-center gap-4">
          <p className="text-sm text-zinc-400 mr-auto">
            Всего сохранено: <span className="font-bold text-zinc-600">{graphs.length}</span>
          </p>
          <Button 
            onClick={onClose}
            variant="outline"
            className="px-8 py-6 text-lg border-zinc-200 rounded-2xl hover:bg-zinc-50 transition-colors"
          >
            Отмена
          </Button>
        </div>
      </div>
    </div>
  );
}
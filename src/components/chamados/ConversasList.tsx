import React, { useState, useEffect } from "react";
import { Check } from "lucide-react";

type StatusType = "SOLVED" | "OPEN" | "PENDING";

interface Conversa {
  id: number;
  usuario: string;
  avatar: string;
  titulo: string;
  status: StatusType;
  data: string;
}

const statusColors: Record<StatusType, string> = {
  SOLVED: "bg-green-600",
  OPEN: "bg-yellow-500",
  PENDING: "bg-red-600",
};

export default function ConversasList({ onSelect, selectedChat }: any) {
  const [search, setSearch] = useState("");
  const [conversas, setConversas] = useState<Conversa[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('https://localhost:7299/api/Conversa/ListarTodosChamados', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        const conversasFormatadas: Conversa[] = data.map((item: any) => ({
          id: item.id,
          usuario: item.cliente?.nme_Usuario || item.funcionarios?.nme_Usuario || "Desconhecido",
          avatar: item.cliente?.img_Usuario || item.funcionarios?.img_Usuario || "",
          titulo: item.titulo || "Chamado",
          status: item.stt_Conversa === 1 ? "PENDING" : item.stt_Conversa === 2 ? "SOLVED" : "OPEN",
          data: item.dta_Inicio_Conversa ? new Date(item.dta_Inicio_Conversa).toLocaleString('pt-BR') : "",
        }));
        setConversas(conversasFormatadas);
      });
  }, []);

  const handleStatusChange = (id: number) => {
    const token = localStorage.getItem('token');
    setConversas((conversas as any[]).map((c: any) =>
      c.id === id ? { ...c, status: "OPEN" } : c
    ));
    fetch(`https://localhost:7299/api/Conversa/Atualizar-status-Conversa/${id}?status=3`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('Erro ao atualizar status no backend');
        return res.json();
      })
      .then(data => {
        console.log('Status atualizado no backend:', data);
      })
      .catch(err => {
        console.error('Erro ao atualizar status:', err);
        setConversas((conversas as any[]).map((c: any) =>
          c.id === id ? { ...c, status: "PENDING" } : c
        ));
      });
  };

  const handleFinalizarChamado = (id: number) => {
    const token = localStorage.getItem('token');
    setConversas((conversas as any[]).map((c: any) =>
      c.id === id ? { ...c, status: "SOLVED" } : c
    ));
    fetch(`https://localhost:7299/api/Conversa/Atualizar-status-Conversa/${id}?status=2`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('Erro ao atualizar status no backend');
        return res.json();
      })
      .then(data => {
        console.log('Status atualizado no backend:', data);
      })
      .catch(err => {
        console.error('Erro ao atualizar status:', err);
      });
  };

  const conversasFiltradas = conversas.filter((c: Conversa) =>
    c.usuario.toLowerCase().includes(search.toLowerCase()) ||
    c.titulo.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full min-h-0 p-8 bg-neutral-950">
      <h2 className="text-xl font-bold text-white mb-4">Conversas</h2>
      <input
        className="mb-4 p-2 rounded bg-neutral-800 text-white placeholder:text-blue-300 w-full border border-neutral-700"
        placeholder="🔍 Pesquise"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      {conversasFiltradas.map((c: Conversa) => (
        <div
          key={c.id}
          className={`rounded-lg p-4 mb-2 cursor-pointer bg-neutral-800 hover:bg-neutral-700 transition flex items-center border-l-4 ${selectedChat?.id === c.id ? "border-blue-400" : "border-transparent"}`}
          onClick={() => onSelect(c)}
        >
          <img
            src={c.avatar}
            alt={c.usuario}
            className="w-10 h-10 rounded-full mr-3 object-cover border-2 border-neutral-700"
            onError={e => (e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(c.usuario)}&background=22223b&color=fff`)}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-white truncate">{c.usuario}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold text-white ${statusColors[c.status]}`}>{c.status}</span>
            </div>
            <div className="text-blue-200 text-sm truncate">{c.titulo}</div>
            <div className="text-xs text-blue-400 mt-1">{c.data}</div>
          </div>
          {c.status === "PENDING" && (
            <button
              className="ml-3 border border-[#0479ff] hover:bg-gray-600 text-white rounded-full p-2 flex items-center justify-center transition cursor-pointer"
              onClick={e => { e.stopPropagation(); handleStatusChange(c.id); }}
              title="Marcar como aberto"
            >
              <Check size={20} />
            </button>
          )}
        </div>
      ))}
      {conversasFiltradas.length === 0 && (
        <div className="text-blue-300 text-center mt-8">Nenhuma conversa encontrada.</div>
      )}
    </div>
  );
}
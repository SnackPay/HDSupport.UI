import React, { useState, useEffect, useRef } from "react";
import { CheckCircle } from "lucide-react";

export default function ChatArea({ chat, onFinalizarChamado }: any) {
  const [mensagem, setMensagem] = useState("");
  const [status, setStatus] = useState(chat?.status);
  const [mensagens, setMensagens] = useState<any[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setStatus(chat?.status);
    // Ao trocar de chat, limpar as mensagens (ou buscar do backend se desejar)
    if (chat) {
      setMensagens([]);
    }
  }, [chat]);

  useEffect(() => {
    // Scroll automático para a última mensagem
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens]);

  const handleFinalizarChamado = () => {
    if (!chat) return;
    const token = localStorage.getItem('token');
    setStatus('SOLVED');
    fetch(`https://localhost:7299/api/Conversa/Atualizar-status-Conversa/${chat.id}?status=2`, {
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
        if (onFinalizarChamado) onFinalizarChamado(chat.id);
      })
      .catch(err => {
        setStatus(chat.status); // Reverte caso erro
      });
  };

  const handleEnviarMensagem = async () => {
    if (!mensagem.trim()) return;
    const token = localStorage.getItem('token');
    const idf_Usuario = localStorage.getItem('idf_Usuario');
    console.log('Token:', token);
    console.log('idf_Usuario:', idf_Usuario);
    console.log('Mensagem:', mensagem);
    console.log('Id da conversa:', chat.id);
    if (!token || !idf_Usuario) {
      console.log('Token ou idf_Usuario não encontrado');
      return;
    }
    try {
      const res = await fetch(`https://localhost:7299/api/Conversa/Registro-mensagem?idConversa=${chat.id}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          msg_Mensagem: mensagem,
          id_Conversa: chat.id,
          idf_Usuario: Number(idf_Usuario)
        })
      });
      console.log('Resposta do backend:', res);
      if (!res.ok) throw new Error('Erro ao enviar mensagem');
      const data = await res.json();
      console.log('Dados retornados:', data);
      setMensagens([...mensagens, {
        id: mensagens.length + 1,
        autor: "usuário",
        nome: chat.usuario,
        texto: mensagem,
        hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
      setMensagem("");
    } catch (err) {
      alert('Erro ao enviar mensagem!');
      console.error(err);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleEnviarMensagem();
    }
  };

  if (!chat) {
    return (
      <div className="flex flex-1 w-300 h-full bg-neutral-950 items-center justify-center">
        <span className="text-blue-200 text-2xl text-center">Selecione uma conversa para visualizar o chat.</span>
      </div>
    );
  }
  return (
    <div className="flex flex-col h-full min-h-0 p-8 bg-neutral-950">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <span className="font-bold text-white text-lg">{chat.usuario}</span>
          <span className="ml-2 text-blue-300 text-sm">{chat.titulo}</span>
        </div>
        {status === "OPEN" && (
          <button
            className={`flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold transition rounded-2xl cursor-pointer`}
            onClick={handleFinalizarChamado}
          >
            <CheckCircle size={18} />
            Finalizar chamado
          </button>
        )}
      </div>
      <div className="bg-neutral-900 rounded p-4 mb-2 text-blue-200 text-sm">
        Caso deseje iniciar uma Conversa com o HelpDesk basta digitar a mensagem no campo abaixo e enviá-la, após enviar basta aguardar que um profissional irá atendê-lo<br />
        Não carregou? ou apareceu um erro? tente recarregar a página, caso não resolva entre em contato com o fornecedor<br />
        <span className="text-blue-400 font-bold">Aviso! Após encerrado, o chamado não poderá ser acessado novamente</span>
      </div>
      <div className="mb-4">
        <div className="h-[60vh] overflow-y-auto flex flex-col gap-2 bg-black bg-opacity-80 rounded p-4 custom-scrollbar scrollbar-hide">
          {mensagens.map((msg) => (
            <div key={msg.id} className={`flex ${msg.autor === "usuário" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-xl px-4 py-2 rounded-2xl text-base shadow-md ${msg.autor === "usuário" ? "bg-blue-700 text-white rounded-br-none" : "bg-neutral-800 text-blue-200 rounded-bl-none"}`} style={{wordBreak: 'break-word'}}>
                <div>{msg.texto}</div>
                <div className="text-xs text-blue-300 mt-1 text-right">{msg.hora}</div>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
      </div>
      <div className="flex gap-2 mt-auto">
        <input
          className="flex-1 p-2 rounded bg-neutral-900 text-white border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-700"
          placeholder="Digite sua mensagem..."
          value={mensagem}
          onChange={e => setMensagem(e.target.value)}
          onKeyDown={handleInputKeyDown}
        />
        <button
          className="bg-blue-900 hover:bg-blue-800 p-2 rounded text-white font-bold px-6 transition cursor-pointer"
          onClick={handleEnviarMensagem}
        >
          Enviar
        </button>
      </div>
    </div>
  );
} 
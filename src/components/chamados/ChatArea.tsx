import React, { useState, useEffect, useRef } from "react";
import { CheckCircle } from "lucide-react";

export default function ChatArea({ chat, onFinalizarChamado }: any) {
  const [mensagem, setMensagem] = useState("");
  const [status, setStatus] = useState(chat?.status);
  const [mensagens, setMensagens] = useState<any[]>([]);
  const [mensagensCache, setMensagensCache] = useState<{ [id: number]: any[] }>({});
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setStatus(chat?.status);
    if (chat) {
      // Mostra imediatamente do cache, se houver
      if (mensagensCache[chat.id]) {
        setMensagens(mensagensCache[chat.id]);
      }
      const token = localStorage.getItem('token');
      const idf_Usuario = localStorage.getItem('idf_Usuario');
      // Marcar todas as mensagens como visualizadas ao abrir o chat
      fetch(`https://localhost:7299/api/Conversa/Marcar-mensagens-visualizadas/${chat.id}/${idf_Usuario}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(() => {
          // Depois de marcar como visualizadas, buscar as mensagens atualizadas
          fetch(`https://localhost:7299/api/Conversa/Lista-Mensagens?idConversa=${chat.id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
            .then(res => res.json())
            .then(data => {
              setMensagens(data);
              setMensagensCache(prev => ({ ...prev, [chat.id]: data }));
            })
            .catch(err => {
              setMensagens([]);
              console.error('Erro ao buscar mensagens:', err);
            });
        });
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
    const usuarioRaw = localStorage.getItem('usuario');
    let usuario = usuarioRaw ? JSON.parse(usuarioRaw) : null;
    // Preencher todos os campos obrigatórios do objeto usuario ou usar valores padrão se null
    if (!usuario) {
      usuario = {
        id: 0,
        nme_Usuario: "string",
        eml_Usuario: "string",
        sen_Usuario: "string",
        tel_Usuario: "string",
        cargo_Usuario: "string",
        img_Usuario: "string",
        status_Usuario: 1,
        status_Conversa: 1,
        token_Redefinicao_Senha: "string",
        dta_Token: "string"
      };
    } else {
      usuario = {
        id: usuario.id || 0,
        nme_Usuario: usuario.nme_Usuario || "",
        eml_Usuario: usuario.eml_Usuario || "",
        sen_Usuario: usuario.sen_Usuario || "",
        tel_Usuario: usuario.tel_Usuario || "",
        cargo_Usuario: usuario.cargo_Usuario || "",
        img_Usuario: usuario.img_Usuario || "",
        status_Usuario: usuario.status_Usuario || 1,
        status_Conversa: usuario.status_Conversa || 1,
        token_Redefinicao_Senha: usuario.token_Redefinicao_Senha || "",
        dta_Token: usuario.dta_Token || ""
      };
    }
    console.log('Objeto usuario enviado:', usuario);
    const body = {
      id: 0,
      msg_Mensagem: mensagem,
      idf_Conversa: chat.id,
      usuario: usuario,
      idf_Usuario: Number(idf_Usuario),
      dta_Envio: new Date().toISOString()
    };
    console.log('Body da requisição:', body);
    if (!token || !idf_Usuario || !usuario) {
      console.log('Token, idf_Usuario ou usuario não encontrado');
      return;
    }
    try {
      const res = await fetch(`https://localhost:7299/api/Conversa/Registro-mensagem?idConversa=${chat.id}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
      console.log('Resposta do backend:', res);
      let data = null;
      try {
        data = await res.json();
        console.log('Dados retornados:', data);
      } catch (e) {
        console.log('Não foi possível fazer o parse do JSON retornado:', e);
      }
      if (!res.ok) throw new Error('Erro ao enviar mensagem');
      // Após enviar, buscar as mensagens do backend para garantir o balão correto
      fetch(`https://localhost:7299/api/Conversa/Lista-Mensagens?idConversa=${chat.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(data => {
          setMensagens(data);
        })
        .catch(err => {
          console.error('Erro ao buscar mensagens após envio:', err);
        });
      setMensagem("");
    } catch (err) {
      alert('Erro ao enviar mensagem!');
      console.error('Erro detalhado:', err);
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
          {mensagens.map((msg) => {
            const idf_Usuario = localStorage.getItem('idf_Usuario');
            const isMe = String(msg.idf_Usuario) === String(idf_Usuario) || (msg.usuario && String(msg.usuario.id) === String(idf_Usuario));
            return (
              <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-xl px-4 py-2 rounded-2xl text-base shadow-md ${isMe ? "bg-blue-700 text-white rounded-br-none" : "bg-neutral-800 text-blue-200 rounded-bl-none"}`} style={{wordBreak: 'break-word'}}>
                  <div>{msg.msg_Mensagem || msg.texto}</div>
                  <div className="text-xs text-blue-300 mt-1 text-right flex items-center gap-1">
                    {msg.dta_Envio ? new Date(msg.dta_Envio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                    {isMe && (
                      <>
                        {msg.status_Mensagem === 3 ? (
                          // Dois certinhos brancos (visualizada)
                          <span className="ml-1 flex">
                            <svg width="18" height="18" fill="white" viewBox="0 0 24 24">
                              <path d="M1.5 13.5l6 6 15-15" stroke="white" strokeWidth="2" fill="none"/>
                              <path d="M9.5 13.5l6 6 7-7" stroke="white" strokeWidth="2" fill="none"/>
                            </svg>
                          </span>
                        ) : (
                          // Dois certinhos cinza (não visualizada)
                          <span className="ml-1 flex">
                            <svg width="18" height="18" fill="#aaa" viewBox="0 0 24 24">
                              <path d="M1.5 13.5l6 6 15-15" stroke="#aaa" strokeWidth="2" fill="none"/>
                              <path d="M9.5 13.5l6 6 7-7" stroke="#aaa" strokeWidth="2" fill="none"/>
                            </svg>
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
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
          disabled={status === 'SOLVED'}
        />
        <button
          className="bg-blue-900 hover:bg-blue-800 p-2 rounded text-white font-bold px-6 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleEnviarMensagem}
          disabled={status === 'SOLVED'}
        >
          Enviar
        </button>
      </div>
      {status === 'SOLVED' && (
        <div className="mt-2 text-red-400 font-bold text-center">Este chamado está finalizado. Não é possível enviar novas mensagens.</div>
      )}
    </div>
  );
} 
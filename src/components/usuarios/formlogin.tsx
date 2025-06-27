"use client"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UsuarioService } from "@/service/ApiConnection";
import { AtSign, Eye, EyeOff  } from "lucide-react";

export default function Page() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [token, setToken] = useState<string | null>(null);

    const handleLogin = async (e: any) => {
        e.preventDefault();
        try {
            const response = await UsuarioService.Login(email, senha)
            const token = response.data.token;
            const idf_Usuario = response.data.usuario?.id;

            if (token) {
              localStorage.setItem('token', token);
              if (idf_Usuario) {
                localStorage.setItem('idf_Usuario', String(idf_Usuario));
              }
              setToken(token);
              console.log('Login efetuado com sucesso!!:', response.data);
              window.alert(`Login efetuado com sucesso!!`);
              router.push('/');
            } else {
              window.alert('Token não recebido do backend.');
            }
        } catch (error) {
            console.error('Erro ao efetuar login!!:', error);
            window.alert(`Erro ao efetuar login!!${error}`);
        }
    };

    const [darkMode, setDarkMode] = useState(false);

    const toggleDarkMode = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        localStorage.setItem('darkMode', newMode ? 'enabled' : 'disabled');
    };

    useEffect(() => {
        const storedMode = localStorage.getItem('darkMode');
        if (storedMode === 'enabled') {
            setDarkMode(true);
        }
        // Verifica se o token existe ao carregar o componente
        const savedToken = localStorage.getItem('token');
        if (!savedToken) {
            console.warn('Token não encontrado no localStorage');
        } else {
            setToken(savedToken);
        }
    }, []);
    
    const resetPassword = () => {
        router.push('/resetpassword')
    }

    const handleRegister = () => {
        router.push('/register')
    }

    return (
        <div className="w-2xl m-4 inset-0">
            <div className="h-screen flex flex-col justify-center items-center bg-black">
                <div className="text-white flex text-center text-3xl font-bold mb-3 ">
                    Login com o Help Desk
                </div>

                <form onSubmit={handleLogin} className="w-lg flex flex-col items-center">
                    <div className="w-full p-2 mt-5 rounded-md flex items-center justify-center text-neutral-300 bg-neutral-950 text-lg">
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Digite seu E-mail"
                            className="h-12"
                            required
                        />
                        <AtSign className="mr-2"/>
                    </div>

                    <div className="w-full p-2 mt-5 rounded-md flex items-center justify-center text-neutral-300 bg-neutral-950 text-lg">
                        <Input
                            type="password"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            placeholder="Informe sua senha"
                            className="h-12"
                            required
                        />

                        <Eye className="mr-2"/>
                        <EyeOff className="mr-2"/>
                    </div>

                    <a onClick={resetPassword} className="mt-3 text-blue-400 font-bold cursor-pointer hover:underline">
                        Esqueceu a Senha?
                    </a>
                    
                    <Button type="submit" className="mt-5">
                        Login
                    </Button>

                    <div className="mt-3 text-white relative text-center">
                        <span className="text-blue-200 font-bold">
                            Não possui conta?
                            <a onClick={handleRegister} className="ml-2 text-sky-400 font-bold cursor-pointer hover:underline">
                                Registre-se
                            </a>
                        </span>
                    </div>
                    {/* Mensagem amigável se o token não existir */}
                    {!token && (
                        <div className="mt-4 text-red-400 text-sm">Token não encontrado. Faça login para acessar as funcionalidades protegidas.</div>
                    )}
                </form>
            </div>
        </div>
    )
}
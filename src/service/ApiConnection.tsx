"use client"
import axios from "axios";

export const axiosInstance = axios.create({
    //baseURL: "https://localhost:7299/api/",
    baseURL: "https://testing-api.hdsupport.bne.com.br/api/",
    headers: {
        "Content-Type": "application/json",
    }
});


export class UsuarioService {
    static Login(email: string, senha: string) {
        return axiosInstance.post(`/Usuario/Login?email=${email}&senha=${senha}`)
    }
    static Register(
        nome: string,
        email: string,
        senha: string,
        telefone: string,
        cargo: string,
        imagem: string = "string",
        status: number = 1,
        statusconversa: number = 1,
    ) {
        return axiosInstance.post(`/Usuario/Registro`, {
            nme_Usuario: nome,
            eml_Usuario: email,
            sen_Usuario: senha,
            tel_Usuario: telefone,
            cargo_Usuario: cargo,
            img_Usuario: imagem,
            status_Usuario: status,
            status_Conversa: statusconversa,
        });
    }
    static BuscarPorTokenJWT(token: string) {
        return axiosInstance.get(`/Usuario/BuscarPorTokenJWT/${token}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    }
}

export class ChamadosService {
    static DadosChamadosDashboard(token: string) {
        return axiosInstance.get(`/Conversa/Dados-Chamados-Dashboard`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    }
    static TodosChamados(token: string) {
        return axiosInstance.get(`/Conversa/Listar-Todos-Chamados`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    }
}

export class EquipamentosSevice {
    static ListarEquipamentos(token: string) {
        return axiosInstance.get(`/Equipamentos/Lista-equipamentos/`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    }
    static RegistroEquipamento(
        token: string,
        idf_Patrimonio: string,
        modelo_Equipamento: string,
        tpo_Equipamento: string,
        dtl_Equipamento: string,
        stt_Equipamento: number,
        img_Equipamento: string,
    ) {
        return axiosInstance.post(`/Equipamentos/Registro-equipamentos`, {
            idf_Patrimonio,
            modelo_Equipamento,
            tpo_Equipamento,
            dtl_Equipamento,
            stt_Equipamento,
            img_Equipamento,
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    }
    static EditarEquipamento(
        token: string,
        id: number,
        idf_Patrimonio: string,
        modelo_Equipamento: string,
        tpo_Equipamento: string,
        dtl_Equipamento: string,
        dta_Emprestimo_Inicio: string,
        dta_Emprestimo_Final: string,
        stt_Equipamento: number,
        profissional_Dh: string,
    ) {
        return axiosInstance.put(`/Equipamentos/Editar-Maquina/${id}`, {
            id,
            idf_Patrimonio,
            modelo_Equipamento,
            tpo_Equipamento,
            dtl_Equipamento,
            dta_Emprestimo_Inicio,
            dta_Emprestimo_Final,
            stt_Equipamento,
            profissional_Dh,
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    }
    static ExcluirEquipamento(token: string, id: number) {
        return axiosInstance.delete(`/Equipamentos/Excluir-Maquina/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    }
    static Graficobarras(token: string){
        return axiosInstance.get(`/Equipamentos/Dados-Equipamento-Barras`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    }
    static GraficoPizza(token: string){
        return axiosInstance.get(`/Equipamentos/Dados-Equipamento-Pizza`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    }
}

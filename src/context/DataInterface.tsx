"use client"

export interface Usuario {
    id: number;
    nme_Usuario: string;
    eml_Usuario: string;
    sen_Usuario: string;
    tel_Usuario: string;
    cargo_Usuario: string;
    img_Usuario: string;
    status_Usuario: string;
    status_Conversa: string;
    token_Redefinicao_Senha: string;
    dta_Token: string;
}
export interface Equipamentos {
    id: number;
    idf_Patrimonio: number;
    modelo_Equipamento: string;
    tpo_Equipamento: string;
    dtl_Equipamento: string;
    dta_Emprestimo_Inicio: string;
    dta_Emprestimo_Final: string;
    stt_Equipamento: number;
    profissional_Hd: string;
    img_Equipamento: string;
}
export interface Chamados {
    id: number;
    funcionario: Usuario;
    idf_Funcionario: number;
    cliente: Usuario;
    idf_Cliente: number;
    tipo_Conversa: number;
    criptografia_Conversa: string;
    stt_Conversa: number;
    dta_Inicio_Conversa: string;
    dta_Conclusao_Conversa: string;
}

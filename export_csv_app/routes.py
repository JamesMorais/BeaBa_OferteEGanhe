from flask import Blueprint, Response
import csv
from io import StringIO
from export_csv_app.db import fetch_data

# Usuários cadastrados
# Perfis de usuários
# Manutenção de talões
# Gestão de recebimento
# Gestão do estoque

export_bp = Blueprint('export', __name__)

@export_bp.route('/usuarios', methods=['GET'])
def export_usuarios():
    """Exporta os dados dos usuários para um arquivo CSV."""
    query = "SELECT matricula, nome, email, data_cadastro FROM usuario"
    usuarios = fetch_data(query)

    if not usuarios:
        return Response(
            "Nenhum dado foi encontrado para exportação.",
            status=404,
            mimetype="text/plain"
        )

    # Criar o CSV em memória
    si = StringIO()
    csv_writer = csv.writer(si)
    
    # Escrever cabeçalhos
    csv_writer.writerow(["Matrícula", "Nome", "Email", "Data de Cadastro"])
    
    # Escrever linhas de dados
    for usuario in usuarios:
        csv_writer.writerow([
            usuario["matricula"],
            usuario["nome"],
            usuario["email"],
            usuario["data_cadastro"]
        ])

    # Configurar a resposta HTTP
    output = si.getvalue()
    si.close()
    return Response(
        output,
        mimetype="text/csv",
        headers={"Content-Disposition": "attachment;filename=usuarios.csv"}
    )
    
    
@export_bp.route('/perfis', methods=['GET'])
def export_perfis():
    """Exporta os dados dos perfis para um arquivo CSV."""
    query = "SELECT id_perfil, nome_perfil, descricao FROM perfil"
    perfis = fetch_data(query)

    if not perfis:
        return Response(
            "Nenhum dado foi encontrado para exportação.",
            status=404,
            mimetype="text/plain"
        )

    # Criar o CSV em memória
    si = StringIO()
    csv_writer = csv.writer(si)
    
    # Escrever cabeçalhos
    csv_writer.writerow(["ID do Perfil", "Nome do Perfil", "Descrição"])
    
    # Escrever linhas de dados
    for perfil in perfis:
        csv_writer.writerow([
            perfil["id_perfil"],
            perfil["nome_perfil"],
            perfil["descricao"]
        ])

    # Configurar a resposta HTTP
    output = si.getvalue()
    si.close()
    return Response(
        output,
        mimetype="text/csv",
        headers={"Content-Disposition": "attachment;filename=perfis.csv"}
    )
@export_bp.route('/taloes/enviados', methods=['GET'])
def export_taloes_enviados():
    """Exporta os dados dos talões enviados para um arquivo CSV."""
    query = """
        SELECT 
            e.id_envio,
            t.id_talao,
            t.data_envio AS data_talao_envio,
            e.quantidade_enviada,
            e.data_envio AS data_envio_real,
            t.status,
            l.nome_loja
        FROM 
            public.envio_talao AS e
        JOIN 
            public.talao AS t ON e.id_talao = t.id_talao
        JOIN 
            public.loja AS l ON e.id_loja = l.id_loja;
    """
    taloes_enviados = fetch_data(query)

    if not taloes_enviados:
        return Response(
            "Nenhum dado foi encontrado para exportação.",
            status=404,
            mimetype="text/plain"
        )

    # Criar o CSV em memória
    si = StringIO()
    csv_writer = csv.writer(si)
    
    # Escrever cabeçalhos
    csv_writer.writerow(["ID do Envio", "ID do Talão", "Data do Talão Envio", "Quantidade Enviada", "Data de Envio Real", "Status", "Nome da Loja"])
    
    # Escrever linhas de dados
    for envio in taloes_enviados:
        csv_writer.writerow([
            envio["id_envio"],
            envio["id_talao"],
            envio["data_talao_envio"],
            envio["quantidade_enviada"],
            envio["data_envio_real"],
            envio["status"],
            envio["nome_loja"]
        ])

    # Configurar a resposta HTTP
    output = si.getvalue()
    si.close()
    return Response(
        output,
        mimetype="text/csv",
        headers={"Content-Disposition": "attachment;filename=taloes_enviados.csv"}
    )
    
@export_bp.route('/taloes/recebidos', methods=['GET'])
def export_taloes_recebidos():
    """Exporta os dados dos talões recebidos para um arquivo CSV."""
    query = """
        SELECT 
            r.id_recebimento,
            t.id_talao,
            t.data_recebimento AS data_talao_recebimento,
            r.quantidade_recebida,
            r.data_recebimento AS data_recebimento_real,
            t.status,
            l.nome_loja
        FROM 
            public.recebimento_talao AS r
        JOIN 
            public.talao AS t ON r.id_talao = t.id_talao
        JOIN 
            public.loja AS l ON r.id_loja = l.id_loja;
    """
    taloes_recebidos = fetch_data(query)

    if not taloes_recebidos:
        return Response(
            "Nenhum dado foi encontrado para exportação.",
            status=404,
            mimetype="text/plain"
        )

    # Criar o CSV em memória
    si = StringIO()
    csv_writer = csv.writer(si)
    
    # Escrever cabeçalhos
    csv_writer.writerow(["ID do Recebimento", "ID do Talão", "Data do Tal ão Recebimento", "Quantidade Recebida", "Data de Recebimento Real", "Status", "Nome da Loja"])
    
    # Escrever linhas de dados
    for recebimento in taloes_recebidos:
        csv_writer.writerow([
            recebimento["id_recebimento"],
            recebimento["id_talao"],
            recebimento["data_talao_recebimento"],
            recebimento["quantidade_recebida"],
            recebimento["data_recebimento_real"],
            recebimento["status"],
            recebimento["nome_loja"]
        ])

    # Configurar a resposta HTTP
    output = si.getvalue()
    si.close()
    return Response(
        output,
        mimetype="text/csv",
        headers={"Content-Disposition": "attachment;filename=taloes_recebidos.csv"}
    )
    
@export_bp.route('/estoque/taloes', methods=['GET'])
def export_estoque_taloes():
    """Exporta os dados do estoque de talões para um arquivo CSV."""
    query = "SELECT id_estoque, id_loja, quantidade_recomendada, quantidade_minima, quantidade_atual FROM estoque_talao"
    estoque_taloes = fetch_data(query)

    if not estoque_taloes:
        return Response(
            "Nenhum dado foi encontrado para exportação.",
            status=404,
            mimetype="text/plain"
        )

    # Criar o CSV em memória
    si = StringIO()
    csv_writer = csv.writer(si)
    
    # Escrever cabeçalhos
    csv_writer.writerow(["ID do Estoque", "ID da Loja", "Quantidade Recomendada", "Quantidade Mínima", "Quantidade Atual"])
    
    # Escrever linhas de dados
    for estoque in estoque_taloes:
        csv_writer.writerow([
            estoque["id_estoque"],
            estoque["id_loja"],
            estoque["quantidade_recomendada"],
            estoque["quantidade_minima"],
            estoque["quantidade_atual"]
        ])

    # Configurar a resposta HTTP
    output = si.getvalue() 
    si.close()
    return Response(
        output,
        mimetype="text/csv",
        headers={"Content-Disposition": "attachment;filename=estoque_taloes.csv"}
    )
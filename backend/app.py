# backend/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS 

app = Flask(__name__)
CORS(app) 
@app.route('/')
def home():
    return "Bem-vindo ao simulador de cotação de seguro de automóvel!"

@app.route('/cotacao', methods=['POST'])
def calcular_cotacao():
    data = request.get_json()

    if not data:
        return jsonify({"erro": "Nenhum dado JSON fornecido"}), 400

    # Extrair dados do request
    nome_cliente = data.get('nome_cliente')
    idade_condutor = data.get('idade_condutor')
    tipo_veiculo = data.get('tipo_veiculo')
    ano_veiculo = data.get('ano_veiculo')
    valor_veiculo = data.get('valor_veiculo')

    # Validação básica dos dados
    if not all([nome_cliente, idade_condutor, tipo_veiculo, ano_veiculo, valor_veiculo]):
        return jsonify({"erro": "Todos os campos são obrigatórios."}), 400
    
    if not isinstance(idade_condutor, (int, float)) or idade_condutor <= 0:
        return jsonify({"erro": "Idade do condutor inválida."}), 400
    if not isinstance(ano_veiculo, (int, float)) or ano_veiculo <= 1900 or ano_veiculo > 2025: # Ajuste o ano_veiculo máximo para o ano atual
        return jsonify({"erro": "Ano do veículo inválido."}), 400
    if not isinstance(valor_veiculo, (int, float)) or valor_veiculo <= 0:
        return jsonify({"erro": "Valor do veículo inválido."}), 400

    # --- Lógica de Negócio para o Cálculo do Seguro ---
    base_seguro = valor_veiculo * 0.06 
    modificadores_resumo = [] 

    # Modificadores de idade 
    if idade_condutor <= 25:
        base_seguro *= 1.15 
        modificadores_resumo.append("Idade (15%)")

    # Modificadores de tipo de veículo 
    if tipo_veiculo.lower() == 'suv':
        base_seguro *= 1.10 
        modificadores_resumo.append("SUV (10%)")
    elif tipo_veiculo.lower() == 'caminhonete':
        base_seguro *= 1.20 
        modificadores_resumo.append("Caminhonete (20%)")

    # Modificadores de ano do veículo 
    ano_atual = 2025 
    if (ano_atual - ano_veiculo) > 10:
        base_seguro *= 1.05 # +5% 
        modificadores_resumo.append("Veículo > 10 anos (5%)")

    valor_final_seguro = round(base_seguro, 2)

    # Construir o resumo 
    resumo_string = f"Base: R$ {valor_veiculo * 0.06:.2f}"
    if modificadores_resumo:
        resumo_string += " + " + " + ".join(modificadores_resumo)

     # --- Resposta da API --- 
    response = {
        "nome": nome_cliente, 
        "valor_seguro": valor_final_seguro, 
        "resumo": resumo_string 
    }

    return jsonify(response)

if __name__ == '__main__':

    app.run(port=5000)
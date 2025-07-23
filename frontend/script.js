// frontend/script.js

// Pega referências aos elementos do DOM (Document Object Model)
const cotacaoForm = document.getElementById('cotacaoForm');
const resultadoCotacaoDiv = document.getElementById('resultadoCotacao');
const resultadoNomeSpan = document.getElementById('resultadoNome');
const resultadoValorSpan = document.getElementById('resultadoValor');
const resultadoResumoSpan = document.getElementById('resultadoResumo');

// Adiciona um 'listener' para o evento de 'submit' do formulário
cotacaoForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Impede o comportamento padrão de recarregar a página ao enviar o formulário

    // Coleta os valores dos campos do formulário
    const nomeCliente = document.getElementById('nomeCliente').value;
    const idadeCondutor = parseInt(document.getElementById('idadeCondutor').value); // Converte para número inteiro
    const tipoVeiculo = document.getElementById('tipoVeiculo').value;
    const anoVeiculo = parseInt(document.getElementById('anoVeiculo').value); // Converte para número inteiro
    const valorVeiculo = parseFloat(document.getElementById('valorVeiculo').value); // Converte para número decimal

    // Cria um objeto com os dados para enviar para a API
    const dadosParaAPI = {
        nome_cliente: nomeCliente,
        idade_condutor: idadeCondutor,
        tipo_veiculo: tipoVeiculo,
        ano_veiculo: anoVeiculo,
        valor_veiculo: valorVeiculo
    };

    console.log('Dados enviados para a API:', dadosParaAPI); // Para debug

    try {
        // Faz a requisição POST para o seu backend
        // Certifique-se de que o URL corresponde ao seu backend Flask (http://127.0.0.1:5000/cotacao)
        const response = await fetch('http://127.0.0.1:5000/cotacao', {
            method: 'POST', // Define o método como POST
            headers: {
                'Content-Type': 'application/json' // Informa que o corpo da requisição é JSON
            },
            body: JSON.stringify(dadosParaAPI) // Converte o objeto JavaScript para uma string JSON
        });

        // Verifica se a resposta da rede foi bem-sucedida (status 2xx)
        if (!response.ok) {
            const errorData = await response.json(); // Tenta ler a mensagem de erro do backend
            throw new Error(`Erro na requisição: ${response.status} - ${errorData.erro || 'Erro desconhecido'}`);
        }

        // Converte a resposta JSON para um objeto JavaScript
        const resultado = await response.json();

        console.log('Resposta da API:', resultado); // Para debug

        // Preenche os spans com os dados recebidos
        resultadoNomeSpan.textContent = resultado.nome;
        // Formata o valor do seguro para moeda brasileira
        resultadoValorSpan.textContent = `R$ ${resultado.valor_seguro.toFixed(2).replace('.', ',')}`;
        resultadoResumoSpan.textContent = resultado.resumo;

        // Torna a seção de resultado visível
        resultadoCotacaoDiv.style.display = 'block';

    } catch (error) {
        // Exibe qualquer erro que ocorra durante a requisição
        console.error('Erro ao calcular cotação:', error);
        alert('Ocorreu um erro ao calcular a cotação. Verifique o console para mais detalhes.');
        resultadoCotacaoDiv.style.display = 'none'; // Oculta a seção de resultado em caso de erro
    }
});
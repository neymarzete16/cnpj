async function buscarCNPJ() {
    const input = document.getElementById('cnpjInput').value.replace(/\D/g, '');
    const loader = document.getElementById('loader');
    const resultCard = document.getElementById('resultCard');

    if (input.length !== 14) {
        alert("CNPJ inválido! Digite os 14 números.");
        return;
    }

    loader.classList.remove('hidden');
    resultCard.classList.add('hidden');

    try {
        const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${input}`);
        
        if (!response.ok) throw new Error();

        const data = await response.json();
        
        // Preenchendo os campos
        document.getElementById('res_razao').innerText = data.razao_social;
        document.getElementById('res_fantasia').innerText = data.nome_fantasia || "Não informado";
        document.getElementById('res_cnpj').innerText = data.cnpj;
        document.getElementById('res_situacao').innerText = data.descricao_situacao_cadastral;
        document.getElementById('res_atividade').innerText = data.cnae_fiscal_descricao;
        document.getElementById('res_capital').innerText = `R$ ${data.capital_social.toLocaleString('pt-BR')}`;
        document.getElementById('res_tel').innerText = data.ddd_telefone_1;
        document.getElementById('res_end').innerText = `${data.logradouro}, ${data.numero} - ${data.municipio}/${data.uf}`;

        resultCard.classList.remove('hidden');
    } catch (err) {
        alert("Erro ao buscar CNPJ. Verifique o número ou tente novamente.");
    } finally {
        loader.classList.add('hidden');
    }
}

function gerarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    const razao = document.getElementById('res_razao').innerText;
    
    doc.setFontSize(18);
    doc.text("Relatório de Consulta de CNPJ", 10, 20);
    
    doc.setFontSize(12);
    doc.text(`Razão Social: ${razao}`, 10, 40);
    doc.text(`CNPJ: ${document.getElementById('res_cnpj').innerText}`, 10, 50);
    doc.text(`Situação: ${document.getElementById('res_situacao').innerText}`, 10, 60);
    doc.text(`Atividade: ${document.getElementById('res_atividade').innerText}`, 10, 70);
    doc.text(`Endereço: ${document.getElementById('res_end').innerText}`, 10, 80);

    doc.save(`CNPJ_${razao}.pdf`);
}
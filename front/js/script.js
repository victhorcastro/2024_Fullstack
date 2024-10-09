const protocolo = 'http://';
const baseURL = 'localhost:3000';
const filmeEndPoint = '/filmes';

async function obterFilmes() {
    const URLcompleta = `${protocolo}${baseURL}${filmeEndPoint}`;
    const filmes = (await axios.get(URLcompleta)).data
    let tabela = document.querySelector('.filmes');
    let corpoTabela = tabela.getElementsByTagName('tbody')[0]
    for (let filme of filmes) {
        let linha = corpoTabela.insertRow(0)
        let celulaTitulo = linha.insertCell(0)
        let celulaSinopse = linha.insertCell(1)
        celulaTitulo.textContent = filme.titulo
        celulaSinopse.textContent = filme.sinopse
        
    }
    //console.log(filmes);
}
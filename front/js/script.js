const protocolo = 'http://';
const baseURL = 'localhost:3000';
const filmeEndPoint = '/filmes';

async function obterFilmes() {
    const URLcompleta = '${protocolo}${baseURL}${filmeEndPoint}';
    const filmes = (await axios.get(URLcompleta)).data

    console.log(filmes);
}
const express = require ('express')
const cors = require ('cors')
const mongoose = require('mongoose')
const app = express()

app.use (express.json())
app.use (cors())

const Filme = mongoose.model("Filme", mongoose.Schema({
    titulo: {type: String},
    sinopse: {type: String}
}))

async function connectarAoMongo() {
    await mongoose.connect(`mongodb+srv://Banco:1234@cluster0.bd5d7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
}


app.get("/filmes", async (req, res) => {
    const filmes = await Filme.find()
    res.json(filmes)
})

app.post("/filmes", async (req, res) => {
    //captura o que o usuário enviou
    const titulo = req.body.titulo
    const sinopse = req.body.sinopse
    //montar o objeto de acordo com o modelo Filme
    const filme = new Filme({titulo: titulo, sinopse: sinopse})
    await filme.save()
    const filmes = await Filme.find()
    res.json(filmes)
})

app.listen(3000, () => {
    try {
        connectarAoMongo()
        console.log("up and running")
    } catch (e) {
        console.log('erro na conexão', e)
    }
})

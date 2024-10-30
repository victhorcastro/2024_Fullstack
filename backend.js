const express = require ('express')
const cors = require ('cors')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const uniqueValidator = require('mongoose-unique-validator')
const app = express()

app.use (express.json())
app.use (cors())

const Filme = mongoose.model("Filme", mongoose.Schema({
    titulo: {type: String},
    sinopse: {type: String}
}))

const usuarioSchema = mongoose.Schema({
    login: {type: String, required: true, unique: true},
    password: {type: String, required: true}
})
usuarioSchema.plugin(uniqueValidator)
const Usuario = mongoose.model("Usuario", usuarioSchema)

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
app.post("/signup", async (req, res) => {
    try {
        const login = req.body.login
        const password = req.body.password
        const senhacriptografada = await bcrypt.hash(password, 10)
        const usuario = new Usuario({login: login, password: senhacriptografada})
        const respMongo = await usuario.save()
        console.log(respMongo)
        res.status(201).end()
    } catch(e) {
        console.log('Erro ao cadastrar usuário', e)
        res.status(409).end()
    }
})

app.post("/login", async (req, res) => {
    const login = req.body.login
    const password = req.body.password
    const usuarioExiste = await Usuario.findOne({login: login})
    if (!usuarioExiste) {
        return res.status(401).json({mensagem: "login inválido"})
    }
    const senhaValida = await bcrypt.compare(password, usuarioExiste.password)
    if (!senhaValida) {
        return res.status(401).json({mensagem: "senha inválida"})
    }
    const token = jwt.sign(
        {login : login},
        "chave-secreta",
        {expiresIn: "1h"}
    )
    res.status(200).json({token: token})
})

app.listen(3000, () => {
    try {
        connectarAoMongo()
        console.log("up and running")
    } catch (e) {
        console.log('erro na conexão', e)
    }
})

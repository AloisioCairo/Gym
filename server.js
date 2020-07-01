const express = require('express')  // Comando para chamar o express
const nunjucks = require('nunjucks') 
const routes = require('./routes')

const server = express()

server.use(express.static('public'))
server.use(routes)

// Configura o nunjucks - Fase 2 - Template Engine - Instalando e configurando o Nunjucks
server.set("view engine", "njk")
nunjucks.configure("views", {
    express: server,
    autoescape: false,
    noCache: true
})

server.listen(5000, function() {
    console.log("Server is running")
})





/*
server.get("/portfolio", function(req, res){
    return res.render("portfolio")
})
server.get("/aulas", function(req, res){
    return res.render("class")
})
server.get("/artigos", function(req, res){
    return res.render("article")
})
*/
const express = require('express')
const routes = express.Router()

routes.get("/", function(req, res){
    return res.redirect("/instructors")
})

routes.get("/instructors", function(req, res){
    return res.render("instructors/index")
})

routes.get("/instructors/create", function(req, res){
    return res.render("instructors/create")
})

routes.post("/instructors/create", function(req, res){
    return res.sender("recebido")
})

routes.get("/members", function(req, res){
    return res.send("Members")
})

module.exports = routes

/*
routes.get('/', function (req, res) {
    return res.send("OK")
})*/
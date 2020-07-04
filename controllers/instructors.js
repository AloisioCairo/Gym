const fs = require('fs') /* Modulo do "node" file sistem */
const data = require('../data.json')
const { age, date } = require('../utils')

/* Manipulando dados - Buscando instrutor com parâmetros da rota 
   Seleciona o instrutor pelo ID */
exports.show = function(req, res) {

    const { id } = req.params

    const foundInstructor = data.instructors.find(function(instructor){
        return instructor.id == id
    })

    if (!foundInstructor)
        return res.send("Instrutor não encontrado.")

    const instructor = {
        ... foundInstructor,
        age: age(foundInstructor.birth),
        services: foundInstructor.services.split(","),
        created_at: Intl.DateTimeFormat("pt-BR").format(foundInstructor.created_at),
    }

    return res.render("instructors/show", { instructor })
}

exports.create = function(req, res){
    return res.render("instructors/create")
}

/* Cadastro de Instrutores - Separando as funções das rotas */
// Creat
exports.post = function(req, res){
    /* Cadastro de Instrutores - Validando dados no Back end
       Seleciona pelo nome, os componentes de entradas de dados */
    const keys = Object.keys(req.body)

    for (key of keys){
        if (req.body[key] == "") {
            return res.send('Por favor. Preencha todos os campos.')
        }
    }

    let {avatar_url, birth, name, services, gender} = req.body
    
    birth = Date.parse(birth)
    const created_at = Date.now()
    const id = Number(data.instructors.length + 1)

    data.instructors.push({
        id,
        name,
        avatar_url,
        birth,
        gender,
        services,
        created_at
    })

    /* Cadastro de Instrutores - Trabalhando com dados em JSON 
    data.instructors.push(req.body)*/

    /* Cadastro de Instrutores - Usando Node fs e entendendo callback function 
       "data.json" - Arquivo que vai salvar os dados da aplicação */
    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {

        if (err)
            return res.send("Erro na escrita do arquivo.")

        return res.redirect("instructors")
    })

    //return res.send(req.body)
}

exports.edit = function(req, res){
    const { id } = req.params

    const foundInstructor = data.instructors.find(function(instructor){
        return instructor.id == id
    })

    if (!foundInstructor)
        return res.send("Instrutor não encontrado.")    
    
    const instructor = {        
        ... foundInstructor,
        birth: date(foundInstructor.birth).iso
    }

    return res.render('instructors/edit', {instructor })
}

/* Atualizando e excluindo instrutores - Entendendo verbos HTTP */
exports.put = function(req, res) {
    const { id } = req.body
    let index = 0

    const foundInstructor = data.instructors.find(function(instructor, foundIndex){
        if (id == instructor.id) {
            index = foundIndex
            return true
        }
    })

    if (!foundInstructor)
        return res.send("Instrutor não encontrado.") 

    const instructor = {
        ... foundInstructor,
        ... req.body,
        birth: Date.parse(req.body.birth),
        id: Number(req.body.id)
    }

    data.instructors[index] = instructor

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
        if (err)
            return res.send("Erro na atualização dos dados")
        
        return res.redirect(`/instructors/${id}`)
    })
}

/* Atualizando e excluindo instrutores - Deletando um instrutor */
exports.delete = function(req, res) {
    const { id } = req.body

    const filteredInstructors = data.instructors.filter(function(instructor){
        return instructor.id != id
    })

    data.instructors = filteredInstructors

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
        if (err)
            return res.send('Erro na escrita/exclusão.')
        
        res.redirect('/instructors')
    })
}

/* Listando instrutores - Listando instrutores com tabelas em HTML */
exports.index = function(req, res){
    return res.render("instructors/index", { instructors : data.instructors })
}
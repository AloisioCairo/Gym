const fs = require('fs') /* Modulo do "node" file sistem */
const data = require('./data.json')
const { RSA_PKCS1_OAEP_PADDING } = require('constants')

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

    let {avatar_url, birth, name, service, gender} = req.body
    
    birth = Date.parse(birth)
    const created_at = Date.now()
    const id = Number(data.instructors.length + 1)

    data.instructors.push({
        id,
        name,
        avatar_url,
        birth,
        gender,
        service,
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
/* Trabalhando com banco de dados - Criando models e aprofundando em 
callback function */
const { age, date } = require('../../lib/utils')
const db = require('../../config/db')

module.exports = {
    all(callback) {
        db.query(`
        SELECT instructors.*, count(members) AS total_students
        FROM instructors
        LEFT JOIN members ON (members.instructor_id = instructors.id)
        GROUP BY instructors.id
        ORDER BY instructors."name" `, function(err, results){
        
            if (err)
                throw `Erro na leitura dos dados no banco de dados. ${err}`

            callback(results.rows)
        })        
    },
    create (data, callback){       
        const query = `INSERT INTO instructors (avatar_url, name, birth, gender, created_at, services)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id`
        
        const values = [
            data.avatar_url, data.name, date(data.birth).iso, data.gender, 
            date(Date.now()).iso, data.services 
        ]

        db.query(query, values, function(err, results){
            if (err)
            throw `Erro no banco de dados. ${err}`
                            
            callback(results.rows[0])
        })
    },
    find (id, callback) {        
        db.query(`SELECT * FROM instructors WHERE id = $1`, [id], function(err, results) {            
            
            if (err)
            throw `Erro no banco de dados. ${err}`
                    
            callback(results.rows[0])            
        })

    },
    findBy (filter, callback) {               
        db.query(`
        SELECT instructors.*, count(members) AS total_students
        FROM instructors
        LEFT JOIN members ON (members.instructor_id = instructors.id)
        WHERE instructors.name ILIKE '%${filter}%'
        OR instructors.services ILIKE '%${filter}%'
        GROUP BY instructors.id
        ORDER BY instructors."name" `, function(err, results){
            
            if (err)
            throw `Erro no banco de dados. ${err}`
                    
            callback(results.rows)            
        })

    },
    update (data, callback){
        const query = `UPDATE instructors SET
            avatar_url = ($1),
            name = ($2),
            birth = ($3),
            gender = ($4),
            services = ($5)
        WHERE id = $6`

        const values = [
            data.avatar_url, data.name, date(data.birth).iso, data.gender, data.services, data.id
        ]

        db.query(query, values, function(err, results){
            if (err)
                throw `Erro no banco de dados. ${err}`
            
            callback()
        })

    },
    delete(id, callback) {
        db.query(`DELETE FROM instructors WHERE id = $1`, [id], function(err, results){
            if (err)
                throw `Erro ao tentar deletar instrutor. ${err}`
            
            return callback()        
        })
    },
    paginate(params){
        const { filter, limit, offset, callback } = params

        let query = "",
            filterQuery = "",
            totalQuery = `(SELECT count(*) FROM instructors) AS total`        

            if (filter) {
                filterQuery = `${query}
                WHERE instructors.name ILIKE '%${filter}%'
                OR instructors.services ILIKE '%${filter}%'
                `

                totalQuery = `(SELECT count(*) FROM instructors
                    ${filterQuery}) AS total`
            }

            query = `
                SELECT instructors.*, ${totalQuery}, count(members) AS total_students
                FROM instructors
                LEFT JOIN members ON (members.instructor_id = instructors.id)
                ${filterQuery}
                GROUP BY instructors.id LIMIT $1 OFFSET $2                
                `

            db.query(query, [limit, offset], function(err, results){
                if (err)
                    throw 'Erro ao listar os dados dos instrutores cadastrados.'
                
                callback(results.rows)
            })
    }
}
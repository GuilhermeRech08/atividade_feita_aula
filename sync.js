const conn = require('./db/conn')
const { Cliente, Veiculo, Agendamento } = require('./models/rel')

async function syncDataBase() {
    try{
        await conn.sync({force: true})
        console.log('Tabelas sincronizadas!')
    }catch(err){
        console.error('Erro ao sincronizar tabelas')
    }finally{
        await conn.close()
        console.log('Fechando conexão')
    }
}

syncDataBase()
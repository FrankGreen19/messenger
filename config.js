const port = 3001;

const db = {
    host: '127.0.0.1',
    port: '5432',
    user: 'postgres',
    password: 'postgres',
    name: 'messenger'
}

module.exports = {port, db};
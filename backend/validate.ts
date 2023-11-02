import data from './salts.json'
const bcrypt = require('bcrypt')

console.log(data);

async function validateUser(username, passwd) {
    // get username and password from DB
    const match = await bcrypt.compareSync(passwd, password_from_db)
    return match
}

async function hashPassword(username, passwd) {
    const salt = data.username
    const hash = bcrypt.hashSync(passwd, salt)
    // store the hashed passwd in db

}
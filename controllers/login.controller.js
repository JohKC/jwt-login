const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const jwtDecode = require('jwt-decode');

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'dbtest'
});

// testing roles
module.exports.getUsers = (req, res) => {
    let token = req.headers.authorization;

    if (!token) {
        res.status(401).send({
            error: 'token authentication needed'
        });
    }

    token = token.replace('Bearer ', '');
    decoded = jwt.decode(token);

    if (decoded === null) {
        res.send({
            error: 'invalid token'
        });
    } else {
        if (decoded.role !== 'admin') {
            res.status(401).send({
                error: "you shouldn't be here"
            });
        } else {
            let query = `SELECT * FROM users`;

            con.query(query, (err, result, fields) => {
                if (err) throw err;

                if (result.length > 0) {
                    res.json(result);
                }
            });
        }
    }
};

module.exports.login = (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    let query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;

    con.query(query, (err, result, fields) => {
        if (err) throw err;

        if (result.length > 0) {
            let token = jwt.sign({
                username: result[0].username,
                role: result[0].role
            }, 'ultra_secret_admin_key', { expiresIn: 60 * 60 * 24 });

            res.json({
                username: result[0].username,
                role: result[0].role,
                token: token
            });
        } else {
            res.status(401).send({
                error: 'invalid credentials'
            });
        }
    });
};

// Client-side
module.exports.verify = async(req, res) => {
    let token = req.headers['authorization'];

    if (!token) {
        res.status(401).send({
            error: 'authentication token needed'
        });
    } else {
        token = token.replace('Bearer ', '');

        jwt.verify(token, 'ultra_secret_admin_key', (err, decoded) => {
            if (err) {
                res.status(401).send({
                    error: 'invalid token'
                });
            }
        });
    }
};
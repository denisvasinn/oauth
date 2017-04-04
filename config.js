module.exports = {
    port: 3000,
    expires: 1 * 60 * 60 * 1000,
    session: {
        name: 'id',
        secret: 'z3Cuf3ij7',
        resave: true,
        saveUninitialized: false,
        cookie: {
            secure: true,
            httpOnly: true,
            path: '/', 
            maxAge: 1 * 24 * 60 * 60 * 1000
        }
    },
    mail: {
        user: 'dvpersonalsite@gmail.com',
        password: 'dvps1347',
        host:	'smtp.gmail.com',
        ssl: true
    }
}
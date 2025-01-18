const express = require('express')
const app = express()

app.use(express.json())

const port = 3000

const users = [
    {
        login: 'testUser',
        name: 'Evan',
        password: '324e2342',
        token: '123456',
        gameLists: [
            {
                name: 'my games',
                gamesId: [432, 3234]
            }
        ]
    },
]

app.get('/account', (req, res) => {
    const user = users.find(user => user.login === req.body.login)
    if (user) {
        if (user.password === req.body.password) {
            res.json({
                success: true,
                message: '',
                token: user.token
            })
        } else {
            res.json({
                success: false,
                message: 'password is incorrect',
            })
        }
    } else {
        res.status(404).json({error: 'no user with login' + req.body.login})
    }
})

app.post('/account', (req, res) => {
    const user = users.find(user => user.login === req.body.login)
    if (!user) {
        const token = req.body.login + 322123
        users.push({
            login: req.body.login,
            name: req.body.name,
            password: req.body.password,
            token: token,
            gameLists: []
        })
        res.json({
            success: true,
            message: 'new user was created successfully',
            token: token
        })
    } else {
        res.json({
            success: false,
            message: 'user with this login already exists',
        })
    }
})

app.put('/account', (req, res) => {
    const userIndex = users.findIndex(user => user.token === req.body.token)
    if (userIndex !== -1) {
        users[userIndex].name = req.body.name
        res.json({
            success: true,
            message: 'name was updated successfully'
        })
    } else {
        res.json({
            success: false,
            message: 'token is incorrect or user does not exist',
        })
    }
})

app.put('/account/pass', (req, res) => {
    const userIndex = users.findIndex(user => user.token === req.body.token)
    if (userIndex !== -1) {
        if (req.body.oldPassword === users[userIndex].password) {
            users[userIndex].password = req.body.newPassword
            res.json({
                success: true,
                message: 'password updated successfully',
            })
        } else {
            res.json({
                success: false,
                message: 'password is incorrect',
            })
        }
    } else {
        res.json({
            success: false,
            message: 'token is incorrect or user does not exist'
        })
    }
})

app.delete('/account', (req, res) => {
    const userIndex = users.findIndex(user => req.body.token === user.token)
    if (userIndex !== -1) {
        users.splice(userIndex, 1)
        res.json({
            success: true,
            message: 'user was deleted successfully',
        })
    } else {
        res.json({
            success: false,
            message: 'user with this token does not exist',
        })
    }
})

app.get('/', (req, res) => {
    res.json(users)
})

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})
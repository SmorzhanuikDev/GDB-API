const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors())

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
                id: 1,
                name: 'my games',
                gamesId: [432, 3234]
            }
        ],
        ratedGames: new Map([
            [12, 1],
            [121, 3],
            [32, 2]
        ])
    },
]

app.get('/account', (req, res) => {
    const user = users.find(user => user.login === req.query.login)
    if (user) {
        if (user.password === req.query.password) {
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
        res.json({
            message: 'no user with provided login',
            success: false
        })
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
            gameLists: [],
            ratedGames: new Map([])
        })
        res.json({
            success: true,
            message: 'New user was created successfully',
            token: token
        })
    } else {
        res.json({
            success: false,
            message: 'This login not available',
        })
    }
})

app.get('/account/checkLogin', (req, res) => {
    const user = users.find(user => user.login === req.query.login)
    if (!user) {
        res.json({
            success: true,
            message: 'Login can be used',
        })
    } else {
        res.json({
            success: false,
            message: 'User with this login already exists',
        })
    }
})

app.put('/account', (req, res) => {
    const userIndex = users.findIndex(user => user.token === req.query.token)
    if (userIndex !== -1) {
        users[userIndex].name = req.body.name
        res.json({
            success: true,
            message: 'name was updated successfully',
            newName: req.body.name
        })
    } else {
        res.json({
            success: false,
            message: 'token is incorrect or user does not exist',
        })
    }
})

app.put('/account/pass', (req, res) => {
    const userIndex = users.findIndex(user => user.token === req.query.token)
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
    const userIndex = users.findIndex(user => req.query.token === user.token)
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

app.get('/user', (req, res) => {
    const userIndex = users.findIndex(user => req.query.token === user.token)
    if (userIndex !== -1) {
        res.json({
            success: true,
            message: 'success',
            user: users[userIndex]
        })
    } else {
        res.json({
            success: false,
            message: 'user with this token does not exist',
        })
    }
})

app.post('/gameList', (req, res) => {
    const userIndex = users.findIndex(user => req.query.token === user.token)
    if (userIndex !== -1) {
        users[userIndex].gameLists.push({
            name: req.body.listName,
            id: users[userIndex].gameLists.length + 1,
            gamesId: req.body.gameId ? [].concat(req.body.gameId) : []
        })
        res.json({
            success: true,
            message: 'success',
            user: users[userIndex]
        })
    } else {
        res.json({
            success: false,
            message: 'user with this token does not exist',
        })
    }
})

app.delete('/gameList', (req, res) => {
    const userIndex = users.findIndex(user => req.query.token === user.token)
    if (userIndex !== -1) {
        const listIndex = users[userIndex].gameLists.findIndex(list => req.body.listId === list.id)
        if (listIndex !== -1) {
            users[userIndex].gameLists.splice(listIndex, 1)
            res.json({
                success: true,
                message: 'list was deleted successfully',
                user: users[userIndex]
            })
        } else {
            res.json({
                success: false,
                message: 'Not found list with this id',
            })
        }
    } else {
        res.json({
            success: false,
            message: 'user with this token does not exist',
        })
    }
})

app.put('/gameList', (req, res) => {
    const userIndex = users.findIndex(user => req.query.token === user.token)
    if (userIndex !== -1) {
        const listIndex = users[userIndex].gameLists.findIndex(list => req.body.listId === list.id)
        if (listIndex !== -1) {
            const gameId = users[userIndex].gameLists[listIndex].gamesId.findIndex(gameId => req.body.gameId === gameId)
            if (gameId !== -1) {
                users[userIndex].gameLists[listIndex].gamesId.splice(gameId, 1)
                res.json({
                    success: true,
                    message: 'Game was deleted successfully',
                    user: users[userIndex]
                })
            } else {
                users[userIndex].gameLists[listIndex].gamesId.push(req.body.gameId)
                res.json({
                    success: true,
                    message: 'list was updated successfully',
                    user: users[userIndex]
                })
            }
        } else {
            res.json({
                success: false,
                message: 'Not found list with this id',
            })
        }
    } else {
        res.json({
            success: false,
            message: 'user with this token does not exist',
        })
    }
})

app.put('/gameListName', (req, res) => {
    const userIndex = users.findIndex(user => req.query.token === user.token)
    if (userIndex !== -1) {
        const listIndex = users[userIndex].gameLists.findIndex(list => req.body.listId === list.id)
        if (listIndex !== -1) {
            users[userIndex].gameLists[listIndex].name = req.body.name
            res.json({
                success: true,
                message: 'Name of list was updated successfully',
                user: users[userIndex]
            })
        } else {
            res.json({
                success: false,
                message: 'Not found list with this id',
            })
        }
    } else {
        res.json({
            success: false,
            message: 'user with this token does not exist',
        })
    }
})

app.get('/gameRating', (req, res) => {
    const userIndex = users.findIndex(user => req.query.token === user.token)
    if (userIndex !== -1) {
        if (users[userIndex].ratedGames.has(req.body.gameId)) {
            res.json({
                success: true,
                message: 'Game is rated',
                gameRating: users[userIndex].ratedGames.get(req.body.gameId)
            })
        } else {
            res.json({
                success: true,
                message: 'Game has not rated',
            })
        }
    } else {
        res.json({
            success: false,
            message: 'user with this token does not exist',
        })
    }
})

app.put('/gameRating', (req, res) => {
    const userIndex = users.findIndex(user => req.query.token === user.token)
    if (userIndex !== -1) {
        users[userIndex].ratedGames.set(req.body.gameId, req.body.rating)
        res.json({
            success: true,
            message: 'game was rated successfully',
        })
    } else {
        res.json({
            success: false,
            message: 'user with this token does not exist',
        })
    }
})

app.delete('/gameRating', (req, res) => {
    const userIndex = users.findIndex(user => req.query.token === user.token)
    if (userIndex !== -1) {
        users[userIndex].ratedGames.delete(req.body.gameId)
        res.json({
            success: true,
            message: 'rating was deleted successfully',
        })
    } else {
        res.json({
            success: false,
            message: 'user with this token does not exist',
        })
    }
})

app.get('/gameRatingList', (req, res) => {
    const userIndex = users.findIndex(user => req.query.token === user.token)
    if (userIndex !== -1) {
        const ratedGames = []
        for (let entry of  users[userIndex].ratedGames) {
            ratedGames.push(entry)
        }
        res.json({
            success: true,
            message: 'success',
            ratedGamesList: ratedGames
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
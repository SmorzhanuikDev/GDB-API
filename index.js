const express = require('express')
const app = express()

app.use(express.json())

const port = 3000

const users = [
    {
        login: 'testUser',
        name: 'Evan',
        password: '123456',
        token: '123456',
        gameLists: [
            {
                name: 'my games',
                gamesId: [432, 3234]
            }
        ]
    },
]


app.get('/', (req, res) => {
    res.json(users)
})

app.post('/', (req, res) => {
    console.log(req.body)
    users.push(req.body)
    res.json({test: 'this shit works, and after nodemon adding works to'})
})

app.put('/', (req, res) => {
    res.json({test: 'this shit works, and after nodemon adding works to'})
})

app.delete('/', (req, res) => {
    res.json({test: 'this shit works, and after nodemon adding works to'})
})

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})
const express = require('express')
const app = express()

app.use(express.json())

const port = 3000

app.get('/', (req, res) => {
    res.json({test: 'this shit works, and after nodemon adding works to'})
})
app.get('/', (req, res) => {
    res.json({test: 'this shit works, and after nodemon adding works to'})
})

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})
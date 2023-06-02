const express = require('express')
const morgan = require('morgan')

const app = express()

morgan.token('getContent', (req, res) => {
    if (req.method === 'POST') {
        return JSON.stringify(req.body)
    }
})
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :getContent '))

let data = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/api/persons', (req, res) => {
    res.json(data)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const asset = data.find(asset => asset.id === id)

    if (asset) {
        res.json(asset)
    } else {
        res
            .status(404)
            .send('Asset not found')

    }
})

app.post('/api/persons', (req, res) => {
    const body = req.body
    if (!body.name || !body.number) {
        return res
            .status(400)
            .json({ error: 'content missing' })
    }

    if (data.find(person => person.name === body.name)) {
        return res
            .status(409)
            .json({ error: 'name must be unique' })
    }

    const person = {
        id: Math.floor(Math.random() * 1000),
        name: body.name,
        number: body.number
    }

    data = data.concat(person)
    res.json(data)
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)

    data = data.filter(person => person.id !== id)
    res.status(204).end()
})

app.get('/info', (req, res) => {
    res.send(`Phonebook has info for ${data.length} people <br> ${Date()}`)
})

const unknownEndpoint = (req, res) => {
    res
        .status(404)
        .json({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const port = 3000

app.listen(port, () => {
    console.log(`Server running on ${port}`)
})
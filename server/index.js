const express  = require('express')
const bodyParser = require('body-parser')
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express')

const schema = require('./schema')
const PORT = 8080

const app = express()
app.use(bodyParser.json())

app.use((req, res, next) => {
  setTimeout(next, 2000)
})

app.use('/graphql', graphqlExpress({ schema }))
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }))

app.listen(PORT, _ => console.log(`server listening on localhost:${PORT}...`))

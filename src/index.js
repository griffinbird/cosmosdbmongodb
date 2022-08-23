import app from "./server.js"
import MoviesDAO from "../src/dao/moviesDAO.js"
import UsersDAO from "./dao/usersDAO.js"
import CommentsDAO from "./dao/commentsDAO.js"
import pkg from 'mongodb';
const { MongoClient } = pkg;

const port = process.env.PORT || 8000

/**
Ticket: Connection Pooling

Please change the configuration of the MongoClient object by setting the
maximum connection pool size to 50 active connections.
*/

/**
Ticket: Timeouts

Please prevent the program from waiting indefinitely by setting the write
concern timeout limit to 2500 milliseconds.
*/
export default function connect() {
  MongoClient.connect(
    process.env.MFLIX_DB_URI,
    // TODO: Connection Pooling
    // Set the poolSize to 50 connections.
    // TODO: Timeouts
    // Set the write timeout limit to 2500 milliseconds.
    { poolSize:50,  useNewUrlParser: true, wtimeout: 2500 },
  )
    .catch(err => {
      console.error(err.stack)
      process.exit(1)
    })
    .then(async client => {
      await MoviesDAO.injectDB(client)
      await UsersDAO.injectDB(client)
      await CommentsDAO.injectDB(client)
      app.listen(port, () => {
        console.log(`listening on port ${port}`)
      })
    })
};
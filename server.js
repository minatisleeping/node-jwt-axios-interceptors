import app from './src/app.js'
import 'dotenv/config'
const PORT = process.env.PORT || 3056

const server = app.listen(PORT, () => {
  console.log(`Server eCommerce running on port:${PORT}`)
})

// process.on('SIGINT', () => {
//   server.close(() => console.log('\nExit Server Express'))
// })

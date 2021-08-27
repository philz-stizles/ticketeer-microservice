import mongoose from 'mongoose'
import chalk from 'chalk'
import app from './app'

const start = async () => {
  console.log('test git actions')
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined')
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined')
  }

  try {
    // The domain must be the name of the auth mongo pod service in the kubernetes cluster
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    console.log(chalk.green('Connected to MongoDb!!!'))
  } catch (error: any) {
    console.error(chalk.red(error.message))
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000!')
  })
}

start()

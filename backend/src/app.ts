import { errors } from 'celebrate'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import 'dotenv/config'
import express, { json, urlencoded } from 'express'
import mongoose from 'mongoose'
import mongoSanitize from 'express-mongo-sanitize'
import path from 'path'
import {
    DB_ADDRESS,
    PORT,
    ORIGIN_ALLOW,
    COOKIES_SECRET,
    MAX_BODY_SIZE,
} from './config'
import errorHandler from './middlewares/error-handler'
import serveStatic from './middlewares/serverStatic'
import routes from './routes'
import { limiter} from './middlewares/limiter'

const app = express()

const corsOptions = {
    origin: ORIGIN_ALLOW,
    credentials: true,
    allowedHeaders: ['Authorization', 'Content-Type', 'X-CSRF-Token'],
}

app.set('trust proxy', 'loopback')

app.use(cookieParser(COOKIES_SECRET))

app.use(limiter)

app.use(json({ limit: MAX_BODY_SIZE }))

app.use(cors(corsOptions))

app.use(serveStatic(path.join(__dirname, 'public')))

app.use(urlencoded({ extended: true }))

app.use(mongoSanitize())

app.options('*', cors())
app.use((req, _res, next) => {
    console.log('=== Request ===')
    console.log('Method:', req.method)
    console.log('Path:', req.path)
    console.log('Headers:', {
        csrf: req.headers['x-csrf-token'],
        cookie: req.headers.cookie,
        authorization: req.headers.authorization,
    })
    next()
})

app.use(routes)
app.use(errors())
app.use(errorHandler)

const bootstrap = async () => {
    try {
        await mongoose.connect(DB_ADDRESS)
        await app.listen(PORT, () => console.log('ok'))
    } catch (error) {
        console.error(error)
    }
}

bootstrap()

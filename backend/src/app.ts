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

app.use(cookieParser(COOKIES_SECRET))

app.use(limiter)

app.use(json({ limit: MAX_BODY_SIZE }))

app.use(
    cors({
        origin: ORIGIN_ALLOW,
        credentials: true,
        allowedHeaders: ['Authorization', 'Content-Type'],
    })
)

app.use(serveStatic(path.join(__dirname, 'public')))

app.use(urlencoded({ extended: true }))
app.use(json())

app.use(mongoSanitize())

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

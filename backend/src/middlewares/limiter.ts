import { rateLimit } from 'express-rate-limit'
import { MAX_REQUEST_PER_MINUTE } from '../config'

export const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: MAX_REQUEST_PER_MINUTE,
    message: 'Достигнут лимит запросов. Повторите попытку позже.',
})
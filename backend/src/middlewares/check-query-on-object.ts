import { NextFunction, Request, Response } from 'express'
import BadRequestError from '../errors/bad-request-error'

export const checkQueryOnObject = async (
    req: Request,
    _: Response,
    next: NextFunction
) => {
    const keys = Object.keys(req.query)
    for (let i = 0; i < keys.length; i += 1) {
        if (typeof req.query[keys[i]] === 'object') {
            next(
                new BadRequestError('Входной параметр не может быть объектом!')
            )
        }
    }
    next()
}
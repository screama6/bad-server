import { Request, Response, NextFunction } from 'express'
import ForbiddenError from '../errors/forbidden-error'

export const checkAdmin = (
    _req: Request,
    res: Response,
    next: NextFunction
) => {
    if (res.locals.user.role !== 'admin') {
        return next(
            new ForbiddenError('Недостаточно прав для выполнения операции')
        )
    }
    return next()
}
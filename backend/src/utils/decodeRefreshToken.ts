import jwt, { JwtPayload } from 'jsonwebtoken'
import { REFRESH_TOKEN } from '../config'
import UnauthorizedError from '../errors/unauthorized-error'

export const decodeRefreshToken = (refreshToken: string): JwtPayload => {
    try {
        const decoded = jwt.verify(
            refreshToken,
            REFRESH_TOKEN.secret
        ) as JwtPayload
        return decoded
    } catch (error) {
        throw new UnauthorizedError('Не валидный токен')
    }
}
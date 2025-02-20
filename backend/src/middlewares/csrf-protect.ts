import { doubleCsrf } from 'csrf-csrf'
import { CSRF_SECRET, CSRF_COOKIE_NAME } from '../config'

const isProduction = process.env.NODE_ENV === 'production'

const csrfCookieOptions = {
    sameSite: 'strict' as const, // Предотвращает атаки CSRF, не отправляя cookie-файлы при межсайтовых запросах
    secure: isProduction, // Устанавливаем файлы cookie только через HTTPS в проде
    httpOnly: true, // Гарантирует, что cookie-файл недоступен через JavaScript
    maxAge: 60 * 60 * 1000, // Срок действия cookie-файла истекает через 1 час
}

export const { invalidCsrfTokenError, generateToken, doubleCsrfProtection } =
    doubleCsrf({
        getSecret: () => CSRF_SECRET,
        cookieName: CSRF_COOKIE_NAME,
        cookieOptions: csrfCookieOptions,
    })
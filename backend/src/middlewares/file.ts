import { Request, Response, NextFunction, Express } from 'express'
import * as fs from "node:fs";
import multer, { FileFilterCallback } from 'multer'
import { join, extname } from 'path'
import { constants } from 'http2'
import { faker } from '@faker-js/faker'
import sharp from 'sharp'
import {
    MAX_FILE_SIZE,
    MIN_FILE_SIZE,
    ALLOWED_MIME_TYPES,
    MIN_IMAGE_WIDTH,
    MIN_IMAGE_HEIGHT,
} from '../config'

type DestinationCallback = (error: Error | null, destination: string) => void
type FileNameCallback = (error: Error | null, filename: string) => void

const tempDir = join(
    __dirname,
    process.env.UPLOAD_PATH_TEMP
        ? `../public/${process.env.UPLOAD_PATH_TEMP}`
        : '../public'
)

fs.mkdirSync(tempDir,{recursive: true})

const storage = multer.diskStorage({
    destination: (
        _req: Request,
        _file: Express.Multer.File,
        cb: DestinationCallback
    ) => {
        cb(null, tempDir)
    },

    filename: (
        _req: Request,
        file: Express.Multer.File,
        cb: FileNameCallback
    ) => {
        cb(null, faker.string.uuid().concat(extname(file.originalname)))
    },
})

const fileFilter = (
    _req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
) => {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        return cb(null, false)
    }

    return cb(null, true)
}

const fileSizeCheck = (req: Request, res: any, next: any) => {
    if (req.file) {
        const fileSize = req.file.size
        if (fileSize < MIN_FILE_SIZE) {
            return res.status(constants.HTTP_STATUS_NOT_FOUND).send({
                message:
                    'Размер файла слишком мал. Минимальный размер файла — 2 КБ.',
            })
        }
        if (fileSize > MAX_FILE_SIZE) {
            return res.status(constants.HTTP_STATUS_NOT_FOUND).send({
                message:
                    'Размер файла слишком велик. Максимальный размер файла — 10 МБ.',
            })
        }
    }
    next()
}

async function checkImageMetadata(filePath: string): Promise<sharp.Metadata> {
    try {
        const metadata = await sharp(filePath).metadata()
        return metadata
    } catch (error) {
        console.error('Ошибка чтения метаданных изображения:', error)
        throw new Error('Недопустимый файл изображения')
    }
}

async function imageDimensionsCheck(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    if (!req.file) {
        res.status(constants.HTTP_STATUS_NOT_FOUND).json({
            error: 'Файл не загружен',
        })
        return
    }

    try {
        const metadata = await checkImageMetadata(req.file.path)

        const { width = 0, height = 0 } = metadata

        if (width < MIN_IMAGE_WIDTH || height < MIN_IMAGE_HEIGHT) {
            res.status(constants.HTTP_STATUS_NOT_FOUND).json({
                error: `Изображение слишком маленькое. Минимальные размеры ${MIN_IMAGE_WIDTH}x${MIN_IMAGE_HEIGHT}.`,
            })
            return
        }

        next()
    } catch (error) {
        if (error instanceof Error) {
            res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
                error: error.message,
            })
        } else {
            res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
                error: 'Произошла неизвестная ошибка',
            })
        }
    }
}

const upload = multer({
    storage,
    fileFilter,
})

export default { upload, fileSizeCheck, imageDimensionsCheck }

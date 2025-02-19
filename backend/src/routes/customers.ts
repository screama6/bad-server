import { Router } from 'express'
import {
    deleteCustomer,
    getCustomerById,
    getCustomers,
    updateCustomer,
} from '../controllers/customers'
import { roleGuardMiddleware } from '../middlewares/auth'
import { doubleCsrfProtection } from '../middlewares/csrf-protect'
import { Role } from '../models/user'

const customerRouter = Router()

customerRouter.get('/', roleGuardMiddleware(Role.Admin), getCustomers)
customerRouter.get('/:id', roleGuardMiddleware(Role.Admin), getCustomerById)
customerRouter.patch(
    '/:id',
    doubleCsrfProtection,
    roleGuardMiddleware(Role.Admin),
    updateCustomer
)
customerRouter.delete(
    '/:id',
    doubleCsrfProtection,
    roleGuardMiddleware(Role.Admin),
    deleteCustomer
)

export default customerRouter

import express from 'express'
import { body } from 'express-validator'
import auth from '../middlewares/auth.middleware'
import RoleController from '../controllers/role.controller'

export const roleRouter = express.Router()

roleRouter.use(auth)
roleRouter.get('/', RoleController.index)
roleRouter.post('/', body('roleName').trim(), RoleController.addRole)
roleRouter.put('/:id', body('roleName').trim(), RoleController.updateRole)
roleRouter.delete('/:id', RoleController.deleteRole)

import express from 'express'
import {
    readAdminOne
} from '../controllers/admin.js'

const router = express.Router()

router.get('/admins/:id', readAdminOne)

export default router
import express from 'express'
import {
    user,
    userOne,
    updateUser
} from '../controllers/user.js'

const router = express.Router()

router.get('/users', user)
router.get('/users/:id', userOne)

router.put('/users/:id', updateUser)

export default router
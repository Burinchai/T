import express from 'express'
import {
    get,
    read
} from '../controllers/notify.js'

const router = express.Router()

router.get('/notify', get)
router.put('/notify', read)

export default router
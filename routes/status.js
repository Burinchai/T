import express from 'express'
import {
    status
} from '../controllers/status.js'

const router = express.Router()

router.put('/status', status)



export default router
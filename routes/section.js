import express from 'express'
import {
    getSection
} from '../controllers/section.js'

const router = express.Router()

router.get('/sections', getSection)
export default router
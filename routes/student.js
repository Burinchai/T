import express from 'express'
import {
    createStudent,
    getStudent,

    updateStudent,
    deleteStudent,
    getStudentOne
} from '../controllers/student.js'

const router = express.Router()


router.post('/students', createStudent)
router.get('/students', getStudent)
router.get('/students/:id', getStudentOne)
router.put('/students/:id', updateStudent)
router.delete('/students/:id', deleteStudent)

export default router
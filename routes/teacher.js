import express from 'express'
import {
    readTeacherAll,
    readTeacherOne,
    createStudent,
    updateTeacher,
    deleteTeacher
} from '../controllers/teacher.js'

const router = express.Router()

router.get('/teachers', readTeacherAll)
router.get('/teachers/:id', readTeacherOne)

router.post('/teachers', createStudent)

router.put('/teachers/:id', updateTeacher)
router.delete('/teachers/:id', deleteTeacher)

export default router
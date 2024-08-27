import express from 'express'
import {
    readManage,
    readManageOne,
    reserveActivity,
    cancelReserve,
    decreaseNumStd,
    upload,


} from '../controllers/manage.js'
// import {
//     updateStatusNotJoin
// } from '../controllers/manage.js';
import {
    updateStatus
} from '../controllers/manage.js'; // Adjust the path as needed
const router = express.Router()

router.get('/reserve', readManage)
router.get('/reserve/:id', readManageOne)
router.get('/upload', upload)

router.post('/reserve', reserveActivity)

router.delete('/reserve', cancelReserve)
router.put('/cancelReserve', decreaseNumStd)
router.put('/manage', updateStatus);

export default router
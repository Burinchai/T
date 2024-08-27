import express from 'express'
import {
    get,
    getOne,
    update,
    deleteNews,
    addActivity,
    updateAct_title,
    upload,
    newsCancelReserve,
    test,
    newsOne
} from '../controllers/news.js'

const router = express.Router()

router.get('/news', get)
router.get('/news/:id', getOne)
// router.post('/news', addActivity)
router.post('/newsUpload', upload)
router.post('/newsCancelReserve', newsCancelReserve)
router.put('/news', update)
router.put('/newsAct', updateAct_title)
router.delete('/news', deleteNews)
router.post('/news', test)
router.post('/new', newsOne)

export default router
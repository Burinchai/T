import express from 'express'
import {
    login,
    register,
    arrayregister,
    userName
} from "../controllers/auth.js"

const router = express.Router()

router.post("/register", register)
router.post("/arrayregister", arrayregister)
router.post("/login", login)
router.get("/login", userName)

export default router;
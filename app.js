import express from 'express'
import 'dotenv/config'
import authRoutes from './routes/auth.js'
import user from './routes/user.js'
import student from './routes/student.js'
import admin from './routes/admin.js'
import teacher from './routes/teacher.js'
import activity from './routes/activity.js'
import manage from './routes/manage.js'
import section from './routes/section.js'
import forgotPassword from './routes/forgotPassword.js'
import news from './routes/news.js'
import status from './routes/status.js'
import notify from './routes/notify.js'



const app = express()

app.use(express.json())

app.use('/auth', authRoutes)
app.use('/', user)
app.use('/', student)
app.use('/', admin)
app.use('/', teacher)
app.use('/', activity)
app.use('/', manage)
app.use('/', section)
app.use('/', forgotPassword)
app.use('/', news)
app.use('/status', status)
app.use('/', notify)

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('server on port 3000'))

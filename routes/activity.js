import express from 'express'
import {
    createActivity,
    updateActivity,
    readActivity,
    readActivityOne,
    deleteActivity,
    updateStatus,
    transection
} from '../controllers/activity.js'

const Router = express.Router()

Router.post('/activitys/', createActivity);

Router.get('/activitys', readActivity);
Router.get('/activitys/:id', readActivityOne);

Router.put('/activitys/:id', updateActivity);

Router.delete('/activitys/:id', deleteActivity);

Router.put('/updateStatus/:id', updateStatus);
Router.put('/transection/:id', transection);
export default Router
import db from '../db.js'

export const readAdminOne = (req, res) => {
    const sql = 'select * from admin where login_ID'
    const {
        id
    } = req.query

    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            })
        }
        if (result.length === 0) {
            return res.status(404).json({
                message: 'Admin not found'
            })
        }
        return res.json(result[0])
    })
}
import db from '../db.js'

export const getSection = (req, res) => {
    const sql = `
        SELECT * FROM section

    `
    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }
        return res.json(result);
    })
}
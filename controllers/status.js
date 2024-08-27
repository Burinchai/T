import db from '../db.js'

export const status = (req, res) => {
    const {
        act_ID,
        std_IDs
    } = req.body;

    // Ensure std_IDs is an array
    if (!Array.isArray(std_IDs) || std_IDs.length === 0) {
        return res.status(400).json({
            error: 'std_IDs should be a non-empty array'
        });
    }

    // Create placeholders for the SQL query
    const placeholders = std_IDs.map(() => '?').join(',');
    const sql = `UPDATE manage SET man_status = 3 WHERE act_ID = ? AND std_ID IN (${placeholders})`;

    // Execute the query
    db.query(sql, [act_ID, ...std_IDs], (err, result) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }
        return res.status(200).json('Status updated successfully');
    });
}
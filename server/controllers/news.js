import db from '../db.js'


export const get = (req, res) => {
    const {
        id,
        role
    } = req.query;

    let sql;

    if (role == "student") {
        sql = `SELECT
                    *
                FROM
                    news
                LEFT JOIN activity ON activity.act_title = news.act_title
                WHERE
                    news_type = 'all'
                OR FIND_IN_SET(${id}, news_type) > 0;
                `

    } else {
        sql = `SELECT * FROM news WHERE news_type = 'all'`;
    }

    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }
        return res.json(result);
    });
};

export const getOne = (req, res) => {
    const {
        id
    } = req.body
    const sql = `
            SELECT * FROM news `
    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }
        return res.json(result);
    })
}
export const update = (req, res) => {
    const {
        news_topic,
        news_desc,
        news_date,
        news_create,
        act_title,
        key
    } = req.body;

    const sql = `
        UPDATE news SET
            news_topic = ?,
            news_desc = ?,
            news_date = ?,
            news_create = ?,
            act_title = ?
        WHERE act_title = ?;
    `;

    db.query(sql, [
        news_topic,
        news_desc,
        news_date,
        news_create,
        act_title,
        key
    ], (err, result) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }
        console.log("Update result:", result);
        return res.json(result);
    });
};

export const updateAct_title = (req, res) => {

    const {
        act_title,
        newAct_title
    } = req.body
    const sql = `
            UPDATE news SET
            act_title = ?
        WHERE act_title = ?
                `;
    db.query(sql, [newAct_title, act_title], (err, result) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }
        return res.json(result);
    })
}
export const deleteNews = (req, res) => {
    const {
        act_title
    } = req.body
    const sql = `
            DELETE FROM news WHERE news_ID = ?
                `
    db.query(sql, [act_title], (err, result) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }
        return res.json(result);
    })
}
export const addActivity = (req, res) => {
    const {
        news_topic,
        news_desc,
        news_date,
        news_create,
        act_title
    } = req.body;
    const news_type = "all"

    const sql = `
            INSERT INTO news(news_topic, news_desc, news_date, news_create,news_type,act_title)
            VALUES( ? , ? , ? , ? ,?,?)
            `;

    db.query(sql, [
        news_topic,
        news_desc,
        news_date,
        news_create,
        news_type,
        act_title
    ], (err, result) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }
        return res.json(result);
    });
};
// Example of backend error handling
export const newsCancelReserve = (req, res) => {
    const {
        news_topic,
        news_desc,
        news_date,
        news_create,
        news_type,
        act_title
    } = req.body;

    const typeMap = news_type.join(',');
    const sql = `
        INSERT INTO news(news_topic, news_desc, news_date, news_create, news_type, act_title)
        VALUES(?,?,?,?,?,?)
    `;

    db.query(sql, [news_topic, news_desc, news_date, news_create, typeMap, act_title], (err, result) => {
        if (err) {
            console.error("Error inserting news:", err); // Log the error
            return res.status(500).json({
                error: err.message
            });
        }
        res.json(result);
    });
};


export const upload = (req, res) => {
    const sql = `
        INSERT INTO news(news_topic, news_desc, news_date, news_create, news_type, act_title)
        VALUES(?,?,?,?,?,?)
        `
    const {
        news_topic,
        news_desc,
        news_date,
        news_create,
        studentIDs,
        act_title,
    } = req.body
    const news_type = studentIDs.join(',');

    db.query(sql, [
        news_topic,
        news_desc,
        news_date,
        news_create,
        news_type,
        act_title
    ], (err, result) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }
        return res.json(result);
    });

}

export const test = (req, res) => {
    const {
        news_topic,
        news_desc,
        act_title,
        news_type,
        news_date, // Optional if you want to set a specific date
        news_create // Optional if you want to set a specific creation date
    } = req.body;

    const newsInsertSql = `
        INSERT INTO news (news_type, news_topic, news_desc, act_title, news_date, news_create)
        VALUES (?, ?, ?, ?, ?, ?);
    `;

    // Start a transaction
    db.beginTransaction((err) => {
        if (err) throw err;

        // First, insert the news
        db.query(newsInsertSql, [news_type, news_topic, news_desc, act_title, news_date, news_create], (error, results) => {
            if (error) {
                return db.rollback(() => {
                    res.status(500).send('Error inserting news: ' + error.message);
                });
            }

            // Get the last inserted news ID
            const newsId = results.insertId;

            // Now, insert notifications for all users
            const notifyInsertSql = `
                INSERT INTO notify (news_ID, notify_status, user_ID)
                SELECT ?, 'unread', login_ID
                FROM login;
            `;

            db.query(notifyInsertSql, [newsId], (error) => {
                if (error) {
                    return db.rollback(() => {
                        res.status(500).send('Error inserting notifications: ' + error.message);
                    });
                }

                // Commit the transaction
                db.commit((err) => {
                    if (err) {
                        return db.rollback(() => {
                            res.status(500).send('Error committing transaction: ' + err.message);
                        });
                    }
                    res.status(200).send('News and notifications added successfully!');
                });
            });
        });
    });
};
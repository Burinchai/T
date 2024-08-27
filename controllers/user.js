import db from '../db.js'

// user
export const user = (req, res) => {
    const sql = `
        SELECT 
            l.*, 
            s.*,

            COALESCE(t.login_ID, st.std_ID, a.login_ID) AS ID,
            COALESCE(t.staff_fname, st.std_fname, a.fname) AS fname,
            COALESCE(t.staff_lname, st.std_lname, a.lname) AS lname,
            COALESCE(t.staff_email, st.std_email, a.email) AS email,
            COALESCE(t.staff_mobile, st.std_mobile, a.mobile) AS mobile,
            COALESCE(t.staff_address, st.std_address) AS address,
            COALESCE(t.province, st.province) AS province,
            COALESCE(t.district, st.district) AS district,
            COALESCE(t.subdistrict, st.subdistrict) AS subdistrict,
            COALESCE(t.zipcode, st.zipcode) AS zipcode

        FROM 
            login l

        LEFT JOIN teacher t ON l.login_ID = t.login_ID
        LEFT JOIN student st ON l.username = st.std_ID
        LEFT JOIN admin a ON l.login_ID = a.login_ID
        LEFT JOIN section s ON COALESCE(t.sec_ID, st.sec_ID) = s.sec_ID 
    `

    db.query(sql, (err, result) => {
        if (err) return res.status(500).json(err)
        return res.json(result)
    })
}

// get one
export const userOne = (req, res) => {
    const {
        id
    } = req.params
    const sql = `
        SELECT 
            l.*, 
            s.*,

            COALESCE(t.login_ID, st.std_ID, a.login_ID) AS ID,
            COALESCE(t.staff_fname, st.std_fname, a.fname) AS fname,
            COALESCE(t.staff_lname, st.std_lname, a.lname) AS lname,
            COALESCE(t.staff_email, st.std_email, a.email) AS email,
            COALESCE(t.staff_mobile, st.std_mobile, a.mobile) AS mobile,
            COALESCE(t.staff_address, st.std_address) AS address,
            COALESCE(t.province, st.province) AS province,
            COALESCE(t.district, st.district) AS district,
            COALESCE(t.subdistrict, st.subdistrict) AS subdistrict,
            COALESCE(t.zipcode, st.zipcode) AS zipcode

        FROM 
            login l

        LEFT JOIN teacher t ON l.login_ID = t.login_ID
        LEFT JOIN student st ON l.username = st.std_ID
        LEFT JOIN admin a ON l.login_ID = a.login_ID
        LEFT JOIN section s ON COALESCE(t.sec_ID, st.sec_ID) = s.sec_ID 
        WHERE COALESCE(t.login_ID, st.login_ID, a.login_ID) = ?
    `

    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json(err)
        return res.json(result)
    })
}


// update user (either teacher or student)
export const updateUser = (req, res) => {
    const { id } = req.params;
    const { role, fname, lname, email, mobile, address, province, district, subdistrict, sec_ID, zipcode } = req.body;

    let sql;
    let values = [fname, lname, email, mobile, address, sec_ID, province, district, subdistrict, zipcode, id];

    if (role === 'teacher') {
        sql = `
            UPDATE teacher
            SET 
                staff_fname = ?,               
                staff_lname = ?,               
                staff_email = ?,               
                staff_mobile = ?,                
                staff_address = ?,
                sec_ID = ?,
                province = ?,            
                district = ?,            
                subdistrict = ?,               
                zipcode = ?      
            WHERE 
                login_ID = ?
        `;
    } else if (role === 'student') {
        sql = `
            UPDATE student
            SET 
                std_fname = ?,               
                std_lname = ?,               
                std_email = ?,               
                std_mobile = ?,                
                std_address = ?,
                sec_ID = ?,
                province = ?,            
                district = ?,            
                subdistrict = ?,               
                zipcode = ?      
            WHERE 
                std_ID = ?
        `;
    } else {
        return res.status(400).json({
            message: 'Invalid role specified'
        });
    }

    db.query(sql, values, (err, result) => {
        if (err) return res.status(500).json({ message: 'Database query failed', error: err });
        return res.json({
            message: `User updated successfully in the ${role} table`
        });
    });
};


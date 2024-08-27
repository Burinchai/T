import db from "../db.js";

export const manage = (req, res) => {
  const sql = "SELECT * FROM manage";
  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({
        error: err.message,
      });
    }
    if (result.length === 0) {
      return res.status(404).json({
        message: "No activity table manage found",
      });
    }
    return res.json(result);
  });
};
export const reserve = (req, res) => {
  const {
    act_ID
  } = req.params;

  const sql = "DELETE FROM manage WHERE act_ID = ? ";

  db.query(sql, [act_ID], (err, result) => {
    if (err) {
      return res.status(500).json({
        error: err.message,
      });
    }
    return res.json({
      message: "Activity deleted successfully",
      result,
    });
  });
};

//create
export const createActivity = (req, res) => {
  const q =
    "INSERT INTO activity(`act_title`, `act_desc`, `act_dateStart`, `act_dateEnd`, `act_numStd`, `act_location`, `staff_ID`, `act_status`, `act_createAt`) VALUES (?, ?, ?, ?, ?, ?, ?, 1 , ?)";
  const {
    act_title,
    act_desc,
    act_dateStart,
    act_dateEnd,
    act_numstd,
    act_location,
    staff_ID,
  } = req.body;

  db.query(
    q,
    [
      act_title,
      act_desc,
      act_dateStart,
      act_dateEnd,
      act_numstd,
      act_location,
      staff_ID,
      1,
      new Date(),
    ],
    (err, result) => {
      if (err) return res.status(500).json(err);
      return res.json(result);
    }
  );
};

// update
export const updateActivity = (req, res) => {
  const {
    id
  } = req.params;
  const {
    act_title,
    act_desc,
    act_dateStart,
    act_dateEnd,
    act_numStd,
    act_location,
    staff_ID,
    act_status,
    act_transaction,
  } = req.body;

  const sql = `
        UPDATE activity SET
            act_title = ?,
            act_desc = ?,
            act_dateStart = ?,
            act_dateEnd = ?,
            act_numStd = ?,
            act_location = ?,
            staff_ID = ?,
            act_status = ?,
            act_transaction = ?
        WHERE act_ID = ?`;

  db.query(
    sql,
    [
      act_title,
      act_desc,
      act_dateStart,
      act_dateEnd,
      act_numStd,
      act_location,
      staff_ID,
      act_status,
      act_transaction,
      id,
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          error: err.message,
        });
      }

      return res.json({
        message: "Activity updated successfully and news ",
        result,
      });

    });
};

// getAll
export const readActivity = (req, res) => {
  const sql = `
        SELECT 
  a.act_ID,
  a.act_title,
  a.act_desc,
  a.act_dateStart,
  a.act_dateEnd,
  a.act_numStd,
  a.act_numStdReserve,
  a.act_location,
  a.staff_ID,
  a.act_status,
  a.act_createAt,
  a.act_transaction,
  t.staff_fname,
  t.staff_lname,
  t.staff_email,
  t.staff_mobile,
  t.staff_address,
  st.std_ID,
  st.std_fname,
  st.std_lname,
  st.std_email,
  st.std_mobile,
  st.std_address,
  st.province,
  st.district,
  st.subdistrict,
  st.zipcode
FROM 
  activity a
  LEFT JOIN teacher t ON t.login_ID = a.staff_ID
  LEFT JOIN manage m ON m.act_ID = a.act_ID
  LEFT JOIN student st ON st.std_ID = m.std_ID
`;
  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({
        error: err.message,
      });
    }
    if (result.length === 0) {
      return res.status(404).json({
        message: "No activity found",
      });
    }
    return res.json(result);
  });
};

// get one
export const readActivityOne = (req, res) => {
  const id = req.params.id;
  const sql = `
        SELECT 
  a.act_ID,
  a.act_title,
  a.act_desc,
  a.act_dateStart,
  a.act_dateEnd,
  a.act_numStd,
  a.act_numStdReserve,
  a.act_location,
  a.staff_ID,
  a.act_status,
  a.act_createAt,
  a.act_transaction,
  t.staff_fname,
  t.staff_lname,
  st.std_ID,
  st.std_fname,
  st.std_lname,
  st.sec_ID,
  m.man_status


FROM activity a 
LEFT JOIN teacher t ON t.login_ID = a.staff_ID 
LEFT JOIN manage m ON m.act_ID = a.act_ID 
LEFT JOIN student st ON st.std_ID = m.std_ID
WHERE 
  a.act_ID = ?;


`;
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({
        error: err.message,
      });
    }
    if (result.length === 0) {
      return res.status(404).json({
        message: "No activity found",
      });
    }
    return res.json(result);
  });
};

export const deleteActivity = (req, res) => {
  const {
    id
  } = req.params;
  const sql = "DELETE FROM activity WHERE act_ID = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({
        error: err.message,
      });
    }
    return res.json({
      message: "Activity deleted successfully",
      result,
    });
  });
};

// update status
export const updateStatus = (req, res) => {
  const id = req.params.id;
  const status = 2;

  const sql = "UPDATE activity SET act_status = ? WHERE act_ID = ?";

  db.query(sql, [status, id], (err, result) => {
    if (err) {
      console.error("Database update error: ", err.message); // Improved logging
      return res.status(500).json({
        error: err.message,
      });
    }
    console.log("Database updated successfully: ", result); // Log successful update
    return res.json({
      message: "Activity updated successfully",
      result,
    });
  });
};


//transection
export const transection = (req, res) => {
  const {
    id
  } = req.params;
  const {
    act_transaction
  } = req.body;

  const sql = `UPDATE activity SET
        act_transaction = ?
        WHERE act_ID = ?`;

  db.query(sql, [act_transaction, id], (err, result) => {
    if (err) {
      return res.status(500).json({
        error: err.message,
      });
    }
    return res.json({
      message: "transection updated successfully",
      result,
    });
  });
};
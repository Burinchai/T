import {
  MailerSend,
  Recipient,
  EmailParams
} from "mailersend";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import dbPromise from "../dbPromise.js";
import db from "../db.js"

const baseURL = "localhost:5173";

// Request Password Reset
export const forgotPassword = async (req, res) => {
  const mailerSend = new MailerSend({
    apiKey: "mlsn.eb1abc9f46a58b00db1f2e031a2056559856a427a0fcfce7f51a4de1211cd861",
  });

  try {
    const {
      email
    } = req.body;

    // Search email in all related tables
    const [studentResult] = await dbPromise.query(
      "SELECT * FROM student WHERE std_email = ?",
      [email]
    );
    const [teacherResult] = await dbPromise.query(
      "SELECT * FROM teacher WHERE staff_email = ?",
      [email]
    );
    const [adminResult] = await dbPromise.query(
      "SELECT * FROM admin WHERE email = ?",
      [email]
    );

    let user = null;
    let role = null;

    if (Array.isArray(studentResult) && studentResult.length > 0) {
      user = studentResult[0];
      role = "student";
    } else if (Array.isArray(teacherResult) && teacherResult.length > 0) {
      user = teacherResult[0];
      role = "teacher";
    } else if (Array.isArray(adminResult) && adminResult.length > 0) {
      user = adminResult[0];
      role = "admin";
    }

    if (!user) {
      return res.status(404).send("No user with that email.");
    }
    console.log(user);

    const token = crypto.randomBytes(20).toString("hex");
    await dbPromise.query(
      "UPDATE login SET resetToken = ?, resetTokenExpiration = ? WHERE username = ?",
      [token, Date.now() + 3600000, user.login_ID]
    );

    const recipients = [new Recipient(email, "Recipient")];

    // Create email parameters
    const emailParams = new EmailParams({
      from: {
        email: "no-reply@trial-yzkq34072d0ld796.mlsender.net", // Replace with your verified sender email
        name: "IT Activity System", // Optional: Add sender name if required
      },
      to: recipients,
      subject: "รีเซ็ตรหัสผ่านของคุณ",
      html: `
  <p>คุณได้รับข้อความนี้เนื่องจากคุณ (หรือบุคคลอื่น) ได้ขอรีเซ็ตรหัสผ่านสำหรับบัญชีของคุณ</p>
  <p>กรุณาคลิกที่ลิงก์ด้านล่าง หรือคัดลอกลิงก์นี้ไปวางในเบราว์เซอร์ของคุณเพื่อดำเนินการต่อ:</p>
  <p><a href="http://${baseURL}/reset-password/${token}">รีเซ็ตรหัสผ่าน</a></p>
  <p>หากคุณไม่ได้เป็นผู้ร้องขอ กรุณาเพิกเฉยต่ออีเมลนี้</p>
`,
      text: `
  คุณได้รับข้อความนี้เนื่องจากคุณ (หรือบุคคลอื่น) ได้ขอรีเซ็ตรหัสผ่านสำหรับบัญชีของคุณ
  กรุณาคลิกที่ลิงก์ด้านล่าง หรือคัดลอกลิงก์นี้ไปวางในเบราว์เซอร์ของคุณเพื่อดำเนินการต่อ:
  http://${baseURL}/reset-password/${token}
  หากคุณไม่ได้เป็นผู้ร้องขอ กรุณาเพิกเฉยต่ออีเมลนี้
`,
    });

    // Send reset email using MailerSend
    const response = await mailerSend.email.send(emailParams);

    console.log("Email sent successfully:", response);
    res.status(200).send("Reset link sent.");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Server error.");
  }
};

// Reset Password
export const resetPassword = async (req, res) => {
  try {
    const {
      token
    } = req.params;
    const {
      password
    } = req.body;

    // ตรวจสอบ token ว่ายังไม่หมดอายุ
    const [user] = await dbPromise.query(
      "SELECT * FROM login WHERE resetToken = ? AND resetTokenExpiration > ?",
      [token, Date.now()]
    );

    if (Array.isArray(user) && user.length === 0) {
      return res
        .status(400)
        .send("Password reset token is invalid or has expired.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // อัปเดตรหัสผ่านใหม่ในตาราง login
    await dbPromise.query(
      "UPDATE login SET password = ?, resetToken = NULL, resetTokenExpiration = NULL WHERE resetToken = ?",
      [hashedPassword, token]
    );

    res.status(200).send("Password has been reset.");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Server error.");
  }
};

export const changePassword = async (req, res) => {
  try {
    const {
      oldPassword,
      newPassword,
      role
    } = req.body;
    const {
      id
    } = req.params;

    // Validate input
    if (!oldPassword || !newPassword || !id) {
      return res.status(400).json({
        message: 'Missing required fields'
      });
    }

    // Fetch the user based on role
    let userQuery;
    if (role === 'student') {
      userQuery = await new Promise((resolve, reject) => {
        db.query('SELECT * FROM login WHERE username = ?', [id], (err, results) => {
          if (err) return reject(err);
          resolve(results);
        });
      });
    } else {
      userQuery = await new Promise((resolve, reject) => {
        db.query('SELECT * FROM login WHERE login_ID = ?', [id], (err, results) => {
          if (err) return reject(err);
          resolve(results);
        });
      });
    }

    if (userQuery.length === 0) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    const user = userQuery[0];

    // Verify old password
    const isOldPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
    if (!isOldPasswordCorrect) {
      return res.status(400).json({
        message: 'Old password is incorrect'
      });
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the password
    let updateQuery;
    if (role === 'student') {
      updateQuery = 'UPDATE login SET password = ? WHERE username = ?';
    } else {
      updateQuery = 'UPDATE login SET password = ? WHERE login_ID = ?';
    }

    const updateResult = await new Promise((resolve, reject) => {
      db.query(updateQuery, [hashedNewPassword, role === 'student' ? id : user.login_ID], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });

    if (updateResult.affectedRows === 0) {
      return res.status(400).json({
        message: 'Password change failed. Old password might be incorrect or update did not succeed.'
      });
    }

    res.status(200).json({
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Error in changePassword function:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
};
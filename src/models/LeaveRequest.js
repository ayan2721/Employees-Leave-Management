const { sql, poolPromise } = require('../config/database');

class LeaveRequest {

    static async create(leaveData) {
        try {
            const pool = await poolPromise;

            const result = await pool.request()
                .input('user_id', sql.Int, leaveData.user_id)
                .input('leave_type', sql.VarChar, leaveData.leave_type)
                .input('start_date', sql.Date, leaveData.start_date)
                .input('end_date', sql.Date, leaveData.end_date)
                .input('reason', sql.Text, leaveData.reason)
                .input('document_url', sql.VarChar, leaveData.document_url || null)
                .query(`
                    INSERT INTO LeaveRequests 
                        (user_id, leave_type, start_date, end_date, reason, document_url)
                    OUTPUT INSERTED.*
                    VALUES 
                        (@user_id, @leave_type, @start_date, @end_date, @reason, @document_url)
                `);

            return result.recordset[0];

        } catch (error) {
            throw error;
        }
    }

    static async findByUserId(userId) {
        try {
            const pool = await poolPromise;

            const result = await pool.request()
                .input('user_id', sql.Int, userId)
                .query(`
                    SELECT lr.*, u.name as user_name, u.email as user_email
                    FROM LeaveRequests lr
                    JOIN Users u ON lr.user_id = u.id
                    WHERE lr.user_id = @user_id
                    ORDER BY lr.created_at DESC
                `);

            return result.recordset;

        } catch (error) {
            throw error;
        }
    }

    static async findAllPending() {
        try {
            const pool = await poolPromise;

            const result = await pool.request()
                .query(`
                    SELECT lr.*, u.name as user_name, u.email as user_email
                    FROM LeaveRequests lr
                    JOIN Users u ON lr.user_id = u.id
                    WHERE lr.status = 'pending'
                    ORDER BY lr.created_at DESC
                `);

            return result.recordset;

        } catch (error) {
            throw error;
        }
    }

    // ✅ FIXED FUNCTION (NO OUTPUT → NO TRIGGER ERROR)
    static async updateStatus(id, status, managerComment = null) {
        try {
            const pool = await poolPromise;

            // 1️⃣ Update safely (no OUTPUT)
            await pool.request()
                .input('id', sql.Int, id)
                .input('status', sql.VarChar, status)
                .input('manager_comment', sql.Text, managerComment)
                .query(`
                    UPDATE LeaveRequests
                    SET status = @status,
                        manager_comment = @manager_comment
                    WHERE id = @id
                `);

            // 2️⃣ Fetch updated record
            const result = await pool.request()
                .input('id', sql.Int, id)
                .query(`
                    SELECT lr.*, u.name as user_name, u.email as user_email
                    FROM LeaveRequests lr
                    JOIN Users u ON lr.user_id = u.id
                    WHERE lr.id = @id
                `);

            return result.recordset[0];

        } catch (error) {
            throw error;
        }
    }

    static async findById(id) {
        try {
            const pool = await poolPromise;

            const result = await pool.request()
                .input('id', sql.Int, id)
                .query(`
                    SELECT lr.*, u.name as user_name, u.email as user_email
                    FROM LeaveRequests lr
                    JOIN Users u ON lr.user_id = u.id
                    WHERE lr.id = @id
                `);

            return result.recordset[0];

        } catch (error) {
            throw error;
        }
    }
}

module.exports = LeaveRequest;
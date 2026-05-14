const { sql, poolPromise } = require('../config/database');

class User {
    static async create(userData) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('name', sql.VarChar, userData.name)
                .input('email', sql.VarChar, userData.email)
                .input('password', sql.VarChar, userData.password)
                .input('role', sql.VarChar, userData.role || 'employee')
                .query(`
          INSERT INTO Users (name, email, password, role)
          OUTPUT INSERTED.*
          VALUES (@name, @email, @password, @role)
        `);
            return result.recordset[0];
        } catch (error) {
            throw error;
        }
    }

    static async findByEmail(email) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input('email', sql.VarChar, email)
                .query('SELECT * FROM Users WHERE email = @email');
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
                .query('SELECT * FROM Users WHERE id = @id');
            return result.recordset[0];
        } catch (error) {
            throw error;
        }
    }

    static async findAllManagers() {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .query("SELECT * FROM Users WHERE role = 'manager'");
            return result.recordset;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = User;
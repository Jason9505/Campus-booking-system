const pool = require('../config/database');

const db = {
  query(sql, params) {
    return pool.execute(sql, params);
  },

  async queryAll(sql, params) {
    const [rows] = await pool.execute(sql, params);
    return rows;
  },

  async queryOne(sql, params) {
    const [rows] = await pool.execute(sql, params);
    return rows[0] || null;
  },

  async insert(table, data) {
    const keys = Object.keys(data);
    const placeholders = keys.map(() => '?').join(', ');
    const columns = keys.join(', ');
    const sql = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`;
    const [result] = await pool.execute(sql, Object.values(data));
    return result.insertId;
  },

  async update(table, data, whereColumn, whereValue) {
    const setClause = Object.keys(data).map((key) => `${key} = ?`).join(', ');
    const sql = `UPDATE ${table} SET ${setClause} WHERE ${whereColumn} = ?`;
    const [result] = await pool.execute(sql, [...Object.values(data), whereValue]);
    return result.affectedRows;
  },

  async remove(table, whereColumn, whereValue) {
    const sql = `DELETE FROM ${table} WHERE ${whereColumn} = ?`;
    const [result] = await pool.execute(sql, [whereValue]);
    return result.affectedRows;
  },

  async transaction(callback) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      const result = await callback(connection);
      await connection.commit();
      return result;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },
};

module.exports = db;

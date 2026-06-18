require('dotenv').config();

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function migrate() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    multipleStatements: true,
  });

  try {
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'crbs'}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    await connection.query(`USE \`${process.env.DB_NAME || 'crbs'}\``);

    const sqlPath = path.join(__dirname, 'schema.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    await connection.query(sql);

    // Add campusId column if it doesn't exist (backward compatibility)
    const [columns] = await connection.query("SHOW COLUMNS FROM users LIKE 'campusId'");
    if (columns.length === 0) {
      await connection.query('ALTER TABLE users ADD COLUMN campusId VARCHAR(50) AFTER department');
    }

    console.log('Migration completed successfully.');
  } catch (error) {
    console.error('Migration failed:', error.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

migrate();

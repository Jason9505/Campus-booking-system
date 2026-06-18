require('dotenv').config();

const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function seed() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'crbs',
  });

  try {
    const hash = await bcrypt.hash('Admin123!', 12);

    await connection.query(
      `INSERT IGNORE INTO users (name, email, passwordHash, role, department, campusId, isActive, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, NULL, true, NOW(), NOW())`,
      ['System Admin', 'admin@mmu.edu.my', hash, 'Admin', 'Administration']
    );

    console.log('Seed completed successfully.');
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

seed();

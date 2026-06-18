-- Admin user seeded with bcrypt hash of 'Admin123!' (cost 12)
INSERT IGNORE INTO users (name, email, passwordHash, role, department, campusId, isActive, createdAt, updatedAt)
VALUES ('System Admin', 'admin@mmu.edu.my', '$2a$12$LJ3m4ys3Lg3YOCwKkC1CYuGhlYOBMGCWCj3GOrHoDAzM0lQJ0Nh7e', 'Admin', 'Administration', NULL, true, NOW(), NOW());

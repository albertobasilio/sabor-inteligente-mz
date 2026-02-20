ALTER TABLE users
ADD COLUMN free_scan_used TINYINT(1) DEFAULT 0 AFTER role;

UPDATE users
SET free_scan_used = 1
WHERE plan = 'free' AND (scan_count > 0 OR last_scan_date IS NOT NULL);

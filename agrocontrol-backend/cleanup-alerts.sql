DELETE FROM "Alert"
WHERE "resolved" = false
AND "severity" = 'HIGH';
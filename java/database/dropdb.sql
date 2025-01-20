-- **************************************************************
-- This script destroys the database and associated users
-- **************************************************************

-- The following line terminates any active connections to the database so that it can be destroyed
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE datname = 'haunted_forest';

DROP DATABASE haunted_forest;

DROP USER haunted_forest_owner;
DROP USER haunted_forest_appuser;

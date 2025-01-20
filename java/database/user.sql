-- ********************************************************************************
-- This script creates the database users and grants them the necessary permissions
-- ********************************************************************************

CREATE USER haunted_forest_owner
WITH PASSWORD 'haunted_forest';

GRANT ALL
ON ALL TABLES IN SCHEMA public
TO haunted_forest_owner;

GRANT ALL
ON ALL SEQUENCES IN SCHEMA public
TO haunted_forest_owner;

CREATE USER haunted_forest_appuser
WITH PASSWORD 'haunted_forest';

GRANT SELECT, INSERT, UPDATE, DELETE
ON ALL TABLES IN SCHEMA public
TO haunted_forest_appuser;

GRANT USAGE, SELECT
ON ALL SEQUENCES IN SCHEMA public
TO haunted_forest_appuser;

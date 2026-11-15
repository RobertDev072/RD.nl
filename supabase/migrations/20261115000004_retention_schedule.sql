-- Monthly retention job (1st of the month, 03:17 UTC). See purge_expired_data().
create extension if not exists pg_cron;
select cron.schedule('lorvex-retention-monthly', '17 3 1 * *', $$select public.purge_expired_data()$$);

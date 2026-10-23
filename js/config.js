/* ============================================================
   config.js — подключение к Supabase
   Supabase → ваш проект → Settings → API Keys (или кнопка «Connect»):
     SUPABASE_URL — Project URL, вида https://xxxxxxxx.supabase.co
     SUPABASE_KEY — Publishable key (sb_publishable_…) или legacy «anon» key.
   Эти значения публичные: они видны в браузере, защита данных — правила
   доступа в базе (supabase/schema.sql). НИКОГДА не вставляйте сюда
   secret / service_role key.
   Пустые строки — локальный режим: данные хранятся только в этом браузере.
   ============================================================ */
const SUPABASE_URL = 'https://lndrdnzgpntjvhvnghsl.supabase.co';
const SUPABASE_KEY = 'sb_publishable_gnCZlLgtB10sc1MozvGwFg_5anpvpR5';

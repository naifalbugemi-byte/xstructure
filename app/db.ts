import { Pool } from "pg";

export const pool = new Pool({
  user: "postgres",      // يوزر قاعدة البيانات
  host: "localhost",     // أو IP السيرفر
  database: "xstructure",// اسم قاعدة البيانات
  password: "yourpassword", // باسورد قاعدة البيانات
  port: 5432,            // بورت PostgreSQL
});

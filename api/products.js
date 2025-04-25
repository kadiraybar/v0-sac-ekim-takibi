import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  try {
    const result = await sql`SELECT * FROM products;`;
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Veritabanı hatası:', err);
    res.status(500).json({ error: 'Veritabanı bağlantısı başarısız.' });
  }
}

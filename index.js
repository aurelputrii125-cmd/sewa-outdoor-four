const express = require('express');
const setupDb = require('./db.js');
const app = express();

app.use(express.static('public')); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let db;

async function startServer() {
    db = await setupDb();

    // API 1: Mengambil daftar alat untuk dropdown di HTML
    app.get('/api/inventory', async (req, res) => {
        try {
            const [rows] = await db.execute('SELECT * FROM inventory');
            res.json(rows);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    // API 2: Menyimpan data booking lengkap dari Form
    app.post('/api/book', async (req, res) => {
        const { nama, telepon, alat_id, jumlah, tgl_booking, tgl_kembali } = req.body;

        try {
            const sql = `
                INSERT INTO bookings 
                (nama_penyewa, nomor_telepon, alat_id, jumlah_alat, tanggal_booking, tanggal_pengembalian) 
                VALUES (?, ?, ?, ?, ?, ?)
            `;
            
            await db.execute(sql, [nama, telepon, alat_id, jumlah, tgl_booking, tgl_kembali]);
            
            res.json({ message: '✨ Booking Berhasil! Data sudah masuk ke MySQL.' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Gagal menyimpan data ke database.' });
        }
    });
    

    const PORT = 3000;
    app.listen(PORT, () => {
        console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
    });
}

startServer();
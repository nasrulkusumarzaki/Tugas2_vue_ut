/* =========================================================
   dataBahanAjar.js — data dummy (pengganti database)
   Dimuat SEBELUM stok-app.js dan tracking-app.js.
   ========================================================= */

var upbjjList = ["Jakarta", "Surabaya", "Makassar", "Padang", "Denpasar"];

var kategoriList = ["MK Wajib", "MK Pilihan", "Praktikum", "Problem-Based"];

var pengirimanList = [
  { kode: "REG", nama: "JNE Reguler" },
  { kode: "EXP", nama: "JNE Express" }
];

var paket = [
  {
    kode: "PAKET-UT-001",
    nama: "Paket Komunikasi dan Bisnis",
    isi: ["ASIP4301 - Pengantar Ilmu Komunikasi", "EKMA4116 - Pengantar Bisnis"],
    harga: 133000
  },
  {
    kode: "PAKET-UT-002",
    nama: "Paket Manajemen dan Penelitian",
    isi: ["EKMA4216 - Manajemen Keuangan", "EKMA4310 - Kepemimpinan", "ADBI4201 - Metode Penelitian Administrasi"],
    harga: 200000
  },
  {
    kode: "PAKET-UT-003",
    nama: "Paket Sains dan Praktikum",
    isi: ["BIOL4211 - Mikrobiologi Dasar", "BIOL4311 - Praktikum Mikrobiologi"],
    harga: 120000
  }
];

var stok = [
  { kode: "ASIP4301", judul: "Pengantar Ilmu Komunikasi", kategori: "MK Wajib", upbjj: "Jakarta", lokasiRak: "R1-A1", harga: 68000, qty: 48, safety: 30, catatanHTML: "<em>Edisi 2</em>, cetakan terbaru" },
  { kode: "EKMA4116", judul: "Pengantar Bisnis", kategori: "MK Wajib", upbjj: "Jakarta", lokasiRak: "R1-A2", harga: 65000, qty: 12, safety: 20, catatanHTML: "<strong>Segera re-order</strong>" },
  { kode: "MKDU4111", judul: "Pendidikan Kewarganegaraan", kategori: "MK Wajib", upbjj: "Jakarta", lokasiRak: "R1-B1", harga: 60000, qty: 0, safety: 25, catatanHTML: "<strong>Stok habis</strong>, menunggu kiriman pusat" },
  { kode: "EKMA4310", judul: "Kepemimpinan", kategori: "MK Pilihan", upbjj: "Surabaya", lokasiRak: "R2-A1", harga: 58000, qty: 27, safety: 15, catatanHTML: "Edisi 1" },
  { kode: "BIOL4211", judul: "Mikrobiologi Dasar", kategori: "Praktikum", upbjj: "Surabaya", lokasiRak: "R2-C3", harga: 62000, qty: 9, safety: 15, catatanHTML: "Perlu <em>re-order</em> bulan ini" },
  { kode: "PAUD4401", judul: "Perkembangan Anak Usia Dini", kategori: "MK Pilihan", upbjj: "Makassar", lokasiRak: "R3-A4", harga: 63000, qty: 34, safety: 20, catatanHTML: "<em>Edisi 4</em>" },
  { kode: "ADBI4201", judul: "Metode Penelitian Administrasi", kategori: "Problem-Based", upbjj: "Makassar", lokasiRak: "R3-B2", harga: 70000, qty: 0, safety: 10, catatanHTML: "<strong>Kosong</strong>, pesanan sudah diajukan" },
  { kode: "EKMA4216", judul: "Manajemen Keuangan", kategori: "MK Wajib", upbjj: "Padang", lokasiRak: "R4-A1", harga: 72000, qty: 55, safety: 30, catatanHTML: "Edisi 3" },
  { kode: "STAT4201", judul: "Statistika Dasar", kategori: "Problem-Based", upbjj: "Padang", lokasiRak: "R4-B3", harga: 59000, qty: 18, safety: 18, catatanHTML: "Tepat di batas <em>safety</em>" },
  { kode: "PEMA4210", judul: "Evaluasi Pembelajaran di SD", kategori: "Problem-Based", upbjj: "Denpasar", lokasiRak: "R5-A2", harga: 61000, qty: 22, safety: 20, catatanHTML: "Edisi 1" },
  { kode: "BIOL4311", judul: "Praktikum Mikrobiologi", kategori: "Praktikum", upbjj: "Denpasar", lokasiRak: "R5-C1", harga: 58000, qty: 5, safety: 12, catatanHTML: "<strong>Menipis</strong>, cek gudang pusat" },
  { kode: "ASIP4301", judul: "Pengantar Ilmu Komunikasi", kategori: "MK Wajib", upbjj: "Surabaya", lokasiRak: "R2-A5", harga: 68000, qty: 36, safety: 30, catatanHTML: "Edisi 2" }
];

var tracking = [
  {
    nomorDO: "DO2025-001",
    nim: "043123456",
    nama: "Rina Wulandari",
    status: "Dalam Perjalanan",
    ekspedisi: "JNE Reguler",
    tanggalKirim: "2025-08-25",
    paket: "PAKET-UT-001",
    total: 133000,
    perjalanan: [
      { waktu: "2025-08-25 10:12:20", keterangan: "Penerimaan di Loket: TANGERANG SELATAN. Pengirim: Universitas Terbuka" },
      { waktu: "2025-08-25 14:07:56", keterangan: "Tiba di Hub: TANGERANG SELATAN" },
      { waktu: "2025-08-26 08:30:10", keterangan: "Diteruskan ke Kantor Jakarta Selatan" }
    ]
  },
  {
    nomorDO: "DO2025-002",
    nim: "043987654",
    nama: "Agus Pranoto",
    status: "Diterima",
    ekspedisi: "JNE Express",
    tanggalKirim: "2025-08-26",
    paket: "PAKET-UT-002",
    total: 200000,
    perjalanan: [
      { waktu: "2025-08-26 09:00:00", keterangan: "Penerimaan di Loket: TANGERANG SELATAN. Pengirim: Universitas Terbuka" },
      { waktu: "2025-08-26 15:20:41", keterangan: "Tiba di Hub: MAKASSAR" },
      { waktu: "2025-08-27 10:05:12", keterangan: "Proses antar ke alamat tujuan" },
      { waktu: "2025-08-27 13:40:33", keterangan: "Selesai Antar. Penerima: Agus Pranoto" }
    ]
  },
  {
    nomorDO: "DO2025-003",
    nim: "050112233",
    nama: "Siti Marlina",
    status: "Diproses",
    ekspedisi: "JNE Reguler",
    tanggalKirim: "2025-09-01",
    paket: "PAKET-UT-003",
    total: 120000,
    perjalanan: [
      { waktu: "2025-09-01 08:45:12", keterangan: "DO dibuat dan sedang disiapkan oleh UT-Daerah" }
    ]
  }
];
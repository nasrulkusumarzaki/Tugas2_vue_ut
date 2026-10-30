/* =========================================================
   tracking-app.js — logika Vue untuk tracking.html
   Memakai Vue 3 (Options API) tanpa Template Component.
   Data awal dibaca dari js/dataBahanAjar.js (variabel global).
   ========================================================= */
const { createApp } = Vue;

const KUNCI_DO = "sitta_vue_tracking";
let timerPesan = null;

// ---------- Helper di luar instance Vue ----------
function salinDataAwal() {
  return JSON.parse(JSON.stringify(tracking));
}

function muatDO() {
  try {
    const mentah = localStorage.getItem(KUNCI_DO);
    if (mentah) return JSON.parse(mentah);
  } catch (e) {
    /* abaikan: pakai data awal */
  }
  return salinDataAwal();
}

const dua = (n) => String(n).padStart(2, "0");

// Tanggal lokal hari ini, format YYYY-MM-DD (cocok untuk input type="date")
function hariIni() {
  const d = new Date();
  return `${d.getFullYear()}-${dua(d.getMonth() + 1)}-${dua(d.getDate())}`;
}

// Waktu lokal sekarang, format YYYY-MM-DD HH:MM:SS
function sekarang() {
  const d = new Date();
  return `${hariIni()} ${dua(d.getHours())}:${dua(d.getMinutes())}:${dua(d.getSeconds())}`;
}

const formKosong = () => ({ nim: "", nama: "", ekspedisi: "", paketKode: "", tanggalKirim: hariIni() });

// ---------- Aplikasi Vue ----------
createApp({
  data() {
    return {
      daftarDO: muatDO(),
      paket,
      pengirimanList,
      urutanStatus: ["Diproses", "Dikirim", "Dalam Perjalanan", "Diterima"],
      cari: "",
      nomorDicari: "",
      errorCari: "",
      form: formKosong(),
      errors: {},
      peringatanTanggal: "",
      pesan: ""
    };
  },

  /* ---------- COMPUTED ---------- */
  computed: {
    // Nomor DO otomatis: "DO" + tahun berjalan + "-" + nomor urut 3 digit
    nomorDOBaru() {
      const awalan = `DO${new Date().getFullYear()}-`;
      const urut = this.daftarDO
        .filter((d) => d.nomorDO.startsWith(awalan))
        .map((d) => parseInt(d.nomorDO.slice(awalan.length), 10))
        .filter((n) => !Number.isNaN(n));
      const berikutnya = (urut.length ? Math.max(...urut) : 0) + 1;
      return awalan + String(berikutnya).padStart(3, "0");
    },

    paketTerpilih() {
      return this.paket.find((p) => p.kode === this.form.paketKode) || null;
    },

    // Total harga diambil dari paket yang dipilih
    totalHarga() {
      return this.paketTerpilih ? this.paketTerpilih.harga : 0;
    },

    // Hasil pencarian selalu mengikuti daftarDO (DO baru langsung bisa ditampilkan)
    hasil() {
      return this.daftarDO.find((d) => d.nomorDO === this.nomorDicari) || null;
    },

    paketHasil() {
      return this.hasil ? this.paket.find((p) => p.kode === this.hasil.paket) || null : null;
    },

    indeksStatus() {
      return this.hasil ? this.urutanStatus.indexOf(this.hasil.status) : -1;
    },

    perjalananTerbaru() {
      return this.hasil ? [...this.hasil.perjalanan].reverse() : [];
    }
  },

  /* ---------- WATCHERS ---------- */
  watch: {
    // Watcher 1: simpan seluruh perubahan DO ke localStorage
    daftarDO: {
      deep: true,
      handler(nilai) {
        try {
          localStorage.setItem(KUNCI_DO, JSON.stringify(nilai));
        } catch (e) {
          this.tampilPesan("Penyimpanan peramban penuh; perubahan hanya sementara.");
        }
      }
    },

    // Watcher 2: bila kolom pencarian dikosongkan, hasil dan pesan error ikut dibersihkan
    cari(baru) {
      this.errorCari = "";
      if (!baru) this.nomorDicari = "";
    },

    // Watcher 3: beri peringatan bila tanggal kirim lebih awal dari hari ini
    "form.tanggalKirim"(baru) {
      this.peringatanTanggal =
        baru && baru < hariIni() ? "Perhatian: tanggal kirim lebih awal dari hari ini." : "";
    },

    // Watcher 4: hapus pesan error paket begitu pengguna memilih paket
    "form.paketKode"() {
      delete this.errors.paketKode;
    }
  },

  /* ---------- METHODS ---------- */
  methods: {
    formatRupiah(angka) {
      return new Intl.NumberFormat("id-ID", {
        style: "currency", currency: "IDR", maximumFractionDigits: 0
      }).format(angka);
    },

    formatTanggal(iso) {
      return new Date(iso + "T00:00:00").toLocaleDateString("id-ID", {
        day: "numeric", month: "long", year: "numeric"
      });
    },

    tampilPesan(teks) {
      this.pesan = teks;
      clearTimeout(timerPesan);
      timerPesan = setTimeout(() => (this.pesan = ""), 3500);
    },

    cariDO() {
      if (!this.cari) {
        this.errorCari = "Nomor Delivery Order wajib diisi.";
        this.nomorDicari = "";
        return;
      }
      this.errorCari = "";
      this.nomorDicari = this.cari.toUpperCase();
    },

    lihat(nomor) {
      this.cari = nomor;
      this.nomorDicari = nomor;
    },

    pakaiHariIni() {
      this.form.tanggalKirim = hariIni();
    },

    kosongkanForm() {
      this.form = formKosong();
      this.errors = {};
    },

    validasi() {
      const e = {};
      const f = this.form;
      if (!/^\d{9}$/.test(f.nim)) e.nim = "NIM wajib 9 digit angka.";
      if (f.nama.length < 3) e.nama = "Nama minimal 3 karakter.";
      else if (!/^[A-Za-z .'-]+$/.test(f.nama)) e.nama = "Nama hanya boleh berisi huruf dan tanda baca nama.";
      if (!f.ekspedisi) e.ekspedisi = "Pilih ekspedisi.";
      if (!f.paketKode) e.paketKode = "Pilih paket bahan ajar.";
      if (!f.tanggalKirim) e.tanggalKirim = "Tanggal kirim wajib diisi.";
      return e;
    },

    tambahDO() {
      this.errors = this.validasi();
      if (Object.keys(this.errors).length > 0) return;

      const f = this.form;
      const nomor = this.nomorDOBaru; // dihitung sebelum data ditambahkan
      this.daftarDO.unshift({
        nomorDO: nomor,
        nim: f.nim,
        nama: f.nama,
        status: "Diproses",
        ekspedisi: f.ekspedisi,
        tanggalKirim: f.tanggalKirim,
        paket: f.paketKode,
        total: this.totalHarga,
        perjalanan: [{ waktu: sekarang(), keterangan: "DO dibuat dan sedang disiapkan oleh UT-Daerah" }]
      });
      this.tampilPesan(`DO ${nomor} berhasil dibuat.`);
      this.lihat(nomor);
      this.kosongkanForm();
    }
  }
}).mount("#app");
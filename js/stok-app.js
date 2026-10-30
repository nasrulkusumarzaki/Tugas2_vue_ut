/* =========================================================
   stok-app.js — logika Vue untuk stok.html
   Memakai Vue 3 (Options API) tanpa Template Component.
   Data awal dibaca dari js/dataBahanAjar.js (variabel global).
   ========================================================= */
const { createApp } = Vue;

const KUNCI_STOK = "sitta_vue_stok";
let timerPesan = null;

// ---------- Helper di luar instance Vue ----------
function salinDataAwal() {
  return stok.map((s) => ({ ...s }));
}

function muatStok() {
  try {
    const mentah = localStorage.getItem(KUNCI_STOK);
    if (mentah) return JSON.parse(mentah);
  } catch (e) {
    /* abaikan: pakai data awal */
  }
  return salinDataAwal();
}

// Mengubah teks biasa menjadi HTML aman (karena ditampilkan dengan v-html)
function escapeHtml(teks) {
  return teks
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Kebalikan escapeHtml + buang tag, dipakai saat catatan diedit
function htmlKeTeks(html) {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&");
}

const formKosong = () => ({
  kode: "", judul: "", kategori: "", upbjj: "",
  lokasiRak: "", harga: null, qty: null, safety: null, catatan: ""
});

const urutanAwal = () => ({ by: "judul", arah: "asc" });
const filterAwal = () => ({ upbjj: "", kategori: "", reorderOnly: false, keyword: "" });

// ---------- Aplikasi Vue ----------
createApp({
  data() {
    return {
      daftar: muatStok(),
      upbjjList,
      kategoriList,
      filters: filterAwal(),
      urutan: urutanAwal(),
      tampilForm: false,
      form: formKosong(),
      errors: {},
      petunjukStok: "",
      editing: null,
      editErrors: {},
      pesan: ""
    };
  },

  /* ---------- COMPUTED: hasilnya di-cache selama dependensinya tidak berubah ---------- */
  computed: {
    // Opsi kategori bergantung pada UT-Daerah yang dipilih (dependent options)
    kategoriTersedia() {
      const adaDi = new Set(
        this.daftar.filter((i) => i.upbjj === this.filters.upbjj).map((i) => i.kategori)
      );
      return this.kategoriList.filter((k) => adaDi.has(k));
    },

    // Filter + sort dijalankan SATU kali dan di-cache. Semua filter diproses
    // bersama dalam satu computed, jadi tidak ada penghitungan ulang yang sia-sia
    // selama filter/urutan/data tidak berubah.
    stokTampil() {
      const { upbjj, kategori, reorderOnly, keyword } = this.filters;
      const kata = keyword.toLowerCase();
      const hasil = this.daftar.filter(
        (i) =>
          (!upbjj || i.upbjj === upbjj) &&
          (!kategori || i.kategori === kategori) &&
          (!reorderOnly || i.qty === 0 || i.qty < i.safety) &&
          (!kata || i.kode.toLowerCase().includes(kata) || i.judul.toLowerCase().includes(kata))
      );
      const arah = this.urutan.arah === "asc" ? 1 : -1;
      const { by } = this.urutan;
      // hasil adalah array baru dari filter(), jadi sort() tidak mengubah this.daftar
      return hasil.sort((a, b) =>
        by === "judul" ? a.judul.localeCompare(b.judul, "id") * arah : (a[by] - b[by]) * arah
      );
    },

    ringkasan() {
      const r = { aman: 0, menipis: 0, kosong: 0 };
      this.stokTampil.forEach((i) => {
        if (i.qty === 0) r.kosong++;
        else if (i.qty < i.safety) r.menipis++;
        else r.aman++;
      });
      return r;
    },

    // Seluruh data (bukan hanya yang terfilter) yang perlu re-order
    jumlahReorder() {
      return this.daftar.filter((i) => i.qty === 0 || i.qty < i.safety).length;
    },

    adaFilter() {
      const f = this.filters;
      const u = this.urutan;
      return !!(f.upbjj || f.kategori || f.reorderOnly || f.keyword || u.by !== "judul" || u.arah !== "asc");
    }
  },

  /* ---------- WATCHERS ---------- */
  watch: {
    // Watcher 1: pilihan kategori dikosongkan setiap UT-Daerah berubah
    "filters.upbjj"() {
      this.filters.kategori = "";
    },

    // Watcher 2: simpan seluruh perubahan data ke localStorage
    daftar: {
      deep: true,
      handler(nilai) {
        try {
          localStorage.setItem(KUNCI_STOK, JSON.stringify(nilai));
        } catch (e) {
          this.tampilPesan("Penyimpanan peramban penuh; perubahan hanya sementara.");
        }
      }
    },

    // Watcher 3 & 4: petunjuk status awal pada formulir tambah data
    "form.qty"() {
      this.perbaruiPetunjuk();
    },
    "form.safety"() {
      this.perbaruiPetunjuk();
    }
  },

  /* ---------- METHODS ---------- */
  methods: {
    formatRupiah(angka) {
      return new Intl.NumberFormat("id-ID", {
        style: "currency", currency: "IDR", maximumFractionDigits: 0
      }).format(angka);
    },

    tampilPesan(teks) {
      this.pesan = teks;
      clearTimeout(timerPesan);
      timerPesan = setTimeout(() => (this.pesan = ""), 3500);
    },

    resetFilter() {
      this.filters = filterAwal();
      this.urutan = urutanAwal();
    },

    perbaruiPetunjuk() {
      const { qty, safety } = this.form;
      if (typeof qty !== "number" || typeof safety !== "number") {
        this.petunjukStok = "";
      } else if (qty === 0) {
        this.petunjukStok = "Status awal data ini: Kosong (qty = 0).";
      } else if (qty < safety) {
        this.petunjukStok = "Status awal data ini: Menipis (qty < safety).";
      } else {
        this.petunjukStok = "Status awal data ini: Aman (qty ≥ safety).";
      }
    },

    // Validasi sederhana untuk form tambah (baru = true) maupun edit (baru = false)
    validasiStok(d, baru) {
      const e = {};
      if (baru) {
        const kode = d.kode.trim().toUpperCase();
        if (!kode) e.kode = "Kode wajib diisi.";
        else if (!/^[A-Z]{4}\d{4}$/.test(kode)) e.kode = "Format: 4 huruf + 4 angka, contoh ASIP4301.";
        else if (this.daftar.some((i) => i.kode === kode && i.upbjj === d.upbjj))
          e.kode = "Kode ini sudah ada di UT-Daerah tersebut.";
        if (d.judul.trim().length < 3) e.judul = "Judul minimal 3 karakter.";
        if (!d.kategori) e.kategori = "Pilih kategori.";
        if (!d.upbjj) e.upbjj = "Pilih UT-Daerah.";
      }
      if (!d.lokasiRak.trim()) e.lokasiRak = "Lokasi rak wajib diisi.";
      if (!Number.isInteger(d.harga) || d.harga <= 0) e.harga = "Harga harus bilangan bulat lebih dari 0.";
      if (!Number.isInteger(d.qty) || d.qty < 0) e.qty = "Qty harus bilangan bulat 0 atau lebih.";
      if (!Number.isInteger(d.safety) || d.safety < 0) e.safety = "Safety harus bilangan bulat 0 atau lebih.";
      return e;
    },

    kosongkanForm() {
      this.form = formKosong();
      this.errors = {};
      this.petunjukStok = "";
    },

    tambahBaru() {
      this.errors = this.validasiStok(this.form, true);
      if (Object.keys(this.errors).length > 0) return;

      const f = this.form;
      this.daftar.push({
        kode: f.kode.trim().toUpperCase(),
        judul: f.judul.trim(),
        kategori: f.kategori,
        upbjj: f.upbjj,
        lokasiRak: f.lokasiRak.trim(),
        harga: f.harga,
        qty: f.qty,
        safety: f.safety,
        catatanHTML: escapeHtml(f.catatan.trim())
      });
      this.tampilPesan(`Data ${f.kode.trim().toUpperCase()} berhasil ditambahkan.`);
      this.kosongkanForm();
    },

    mulaiEdit(item) {
      this.editing = {
        kode: item.kode,
        judul: item.judul,
        upbjj: item.upbjj,
        lokasiRak: item.lokasiRak,
        harga: item.harga,
        qty: item.qty,
        safety: item.safety,
        catatan: htmlKeTeks(item.catatanHTML)
      };
      this.editErrors = {};
    },

    simpanEdit() {
      this.editErrors = this.validasiStok(this.editing, false);
      if (Object.keys(this.editErrors).length > 0) return;

      const e = this.editing;
      const target = this.daftar.find((i) => i.kode === e.kode && i.upbjj === e.upbjj);
      if (target) {
        target.lokasiRak = e.lokasiRak.trim();
        target.harga = e.harga;
        target.qty = e.qty;
        target.safety = e.safety;
        target.catatanHTML = escapeHtml(e.catatan.trim());
      }
      this.tampilPesan(`Data ${e.kode} (${e.upbjj}) berhasil diperbarui.`);
      this.editing = null;
    },

    batalEdit() {
      this.editing = null;
    },

    kembalikanDataAwal() {
      if (confirm("Kembalikan seluruh data ke kondisi awal? Perubahan Anda akan hilang.")) {
        this.daftar = salinDataAwal();
        this.resetFilter();
        this.tampilPesan("Data dikembalikan ke kondisi awal.");
      }
    },

    tutupDenganEsc(e) {
      if (e.key === "Escape") this.editing = null;
    }
  },

  mounted() {
    window.addEventListener("keydown", this.tutupDenganEsc);
  },

  beforeUnmount() {
    window.removeEventListener("keydown", this.tutupDenganEsc);
  }
}).mount("#app");
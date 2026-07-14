# Eco-Share Frontend

Frontend web application untuk platform penyewaan alat elektronik bekas **Eco-Share**. Project ini dibangun dengan Vue 3 dan terintegrasi dengan backend repository [`UTS-Fullstack-411251181-BayuFarid`](../UTS-Fullstack-411251181-BayuFarid/README.md) melalui REST API berbasis Express, Prisma, Supabase Postgres, JWT, dan middleware otorisasi role.

## Tujuan Project

Project ini dibuat untuk memenuhi kebutuhan UAS frontend berdasarkan spesifikasi pada [`task.md`](./task.md), dengan fokus pada:

- autentikasi login/register terintegrasi backend,
- role access `OWNER` dan `RENTER`,
- modul transaksional rental,
- pengelolaan item oleh owner,
- error handling yang seragam,
- tampilan mobile-responsive,
- dokumentasi dan setup yang siap dinilai.

## Stack

- Vue 3
- Vite
- Vue Router
- Pinia
- Axios
- CSS custom responsive

## Hubungan Frontend dengan Backend

Frontend ini memakai backend dari repository berikut:

- Frontend target: `https://github.com/411251181/UAS-Fullstack-411251181-BayuFarid.git`
- Backend referensi/integrasi: `https://github.com/411251181/UTS-Fullstack-411251181-BayuFarid.git`

Integrasi utama:

- [`src/api/http.js`](src/api/http.js) membuat instance Axios dengan `baseURL` dari environment.
- Token JWT dikirim otomatis lewat header `Authorization: Bearer <token>`.
- State login disimpan di `localStorage` lewat [`src/utils/auth.js`](src/utils/auth.js).
- Router guard pada [`src/router/index.js`](src/router/index.js) membatasi halaman berdasarkan autentikasi dan role.
- Semua error API dibaca dan dinormalisasi dengan [`src/utils/api.js`](src/utils/api.js).

## Analisis Kebutuhan dari Backend

Berdasarkan backend:

### Auth

Endpoint:

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`

Aturan:

- role valid hanya `RENTER` atau `OWNER`
- token wajib untuk endpoint protected
- jika token invalid/expired, frontend harus logout lokal

### Items

Endpoint:

- `GET /api/v1/items`
- `GET /api/v1/items/:id`
- `GET /api/v1/items/owner/my`
- `POST /api/v1/items`
- `PUT /api/v1/items/:id`
- `DELETE /api/v1/items/:id`

Aturan:

- create/update/delete hanya untuk `OWNER`
- owner hanya bisa ubah/hapus barang miliknya
- item yang sedang dipinjam tidak bisa dihapus
- status item: `AVAILABLE`, `UNAVAILABLE`, `INACTIVE`

### Rentals

Endpoint:

- `POST /api/v1/rentals`
- `GET /api/v1/rentals/my`
- `GET /api/v1/rentals/owner`
- `GET /api/v1/rentals/:id`
- `PATCH /api/v1/rentals/:id/return`
- `PATCH /api/v1/rentals/:id/cancel`

Aturan:

- create rental hanya untuk `RENTER`
- backend validasi stok, tanggal, dan status item
- return/cancel hanya untuk renter terkait
- owner hanya memantau transaksi barang miliknya
- detail rental memuat relasi item, owner, renter, dan histories

### Format Response Backend

Success:

```json
{
  "success": true,
  "message": "Request berhasil",
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "message": "Pesan error",
  "errors": []
}
```

Frontend ini mengikuti format itu penuh pada penanganan error dan sukses.

## Fitur Frontend

### Public

- katalog barang tersedia
- detail barang
- navigasi responsive

### Auth

- login
- register
- restore session dari `localStorage`
- fetch profile user dengan endpoint `me`
- logout otomatis saat `401`

### Owner

- lihat daftar barang milik sendiri
- tambah barang
- edit barang
- hapus barang
- lihat daftar transaksi rental pada barang milik sendiri
- lihat detail rental

### Renter

- lihat katalog barang
- buat rental dari detail barang
- lihat riwayat rental sendiri
- cancel rental sesuai status
- return rental aktif
- lihat detail rental dan histori transaksi

### UX / Reliability

- unified alert untuk error dan success
- loading state di tiap halaman utama
- empty state saat data kosong
- layout mobile-responsive

## Arsitektur Frontend

Struktur utama:

```txt
src/
├── api/
├── assets/styles/
├── components/
│   ├── common/
│   ├── forms/
│   ├── items/
│   └── layout/
├── router/
├── stores/
├── tests/
├── utils/
└── views/
    ├── auth/
    ├── items/
    └── rentals/
```

Penjelasan:

- [`src/api/http.js`](src/api/http.js): config Axios, token interceptor, `401` cleanup.
- [`src/stores/auth.js`](src/stores/auth.js): state auth global, login/register/init/logout.
- [`src/router/index.js`](src/router/index.js): route map dan guard role.
- [`src/views/items/PublicItemsView.vue`](src/views/items/PublicItemsView.vue): katalog public.
- [`src/views/items/OwnerItemsView.vue`](src/views/items/OwnerItemsView.vue): CRUD barang owner.
- [`src/views/rentals/MyRentalsView.vue`](src/views/rentals/MyRentalsView.vue): dashboard renter.
- [`src/views/rentals/OwnerRentalsView.vue`](src/views/rentals/OwnerRentalsView.vue): dashboard transaksi owner.
- [`src/views/rentals/RentalDetailView.vue`](src/views/rentals/RentalDetailView.vue): detail rental dan histori.

## Routing

- `/` katalog barang
- `/login` login
- `/register` register
- `/items/:id` detail barang
- `/dashboard/owner/items` dashboard item owner
- `/dashboard/owner/rentals` transaksi owner
- `/dashboard/rentals` rental renter
- `/rentals/:id` detail rental

## Environment Variables

Salin file contoh:

```sh
cp .env.example .env
```

Isi nilai:

```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

Catatan:

- default frontend mengarah ke backend lokal pada port `3000`
- ubah nilai bila backend berjalan di host/port lain

## Instalasi

Jalankan di folder frontend:

```sh
npm install
```

## Menjalankan Project

Development:

```sh
npm run dev
```

Build production:

```sh
npm run build
```

Preview build:

```sh
npm run preview
```

Test:

```sh
npm run test
```

## Integrasi dengan Backend

1. Jalankan backend lebih dulu pada repository [`UTS-Fullstack-411251181-BayuFarid`](../UTS-Fullstack-411251181-BayuFarid/README.md).
2. Pastikan koneksi Supabase Postgres dan migration backend sudah siap.
3. Pastikan backend aktif pada `http://localhost:3000` atau sesuaikan [`VITE_API_BASE_URL`](.env.example).
4. Jalankan frontend.
5. Register akun `OWNER` dan `RENTER`, lalu uji alur item dan rental.

## Alur Penggunaan

### Sebagai Owner

1. Register/login role `OWNER`
2. Buka dashboard barang
3. Tambah barang dengan status tersedia
4. Pantau transaksi pada dashboard owner rentals

### Sebagai Renter

1. Register/login role `RENTER`
2. Buka katalog dan detail barang
3. Buat rental
4. Lihat riwayat rental
5. Lakukan return atau cancel bila memenuhi aturan backend

## Asumsi Teknis

- backend sudah mengaktifkan CORS
- backend response selalu mengikuti kontrak `success/message/data` dan `success/message/errors`
- backend tidak memakai refresh token
- frontend menyimpan token di `localStorage` karena kebutuhan project akademik
- `PENDING` tetap didukung di UI walau create rental backend saat ini menghasilkan `ACTIVE`

## Kendala / Catatan

- beberapa aksi sensitif seperti delete/cancel/return belum memakai modal konfirmasi terpisah agar scope tetap efisien
- validasi utama tetap bersumber dari backend supaya kontrak API konsisten
- histori rental memakai format tanggal lokal browser

## Testing dan Review

Yang sudah disiapkan:

- unit test util sederhana pada [`src/tests/format.test.js`](src/tests/format.test.js)
- build check melalui `vite build`
- review integrasi route, role, endpoint, dan error handling

Checklist manual yang disarankan:

- login owner berhasil
- login renter berhasil
- owner dapat CRUD barang
- renter dapat lihat katalog dan detail barang
- renter dapat membuat rental jika stok cukup
- stok berkurang setelah rental berhasil
- renter dapat return rental aktif
- renter dapat cancel rental sesuai aturan
- owner dapat melihat transaksi rental pada barang miliknya
- error backend tampil jelas di UI

## Struktur Folder Aktual

Lihat root utama:

- [`package.json`](package.json)
- [`vite.config.js`](vite.config.js)
- [`.env.example`](.env.example)
- [`src/main.js`](src/main.js)
- [`src/App.vue`](src/App.vue)
- [`src/assets/styles/main.css`](src/assets/styles/main.css)

## Git Workflow

Requirement soal meminta minimal 3 commit dengan pesan standar. Perubahan lokal sudah disusun agar mudah dipisah menjadi misal:

1. `feat: initialize vue frontend architecture`
2. `feat: add auth item and rental flows`
3. `docs: add frontend setup and integration guide`

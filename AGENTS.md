# Agent Guidelines

## Commit Message Suggestion (Mandatory)

Di **setiap akhir respon**, selalu berikan saran pesan commit Git menggunakan format **Conventional Commits** yang rapi dan siap di-*copy-paste*.

### Format Commit

```text
<type>: <deskripsi singkat dalam bahasa Inggris (imperative mood)>
```

Atau dengan *scope* opsional jika perubahan terfokus pada satu bagian:

```text
<type>(<scope>): <deskripsi singkat dalam bahasa Inggris (imperative mood)>
```

### Daftar `<type>` yang Digunakan

- `feat`: Penambahan fitur atau komponen baru (contoh: `feat: add GSAP menu animation and keyboard navigation`)
- `fix`: Perbaikan bug, error, atau perilaku yang tidak sesuai (contoh: `fix: ensure theme toggle label updates on mode switch`)
- `refactor`: Restrukturisasi atau pembersihan kode tanpa mengubah fungsionalitas (contoh: `refactor: modularize navbar and clean up outdated comments`)
- `style`: Penyesuaian styling/UI (CSS, Tailwind, animasi visual) atau formatting kode (contoh: `style: refine light mode transition timing`)
- `chore`: Pembaruan konfigurasi, dependencies, build scripts, atau maintenance proyek (contoh: `chore: remove unused package manager lockfile`)
- `docs`: Perubahan pada dokumentasi atau aturan proyek (contoh: `docs: add AGENTS.md with conventional commit guidelines`)
- `perf`: Optimasi performa atau ukuran bundle (contoh: `perf: lazy load heavy animation scripts`)

### Aturan Penulisan Pesan Commit

1. Gunakan huruf kecil (*lowercase*) untuk `<type>` dan huruf pertama deskripsi.
2. Gunakan *imperative mood* dalam bahasa Inggris (`add`, `fix`, `update`, `remove`, `ensure`, `refine` — bukan `added` atau `adding`).
3. Buat ringkas, jelas, dan spesifik (maksimal ~72 karakter), tanpa tanda titik di akhir kalimat.
4. Jika terdapat beberapa perubahan yang berbeda konteks, berikan 1 saran commit utama yang merangkum perubahan, atau pecah menjadi beberapa opsi commit per kelompok file.
5. Tampilkan saran commit di bagian paling bawah setiap respon dengan format berikut:

```markdown
---
**Suggested commit:**
`type: short imperative description`
```

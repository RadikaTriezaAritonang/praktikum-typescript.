// Data simulasi untuk user dan produk
const database = {
  users: [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' }
  ],
  products: [
    { id: 1, name: 'Laptop', price: 15000000 },
    { id: 2, name: 'Mouse', price: 300000 }
  ]
};

const server = Bun.serve({
  // Soal 4: Menggunakan port 3001 (Node.js bisa di 3000, Bun di 3001)
  port: 3001, 
  
  async fetch(request) {
    // Soal 3: Middleware sederhana untuk menghitung lama eksekusi (Performance Benchmarking)
    const startTime = performance.now(); // Catat waktu mulai

    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // Memisahkan path berdasarkan karakter '/' untuk mendeteksi parameter dinamis
    const pathSegments = path.split('/').filter(Boolean); // Contoh: '/users/123' -> ['users', '123']

    let response: Response;

    // --- AREA ROUTING ---

    // 1. Rute Utama & About
    if (path === '/' && method === 'GET') {
      response = new Response('<h1>🏠 Halaman Utama (Bun)</h1>', { headers: { 'Content-Type': 'text/html' } });
    } 
    else if (path === '/about' && method === 'GET') {
      response = new Response('<h1>📄 Tentang Kami</h1>', { headers: { 'Content-Type': 'text/html' } });
    }

    // 2. Rute Users (Statis Lama)
    else if (path === '/api/users' && method === 'GET') {
      response = new Response(JSON.stringify(database.users), { headers: { 'Content-Type': 'application/json' } });
    }

    // Soal 1: Tambahkan rute baru /products (GET & POST)
    else if (path === '/products' && method === 'GET') {
      response = new Response(JSON.stringify(database.products), {
        headers: { 'Content-Type': 'application/json' },
      });
    } 
    else if (path === '/products' && method === 'POST') {
      response = new Response(JSON.stringify({ message: 'Produk berhasil ditambahkan (Simulasi)' }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Soal 2: Tangani parameter dinamis GET /users/:id (Menggunakan teknik split path)
    else if (pathSegments[0] === 'users' && pathSegments.length === 2 && method === 'GET') {
      const userId = parseInt(pathSegments[1]!, 10); // Mengambil '123' dari ['users', '123'] dan ubah ke angka
      const user = database.users.find(u => u.id === userId);

      if (user) {
        response = new Response(JSON.stringify(user), { headers: { 'Content-Type': 'application/json' } });
      } else {
        response = new Response(JSON.stringify({ error: `User dengan ID ${userId} tidak ditemukan` }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    // 3. Rute Default (404 Not Found)
    else {
      response = new Response('<h1>❌ 404 - Halaman Tidak Ditemukan</h1>', {
        status: 404,
        headers: { 'Content-Type': 'text/html' },
      });
    }

    // Soal 3 (Lanjutan): Hitung selisih waktu setelah response siap dikirim
    const endTime = performance.now();
    const duration = (endTime - startTime).toFixed(4); // Menghitung milidetik dengan 4 angka di belakang koma
    
    console.log(`[${new Date().toLocaleTimeString()}] ${method} ${path} - Selesai dalam ${duration}ms`);

    return response;
  },
});

console.log(`🚀 Server Bun berjalan di http://localhost:${server.port}`);
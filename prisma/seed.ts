import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const categories = [
  { name: 'Kelapa Sawit / Palm Oil', slug: 'palm-oil', description: 'Minyak kelapa sawit berkualitas tinggi untuk kebutuhan industri makanan, kosmetik, dan biodiesel. Indonesia adalah produsen kelapa sawit terbesar di dunia.', category: 'agriculture', origin: 'Indonesia', price: '$850/ton', unit: 'Metric Ton', imageUrl: '/images/palm-oil.jpg', featured: true },
  { name: 'Kopi / Coffee', slug: 'coffee', description: 'Kopi arabika dan robusta premium dari berbagai daerah penghasil kopi terbaik Indonesia seperti Sumatra, Java, dan Sulawesi.', category: 'agriculture', origin: 'Indonesia', price: '$4,500/ton', unit: 'Metric Ton', imageUrl: '/images/coffee.jpg', featured: true },
  { name: 'Karet / Rubber', slug: 'rubber', description: 'Karet alam berkualitas tinggi untuk industri otomotif, sepatu, dan berbagai produk karet lainnya.', category: 'agriculture', origin: 'Indonesia', price: '$1,600/ton', unit: 'Metric Ton', imageUrl: '/images/rubber.jpg', featured: true },
  { name: 'Rempah & Bumbu / Spices', slug: 'spices', description: 'Rempah-rempah asli Nusantara termasuk pala, cengkeh, kayu manis, dan lada hitam yang terkenal di seluruh dunia.', category: 'agriculture', origin: 'Indonesia', price: '$8,000/ton', unit: 'Metric Ton', imageUrl: '/images/spices.jpg', featured: true },
  { name: 'Tekstil & Garmen / Textiles', slug: 'textiles', description: 'Produksi tekstil dan garmen berkualitas ekspor dengan berbagai jenis kain dan pakaian jadi untuk pasar global.', category: 'manufacturing', origin: 'Indonesia', price: '$2-15/pcs', unit: 'Piece', imageUrl: '/images/textiles.jpg', featured: true },
  { name: 'Elektronik / Electronics', slug: 'electronics', description: 'Komponen dan produk elektronik berkualitas tinggi mulai dari semikonduktor hingga perangkat konsumer.', category: 'manufacturing', origin: 'Indonesia', price: 'Negotiable', unit: 'Unit', imageUrl: '/images/electronics.jpg', featured: false },
  { name: 'Kakao / Cocoa', slug: 'cocoa', description: 'Biji kakao premium dari perkebunan terbaik Indonesia, cocok untuk industri cokelat dan makanan premium.', category: 'agriculture', origin: 'Indonesia', price: '$3,200/ton', unit: 'Metric Ton', imageUrl: '/images/cocoa.jpg', featured: true },
  { name: 'Hasil Laut / Seafood', slug: 'seafood', description: 'Produk perikanan segar dan beku termasuk udang, tuna, dan ikan lainnya yang diekspor ke seluruh dunia.', category: 'marine', origin: 'Indonesia', price: '$6-25/kg', unit: 'Kilogram', imageUrl: '/images/seafood.jpg', featured: true },
  { name: 'Kayu & Furniture / Wood Products', slug: 'wood-furniture', description: 'Furniture kayu tropis berkualitas tinggi dan produk kayu olahan dari kayu jati, mahoni, dan kayu lainnya.', category: 'manufacturing', origin: 'Indonesia', price: '$50-500/pcs', unit: 'Piece', imageUrl: '/images/furniture.jpg', featured: false },
  { name: 'Batik', slug: 'batik', description: 'Kain batik tulis dan batik cap asli Indonesia yang diakui UNESCO sebagai Warisan Kemanusiaan untuk Budaya Lisan dan Nonbendawi.', category: 'manufacturing', origin: 'Indonesia', price: '$15-200/pcs', unit: 'Piece', imageUrl: '/images/batik.jpg', featured: true },
  { name: 'Nikel / Nickel', slug: 'nickel', description: 'Nikel dan produk turunan nikel untuk industri baterai EV, stainless steel, dan berbagai aplikasi industri.', category: 'mining', origin: 'Indonesia', price: '$18,000/ton', unit: 'Metric Ton', imageUrl: '/images/nickel.jpg', featured: false },
  { name: 'Tembakau / Tobacco', slug: 'tobacco', description: 'Tembakau Virginia dan tembakau cerutu berkualitas premium dari berbagai daerah penghasil tembakau di Indonesia.', category: 'agriculture', origin: 'Indonesia', price: '$5,000/ton', unit: 'Metric Ton', imageUrl: '/images/tobacco.jpg', featured: false },
]

const testimonials = [
  { name: 'James Mitchell', company: 'Pacific Trade Co.', role: 'Procurement Director', message: 'Kerjasama dengan GlobalNusantara sangat memuaskan. Kualitas produk kelapa sawit yang kami terima selalu konsisten dan sesuai standar internasional.', rating: 5 },
  { name: 'Sarah Chen', company: 'Shanghai Commodities Ltd.', role: 'Import Manager', message: 'Kami telah bekerjasama selama 5 tahun dan selalu puas dengan layanan dan kualitas produk. Tim mereka sangat profesional dan responsif.', rating: 5 },
  { name: 'Ahmed Al-Rashid', company: 'Gulf Resources FZE', role: 'CEO', message: 'GlobalNusantara adalah mitra terpercaya kami untuk impor rempah Indonesia. Pengiriman selalu tepat waktu dan dokumentasi lengkap.', rating: 5 },
  { name: 'Maria Santos', company: 'Brazil Food Imports', role: 'Quality Assurance Manager', message: 'Sistem quality control yang ketat memastikan setiap pengiriman kopi memenuhi ekspektasi kami. Sangat direkomendasikan!', rating: 4 },
]

async function main() {
  console.log('Seeding database...')

  // Clear existing data
  await prisma.inquiry.deleteMany()
  await prisma.testimonial.deleteMany()
  await prisma.product.deleteMany()

  // Seed products
  for (const product of categories) {
    await prisma.product.create({ data: product })
  }
  console.log(`Seeded ${categories.length} products`)

  // Seed testimonials
  for (const testimonial of testimonials) {
    await prisma.testimonial.create({ data: testimonial })
  }
  console.log(`Seeded ${testimonials.length} testimonials`)

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

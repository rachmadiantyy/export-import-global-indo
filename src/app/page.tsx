'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import {
  Ship,
  Globe,
  Package,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  ChevronDown,
  Star,
  Shield,
  TrendingUp,
  Users,
  Award,
  Leaf,
  Coffee,
  Waves,
  Factory,
  Cpu,
  TreePine,
  Palette,
  Mountain,
  Cigarette,
  Menu,
  X,
  CheckCircle2,
  Clock,
  Headphones,
  FileCheck,
  Send,
  Loader2,
  ChevronUp,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'

// ─── Types ─────────────────────────────────────────────
interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: string | null
  unit: string | null
  category: string
  origin: string | null
  imageUrl: string | null
  featured: boolean
  active: boolean
}

interface Testimonial {
  id: string
  name: string
  company: string
  role: string | null
  avatar: string | null
  message: string
  rating: number
}

// ─── Category Config ───────────────────────────────────
const categoryIcons: Record<string, React.ReactNode> = {
  agriculture: <Leaf className="h-5 w-5" />,
  manufacturing: <Factory className="h-5 w-5" />,
  marine: <Waves className="h-5 w-5" />,
  mining: <Mountain className="h-5 w-5" />,
}

const categoryLabels: Record<string, string> = {
  agriculture: 'Pertanian',
  manufacturing: 'Manufaktur',
  marine: 'Perikanan',
  mining: 'Pertambangan',
}

const productIconMap: Record<string, React.ReactNode> = {
  'palm-oil': <Leaf className="h-6 w-6" />,
  'coffee': <Coffee className="h-6 w-6" />,
  'rubber': <TreePine className="h-6 w-6" />,
  'spices': <Leaf className="h-6 w-6" />,
  'textiles': <Palette className="h-6 w-6" />,
  'electronics': <Cpu className="h-6 w-6" />,
  'cocoa': <Coffee className="h-6 w-6" />,
  'seafood': <Waves className="h-6 w-6" />,
  'wood-furniture': <TreePine className="h-6 w-6" />,
  'batik': <Palette className="h-6 w-6" />,
  'nickel': <Mountain className="h-6 w-6" />,
  'tobacco': <Cigarette className="h-6 w-6" />,
}

// ─── Animated Section Wrapper ──────────────────────────
function AnimatedSection({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ─── Counter Component ─────────────────────────────────
function Counter({ end, suffix = '', prefix = '' }: { end: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (isInView && !hasAnimated.current) {
      hasAnimated.current = true
      let start = 0
      const duration = 2000
      const increment = end / (duration / 16)
      const timer = setInterval(() => {
        start += increment
        if (start >= end) {
          setCount(end)
          clearInterval(timer)
        } else {
          setCount(Math.floor(start))
        }
      }, 16)
      return () => clearInterval(timer)
    }
  }, [isInView, end])

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>
}

// ─── Navigation ────────────────────────────────────────
function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: '#home', label: 'Beranda' },
    { href: '#products', label: 'Produk' },
    { href: '#about', label: 'Tentang Kami' },
    { href: '#testimonials', label: 'Testimoni' },
    { href: '#contact', label: 'Kontak' },
  ]

  const scrollTo = (href: string) => {
    setMobileOpen(false)
    const el = document.querySelector(href)
    el?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-emerald-100'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <button onClick={() => scrollTo('#home')} className="flex items-center gap-2 sm:gap-3 group">
            <div className={`p-1.5 sm:p-2 rounded-lg transition-colors ${scrolled ? 'bg-emerald-600' : 'bg-white/20 backdrop-blur-sm'}`}>
              <Ship className={`h-5 w-5 sm:h-6 sm:w-6 ${scrolled ? 'text-white' : 'text-white'}`} />
            </div>
            <div>
              <h1 className={`text-lg sm:text-xl font-bold tracking-tight transition-colors ${scrolled ? 'text-emerald-800' : 'text-white'}`}>
                WeltBridge International
              </h1>
              <p className={`text-[10px] sm:text-xs tracking-widest uppercase transition-colors ${scrolled ? 'text-emerald-600' : 'text-emerald-200'}`}>
                Export & Import
              </p>
            </div>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-emerald-50 ${
                  scrolled ? 'text-gray-700 hover:text-emerald-700' : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
              </button>
            ))}
            <Button
              onClick={() => scrollTo('#contact')}
              className={`ml-3 rounded-lg font-semibold transition-all ${
                scrolled
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-white text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              Minta Penawaran
            </Button>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${scrolled ? 'text-gray-700' : 'text-white'}`}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-emerald-100 shadow-lg"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className="block w-full text-left px-4 py-3 rounded-lg text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 font-medium transition-colors"
                >
                  {link.label}
                </button>
              ))}
              <Button
                onClick={() => scrollTo('#contact')}
                className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold"
              >
                Minta Penawaran
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

// ─── Hero Section ──────────────────────────────────────
function HeroSection() {
  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/images/hero.jpg"
          alt="International shipping port"
          className="w-full h-full object-cover"
        />
        <div className="hero-overlay absolute inset-0" />
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-emerald-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 sm:py-40">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="bg-amber-500/90 text-white border-0 px-4 py-1.5 text-sm font-medium mb-6">
              🌏 Mitra Perdagangan Terpercaya Sejak 2008
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
          >
            Jembatan Perdagangan
            <span className="text-amber-400"> Indonesia </span>
            ke Dunia
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-emerald-100 mb-10 max-w-2xl leading-relaxed"
          >
            WeltBridge International adalah perusahaan ekspor-impor terkemuka yang menghubungkan produk berkualitas tinggi Indonesia dengan pasar global. Dari kelapa sawit hingga rempah pilihan, kami memastikan setiap pengiriman memenuhi standar internasional.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button
              onClick={() => document.querySelector('#products')?.scrollIntoView({ behavior: 'smooth' })}
              size="lg"
              className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-8 py-6 text-base rounded-xl shadow-lg shadow-amber-500/30 transition-all hover:shadow-xl hover:shadow-amber-500/40"
            >
              Lihat Produk Kami
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
              size="lg"
              variant="outline"
              className="border-2 border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-6 text-base rounded-xl bg-transparent backdrop-blur-sm"
            >
              <Phone className="mr-2 h-5 w-5" />
              Hubungi Kami
            </Button>
          </motion.div>

          {/* Quick stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-16 grid grid-cols-3 gap-6 sm:gap-10 max-w-lg"
          >
            {[
              { value: '15+', label: 'Tahun Pengalaman' },
              { value: '50+', label: 'Negara Tujuan' },
              { value: '500+', label: 'Klien Puas' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-2xl sm:text-3xl font-bold text-amber-400">{stat.value}</p>
                <p className="text-xs sm:text-sm text-emerald-200 mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <ChevronDown className="h-6 w-6 text-white/60" />
        </motion.div>
      </motion.div>
    </section>
  )
}

// ─── Products Section ──────────────────────────────────
function ProductsSection({ products }: { products: Product[] }) {
  const [activeCategory, setActiveCategory] = useState<string>('all')

  const categories = ['all', ...Array.from(new Set(products.map((p) => p.category)))]

  const filteredProducts =
    activeCategory === 'all' ? products : products.filter((p) => p.category === activeCategory)

  return (
    <section id="products" className="py-20 sm:py-28 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <AnimatedSection className="text-center mb-12 sm:mb-16">
          <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 border-0 mb-4">
            <Package className="h-3.5 w-3.5 mr-1.5" />
            Produk Unggulan
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Produk Ekspor Paling Dicari
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Kami menyediakan berbagai komoditas unggulan Indonesia yang memenuhi standar kualitas internasional untuk kebutuhan pasar global.
          </p>
        </AnimatedSection>

        {/* Category filter */}
        <AnimatedSection delay={0.1} className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10 sm:mb-12">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={activeCategory === cat ? 'default' : 'outline'}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md'
                  : 'border-gray-300 text-gray-600 hover:border-emerald-300 hover:text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              {cat === 'all' ? (
                'Semua'
              ) : (
                <span className="flex items-center gap-1.5">
                  {categoryIcons[cat]}
                  {categoryLabels[cat] || cat}
                </span>
              )}
            </Button>
          ))}
        </AnimatedSection>

        {/* Products grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
          {filteredProducts.map((product, i) => (
            <AnimatedSection key={product.id} delay={i * 0.05}>
              <Card className="product-card group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col bg-white rounded-xl">
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                  <img
                    src={product.imageUrl || '/images/placeholder.jpg'}
                    alt={product.name}
                    className="product-card-image w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-white/90 text-emerald-700 border-0 backdrop-blur-sm text-xs font-medium">
                      {categoryLabels[product.category] || product.category}
                    </Badge>
                  </div>
                  {product.featured && (
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-amber-500 text-white border-0 text-xs font-medium">
                        <Star className="h-3 w-3 mr-1" />
                        Unggulan
                      </Badge>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <CardContent className="p-4 sm:p-5 flex-1 flex flex-col">
                  <div className="flex items-start gap-2 mb-2">
                    <div className="p-1.5 rounded-md bg-emerald-50 text-emerald-600 shrink-0 mt-0.5">
                      {productIconMap[product.slug] || <Package className="h-5 w-5" />}
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base leading-snug">
                      {product.name}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-3 flex-1">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div>
                      {product.price && (
                        <p className="text-sm font-bold text-emerald-700">{product.price}</p>
                      )}
                      {product.unit && (
                        <p className="text-xs text-gray-400">per {product.unit}</p>
                      )}
                    </div>
                    {product.origin && (
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <MapPin className="h-3 w-3" />
                        {product.origin}
                      </div>
                    )}
                  </div>
                </CardContent>

                <CardFooter className="p-4 pt-0">
                  <Button
                    onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
                    variant="ghost"
                    className="w-full text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 font-medium text-sm group/btn"
                  >
                    Minta Penawaran
                    <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </CardFooter>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Why Choose Us Section ─────────────────────────────
function AboutSection() {
  const features = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Jaminan Kualitas',
      desc: 'Setiap produk melewati proses quality control ketat sesuai standar internasional ISO, SNI, dan sertifikasi global.',
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: 'Harga Kompetitif',
      desc: 'Bermitra langsung dengan produsen lokal memungkinkan kami menawarkan harga terbaik tanpa mengorbankan kualitas.',
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: 'Pengiriman Tepat Waktu',
      desc: 'Jaringan logistik yang luas dan pengalaman 15+ tahun menjamin pengiriman tepat waktu ke 50+ negara.',
    },
    {
      icon: <FileCheck className="h-6 w-6" />,
      title: 'Dokumentasi Lengkap',
      desc: 'Kami menangani seluruh proses dokumentasi ekspor-impor termasuk sertifikat asal, phytosanitary, dan custom clearance.',
    },
    {
      icon: <Headphones className="h-6 w-6" />,
      title: 'Layanan 24/7',
      desc: 'Tim support profesional kami siap membantu Anda kapan saja, dari konsultasi hingga after-sales service.',
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: 'Jaringan Global',
      desc: 'Memiliki mitra dan agen di lebih dari 50 negara di Asia, Eropa, Amerika, Timur Tengah, dan Afrika.',
    },
  ]

  const stats = [
    { icon: <Ship className="h-8 w-8" />, value: 1200, suffix: '+', label: 'Pengiriman per Tahun' },
    { icon: <Users className="h-8 w-8" />, value: 500, suffix: '+', label: 'Klien Aktif' },
    { icon: <Globe className="h-8 w-8" />, value: 50, suffix: '+', label: 'Negara Tujuan' },
    { icon: <Award className="h-8 w-8" />, value: 98, suffix: '%', label: 'Tingkat Kepuasan' },
  ]

  return (
    <section id="about" className="py-20 sm:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats bar */}
        <AnimatedSection className="mb-16 sm:mb-20">
          <div className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-700 rounded-2xl p-6 sm:p-10 shadow-xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-xl mb-3 text-amber-400">
                    {stat.icon}
                  </div>
                  <p className="text-2xl sm:text-4xl font-bold text-white">
                    <Counter end={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="text-xs sm:text-sm text-emerald-200 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Section header */}
        <AnimatedSection className="text-center mb-12 sm:mb-16">
          <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 border-0 mb-4">
            <Award className="h-3.5 w-3.5 mr-1.5" />
            Mengapa Memilih Kami
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Keunggulan WeltBridge International
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Lebih dari 15 tahun pengalaman dalam perdagangan internasional menjadikan kami mitra terpercaya Anda.
          </p>
        </AnimatedSection>

        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {features.map((feature, i) => (
            <AnimatedSection key={i} delay={i * 0.08}>
              <Card className="h-full border border-gray-100 hover:border-emerald-200 shadow-sm hover:shadow-md transition-all duration-300 rounded-xl group">
                <CardContent className="p-6">
                  <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 inline-flex mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 text-lg mb-2">{feature.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
                </CardContent>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Testimonials Section ──────────────────────────────
function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <section id="testimonials" className="py-20 sm:py-28 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-12 sm:mb-16">
          <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 border-0 mb-4">
            <Star className="h-3.5 w-3.5 mr-1.5" />
            Testimoni Klien
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Dipercaya oleh Ratusan Klien Global
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Dengarkan langsung dari mitra bisnis kami yang telah merasakan layanan dan kualitas produk WeltBridge International.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {testimonials.map((t, i) => (
            <AnimatedSection key={t.id} delay={i * 0.1}>
              <Card className="h-full border-0 shadow-md hover:shadow-lg transition-shadow rounded-xl bg-white">
                <CardContent className="p-6">
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star
                        key={j}
                        className={`h-4 w-4 ${j < t.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 leading-relaxed mb-6 text-sm italic">
                    &ldquo;{t.message}&rdquo;
                  </p>
                  <Separator className="mb-4" />
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-semibold text-sm">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                      <p className="text-xs text-gray-500">
                        {t.role && `${t.role}, `}{t.company}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Contact / Inquiry Section ─────────────────────────
function ContactSection() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const form = e.currentTarget
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      company: (form.elements.namedItem('company') as HTMLInputElement).value,
      phone: (form.elements.namedItem('phone') as HTMLInputElement).value,
      product: (form.elements.namedItem('product') as HTMLInputElement).value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
    }

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) throw new Error('Failed to submit')

      setSent(true)
      toast({
        title: 'Inquiry Terkirim! ✅',
        description: 'Tim kami akan menghubungi Anda dalam 1x24 jam.',
      })
      form.reset()
    } catch {
      toast({
        title: 'Gagal Mengirim',
        description: 'Silakan coba lagi atau hubungi kami langsung.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  return (
    <section id="contact" className="py-20 sm:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-12 sm:mb-16">
          <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 border-0 mb-4">
            <Phone className="h-3.5 w-3.5 mr-1.5" />
            Hubungi Kami
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Dapatkan Penawaran Terbaik
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Kirimkan kebutuhan Anda dan tim kami akan merespons dalam waktu 1x24 jam dengan penawaran yang kompetitif.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <AnimatedSection className="lg:col-span-2 space-y-6" delay={0.1}>
            <Card className="border-0 shadow-md rounded-xl bg-gradient-to-br from-emerald-700 to-emerald-800 text-white">
              <CardContent className="p-6 sm:p-8">
                <h3 className="font-bold text-xl mb-6">Informasi Kontak</h3>
                <div className="space-y-5">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-white/10 rounded-lg shrink-0">
                      <MapPin className="h-5 w-5 text-amber-400" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Kantor Pusat</p>
                      <p className="text-emerald-200 text-sm">Gedung Niaga Lt. 12, Jl. Sudirman Kav. 52-53, Jakarta 12190, Indonesia</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-white/10 rounded-lg shrink-0">
                      <Phone className="h-5 w-5 text-amber-400" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Telepon</p>
                      <p className="text-emerald-200 text-sm">+62 21 5555 8888</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-white/10 rounded-lg shrink-0">
                      <Mail className="h-5 w-5 text-amber-400" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Email</p>
                      <p className="text-emerald-200 text-sm">trade@globalnusantara.co.id</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-white/10 rounded-lg shrink-0">
                      <Clock className="h-5 w-5 text-amber-400" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Jam Operasional</p>
                      <p className="text-emerald-200 text-sm">Senin - Jumat: 08:00 - 17:00 WIB</p>
                      <p className="text-emerald-200 text-sm">Sabtu: 08:00 - 12:00 WIB</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick guarantee badges */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: <Shield className="h-5 w-5" />, text: 'Legalitas Resmi' },
                { icon: <FileCheck className="h-5 w-5" />, text: 'Dokumen Lengkap' },
                { icon: <TrendingUp className="h-5 w-5" />, text: 'Harga Terbaik' },
                { icon: <Headphones className="h-5 w-5" />, text: 'Support 24/7' },
              ].map((badge, i) => (
                <div key={i} className="flex items-center gap-2 bg-emerald-50 p-3 rounded-lg">
                  <span className="text-emerald-600">{badge.icon}</span>
                  <span className="text-xs font-medium text-emerald-800">{badge.text}</span>
                </div>
              ))}
            </div>
          </AnimatedSection>

          {/* Contact Form */}
          <AnimatedSection className="lg:col-span-3" delay={0.2}>
            <Card className="border-0 shadow-md rounded-xl">
              <CardContent className="p-6 sm:p-8">
                {sent ? (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center p-4 bg-emerald-100 rounded-full mb-4">
                      <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Inquiry Berhasil Dikirim!</h3>
                    <p className="text-gray-500 mb-6">Tim kami akan menghubungi Anda dalam 1x24 jam kerja.</p>
                    <Button
                      onClick={() => setSent(false)}
                      variant="outline"
                      className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                    >
                      Kirim Inquiry Lagi
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                          Nama Lengkap <span className="text-red-500">*</span>
                        </Label>
                        <Input id="name" name="name" required placeholder="John Doe" className="rounded-lg" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                          Email <span className="text-red-500">*</span>
                        </Label>
                        <Input id="email" name="email" type="email" required placeholder="john@company.com" className="rounded-lg" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="company" className="text-sm font-medium text-gray-700">
                          Nama Perusahaan
                        </Label>
                        <Input id="company" name="company" placeholder="PT. Contoh Indonesia" className="rounded-lg" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                          Nomor Telepon
                        </Label>
                        <Input id="phone" name="phone" type="tel" placeholder="+62 812 3456 7890" className="rounded-lg" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="product" className="text-sm font-medium text-gray-700">
                        Produk yang Diminati
                      </Label>
                      <Input id="product" name="product" placeholder="Cth: Kelapa Sawit, Kopi, Rempah" className="rounded-lg" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-sm font-medium text-gray-700">
                        Pesan / Detail Kebutuhan <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        required
                        rows={4}
                        placeholder="Jelaskan kebutuhan Anda termasuk volume, spesifikasi, dan tujuan pengiriman..."
                        className="rounded-lg resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-6 rounded-xl shadow-md shadow-emerald-600/20 transition-all hover:shadow-lg hover:shadow-emerald-600/30"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Mengirim...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-5 w-5" />
                          Kirim Inquiry
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>
      </div>
    </section>
  )
}

// ─── Footer ────────────────────────────────────────────
function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 500)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <footer className="bg-gray-900 text-gray-300 relative">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company info */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-600 rounded-lg">
                <Ship className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">WeltBridge International</h3>
                <p className="text-xs text-gray-500 tracking-wider uppercase">Export & Import</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Perusahaan ekspor-impor terkemuka yang menghubungkan produk berkualitas tinggi Indonesia dengan pasar global sejak 2008.
            </p>
            <div className="flex gap-3">
              {['LinkedIn', 'Twitter', 'Facebook'].map((social) => (
                <div key={social} className="p-2 bg-gray-800 rounded-lg hover:bg-emerald-600 transition-colors cursor-pointer">
                  <Globe className="h-4 w-4" />
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Navigasi</h4>
            <ul className="space-y-2.5">
              {[
                { href: '#home', label: 'Beranda' },
                { href: '#products', label: 'Produk' },
                { href: '#about', label: 'Tentang Kami' },
                { href: '#testimonials', label: 'Testimoni' },
                { href: '#contact', label: 'Kontak' },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-emerald-400 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-semibold text-white mb-4">Produk Utama</h4>
            <ul className="space-y-2.5">
              {['Kelapa Sawit', 'Kopi', 'Rempah & Bumbu', 'Batik', 'Hasil Laut', 'Kakao'].map((product) => (
                <li key={product}>
                  <a href="#products" className="text-sm text-gray-400 hover:text-emerald-400 transition-colors">
                    {product}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">Kontak</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm">
                <MapPin className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-gray-400">Jakarta, Indonesia</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-emerald-400 shrink-0" />
                <span className="text-gray-400">+62 21 5555 8888</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-emerald-400 shrink-0" />
                <span className="text-gray-400">trade@globalnusantara.co.id</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} WeltBridge International. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="hover:text-gray-300 cursor-pointer">Kebijakan Privasi</span>
            <span>•</span>
            <span className="hover:text-gray-300 cursor-pointer">Syarat & Ketentuan</span>
          </div>
        </div>
      </div>

      {/* Scroll to top */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-lg transition-all z-40"
        >
          <ChevronUp className="h-5 w-5" />
        </button>
      )}
    </footer>
  )
}

// ─── Main Page ─────────────────────────────────────────
export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [productsRes, testimonialsRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/testimonials'),
        ])
        const productsData = await productsRes.json()
        const testimonialsData = await testimonialsRes.json()
        setProducts(productsData.products || [])
        setTestimonials(testimonialsData.testimonials || [])
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        <HeroSection />
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="h-8 w-8 text-emerald-600 animate-spin" />
          </div>
        ) : (
          <>
            <ProductsSection products={products} />
            <AboutSection />
            <TestimonialsSection testimonials={testimonials} />
            <ContactSection />
          </>
        )}
      </main>
      <Footer />
    </div>
  )
}

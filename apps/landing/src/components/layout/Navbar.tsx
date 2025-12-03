import React, { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '../ui/Button'

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/50 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center cursor-pointer">
          <img
            src="/logo1.svg"
            alt="Valorize"
            className="h-8 w-auto"
          />
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <a
            href="#features"
            className="text-sm font-medium text-zinc-100 hover:text-valorize-400 transition-colors"
          >
            Como Funciona
          </a>
          <a
            href="#gamification"
            className="text-sm font-medium text-zinc-100 hover:text-valorize-400 transition-colors"
          >
            Gamificação
          </a>
          <a
            href="#pricing"
            className="text-sm font-medium text-zinc-100 hover:text-valorize-400 transition-colors"
          >
            Preços
          </a>
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href="#"
            className="text-sm font-medium text-white hover:text-valorize-400 transition-colors"
          >
            Login
          </a>
          <Button size="sm" onClick={() => (window.location.href = '#contact')}>
            Agendar Demo
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden absolute top-full left-0 w-full bg-zinc-900/95 backdrop-blur-lg border-b border-zinc-800 shadow-2xl overflow-hidden"
          >
            <div className="p-6 flex flex-col gap-2">
              {[
                { href: '#features', label: 'Como Funciona' },
                { href: '#gamification', label: 'Gamificação' },
                { href: '#pricing', label: 'Preços' },
              ].map((link, index) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-base font-medium text-zinc-100 hover:text-valorize-400 transition-colors py-3 px-4 rounded-lg hover:bg-zinc-800/50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="h-px bg-zinc-800 my-3"
              />
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Button className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
                  Agendar Demo
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

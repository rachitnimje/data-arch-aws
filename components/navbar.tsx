"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { ContactModal } from "./contact-modal"

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services" },
  { name: "Careers", href: "/careers" },
  { name: "Blogs", href: "/blogs" },
  { name: "About", href: "/about" },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [contactModalOpen, setContactModalOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setContactModalOpen(true)
    setMobileMenuOpen(false)
  }

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(href)
  }

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out",
          isScrolled ? "bg-white/90 backdrop-blur-md shadow-md py-4" : "gradient-bg py-5",
        )}
      >
        <div className="container mx-auto px-4 sm:px-6 md:px-8 flex justify-between items-center">
          <Link href="/" className="text-xl sm:text-2xl font-bold">
            <span className={isScrolled ? "gradient-text" : "text-white"}>DataArch</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-4 lg:space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={link.isContact ? handleContactClick : undefined}
                className={cn(
                  "transition-colors relative group pb-1 text-sm lg:text-base",
                  // Base styles for non-active links
                  isScrolled ? "text-gray-600 hover:text-purple-DEFAULT" : "text-white hover:text-blue-light",

                  // Active link styles
                  isActive(link.href) && (isScrolled ? "!text-purple-dark font-bold" : "text-black font-semibold"),
                )}
              >
                {link.name}

                {/* Underline for non-scrolled active state */}
                {isActive(link.href) && !isScrolled && (
                  <span className="absolute bottom-0 left-0 h-0.5 w-full bg-black" />
                )}

                {/* Hover underline */}
                {!isActive(link.href) && (
                  <span
                    className={cn(
                      "absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full",
                      isScrolled
                        ? "bg-purple-DEFAULT group-hover:bg-purple-DEFAULT"
                        : "bg-white group-hover:bg-blue-light",
                    )}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className={`md:hidden ${isScrolled ? "text-gray-800" : "text-white"}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden bg-white/95 absolute top-full left-0 right-0 p-4 animate-fade-in shadow-lg">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={link.isContact ? handleContactClick : () => setMobileMenuOpen(false)}
                  className={cn(
                    "text-gray-800 hover:text-purple-DEFAULT transition-colors py-2 border-b border-gray-200 relative",
                    isActive(link.href) && "text-black font-medium",
                    isActive(link.href) &&
                      "after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-black",
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </header>

      <ContactModal isOpen={contactModalOpen} onClose={() => setContactModalOpen(false)} />
    </>
  )
}

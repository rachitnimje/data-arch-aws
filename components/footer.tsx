import Link from "next/link"
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from "lucide-react"

const companyLinks = [
  { name: "About Us", href: "/about" },
  { name: "Team", href: "/team" },
  { name: "Careers", href: "/careers" },
  { name: "Blogs", href: "/blogs" },
]

const socialLinks = [
  { name: "LinkedIn", href: "https://linkedin.com", icon: <Linkedin size={18} /> },
  { name: "Twitter", href: "https://twitter.com", icon: <Twitter size={18} /> },
  { name: "Instagram", href: "https://instagram.com", icon: <Instagram size={18} /> },
  { name: "Facebook", href: "https://facebook.com", icon: <Facebook size={18} /> },
]

export function Footer() {
  return (
    <footer className="footer-gradient text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <div className="col-span-1">
            <Link href="/" className="text-xl sm:text-2xl font-bold mb-4 inline-block">
              <span className="gradient-text">DataArch</span>
            </Link>
            <p className="text-sm mt-2 text-gray-800">Helping data-driven businesses unlock greater value</p>

            <div className="mt-6 space-y-3">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-800 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-800">New Sanghavi Pimpri-Chinchwad, Maharashtra 411027</p>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-gray-800 mr-2" />
                <a href="tel:+919960743850" className="text-sm text-gray-800 hover:text-purple-dark transition-colors">
                  +91-9960743850
                </a>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-gray-800 mr-2" />
                <a
                  href="mailto:sales@dataarch.co"
                  className="text-sm text-gray-800 hover:text-purple-dark transition-colors"
                >
                  sales@dataarch.co
                </a>
              </div>
            </div>
          </div>

          <div className="col-span-1">
            <h3 className="font-bold text-lg mb-4 text-gray-800">Company</h3>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-800 hover:text-purple-dark transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="font-bold text-lg mb-4 text-gray-800">Connect</h3>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-gray-800 hover:text-purple-dark transition-colors p-2 bg-white/50 rounded-full"
                  aria-label={link.name}
                >
                  {link.icon}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800/20 mt-12 pt-6 text-center text-sm text-gray-800 max-w-7xl mx-auto">
          <p>© {new Date().getFullYear()} DataArch. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

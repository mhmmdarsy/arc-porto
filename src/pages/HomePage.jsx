// src/pages/HomePage.jsx
import CardNav from '../components/CardNav'
import Aurora from '../components/Aurora'
import logo from '../assets/react.svg'

export default function HomePage() {
  const items = [
    {
      label: 'About',
      bgColor: '#0D0716',
      textColor: '#fff',
      links: [
        { label: 'Company', href: '#about', ariaLabel: 'About Company' },
        { label: 'Careers', href: '#careers', ariaLabel: 'About Careers' }
      ]
    },
    {
      label: 'Projects',
      bgColor: '#170D27',
      textColor: '#fff',
      links: [
        { label: 'Featured', href: '#projects', ariaLabel: 'Featured Projects' },
        { label: 'Case Studies', href: '#cases', ariaLabel: 'Project Case Studies' }
      ]
    },
    {
      label: 'Contact',
      bgColor: '#271E37',
      textColor: '#fff',
      links: [
        { label: 'Email', href: 'mailto:info@example.com', ariaLabel: 'Email us' },
        { label: 'Twitter', href: 'https://twitter.com', ariaLabel: 'Twitter' },
        { label: 'LinkedIn', href: 'https://linkedin.com', ariaLabel: 'LinkedIn' }
      ]
    }
  ]

  return (
    <div className="relative min-h-screen bg-gray-900 flex items-start justify-center pt-16 pb-10 overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-80 z-0">
        <Aurora
          colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
          blend={0.5}
          amplitude={1.0}
          speed={0.5}
        />
      </div>

      <CardNav
        logo={logo}
        logoAlt="Company Logo"
        items={items}
        baseColor="#fff"
        menuColor="#000"
        buttonBgColor="#111"
        buttonTextColor="#fff"
        ease="power3.out"
      />
    </div>
  )
}

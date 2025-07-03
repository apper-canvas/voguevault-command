import React from 'react';
import { Link } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';

const Footer = () => {
  const footerSections = [
    {
      title: 'Shop',
      links: [
        { name: 'Women', href: '/category/women' },
        { name: 'Men', href: '/category/men' },
        { name: 'Accessories', href: '/category/accessories' },
        { name: 'New Arrivals', href: '/search?featured=true' }
      ]
    },
    {
      title: 'Customer Care',
      links: [
        { name: 'Size Guide', href: '#' },
        { name: 'Shipping Info', href: '#' },
        { name: 'Returns', href: '#' },
        { name: 'Contact Us', href: '#' }
      ]
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '#' },
        { name: 'Careers', href: '#' },
        { name: 'Press', href: '#' },
        { name: 'Sustainability', href: '#' }
      ]
    }
  ];

  const socialLinks = [
    { name: 'Instagram', icon: 'Instagram', href: '#' },
    { name: 'Facebook', icon: 'Facebook', href: '#' },
    { name: 'Twitter', icon: 'Twitter', href: '#' },
    { name: 'Pinterest', icon: 'MessageSquare', href: '#' }
  ];

  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-white text-black p-2 rounded-lg">
                <ApperIcon name="Diamond" size={24} />
              </div>
              <span className="font-display text-2xl font-bold">
                VogueVault
              </span>
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed">
              Discover timeless elegance and contemporary style. 
              Your destination for luxury fashion and curated collections.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition-colors"
                  aria-label={social.name}
                >
                  <ApperIcon name={social.icon} size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title} className="space-y-4">
              <h3 className="font-semibold text-lg">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-gray-300 hover:text-white transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="max-w-md mx-auto text-center lg:text-left lg:max-w-none lg:flex lg:items-center lg:justify-between">
            <div className="lg:flex-1">
              <h3 className="text-lg font-semibold mb-2">Stay in Style</h3>
              <p className="text-gray-300 text-sm mb-4 lg:mb-0">
                Subscribe to get special offers, free giveaways, and exclusive deals.
              </p>
            </div>
            <div className="lg:flex-1 lg:max-w-md lg:ml-8">
              <div className="flex space-x-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-white text-white placeholder-gray-400"
                />
                <button className="bg-accent hover:bg-white hover:text-black px-6 py-2 rounded-lg font-medium transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-gray-400 text-sm">
            © 2024 VogueVault. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm">
            <Link to="#" className="text-gray-400 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="#" className="text-gray-400 hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link to="#" className="text-gray-400 hover:text-white transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
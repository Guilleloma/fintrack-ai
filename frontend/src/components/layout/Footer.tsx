import React from 'react';
import { Link } from 'react-router-dom';

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className }) => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className={`bg-white border-t border-gray-200 ${className || ''}`}>
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:justify-start space-x-6">
            <Link to="/about" className="text-gray-500 hover:text-gray-700">
              Acerca de
            </Link>
            <Link to="/privacy" className="text-gray-500 hover:text-gray-700">
              Privacidad
            </Link>
            <Link to="/terms" className="text-gray-500 hover:text-gray-700">
              Términos
            </Link>
            <Link to="/contact" className="text-gray-500 hover:text-gray-700">
              Contacto
            </Link>
          </div>
          <div className="mt-8 md:mt-0">
            <p className="text-center md:text-right text-sm text-gray-500">
              &copy; {currentYear} FinTrack AI. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

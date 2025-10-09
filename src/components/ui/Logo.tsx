
import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Logo = ({ size = 'md', className = '' }: LogoProps) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12'
  };

  const iconSizes = {
    sm: '16px',
    md: '20px',
    lg: '28px'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <img
        src="/previa-logo.svg"
        alt="Previa Logo"
        className={sizeClasses[size]}
        style={{ objectFit: 'contain' }}
      />
    </div>
  );
};

export default Logo;

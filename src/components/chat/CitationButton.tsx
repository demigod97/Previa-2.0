/**
 * Citation button for financial data references
 * Adapted from PolicyAI with Previa design system
 */

import React from 'react';
import { Button } from '@/components/chakra-ui/button';

interface CitationButtonProps {
  chunkIndex: number;
  onClick: () => void;
  className?: string;
}

const CitationButton = ({ chunkIndex, onClick, className = '' }: CitationButtonProps) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className={`inline-flex items-center justify-center w-6 h-6 p-0 ml-1 text-xs font-medium text-darkStone border-sand hover:bg-sand hover:border-darkStone rounded-full ${className}`}
    >
      {chunkIndex + 1}
    </Button>
  );
};

export default CitationButton;

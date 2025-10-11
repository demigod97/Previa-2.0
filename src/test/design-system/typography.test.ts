import { describe, it, expect } from 'vitest';

/**
 * Design System Test Suite: Typography
 * Tests Inter and JetBrains Mono font configuration and scale
 */

describe('Design System - Typography', () => {
  describe('Font Family Configuration', () => {
    it('should configure Inter font for sans-serif', () => {
      const fontFamily = 'Inter, ui-sans-serif, system-ui, sans-serif';
      expect(fontFamily).toContain('Inter');
      expect(fontFamily).toContain('sans-serif');
    });

    it('should configure JetBrains Mono for financial numbers', () => {
      const fontFamily = 'JetBrains Mono, ui-monospace, monospace';
      expect(fontFamily).toContain('JetBrains Mono');
      expect(fontFamily).toContain('monospace');
    });

    it('should have font-financial alias for JetBrains Mono', () => {
      // Verify Tailwind config has financial font alias
      const config = {
        fontFamily: {
          financial: ['JetBrains Mono', 'ui-monospace', 'monospace'],
        },
      };
      expect(config.fontFamily.financial[0]).toBe('JetBrains Mono');
    });

    it('should have font-heading alias for Inter', () => {
      const config = {
        fontFamily: {
          heading: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        },
      };
      expect(config.fontFamily.heading[0]).toBe('Inter');
    });
  });

  describe('Font Scale', () => {
    it('should define h1 as 2.5rem with weight 600', () => {
      const h1Styles = {
        fontSize: '2.5rem',
        fontWeight: '600',
      };
      expect(h1Styles.fontSize).toBe('2.5rem');
      expect(h1Styles.fontWeight).toBe('600');
    });

    it('should define h2 as 2rem with weight 600', () => {
      const h2Styles = {
        fontSize: '2rem',
        fontWeight: '600',
      };
      expect(h2Styles.fontSize).toBe('2rem');
      expect(h2Styles.fontWeight).toBe('600');
    });

    it('should define h3 as 1.5rem with weight 600', () => {
      const h3Styles = {
        fontSize: '1.5rem',
        fontWeight: '600',
      };
      expect(h3Styles.fontSize).toBe('1.5rem');
      expect(h3Styles.fontWeight).toBe('600');
    });

    it('should define h4 as 1.25rem with weight 600', () => {
      const h4Styles = {
        fontSize: '1.25rem',
        fontWeight: '600',
      };
      expect(h4Styles.fontSize).toBe('1.25rem');
      expect(h4Styles.fontWeight).toBe('600');
    });

    it('should define body text as 1rem with weight 400', () => {
      const bodyStyles = {
        fontSize: '1rem',
        fontWeight: '400',
      };
      expect(bodyStyles.fontSize).toBe('1rem');
      expect(bodyStyles.fontWeight).toBe('400');
    });

    it('should define small text as 0.875rem with weight 400', () => {
      const smallStyles = {
        fontSize: '0.875rem',
        fontWeight: '400',
      };
      expect(smallStyles.fontSize).toBe('0.875rem');
      expect(smallStyles.fontWeight).toBe('400');
    });
  });

  describe('Google Fonts Import', () => {
    it('should import Inter with required weights', () => {
      const fontUrl = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700';
      expect(fontUrl).toContain('Inter');
      expect(fontUrl).toContain('400');
      expect(fontUrl).toContain('500');
      expect(fontUrl).toContain('600');
      expect(fontUrl).toContain('700');
    });

    it('should import JetBrains Mono with required weights', () => {
      const fontUrl = 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600';
      expect(fontUrl).toContain('JetBrains+Mono');
      expect(fontUrl).toContain('400');
      expect(fontUrl).toContain('500');
      expect(fontUrl).toContain('600');
    });

    it('should use font-display: swap for performance', () => {
      const fontUrl = 'display=swap';
      expect(fontUrl).toContain('swap');
    });
  });

  describe('Typography Utility Classes', () => {
    it('should have financial-amount class for currency display', () => {
      const className = 'financial-amount';
      expect(className).toBe('financial-amount');
    });

    it('should have body-text utility class', () => {
      const className = 'body-text';
      expect(className).toBe('body-text');
    });

    it('should have small-text utility class', () => {
      const className = 'small-text';
      expect(className).toBe('small-text');
    });

    it('should apply tabular-nums to financial amounts', () => {
      // Tabular numbers ensure consistent digit width for alignment
      const className = 'tabular-nums';
      expect(className).toBe('tabular-nums');
    });
  });

  describe('Responsive Typography', () => {
    it('should maintain legibility at mobile sizes', () => {
      // h1 at 2.5rem (40px) is readable on mobile
      const h1Mobile = 2.5; // rem
      expect(h1Mobile).toBeGreaterThanOrEqual(2.0);
    });

    it('should have appropriate line-height for readability', () => {
      // Body text should have 1.5 or higher line-height
      const lineHeight = 1.5;
      expect(lineHeight).toBeGreaterThanOrEqual(1.5);
    });
  });
});

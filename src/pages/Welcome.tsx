import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileText, Zap, BarChart3 } from 'lucide-react';
import Logo from '@/components/ui/Logo';

interface BenefitCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function BenefitCard({ icon, title, description }: BenefitCardProps) {
  return (
    <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm border border-sand">
      <div className="mb-4 p-3 rounded-full bg-sand">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-charcoal mb-2">{title}</h3>
      <p className="text-sm text-stone">{description}</p>
    </div>
  );
}

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-4">
      {/* Logo */}
      <div className="mb-8">
        <Logo size="xl" />
      </div>

      {/* Headline */}
      <h1 className="text-4xl md:text-5xl font-bold text-charcoal mb-4 text-center">
        Welcome to Previa
      </h1>
      <p className="text-xl md:text-2xl text-stone mb-12 text-center max-w-2xl">
        AI-driven financial intelligence for Australian freelancers
      </p>

      {/* Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12 max-w-5xl w-full px-4">
        <BenefitCard
          icon={<FileText className="w-8 h-8 text-charcoal" />}
          title="Smart Document Processing"
          description="Upload bank statements and receipts, AI extracts the data automatically"
        />
        <BenefitCard
          icon={<Zap className="w-8 h-8 text-charcoal" />}
          title="Automated Reconciliation"
          description="AI matches transactions to receipts automatically, saving you hours"
        />
        <BenefitCard
          icon={<BarChart3 className="w-8 h-8 text-charcoal" />}
          title="Real-Time Insights"
          description="Dashboard shows spending patterns, income trends, and financial health"
        />
      </div>

      {/* CTA */}
      <Button
        size="lg"
        onClick={() => navigate('/auth')}
        className="bg-charcoal hover:bg-darkStone text-cream font-semibold px-8 py-6 text-lg min-h-[44px] min-w-[160px]"
      >
        Get Started
      </Button>

      {/* Legal Footer */}
      <footer className="mt-16 text-sm text-stone">
        <a href="/privacy" className="hover:underline hover:text-charcoal transition-colors">
          Privacy Policy
        </a>
        {' · '}
        <a href="/terms" className="hover:underline hover:text-charcoal transition-colors">
          Terms of Service
        </a>
      </footer>
    </div>
  );
}

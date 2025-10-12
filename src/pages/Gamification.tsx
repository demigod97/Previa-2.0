// Australian Financial Literacy Gamification Page
// Main dashboard for points, badges, challenges, and educational tips

import { Sidebar, TopBar } from '@/components/layout';
import { PointsLevelCard } from '@/components/gamification/PointsLevelCard';
import { AustralianBadgeShowcase } from '@/components/gamification/AustralianBadgeShowcase';
import { AustralianTipOfTheDay } from '@/components/gamification/AustralianTipOfTheDay';
import { ActiveChallenges } from '@/components/gamification/ActiveChallenges';
import { Trophy, BookOpen } from 'lucide-react';

export default function Gamification() {
  return (
    <div className="flex h-screen bg-cream">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64 md:ml-20 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <TopBar />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-paper p-4 md:p-8 pb-20 md:pb-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Trophy className="h-8 w-8 text-gold" />
              <h1 className="text-3xl md:text-4xl font-bold text-charcoal">
                My Progress
              </h1>
            </div>
        <p className="text-stone text-sm md:text-base">
          Track your Australian financial literacy journey, earn badges, and master money
          management skills
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Points & Badges (2/3 width on desktop) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Points & Level Card */}
          <PointsLevelCard />

          {/* Badge Showcase */}
          <AustralianBadgeShowcase />
        </div>

        {/* Right Column: Challenges & Tips (1/3 width on desktop) */}
        <div className="space-y-6">
          {/* Active Challenges */}
          <ActiveChallenges />

          {/* Tip of the Day */}
          <AustralianTipOfTheDay />
        </div>
      </div>

      {/* Educational Modules Teaser (Future Enhancement) */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-3">
          <BookOpen className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-bold text-charcoal">
            🇦🇺 Australian Financial Education Modules
          </h2>
        </div>
        <p className="text-sm text-stone mb-4">
          Master Australian financial concepts with interactive learning modules on Superannuation,
          Taxation, Banking, Consumer Rights, and Scam Prevention. Coming soon!
        </p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { name: 'Aussie Super Star', icon: '⭐', color: 'bg-yellow-100' },
            { name: 'Tax Ninja', icon: '🧾', color: 'bg-blue-100' },
            { name: 'Banking Pro', icon: '🏦', color: 'bg-green-100' },
            { name: 'Consumer Champion', icon: '🛡️', color: 'bg-purple-100' },
            { name: 'Scam Spotter', icon: '🚨', color: 'bg-red-100' },
          ].map((module) => (
            <div
              key={module.name}
              className={`${module.color} border-2 border-stone/20 rounded-lg p-3 text-center opacity-60`}
            >
              <div className="text-3xl mb-1">{module.icon}</div>
              <p className="text-xs font-semibold text-charcoal">{module.name}</p>
              <p className="text-xs text-stone mt-1">Locked</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-8 text-center text-xs text-stone">
        <p>
          💡 Previa gamification is designed for Australian users and aligned with ASIC
          MoneySmart and ATO guidelines.
        </p>
        <p className="mt-1">
          🇦🇺 All tips, badges, and challenges are specific to the Australian financial system.
        </p>
      </div>
        </main>
      </div>
    </div>
  );
}

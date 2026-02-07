'use client';

import { Header } from '@/components/layout/header';
import { Hero } from '@/components/landing/Hero';
import { TrustIndicators } from '@/components/landing/TrustIndicators';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { TransparencyShowcase } from '@/components/landing/TransparencyShowcase';
import { FeaturesGrid } from '@/components/landing/FeaturesGrid';
import { DashboardPreview } from '@/components/landing/DashboardPreview';
import { PerformanceMetrics } from '@/components/landing/PerformanceMetrics';
import { CtaSection } from '@/components/landing/CtaSection';
import { Footer } from '@/components/landing/Footer';

export default function Home() {
    return (
        <div className="min-h-screen bg-background">
            <Header />

            {/* Landing Page Sections */}
            <main>
                <Hero />
                <TrustIndicators />
                <HowItWorks />
                <TransparencyShowcase />
                <FeaturesGrid />
                <DashboardPreview />
                <PerformanceMetrics />
                <CtaSection />
            </main>

            <Footer />
        </div>
    );
}

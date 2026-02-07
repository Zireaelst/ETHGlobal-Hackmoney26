"use client";

import Link from "next/link";
import { ArrowRight, Brain } from "lucide-react";
import { Lamp } from "@/components/aceternity/lamp";
import { Button } from "@/components/ui/button";

export function CtaSection() {
    return (
        <section className="relative">
            <Lamp className="bg-background">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center mb-4 tracking-tight">
                    Start Your Autonomous
                    <br />
                    <span className="gradient-text">Portfolio Today</span>
                </h2>

                <p className="text-lg text-zinc-400 text-center max-w-xl mx-auto mb-8">
                    Join the future of DeFi. No custody required.
                    <br />
                    Your keys, your agents, your profits.
                </p>

                <div className="flex flex-wrap justify-center gap-4">
                    <Link href="/agents">
                        <Button size="lg" className="group">
                            <Brain className="w-5 h-5" />
                            Create Your Agent
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </Link>

                    <Button variant="outline" size="lg">
                        Read Documentation
                    </Button>
                </div>
            </Lamp>
        </section>
    );
}

import React from 'react';
import { Truck, Warehouse, ClipboardCheck, Database, LayoutGrid } from 'lucide-react';
import { Section, Heading, Text, GlassCard, Button } from '../components/UiKit';

export const WhatIDo: React.FC = () => {
  const services = [
    {
      icon: <Truck className="w-8 h-8 text-blue-400" />,
      title: "Logistics & Yard Management",
      desc: "Track vehicles, manage loading bays, and digitize gate logs. replace paper checklists with tablets."
    },
    {
      icon: <Warehouse className="w-8 h-8 text-indigo-400" />,
      title: "Facilities & Asset Tracking",
      desc: "QR code scanning for assets, maintenance logs, and defect reporting directly from the shop floor."
    },
    {
      icon: <ClipboardCheck className="w-8 h-8 text-teal-400" />,
      title: "Safety & Compliance",
      desc: "Digital audits, near-miss reporting, and automated incident workflows. Ensure you are always audit-ready."
    },
    {
      icon: <Database className="w-8 h-8 text-purple-400" />,
      title: "Data Consolidation",
      desc: "Stop copying data between sheets. Create a single source of truth that connects to your existing systems."
    }
  ];

  return (
    <>
      <Section className="pt-32">
        <Heading level={1} className="mb-6">What I Do</Heading>
        <Text size="lg" className="max-w-3xl mb-16">
          I build custom operational tools. Unlike generic software, these are tailored to your specific facility processes, vocabulary, and pain points.
        </Text>

        <div className="grid md:grid-cols-2 gap-6">
          {services.map((s, i) => (
            <GlassCard key={i} delay={i * 0.1} className="h-full">
              <div className="mb-6 p-3 bg-white/5 rounded-lg inline-block border border-white/10">
                {s.icon}
              </div>
              <Heading level={3} className="mb-3">{s.title}</Heading>
              <Text>{s.desc}</Text>
            </GlassCard>
          ))}
        </div>
      </Section>

      <Section className="bg-white/[0.02]">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <Heading level={2} className="mb-4">Why custom apps?</Heading>
            <Text className="mb-6">
              Off-the-shelf software is often too expensive and too rigid. Excel is too risky. 
              Low-code apps hit the sweet spot: fast to build, easy to change, and robust enough for enterprise use.
            </Text>
            <div className="grid grid-cols-2 gap-4">
               <div className="border-l-2 border-primary pl-4">
                  <div className="text-white font-semibold">Speed</div>
                  <div className="text-sm text-slate-400">Deployed in weeks</div>
               </div>
               <div className="border-l-2 border-primary pl-4">
                  <div className="text-white font-semibold">Cost</div>
                  <div className="text-sm text-slate-400">Fraction of traditional dev</div>
               </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-slate-900 to-black p-8 rounded-2xl border border-white/10">
             <div className="flex items-center gap-3 mb-6">
                <LayoutGrid className="text-primary" />
                <span className="text-white font-medium">Tech Stack Strategy</span>
             </div>
             <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded bg-white/5 border border-white/5">
                   <span className="text-slate-300">Frontend</span>
                   <span className="text-white font-medium">Mobile-First (AppSheet/React)</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded bg-white/5 border border-white/5">
                   <span className="text-slate-300">Database</span>
                   <span className="text-white font-medium">Google Sheets / SQL</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded bg-white/5 border border-white/5">
                   <span className="text-slate-300">Automation</span>
                   <span className="text-white font-medium">Webhooks & API Integrations</span>
                </div>
             </div>
          </div>
        </div>
      </Section>
    </>
  );
};
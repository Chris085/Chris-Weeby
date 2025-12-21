import React from 'react';
import { Search, PenTool, Hammer, Rocket } from 'lucide-react';
import { Section, Heading, Text, GlassCard } from '../components/UiKit';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: <Search />,
      title: "1. Review & Audit",
      desc: "You send me the problem spreadsheet. We jump on a 30-min call. I don't just look at the columns; I ask about the people using it and the physical process it supports."
    },
    {
      icon: <PenTool />,
      title: "2. Prototype Design",
      desc: "I design the data structure and a clickable prototype. We focus on the user interface for the person on the ground—big buttons, simple flows, minimal typing."
    },
    {
      icon: <Hammer />,
      title: "3. Build & Iterate",
      desc: "I build the functional app. You get access early. We iterate fast based on real feedback. \"Can we make this button red?\" \"Can this field auto-calculate?\" Yes."
    },
    {
      icon: <Rocket />,
      title: "4. Deploy & Handover",
      desc: "We go live. I configure permissions, set up automated reports, and provide training documentation. You own the app; no vendor lock-in."
    }
  ];

  return (
    <Section className="pt-32">
      <div className="text-center max-w-2xl mx-auto mb-20">
        <Heading level={1} className="mb-6">How It Works</Heading>
        <Text size="lg">
          No jargon, no 6-month consulting contracts. Just a pragmatic process to get from "broken spreadsheet" to "working app".
        </Text>
      </div>

      <div className="relative">
        {/* Connection Line (Desktop) */}
        <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/0 via-primary/30 to-primary/0 -translate-x-1/2" />

        <div className="space-y-12 lg:space-y-24">
          {steps.map((step, index) => (
            <div key={index} className={`flex flex-col lg:flex-row items-center gap-8 lg:gap-16 ${index % 2 === 0 ? 'lg:flex-row-reverse' : ''}`}>
              
              {/* Text Side */}
              <div className="flex-1 text-center lg:text-left">
                 <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/5 border border-white/10 text-primary mb-4 lg:hidden">
                    {step.icon}
                 </div>
                 <Heading level={3} className="mb-4 text-primary">{step.title}</Heading>
                 <Text>{step.desc}</Text>
              </div>

              {/* Icon/Timeline Node */}
              <div className="hidden lg:flex relative items-center justify-center w-16 h-16 shrink-0">
                 <div className="absolute w-16 h-16 bg-dark-bg border border-primary/30 rounded-full z-10 flex items-center justify-center text-primary shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                    {step.icon}
                 </div>
              </div>

              {/* Card Side */}
              <div className="flex-1 w-full">
                <GlassCard className="h-full flex items-center justify-center min-h-[160px] border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent">
                   <div className="text-center opacity-30">
                      <span className="font-mono text-sm tracking-widest uppercase">Phase 0{index + 1}</span>
                   </div>
                </GlassCard>
              </div>

            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};
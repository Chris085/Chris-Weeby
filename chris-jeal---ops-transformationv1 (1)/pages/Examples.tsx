import React from 'react';
import { Section, Heading, Text, GlassCard } from '../components/UiKit';
import { Package, Clipboard, Truck, AlertTriangle } from 'lucide-react';

export const Examples: React.FC = () => {
  const examples = [
    {
      title: "Warehouse Incident Reporter",
      icon: <AlertTriangle className="text-amber-400" />,
      desc: "Captures photos, location, and witness statements. Triggers instant alerts to H&S team.",
      tags: ["Safety", "Mobile", "Notifications"]
    },
    {
      title: "Inbound Logistics Tracker",
      icon: <Truck className="text-blue-400" />,
      desc: "Dashboard for gatehouse staff to schedule and log arrivals. Calculates turnaround times automatically.",
      tags: ["Logistics", "Dashboard", "Calendar"]
    },
    {
      title: "Asset Maintenance Log",
      icon: <Clipboard className="text-green-400" />,
      desc: "Scan QR code on machine > see history > log service. No more lost paper cards.",
      tags: ["Facilities", "QR Scanning", "History"]
    },
    {
      title: "Stock Request Portal",
      icon: <Package className="text-purple-400" />,
      desc: "Internal shop for staff to request PPE and consumables. Managers approve in one click.",
      tags: ["Inventory", "Approvals", "Email"]
    }
  ];

  return (
    <Section className="pt-32">
       <Heading level={1} className="mb-6">Example Apps</Heading>
       <Text size="lg" className="max-w-3xl mb-16">
         These aren't hypothetical. These are the types of tools I build to replace complex spreadsheets.
         Clean, simple, and mobile-ready.
       </Text>

       <div className="grid md:grid-cols-2 gap-8">
          {examples.map((app, i) => (
             <GlassCard key={i} delay={i * 0.1} className="group cursor-default">
                <div className="flex items-start justify-between mb-6">
                   <div className="p-3 rounded-lg bg-white/5 border border-white/10 group-hover:bg-primary/20 group-hover:border-primary/50 transition-colors">
                      {React.cloneElement(app.icon as React.ReactElement<any>, { size: 24 })}
                   </div>
                   <div className="flex gap-2">
                      {app.tags.map(tag => (
                         <span key={tag} className="text-[10px] uppercase font-bold tracking-wider text-slate-500 bg-white/5 px-2 py-1 rounded">
                            {tag}
                         </span>
                      ))}
                   </div>
                </div>
                <Heading level={3} className="mb-3 text-white group-hover:text-primary transition-colors">{app.title}</Heading>
                <Text>{app.desc}</Text>
                
                {/* Visual Placeholder for App UI */}
                <div className="mt-8 pt-6 border-t border-white/5">
                   <div className="flex gap-2 items-center text-xs text-slate-500 font-mono">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                      Live Functionality
                   </div>
                </div>
             </GlassCard>
          ))}
       </div>
    </Section>
  );
};
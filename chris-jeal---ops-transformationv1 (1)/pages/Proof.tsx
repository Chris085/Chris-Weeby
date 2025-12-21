import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Section, Heading, Text, GlassCard } from '../components/UiKit';

const data = [
  { name: 'Vehicle Checks', before: 45, after: 12 },
  { name: 'Shift Reports', before: 60, after: 15 },
  { name: 'Audit Prep', before: 120, after: 20 },
];

const caseStudies = [
  {
    title: "Logistics Yard Management",
    challenge: "A busy transport hub relied on a shared, fragile Excel sheet to track over 40 daily truck movements. Data was frequently overwritten or lost, communication with gate staff was disjointed, and lack of real-time visibility led to costly demurrage charges.",
    solution: "A dedicated mobile application for gate security to log arrivals, departures, and bay allocations. Features include photographic evidence of loads, automated timestamping, and a live dashboard for the transport office to monitor flow.",
    result: "Achieved 100% data accuracy with a complete digital audit trail. Demurrage disputes were reduced by 90% due to irrefutable timestamped evidence, and yard throughput efficiency increased significantly."
  },
  {
    title: "Facility Safety Inspections",
    challenge: "A multi-site safety manager spent entire Fridays manually transcribing paper inspection checklists from three locations into a master spreadsheet. This lag meant critical safety defects were often addressed too late, increasing operational risk.",
    solution: "A mobile inspection app allowing site managers to complete audits on the floor. The system automatically scores inspections, triggers instant alerts for failures, and generates professional PDF reports sent to stakeholders immediately.",
    result: "Eliminated 6 hours of weekly manual data entry. Corrective actions are now tracked in real-time with automated follow-ups, ensuring compliance standards are consistently met across all sites."
  },
  {
    title: "Skill Sync – Training & Compliance Management",
    challenge: "Training records, SOP sign-offs, and safety briefs were tracked across spreadsheets and paper. No clear visibility of who was trained, what version they signed, or where gaps existed — creating audit risk and admin overhead.",
    solution: "A centralized, mobile-first training and compliance system with controlled SOP versions, electronic sign-off, role-based training assignments, and real-time compliance dashboards.",
    result: "100% visibility of training status and audit-ready records, with significantly reduced admin effort and zero reliance on spreadsheets or paper sign-offs."
  }
];

export const Proof: React.FC = () => {
  return (
    <>
      <Section className="pt-32">
        <Heading level={1} className="mb-6">Outcomes</Heading>
        <Text size="lg" className="max-w-3xl mb-16">
          Real results from replacing manual spreadsheet processes with structured applications.
        </Text>

        <div className="grid lg:grid-cols-2 gap-8 mb-20">
          <GlassCard className="min-h-[400px] flex flex-col">
            <Heading level={3} className="mb-6">Time Spent (Minutes/Task)</Heading>
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                  <XAxis type="number" stroke="#94a3b8" />
                  <YAxis dataKey="name" type="category" stroke="#cbd5e1" width={100} tick={{fontSize: 12}} />
                  <Tooltip 
                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }}
                  />
                  <Bar dataKey="before" name="Spreadsheet (min)" fill="#475569" radius={[0, 4, 4, 0]} barSize={20} />
                  <Bar dataKey="after" name="App (min)" fill="#06b6d4" radius={[0, 4, 4, 0]} barSize={20}>
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex gap-6 justify-center text-sm">
               <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-slate-600 rounded-sm"></div> <span className="text-slate-400">Manual Process</span>
               </div>
               <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-primary rounded-sm"></div> <span className="text-white">With App</span>
               </div>
            </div>
          </GlassCard>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 content-start">
             <GlassCard className="flex flex-col justify-center items-center text-center p-8">
                <div className="text-5xl font-bold text-white mb-2">9</div>
                <div className="text-primary font-medium">Spreadsheets Killed</div>
             </GlassCard>
             <GlassCard className="flex flex-col justify-center items-center text-center p-8">
                <div className="text-5xl font-bold text-white mb-2">~6h</div>
                <div className="text-primary font-medium">Weekly Admin Saved</div>
             </GlassCard>
             <GlassCard className="flex flex-col justify-center items-center text-center p-8 sm:col-span-2">
                <div className="text-5xl font-bold text-white mb-2">100%</div>
                <div className="text-primary font-medium">Audit Trail Visibility</div>
             </GlassCard>
          </div>
        </div>

        <Heading level={2} className="mb-10">Mini Case Studies</Heading>
        <div className="grid md:grid-cols-3 gap-6">
          {caseStudies.map((study, i) => (
            <GlassCard key={i} delay={i * 0.1} className="flex flex-col">
              <h3 className="text-xl font-bold text-white mb-4 h-14 line-clamp-2">{study.title}</h3>
              <div className="space-y-4 flex-1">
                <div>
                  <span className="text-xs font-bold text-red-400 uppercase tracking-wide block mb-1">Problem</span>
                  <Text size="sm">{study.challenge}</Text>
                </div>
                <div>
                  <span className="text-xs font-bold text-primary uppercase tracking-wide block mb-1">Solution</span>
                  <Text size="sm">{study.solution}</Text>
                </div>
                <div className="pt-4 border-t border-white/10 mt-auto">
                  <span className="text-xs font-bold text-green-400 uppercase tracking-wide block mb-1">Outcome</span>
                  <Text size="sm" className="text-white font-medium">{study.result}</Text>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </Section>
    </>
  );
};
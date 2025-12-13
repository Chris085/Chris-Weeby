import React from 'react';
import { Section, Heading, Text, GlassCard } from '../components/UiKit';
import { CheckCircle2 } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <Section className="pt-32">
      <div className="grid lg:grid-cols-2 gap-16 items-start">
        <div>
          <Heading level={1} className="mb-8">Not a traditional agency.</Heading>
          
          <div className="prose prose-invert prose-lg text-slate-400">
             <p className="mb-6">
               I'm Chris Jeal. I'm not a "Full Stack Developer" looking to build the next Facebook. 
               I'm a specialist in <strong>Operational Digital Transformation</strong>.
             </p>
             <p className="mb-6">
               I spent years watching operations teams struggle with massive, fragile spreadsheets. 
               The IT department was too busy with ERP migrations, and external agencies wanted £50k to build a simple form.
             </p>
             <p className="mb-6">
               I fill that gap. I build the "last mile" operational tools that bridge the gap between your floor staff and your data.
             </p>
          </div>

          <div className="mt-10 grid sm:grid-cols-2 gap-4">
            {[
              "Ops Experience",
              "Rapid Development",
              "Security First",
              "No Jargon"
            ].map((item) => (
              <div key={item} className="flex items-center text-white font-medium">
                <CheckCircle2 className="text-primary mr-3" size={20} />
                {item}
              </div>
            ))}
          </div>
        </div>

        <GlassCard className="relative p-8 lg:p-12 bg-gradient-to-b from-white/[0.05] to-transparent">
           <div className="absolute top-0 right-0 p-32 bg-primary/20 blur-[100px] rounded-full pointer-events-none" />
           <Heading level={2} className="mb-6">My Philosophy</Heading>
           <ul className="space-y-6">
              <li>
                 <h4 className="text-white font-bold mb-1">Process First, Tech Second</h4>
                 <Text size="sm">A bad process digitized is just a faster bad process. We fix the workflow first.</Text>
              </li>
              <li>
                 <h4 className="text-white font-bold mb-1">Keep It Simple</h4>
                 <Text size="sm">If the warehouse team needs training to use it, it's too complicated.</Text>
              </li>
              <li>
                 <h4 className="text-white font-bold mb-1">Ship Fast</h4>
                 <Text size="sm">Weeks, not months. Momentum is everything in operations.</Text>
              </li>
           </ul>
        </GlassCard>
      </div>
    </Section>
  );
};
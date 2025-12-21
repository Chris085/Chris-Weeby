import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, FileSpreadsheet, ShieldCheck, Smartphone, Zap } from 'lucide-react';
import { Section, Heading, Text, Button, GlassCard } from '../components/UiKit';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export const Home: React.FC = () => {
  return (
    <>
      {/* Hero Section */}
      <Section fullHeight className="pt-32 pb-20">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-[-1]">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[128px] animate-pulse-slow" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[128px]" />
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-primary text-xs font-medium tracking-wide mb-6">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            AVAILABLE FOR NEW PROJECTS
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
            Replace spreadsheets with <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">secure internal apps</span>
            <span className="text-slate-500"> — fast.</span>
          </motion.h1>

          <motion.p variants={itemVariants} className="text-xl text-slate-400 max-w-2xl mb-10 leading-relaxed">
            I help operations teams in logistics, facilities, and safety move out of Excel and into secure, mobile-first apps in weeks, not months.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" to="/contact" icon={<ArrowRight size={18} />}>
              Review one of your spreadsheets
            </Button>
            <Button size="lg" variant="secondary" to="/how-it-works">
              See how it works
            </Button>
          </motion.div>
        </motion.div>

        {/* Hero Metrics */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-20 sm:mt-32 grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-white/10 pt-10"
        >
          {[
            { label: "Spreadsheets Replaced", value: "9" },
            { label: "Admin Saved / Week", value: "~6h" },
            { label: "Audit Readiness", value: "100%" },
            { label: "Deployment Speed", value: "<3wks" },
          ].map((metric, idx) => (
            <div key={idx}>
              <div className="text-3xl font-bold text-white mb-1">{metric.value}</div>
              <div className="text-sm text-slate-500 font-medium uppercase tracking-wider">{metric.label}</div>
            </div>
          ))}
        </motion.div>
      </Section>

      {/* Problem Section */}
      <Section className="bg-gradient-to-b from-transparent to-white/[0.02]">
        <div className="mb-16">
          <Heading>The Spreadsheet Trap</Heading>
          <Text className="mt-4 max-w-2xl">
            Operations run on Excel because it's flexible, but it breaks at scale. 
            Does this sound like your current reality?
          </Text>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <GlassCard delay={0.1}>
            <FileSpreadsheet className="text-red-400 mb-4 h-8 w-8" />
            <h3 className="text-lg font-semibold text-white mb-2">Version Chaos</h3>
            <Text size="sm">
              "Final_v2_updated.xlsx" being emailed around. No one knows which data is current, leading to costly operational errors.
            </Text>
          </GlassCard>
          <GlassCard delay={0.2}>
            <ShieldCheck className="text-orange-400 mb-4 h-8 w-8" />
            <h3 className="text-lg font-semibold text-white mb-2">Audit Risks</h3>
            <Text size="sm">
              No audit logs. Anyone can accidentally delete a row or change a formula. Compliance audits become a stressful scramble.
            </Text>
          </GlassCard>
          <GlassCard delay={0.3}>
            <Smartphone className="text-yellow-400 mb-4 h-8 w-8" />
            <h3 className="text-lg font-semibold text-white mb-2">Desktop Only</h3>
            <Text size="sm">
              Your team is on the floor, in the yard, or inspecting assets. Spreadsheets don't work on mobile, leading to paper notes and double entry.
            </Text>
          </GlassCard>
        </div>
      </Section>

      {/* Solution Overview */}
      <Section>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-primary text-sm font-bold tracking-wider uppercase mb-4">
              <Zap size={16} /> The Solution
            </div>
            <Heading className="mb-6">
              Purpose-built operational apps that fit your workflow.
            </Heading>
            <Text className="mb-6">
              I don't just "digitize" data. I observe how your team works and build tools that make their job easier, not harder.
            </Text>
            
            <ul className="space-y-4 mb-8">
              {[
                "Mobile-first design for field teams",
                "Role-based permissions & security",
                "Automated PDF reporting & emails",
                "Real-time dashboards for management"
              ].map((item, i) => (
                <li key={i} className="flex items-center text-slate-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mr-3" />
                  {item}
                </li>
              ))}
            </ul>

            <Button to="/what-i-do" variant="outline">
              Explore capabilities
            </Button>
          </div>
          
          <div className="relative">
             {/* Abstract Representation of Transformation */}
             <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full" />
             <GlassCard className="relative z-10 border-primary/20">
                <div className="space-y-4">
                   {/* Mock UI Elements */}
                   <div className="flex justify-between items-center border-b border-white/10 pb-4">
                      <div className="h-4 w-32 bg-white/10 rounded" />
                      <div className="h-8 w-8 bg-primary/20 rounded-full flex items-center justify-center text-primary text-xs">CJ</div>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="h-24 bg-white/5 rounded border border-white/5 p-4 flex flex-col justify-between">
                         <div className="h-2 w-12 bg-white/20 rounded" />
                         <div className="text-2xl font-bold text-white">98%</div>
                      </div>
                      <div className="h-24 bg-white/5 rounded border border-white/5 p-4 flex flex-col justify-between">
                         <div className="h-2 w-12 bg-white/20 rounded" />
                         <div className="text-2xl font-bold text-primary">Active</div>
                      </div>
                   </div>
                   <div className="h-40 bg-gradient-to-br from-white/5 to-transparent rounded border border-white/5 flex items-center justify-center text-slate-500 text-sm">
                      Real-time Operational Data
                   </div>
                   <div className="flex gap-2 justify-end">
                      <div className="h-8 w-24 bg-primary rounded shadow-lg shadow-primary/20" />
                   </div>
                </div>
             </GlassCard>
          </div>
        </div>
      </Section>
      
      {/* Footer CTA */}
      <Section className="py-24 text-center">
        <div className="max-w-3xl mx-auto">
          <Heading level={2} className="mb-6">Ready to ditch the spreadsheet?</Heading>
          <Text size="lg" className="mb-8">
            Send me a spreadsheet causing you pain. I'll review it and show you what it could look like as a secure, mobile app.
          </Text>
          <Button size="lg" to="/contact" icon={<ArrowRight />}>
            Book a Free Spreadsheet Review
          </Button>
        </div>
      </Section>
    </>
  );
};
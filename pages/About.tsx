import React, { useEffect, useState } from 'react';
import { Section, Heading, Text, GlassCard } from '../components/UiKit';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { db } from '../lib/firebaseClient';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { AboutContent } from '../types';

export const About: React.FC = () => {
  const [content, setContent] = useState<AboutContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const q = query(collection(db, 'about_content'), where('is_active', '==', true));
        const snapshot = await getDocs(q);
        
        if (!snapshot.empty) {
          const data = snapshot.docs[0].data() as AboutContent;
          setContent(data);
        }
      } catch (err) {
        console.log("No dynamic About content found.");
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  return (
    <>
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

      {/* Dynamic CMS Experience Section */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-primary opacity-20" />
        </div>
      ) : content && (
        <Section className="bg-white/[0.02]">
           <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="order-2 lg:order-1">
                 <Heading level={2} className="mb-6">{content.experience_title}</Heading>
                 
                 <div className="space-y-6 mb-8">
                    {content.experience_body.split('\n\n').map((paragraph, idx) => (
                       <Text key={idx} size="lg">{paragraph}</Text>
                    ))}
                 </div>

                 {content.experience_bullets && content.experience_bullets.length > 0 && (
                    <div className="grid sm:grid-cols-1 gap-4">
                       {content.experience_bullets.map((bullet, idx) => (
                          <div key={idx} className="flex items-start text-slate-300">
                             <CheckCircle2 className="text-primary mr-3 mt-1 shrink-0" size={18} />
                             <span>{bullet}</span>
                          </div>
                       ))}
                    </div>
                 )}
              </div>

              {content.experience_image_url && (
                <div className="order-1 lg:order-2">
                   <GlassCard hoverEffect={false} className="p-2 border-primary/10">
                      <div className="aspect-[4/3] rounded-lg overflow-hidden relative group">
                         <img 
                            src={content.experience_image_url} 
                            alt={content.experience_image_alt || "Experience image"} 
                            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                         />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                   </GlassCard>
                </div>
              )}
           </div>
        </Section>
      )}
    </>
  );
};

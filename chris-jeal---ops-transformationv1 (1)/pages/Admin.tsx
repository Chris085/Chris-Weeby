
import React, { useEffect, useState, useRef } from 'react';
import { Section, Heading, Text, GlassCard, Button } from '../components/UiKit';
import { supabase } from '../lib/supabaseClient';
import { Inquiry, AboutContent } from '../types';
// Fixed: Added Image to the lucide-react imports
import { Download, LogOut, Loader2, FileSpreadsheet, Mail, AlertCircle, Trash2, Edit3, Save, Upload, CheckCircle2, LayoutDashboard, UserCircle, Image } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Admin: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [aboutContent, setAboutContent] = useState<AboutContent | null>(null);
  const [activeTab, setActiveTab] = useState<'inquiries' | 'about'>('inquiries');
  const [authMessage, setAuthMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  
  // About Editor States
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [bullets, setBullets] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageAlt, setImageAlt] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        loadDashboardData();
      } else {
        setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        loadDashboardData();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    await Promise.all([fetchInquiries(), fetchAboutContent()]);
    setLoading(false);
  };

  const fetchInquiries = async () => {
    const { data, error } = await supabase
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.error('Error fetching inquiries:', error);
    else setInquiries(data as Inquiry[]);
  };

  const fetchAboutContent = async () => {
    try {
      const { data, error } = await supabase
        .from('about_content')
        .select('*')
        .eq('is_active', true)
        .order('id', { ascending: true })
        .limit(1)
        .single();

      if (data) {
        setAboutContent(data);
        setTitle(data.experience_title);
        setBody(data.experience_body);
        setBullets(data.experience_bullets.join('\n'));
        setImageUrl(data.experience_image_url);
        setImageAlt(data.experience_image_alt || '');
      }
    } catch (err) {
      console.log("No existing About content found or initial setup required.");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthMessage(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    } catch (error: any) {
      setAuthMessage({ type: 'error', text: error.message || 'Authentication failed' });
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setSaveLoading(true);
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `experience_${Date.now()}.${fileExt}`;
    const filePath = `about/${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('site-assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('site-assets').getPublicUrl(filePath);
      setImageUrl(data.publicUrl);
      setAuthMessage({ type: 'success', text: 'Image uploaded successfully' });
    } catch (error: any) {
      setAuthMessage({ type: 'error', text: `Upload failed: ${error.message}` });
    } finally {
      setSaveLoading(false);
    }
  };

  const saveAboutContent = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    setAuthMessage(null);

    const payload: Partial<AboutContent> = {
      experience_title: title,
      experience_body: body,
      experience_bullets: bullets.split('\n').filter(b => b.trim() !== ''),
      experience_image_url: imageUrl,
      experience_image_alt: imageAlt,
      is_active: true,
      updated_at: new Date().toISOString()
    };

    try {
      const { error } = await supabase
        .from('about_content')
        .upsert({ 
          id: aboutContent?.id || undefined, 
          ...payload 
        });

      if (error) throw error;
      setAuthMessage({ type: 'success', text: 'About page updated successfully!' });
      fetchAboutContent();
    } catch (error: any) {
      setAuthMessage({ type: 'error', text: `Save failed: ${error.message}` });
    } finally {
      setSaveLoading(false);
    }
  };

  const executeDelete = async (id: number) => {
    try {
      const { error } = await supabase
        .from('inquiries')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setInquiries((prev) => prev.filter((item) => item.id !== id));
      setDeleteId(null);
    } catch (error: any) {
      console.error('Error deleting inquiry:', error);
    }
  };

  if (!session) {
    return (
      <Section className="min-h-screen flex flex-col items-center justify-center">
        <GlassCard className="max-w-md w-full p-8">
          <Heading level={2} className="mb-2 text-center">
            Admin Login
          </Heading>
          <Text size="sm" className="text-center mb-6">
            Access your secure dashboard.
          </Text>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded px-4 py-2 text-white focus:outline-none focus:border-primary/50 transition-all placeholder:text-slate-700"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded px-4 py-2 text-white focus:outline-none focus:border-primary/50 transition-all placeholder:text-slate-700"
                placeholder="••••••••"
                required
              />
            </div>

            {authMessage && authMessage.type === 'error' && (
              <div className="p-3 rounded text-sm flex items-start gap-2 bg-red-500/10 text-red-400 border border-red-500/20">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                {authMessage.text}
              </div>
            )}

            <Button type="submit" className="w-full" isLoading={authLoading}>
              Sign In
            </Button>
          </form>
        </GlassCard>
      </Section>
    );
  }

  return (
    <Section className="pt-32 min-h-screen">
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 border-b border-white/10 pb-8">
        <div>
           <Heading level={1} className="mb-2">Admin Dashboard</Heading>
           <Text>Manage your operational inquiries and dynamic site content.</Text>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
           <div className="bg-white/5 p-1 rounded-lg flex gap-1">
              <button 
                onClick={() => setActiveTab('inquiries')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'inquiries' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
              >
                <Mail size={16} /> Inquiries
                <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] ${activeTab === 'inquiries' ? 'bg-white/20' : 'bg-white/10'}`}>
                   {inquiries.length}
                </span>
              </button>
              <button 
                onClick={() => setActiveTab('about')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'about' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
              >
                <UserCircle size={16} /> Edit About
              </button>
           </div>
           <Button variant="outline" size="sm" onClick={handleLogout} icon={<LogOut size={16} />}>
            Sign Out
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-40">
          <Loader2 className="animate-spin text-primary w-10 h-10" />
        </div>
      ) : activeTab === 'inquiries' ? (
        // INQUIRIES LIST
        <div className="grid gap-6">
          {inquiries.length === 0 ? (
            <div className="text-center py-32 border-2 border-dashed border-white/5 rounded-2xl">
               <Mail className="mx-auto mb-4 text-slate-700" size={48} />
               <Text className="text-slate-500">No inquiries have been submitted yet.</Text>
            </div>
          ) : (
            inquiries.map((inquiry) => (
              <GlassCard key={inquiry.id} hoverEffect={false}>
                <div className="flex flex-col md:flex-row gap-8 justify-between items-start">
                  <div className="space-y-4 flex-1">
                    <div className="flex items-center gap-4">
                       <h3 className="text-2xl font-bold text-white">{inquiry.name}</h3>
                       <span className="text-xs font-mono text-slate-500 bg-white/5 px-2 py-1 rounded">
                          {new Date(inquiry.created_at).toLocaleString()}
                       </span>
                    </div>
                    <div className="flex items-center gap-2 text-primary">
                       <Mail size={16} />
                       <a href={`mailto:${inquiry.email}`} className="hover:underline font-medium">{inquiry.email}</a>
                    </div>
                    <div className="p-5 rounded-xl bg-black/40 border border-white/5 text-slate-300 text-sm whitespace-pre-wrap leading-relaxed">
                      {inquiry.problem}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 w-full md:w-auto min-w-[200px]">
                    {inquiry.file_url && (
                      <a 
                        href={inquiry.file_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-4 rounded-xl bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-all group w-full"
                      >
                         <FileSpreadsheet className="text-primary shrink-0" size={24} />
                         <div className="text-left flex-1 min-w-0">
                            <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Spreadsheet</div>
                            <div className="text-sm font-bold text-white group-hover:text-primary transition-colors truncate">View Attachment</div>
                         </div>
                         <Download size={18} className="text-slate-500 group-hover:text-white ml-2 shrink-0" />
                      </a>
                    )}
                    
                    {deleteId === inquiry.id ? (
                      <div className="flex gap-2 p-1 bg-red-500/10 border border-red-500/20 rounded-xl">
                         <button onClick={() => executeDelete(inquiry.id)} className="flex-1 p-3 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all text-sm font-bold">Delete Forever</button>
                         <button onClick={() => setDeleteId(null)} className="flex-1 p-3 rounded-lg text-slate-400 hover:text-white transition-all text-sm font-medium">Cancel</button>
                      </div>
                    ) : (
                      <button onClick={() => setDeleteId(inquiry.id)} className="flex items-center justify-center gap-2 p-3 rounded-xl border border-white/10 text-slate-500 hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/5 transition-all text-sm w-full font-medium">
                          <Trash2 size={16} /> Remove Record
                      </button>
                    )}
                  </div>
                </div>
              </GlassCard>
            ))
          )}
        </div>
      ) : (
        // ABOUT CMS EDITOR
        <div className="max-w-4xl mx-auto">
          <GlassCard hoverEffect={false} className="p-8 md:p-12">
            <form onSubmit={saveAboutContent} className="space-y-8">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-6">
                 <div>
                    <Heading level={3}>About Page CMS</Heading>
                    <Text size="sm">Update the "Experience" section below your philosophy.</Text>
                 </div>
                 <Button type="submit" size="md" isLoading={saveLoading} icon={<Save size={18} />}>
                   Save Changes
                 </Button>
              </div>

              {authMessage && (
                <div className={`p-4 rounded-xl text-sm flex items-start gap-3 ${authMessage.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                  {authMessage.type === 'success' ? <CheckCircle2 size={20} className="shrink-0" /> : <AlertCircle size={20} className="shrink-0" />}
                  <span className="font-medium">{authMessage.text}</span>
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2 uppercase tracking-wider">Experience Title</label>
                  <input 
                    type="text" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-all placeholder:text-slate-700"
                    placeholder="e.g. My Industrial Experience"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2 uppercase tracking-wider">Main Body Text</label>
                  <Text size="sm" className="mb-2">Use a double empty line (Enter twice) to create separate paragraphs.</Text>
                  <textarea 
                    value={body} 
                    onChange={(e) => setBody(e.target.value)}
                    rows={8}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-all placeholder:text-slate-700"
                    placeholder="Describe your background and what you bring to operations..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2 uppercase tracking-wider">Bullet Points</label>
                  <Text size="sm" className="mb-2">One point per line. These will appear with checkmarks.</Text>
                  <textarea 
                    value={bullets} 
                    onChange={(e) => setBullets(e.target.value)}
                    rows={5}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-all placeholder:text-slate-700"
                    placeholder="Logistics Management...&#10;Audit Compliance...&#10;Process Mapping..."
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-8 pt-4 border-t border-white/10">
                  <div>
                    <label className="block text-sm font-bold text-slate-300 mb-2 uppercase tracking-wider">Featured Image</label>
                    <div className="space-y-4">
                       <div className="flex items-center gap-4">
                          <input 
                             type="file" 
                             ref={fileInputRef} 
                             className="hidden" 
                             accept="image/*"
                             onChange={handleImageUpload}
                          />
                          <Button 
                             type="button" 
                             variant="outline" 
                             size="sm" 
                             onClick={() => fileInputRef.current?.click()}
                             icon={<Upload size={16} />}
                             className="w-full"
                          >
                             Upload Image
                          </Button>
                       </div>
                       
                       {imageUrl ? (
                          <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-black/40 border border-white/10 group">
                             <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                             <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Text size="sm" className="text-white">Current Image</Text>
                             </div>
                          </div>
                       ) : (
                          <div className="aspect-[4/3] rounded-xl border-2 border-dashed border-white/5 flex flex-col items-center justify-center text-slate-700">
                             {/* Fixed: Replaced ImageIcon with Image component */}
                             <Image size={40} className="mb-2" />
                             <Text size="sm">No image uploaded</Text>
                          </div>
                       )}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-slate-300 mb-2 uppercase tracking-wider">Image Metadata</label>
                    <div className="space-y-4">
                       <div>
                          <label className="block text-xs text-slate-500 mb-1">Accessibility (Alt Text)</label>
                          <input 
                            type="text" 
                            value={imageAlt} 
                            onChange={(e) => setImageAlt(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-primary/50 transition-all text-sm"
                            placeholder="e.g. Chris Jeal in transport office"
                          />
                       </div>
                       <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                          <Text size="sm" className="text-primary/80">
                             <strong>Tip:</strong> Use a high-quality landscape photo. The image will be rendered with a subtle grayscale effect that transitions to color on hover.
                          </Text>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </GlassCard>
        </div>
      )}
    </Section>
  );
};

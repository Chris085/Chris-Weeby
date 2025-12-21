import React, { useEffect, useState, useRef } from 'react';
import { Section, Heading, Text, GlassCard, Button } from '../components/UiKit';
import { supabase } from '../lib/supabaseClient';
import { Inquiry, AboutContent } from '../types';
import { Download, LogOut, Loader2, FileSpreadsheet, Mail, AlertCircle, Trash2, Edit3, Save, Upload, CheckCircle2, Image as ImageIcon } from 'lucide-react';
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
        fetchInquiries();
        fetchAboutContent();
      } else {
        setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchInquiries();
        fetchAboutContent();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchInquiries = async () => {
    const { data, error } = await supabase
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.error('Error fetching data:', error);
    else setInquiries(data as Inquiry[]);
  };

  const fetchAboutContent = async () => {
    setLoading(true);
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
      console.log("No existing About content found, or error fetching.");
    } finally {
      setLoading(false);
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
            Enter your credentials to continue.
          </Text>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded px-4 py-2 text-white focus:outline-none focus:border-primary/50 transition-all"
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
                className="w-full bg-black/20 border border-white/10 rounded px-4 py-2 text-white focus:outline-none focus:border-primary/50 transition-all"
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
           <Heading level={1}>Admin Dashboard</Heading>
           <Text>Manage your inquiries and site content.</Text>
        </div>
        <div className="flex gap-2">
           <Button 
              variant={activeTab === 'inquiries' ? 'primary' : 'outline'} 
              size="sm" 
              onClick={() => setActiveTab('inquiries')}
           >
              Inquiries ({inquiries.length})
           </Button>
           <Button 
              variant={activeTab === 'about' ? 'primary' : 'outline'} 
              size="sm" 
              onClick={() => setActiveTab('about')}
           >
              Edit About
           </Button>
           <Button variant="ghost" size="sm" onClick={handleLogout} icon={<LogOut size={16} />}>
            Logout
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-primary w-8 h-8" />
        </div>
      ) : activeTab === 'inquiries' ? (
        // INQUIRIES TAB
        <div className="grid gap-6">
          {inquiries.length === 0 ? (
            <div className="text-center py-20 text-slate-500">No inquiries yet.</div>
          ) : (
            inquiries.map((inquiry) => (
              <GlassCard key={inquiry.id} hoverEffect={false}>
                <div className="flex flex-col md:flex-row gap-6 justify-between items-start">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                       <h3 className="text-xl font-semibold text-white">{inquiry.name}</h3>
                       <span className="text-xs text-slate-500 bg-white/5 px-2 py-1 rounded">
                          {new Date(inquiry.created_at).toLocaleDateString()}
                       </span>
                    </div>
                    <div className="flex items-center gap-2 text-primary text-sm">
                       <Mail size={14} />
                       <a href={`mailto:${inquiry.email}`} className="hover:underline">{inquiry.email}</a>
                    </div>
                    <div className="mt-4 p-4 rounded bg-black/20 border border-white/5 text-slate-300 text-sm whitespace-pre-wrap">
                      {inquiry.problem}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 w-full md:w-auto min-w-[160px]">
                    {inquiry.file_url && (
                      <a 
                        href={inquiry.file_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-lg bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-colors group w-full"
                      >
                         <FileSpreadsheet className="text-primary shrink-0" size={18} />
                         <div className="text-left flex-1 min-w-0">
                            <div className="text-sm font-medium text-white group-hover:text-primary transition-colors truncate">Download File</div>
                         </div>
                         <Download size={16} className="text-slate-400 group-hover:text-white ml-2 shrink-0" />
                      </a>
                    )}
                    
                    {deleteId === inquiry.id ? (
                      <div className="flex gap-2">
                         <button onClick={() => executeDelete(inquiry.id)} className="flex-1 p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all text-sm font-medium">Confirm</button>
                         <button onClick={() => setDeleteId(null)} className="flex-1 p-2 rounded-lg border border-white/10 text-slate-400 hover:bg-white/5 transition-all text-sm">Cancel</button>
                      </div>
                    ) : (
                      <button onClick={() => setDeleteId(inquiry.id)} className="flex items-center justify-center gap-2 p-2 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 hover:border-red-500/40 transition-all text-sm w-full">
                          <Trash2 size={16} /> Delete Inquiry
                      </button>
                    )}
                  </div>
                </div>
              </GlassCard>
            ))
          )}
        </div>
      ) : (
        // ABOUT CONTENT EDITOR TAB
        <div className="max-w-4xl">
          <GlassCard hoverEffect={false}>
            <form onSubmit={saveAboutContent} className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                 <Heading level={3}>Experience Section CMS</Heading>
                 <Button type="submit" size="sm" isLoading={saveLoading} icon={<Save size={16} />}>
                   Save Changes
                 </Button>
              </div>

              {authMessage && (
                <div className={`p-3 rounded text-sm flex items-start gap-2 ${authMessage.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                  {authMessage.type === 'success' ? <CheckCircle2 size={16} className="shrink-0 mt-0.5" /> : <AlertCircle size={16} className="shrink-0 mt-0.5" />}
                  {authMessage.text}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Section Title</label>
                  <input 
                    type="text" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-black/20 border border-white/10 rounded px-4 py-2 text-white focus:outline-none focus:border-primary/50"
                    placeholder="e.g. My Background & Experience"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Experience Body (Supports double newline for paragraphs)</label>
                  <textarea 
                    value={body} 
                    onChange={(e) => setBody(e.target.value)}
                    rows={6}
                    className="w-full bg-black/20 border border-white/10 rounded px-4 py-2 text-white focus:outline-none focus:border-primary/50"
                    placeholder="Describe your journey..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Bullet Points (One per line)</label>
                  <textarea 
                    value={bullets} 
                    onChange={(e) => setBullets(e.target.value)}
                    rows={4}
                    className="w-full bg-black/20 border border-white/10 rounded px-4 py-2 text-white focus:outline-none focus:border-primary/50"
                    placeholder="Managed 50+ logistics projects..."
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Image Alt Text</label>
                    <input 
                      type="text" 
                      value={imageAlt} 
                      onChange={(e) => setImageAlt(e.target.value)}
                      className="w-full bg-black/20 border border-white/10 rounded px-4 py-2 text-white focus:outline-none focus:border-primary/50"
                      placeholder="e.g. Chris working on-site"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Experience Image</label>
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
                          icon={<Upload size={14} />}
                       >
                          Upload New Image
                       </Button>
                       {imageUrl && (
                          <div className="h-10 w-10 rounded border border-white/10 overflow-hidden bg-black">
                             <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                          </div>
                       )}
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
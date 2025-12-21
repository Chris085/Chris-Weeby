import React, { useEffect, useState } from 'react';
import { Section, Heading, Text, GlassCard, Button } from '../components/UiKit';
import { supabase } from '../lib/supabaseClient';
import { Inquiry, AboutContent } from '../types';
import { Download, LogOut, Loader2, FileSpreadsheet, Mail, AlertCircle, Trash2, Save, Upload, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Admin: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [authMessage, setAuthMessage] = useState<{ type: 'error', text: string } | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // About Content State
  const [aboutContent, setAboutContent] = useState<Partial<AboutContent>>({
    experience_title: '',
    experience_body: '',
    experience_image_url: ''
  });
  const [bulletsString, setBulletsString] = useState('');
  const [savingAbout, setSavingAbout] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [aboutMessage, setAboutMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchInquiries();
        fetchAboutContent();
      }
      else setLoading(false);
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
    setLoading(true);
    const { data, error } = await supabase
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.error('Error fetching data:', error);
    else setInquiries(data as Inquiry[]);

    setLoading(false);
  };

  const fetchAboutContent = async () => {
    const { data } = await supabase
      .from('about_content')
      .select('*')
      .eq('is_active', true)
      .limit(1)
      .single();

    if (data) {
      setAboutContent(data);
      setBulletsString(data.experience_bullets ? data.experience_bullets.join('\n') : '');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    setUploading(true);
    setAboutMessage(null);
    try {
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `experience_${Date.now()}.${fileExt}`;
      const filePath = `about/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('site-assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('site-assets').getPublicUrl(filePath);
      setAboutContent(prev => ({ ...prev, experience_image_url: data.publicUrl }));
      setAboutMessage({ type: 'success', text: 'Image uploaded successfully' });
    } catch (error: any) {
      setAboutMessage({ type: 'error', text: 'Error uploading image: ' + error.message });
    } finally {
      setUploading(false);
    }
  };

  const handleSaveAbout = async () => {
    setSavingAbout(true);
    setAboutMessage(null);

    try {
      const payload = {
        experience_title: aboutContent.experience_title || '',
        experience_body: aboutContent.experience_body || '',
        experience_bullets: bulletsString.split('\n').filter(b => b.trim() !== ''),
        experience_image_url: aboutContent.experience_image_url,
        experience_image_alt: aboutContent.experience_title,
        is_active: true
      };

      let error;
      if (aboutContent.id) {
        const { error: err } = await supabase
          .from('about_content')
          .update(payload)
          .eq('id', aboutContent.id);
        error = err;
      } else {
        const { error: err } = await supabase
          .from('about_content')
          .insert([payload]);
        error = err;
      }

      if (error) throw error;

      setAboutMessage({ type: 'success', text: 'Content saved successfully!' });
      fetchAboutContent(); // Refresh to get ID if it was an insert
    } catch (error: any) {
      setAboutMessage({ type: 'error', text: 'Error saving content: ' + error.message });
    } finally {
      setSavingAbout(false);
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
      // Avoid alert() as it may be blocked in sandbox environments
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

            {authMessage && (
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
      <div className="flex justify-between items-center mb-10">
        <div>
          <Heading level={1}>Inquiries</Heading>
          <Text>Review submitted spreadsheet problems.</Text>
        </div>
        <Button variant="outline" size="sm" onClick={handleLogout} icon={<LogOut size={16} />}>
          Sign Out
        </Button>
      </div>

      {/* About Content Editor */}
      <GlassCard className="mb-10 p-8">
        <div className="flex items-center justify-between mb-6">
          <Heading level={2}>About Page Content</Heading>
          <Button
            size="sm"
            onClick={handleSaveAbout}
            isLoading={savingAbout}
            icon={<Save size={16} />}
          >
            Save Changes
          </Button>
        </div>

        {aboutMessage && (
          <div className={`mb-6 p-3 rounded text-sm flex items-start gap-2 border ${aboutMessage.type === 'error'
              ? 'bg-red-500/10 text-red-400 border-red-500/20'
              : 'bg-green-500/10 text-green-400 border-green-500/20'
            }`}>
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            {aboutMessage.text}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Experience Title</label>
              <input
                type="text"
                value={aboutContent.experience_title || ''}
                onChange={(e) => setAboutContent(prev => ({ ...prev, experience_title: e.target.value }))}
                className="w-full bg-black/20 border border-white/10 rounded px-4 py-2 text-white focus:outline-none focus:border-primary/50 transition-all"
                placeholder="e.g. My Experience"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-1">Body Text (Double enter for paragraphs)</label>
              <textarea
                value={aboutContent.experience_body || ''}
                onChange={(e) => setAboutContent(prev => ({ ...prev, experience_body: e.target.value }))}
                className="w-full h-40 bg-black/20 border border-white/10 rounded px-4 py-2 text-white focus:outline-none focus:border-primary/50 transition-all resize-y"
                placeholder="Share your story..."
              />
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-1">Bullet Points (One per line)</label>
              <textarea
                value={bulletsString}
                onChange={(e) => setBulletsString(e.target.value)}
                className="w-full h-32 bg-black/20 border border-white/10 rounded px-4 py-2 text-white focus:outline-none focus:border-primary/50 transition-all resize-y"
                placeholder="• Point 1&#10;• Point 2"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1">Experience Image</label>

            <div className="mb-4">
              {aboutContent.experience_image_url ? (
                <div className="relative group rounded overflow-hidden border border-white/10">
                  <img
                    src={aboutContent.experience_image_url}
                    alt="Preview"
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="sm" variant="outline" onClick={() => (document.getElementById('image-upload') as HTMLInputElement)?.click()}>
                      Change Image
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  className="w-full h-64 border-2 border-dashed border-white/10 rounded flex flex-col items-center justify-center text-slate-500 hover:border-primary/50 hover:text-primary transition-all cursor-pointer"
                  onClick={() => (document.getElementById('image-upload') as HTMLInputElement)?.click()}
                >
                  <ImageIcon size={48} className="mb-2 opacity-50" />
                  <span className="text-sm">Click to upload image</span>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                isLoading={uploading}
                onClick={() => (document.getElementById('image-upload') as HTMLInputElement)?.click()}
                icon={<Upload size={14} />}
              >
                {uploading ? 'Uploading...' : 'Upload New Image'}
              </Button>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Uploads to 'site-assets' bucket. Recommended size: 800x600px.
            </p>
          </div>
        </div>
      </GlassCard>

      <div className="mb-6">
        <Heading level={2}>Inquiries</Heading>
        <Text>Review submitted spreadsheet problems.</Text>
      </div>

      {
        loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-primary w-8 h-8" />
          </div>
        ) : inquiries.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            No inquiries yet.
          </div>
        ) : (
          <div className="grid gap-6">
            {inquiries.map((inquiry) => (
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
                        <button
                          onClick={() => executeDelete(inquiry.id)}
                          className="flex-1 flex items-center justify-center p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all text-sm font-medium"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setDeleteId(null)}
                          className="flex-1 flex items-center justify-center p-2 rounded-lg border border-white/10 text-slate-400 hover:bg-white/5 transition-all text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteId(inquiry.id)}
                        className="flex items-center justify-center gap-2 p-2 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 hover:border-red-500/40 transition-all text-sm w-full"
                      >
                        <Trash2 size={16} />
                        Delete Inquiry
                      </button>
                    )}
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        )
      }
    </Section >
  );
};
import React, { useEffect, useState } from 'react';
import { Section, Heading, Text, GlassCard, Button } from '../components/UiKit';
import { supabase } from '../lib/supabaseClient';
import { Inquiry } from '../types';
import { Download, LogOut, Loader2, FileSpreadsheet, Mail, AlertCircle, Trash2 } from 'lucide-react';
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
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchInquiries();
      else setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchInquiries();
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

      {loading ? (
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
      )}
    </Section>
  );
};
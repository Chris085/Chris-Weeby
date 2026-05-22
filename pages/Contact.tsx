import React, { useState, useRef } from 'react';
import { Section, Heading, Text, GlassCard, Button } from '../components/UiKit';
import { Send, CheckCircle, Upload, FileSpreadsheet, X, AlertCircle } from 'lucide-react';
import { db, storage } from '../lib/firebaseClient';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const Contact: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    const form = e.target as HTMLFormElement;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const problem = (form.elements.namedItem('problem') as HTMLTextAreaElement).value;

    try {
      let fileUrl = null;

      // 1. Upload File if exists
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `inquiries/${fileName}`;
        const fileRef = ref(storage, filePath);

        await uploadBytes(fileRef, file);
        fileUrl = await getDownloadURL(fileRef);
      }

      // 2. Add Data to Firestore
      await addDoc(collection(db, 'inquiries'), {
        name,
        email,
        problem,
        file_url: fileUrl,
        created_at: serverTimestamp(),
      });

      setIsSubmitted(true);
      form.reset();
      setFile(null);
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrorMessage('Something went wrong. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <Section className="min-h-[80vh] flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-6 animate-pulse">
          <CheckCircle size={40} />
        </div>
        <Heading level={1} className="mb-4">Request Received.</Heading>
        <Text className="max-w-md mx-auto mb-8">
          I've received your details. If you attached a spreadsheet, I'll take a look and record a Loom video walking through how we can transform it.
        </Text>
        <Button variant="outline" onClick={() => { setIsSubmitted(false); setFile(null); }}>
          Submit another
        </Button>
      </Section>
    );
  }

  return (
    <Section className="pt-32">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <Heading level={1} className="mb-4">Let's kill that spreadsheet.</Heading>
          <Text size="lg">
            Send me details about the process causing you pain. I'll review it and show you what it could look like as an app.
          </Text>
        </div>

        <GlassCard className="p-8 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-slate-300">Name</label>
                <input 
                  required
                  type="text" 
                  id="name"
                  name="name"
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                  placeholder="Jane Doe"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-slate-300">Work Email</label>
                <input 
                  required
                  type="email" 
                  id="email"
                  name="email"
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                  placeholder="jane@company.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="problem" className="text-sm font-medium text-slate-300">What process are you trying to fix?</label>
              <textarea 
                required
                id="problem"
                name="problem"
                rows={4}
                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                placeholder="e.g. 'Our daily vehicle check is a messy Excel sheet that no one updates on time...'"
              />
            </div>

            <div className="space-y-2">
               <label className="text-sm font-medium text-slate-300">Spreadsheet Upload (Optional)</label>
               
               {!file ? (
                 <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-white/10 rounded-lg p-8 text-center hover:border-primary/30 hover:bg-white/5 transition-all cursor-pointer group"
                 >
                    <Upload className="mx-auto mb-3 text-slate-500 group-hover:text-primary transition-colors" />
                    <p className="text-slate-300 text-sm font-medium">Click to upload your .xlsx or .csv</p>
                    <p className="text-xs text-slate-500 mt-2">Confidentiality guaranteed.</p>
                 </div>
               ) : (
                 <div className="border border-primary/30 bg-primary/5 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <div className="p-2 bg-primary/20 rounded">
                          <FileSpreadsheet className="text-primary" size={20} />
                       </div>
                       <div>
                          <p className="text-sm text-white font-medium">{file.name}</p>
                          <p className="text-xs text-slate-400">{(file.size / 1024).toFixed(1)} KB</p>
                       </div>
                    </div>
                    <button 
                      type="button" 
                      onClick={removeFile}
                      className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors"
                    >
                       <X size={18} />
                    </button>
                 </div>
               )}
               
               <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                  className="hidden"
               />
            </div>

            {errorMessage && (
              <div className="p-3 rounded text-sm flex items-start gap-2 bg-red-500/10 text-red-400 border border-red-500/20">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                {errorMessage}
              </div>
            )}

            <div className="pt-4">
              <Button type="submit" size="lg" className="w-full md:w-auto min-w-[200px]" isLoading={isLoading} icon={<Send size={18} />}>
                Request Review
              </Button>
            </div>
          </form>
        </GlassCard>
      </div>
    </Section>
  );
};

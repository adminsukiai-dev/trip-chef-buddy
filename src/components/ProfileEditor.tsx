import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Pencil, Check, X, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface ProfileEditorProps {
  displayName: string;
  avatarUrl: string | null;
  onUpdate: () => void;
}

const ProfileEditor = ({ displayName, avatarUrl, onUpdate }: ProfileEditorProps) => {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(displayName);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const path = `${user.id}/avatar.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(path, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(path);

      const url = `${publicUrl}?t=${Date.now()}`;

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: url, updated_at: new Date().toISOString() })
        .eq('id', String(user.id));

      if (updateError) throw updateError;

      toast.success('Avatar updated');
      onUpdate();
    } catch (err: any) {
      toast.error(err.message || 'Failed to upload avatar');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveName = async () => {
    if (!user || !name.trim()) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ display_name: name.trim(), updated_at: new Date().toISOString() })
        .eq('id', String(user.id));

      if (error) throw error;

      toast.success('Name updated');
      setEditing(false);
      onUpdate();
    } catch (err: any) {
      toast.error(err.message || 'Failed to update name');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grocer-input-card flex items-center gap-4 mb-4">
      {/* Avatar */}
      <div className="relative">
        <div className="w-14 h-14 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center">
          {avatarUrl ? (
            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <span className="text-xl font-bold text-primary">
              {displayName?.charAt(0)?.toUpperCase() || '?'}
            </span>
          )}
          {uploading && (
            <div className="absolute inset-0 bg-background/60 rounded-full flex items-center justify-center">
              <Loader2 size={18} className="text-accent animate-spin" />
            </div>
          )}
        </div>
        {user && (
          <button
            onClick={() => fileRef.current?.click()}
            className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-accent flex items-center justify-center shadow-md"
          >
            <Camera size={12} className="text-white" />
          </button>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleAvatarUpload}
        />
      </div>

      {/* Name */}
      <div className="flex-1 min-w-0">
        <AnimatePresence mode="wait">
          {editing ? (
            <motion.div key="edit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex items-center gap-2">
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                autoFocus
                className="flex-1 bg-muted/50 border border-border rounded-lg px-3 py-1.5 text-sm outline-none focus:border-accent/50 transition-colors"
              />
              <button onClick={handleSaveName} disabled={saving}
                className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                {saving ? <Loader2 size={12} className="animate-spin text-primary" /> : <Check size={14} className="text-primary" />}
              </button>
              <button onClick={() => { setEditing(false); setName(displayName); }}
                className="w-7 h-7 rounded-full bg-muted flex items-center justify-center">
                <X size={14} className="text-muted-foreground" />
              </button>
            </motion.div>
          ) : (
            <motion.div key="view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="flex items-center gap-1.5">
                <p className="font-semibold truncate">{displayName}</p>
                {user && (
                  <button onClick={() => setEditing(true)}
                    className="flex-shrink-0 text-muted-foreground hover:text-accent transition-colors">
                    <Pencil size={12} />
                  </button>
                )}
              </div>
              <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProfileEditor;

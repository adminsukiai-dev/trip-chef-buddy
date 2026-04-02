import { useAuth } from '@/hooks/useAuth';

interface ProfileEditorProps {
  displayName: string;
}

const ProfileEditor = ({ displayName }: ProfileEditorProps) => {
  const { user } = useAuth();

  return (
    <div className="grocer-input-card flex items-center gap-4 mb-4">
      {/* Avatar */}
      <div className="relative">
        <div className="w-14 h-14 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center">
          <span className="text-xl font-bold text-primary">
            {displayName?.charAt(0)?.toUpperCase() || '?'}
          </span>
        </div>
      </div>

      {/* Name */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold truncate">{displayName}</p>
        <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
      </div>
    </div>
  );
};

export default ProfileEditor;

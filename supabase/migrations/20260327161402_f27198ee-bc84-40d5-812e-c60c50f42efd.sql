
ALTER TABLE public.profiles
ADD COLUMN dietary_preferences text[] DEFAULT '{}',
ADD COLUMN allergens text[] DEFAULT '{}',
ADD COLUMN family_members jsonb DEFAULT '[]';

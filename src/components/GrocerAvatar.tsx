import { motion } from 'framer-motion';
import { Leaf } from 'lucide-react';

interface GrocerAvatarProps {
  size?: 'sm' | 'md' | 'lg';
  speaking?: boolean;
}

const sizes = { sm: 'w-8 h-8', md: 'w-10 h-10', lg: 'w-14 h-14' };
const iconSizes = { sm: 14, md: 16, lg: 22 };

const GrocerAvatar = ({ size = 'md', speaking = false }: GroCerAvatarProps) => (
  <motion.div
    className={`${sizes[size]} rounded-full bg-primary flex items-center justify-center flex-shrink-0`}
    animate={speaking ? { scale: [1, 1.05, 1] } : {}}
    transition={speaking ? { repeat: Infinity, duration: 2, ease: 'easeInOut' } : {}}
  >
    <Leaf className="text-primary-foreground" size={iconSizes[size]} />
  </motion.div>
);

export default GrocerAvatar;

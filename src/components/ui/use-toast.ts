import { toast } from '@/components/ui/toast';

interface ToastProps {
  title?: string;
  description: string;
  duration?: number;
}

export const useToast = () => {
  return {
    toast: ({ title, description, duration = 3000 }: ToastProps) => {
      toast({
        title,
        description,
        duration,
      });
    },
  };
}; 
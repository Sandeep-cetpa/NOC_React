import { useAppSelector } from '@/app/hooks';
import { environment } from '@/config';

export const useAppName = () => {
  const applications = useAppSelector((state) => state.applications.applications);

  const currentApplication = applications.find((app) => app.id === environment.applicationId) ?? {
    name: 'Task Management',
    hindiName: 'e-प्रबंधन',
    description: 'Task Management',
  };

  return {
    name: currentApplication.name,
    hindiName: currentApplication.hindiName,
    description: currentApplication.description,
    fullName: `${currentApplication.hindiName} / ${currentApplication.name}`,
    fullDescription: `${currentApplication.hindiName} / ${currentApplication.name} || DFCCIL`,
  };
};

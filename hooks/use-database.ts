import { useEffect } from 'react';
import { databaseService } from '@/database/service';

export function useDatabase() {
  useEffect(() => {
    databaseService.initialize();
  }, []);
}

import { createContext, useContext, useState, type ReactNode } from 'react';

export type ListDensity = 'comfortable' | 'compact';

interface DensityContextValue {
  density: ListDensity;
  toggleDensity: () => void;
}

const DensityContext = createContext<DensityContextValue>({
  density: 'compact',
  toggleDensity: () => {},
});

export function DensityProvider({ children }: { children: ReactNode }) {
  const [density, setDensity] = useState<ListDensity>('compact');
  const toggleDensity = () => setDensity((d) => (d === 'compact' ? 'comfortable' : 'compact'));
  return (
    <DensityContext.Provider value={{ density, toggleDensity }}>
      {children}
    </DensityContext.Provider>
  );
}

export function useDensity() {
  return useContext(DensityContext);
}

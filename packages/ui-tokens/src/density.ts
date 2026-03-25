export const density = {
  comfortable: {
    rowHeight: '36px',
    controlHeight: {
      sm: '28px',
      md: '32px',
      lg: '36px',
    },
    cellPaddingY: '10px',
  },
  compact: {
    rowHeight: '28px',
    controlHeight: {
      sm: '24px',
      md: '28px',
      lg: '32px',
    },
    cellPaddingY: '4px',
  },
} as const;

export type DensityMode = keyof typeof density;

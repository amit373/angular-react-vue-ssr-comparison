export type ClassValue =
  | string
  | number
  | false
  | null
  | undefined
  | ClassValue[]
  | Record<string, boolean | null | undefined>;

export const cn = (...inputs: ClassValue[]): string => {
  const classes: string[] = [];

  const push = (v: ClassValue) => {
    if (!v) return;
    if (typeof v === 'string' || typeof v === 'number') {
      classes.push(String(v));
      return;
    }
    if (Array.isArray(v)) {
      for (const x of v) push(x);
      return;
    }
    for (const [k, on] of Object.entries(v)) {
      if (on) classes.push(k);
    }
  };

  for (const input of inputs) push(input);
  return classes.join(' ');
};

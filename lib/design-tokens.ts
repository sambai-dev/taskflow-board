export const colors = {
  primary: {
    blue600: '#2563eb',
    blue500: '#3b82f6',
    blue100: '#dbeafe',
    blue50: '#eff6ff',
  },
  neutral: {
    white: '#ffffff',
    gray900: '#111827',
    gray600: '#4b5563',
    gray100: '#f3f4f6',
  },
};

export const typography = {
  hero: 'text-7xl font-bold',
  h2: 'text-5xl font-bold',
  h3: 'text-2xl font-semibold',
  body: 'text-xl',
};

export const animation = {
  fadeIn: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  },
  hoverLift: {
    whileHover: { y: -8 },
  },
};

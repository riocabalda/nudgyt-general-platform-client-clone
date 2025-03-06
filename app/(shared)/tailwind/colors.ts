const colors = {
  brandcolora: 'hsl(var(--brandcolora))',
  'brandcolora-foreground': 'hsl(var(--brandcolora-foreground))',
  brandcolorb: 'hsl(var(--brandcolorb))',
  'brandcolorb-foreground': 'hsl(var(--brandcolorb-foreground))',
  brandcolorc: 'hsl(var(--brandcolorc))',
  'brandcolorc-foreground': 'hsl(var(--brandcolorc-foreground))',
  brandcolord: 'hsl(var(--brandcolord))',
  'brandcolord-foreground': 'hsl(var(--brandcolord-foreground))',
  brandcolore: 'hsl(var(--brandcolore))',
  'brandcolore-foreground': 'hsl(var(--brandcolore-foreground))',
  brandcolorf: 'hsl(var(--brandcolorf))',
  'brandcolorf-foreground': 'hsl(var(--brandcolorf-foreground))',
  success: 'hsl(var(--success))',
  'success-foreground': 'hsl(var(--success-foreground))',
  border: 'hsl(var(--border))',
  input: 'hsl(var(--input))',
  ring: 'hsl(var(--ring))',
  background: 'hsl(var(--background))',
  foreground: 'hsl(var(--foreground))',
  'foreground-800': 'hsl(var(--foreground-800))',
  destructive: {
    DEFAULT: 'hsl(var(--destructive))',
    foreground: 'hsl(var(--destructive-foreground))'
  },
  muted: {
    DEFAULT: 'hsl(var(--muted))',
    foreground: 'hsl(var(--muted-foreground))'
  },
  accent: {
    DEFAULT: 'hsl(var(--accent))',
    foreground: 'hsl(var(--accent-foreground))'
  },
  popover: {
    DEFAULT: 'hsl(var(--popover))',
    foreground: 'hsl(var(--popover-foreground))'
  },
  card: {
    DEFAULT: 'hsl(var(--card))',
    foreground: 'hsl(var(--card-foreground))'
  },

  'neutral-gray': {
    50: '#F9FAFB',
    100: '#F4F5F7',
    200: '#EDEEF1',
    300: '#DADCDE',
    400: '#CBCDD0',
    500: '#A3A5A8',
    600: '#727679',
    800: '#393C3F'
  },
  primary: {
    100: '#EADEFF',
    500: '#5C05F2'
  },
  frost: {
    500: '#D4E3F2'
  },
  purple: {
    500: '#7B4DB0'
  },
  teal: {
    500: '#0095A9'
  },
  'purple-shade': {
    lightest: '#BBA4E1',
    lighter: '#A17AD2',
    base: '#7B4DB0', // Same as purple-500 above, but this might be better to avoid overriding Tailwind's default
    darkest: '#51346F',
    darkest2: '#5C05F2'
  },
  'teal-shade': {
    lightest: '#80CAD4',
    lighter: '#3BD1DA',
    base: '#0095A9', // Same as teal-500 above, but this might be better to avoid overriding Tailwind's default
    darkest: '#0E5B6B'
  },
  tier: {
    bronze: {
      from: '#DE9D62',
      to: '#9A4202'
    },
    silver: {
      from: '#ADB5BD',
      to: '#6C757D'
    },
    gold: {
      from: '#FFD700',
      to: '#DAA520'
    }
  }
}

export default colors

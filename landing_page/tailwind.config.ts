import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			dark: {
  				950: 'var(--dark-950)',
  				900: 'var(--dark-900)',
  				850: 'var(--dark-850)',
  				800: 'var(--dark-800)',
  			},
  			brand: {
  				primary: {
  					DEFAULT: 'var(--brand-primary)',
  					hover: 'var(--brand-primary-hover)',
  					glow: 'var(--brand-primary-glow)',
  					dim: 'var(--brand-primary-dim)',
  				},
  			},
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		fontFamily: {
  			sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
  			display: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
  		},
  		fontSize: {
  			display: ['10rem', { lineHeight: '0.9', letterSpacing: '-0.04em' }],
  			hero: ['8rem', { lineHeight: '0.95', letterSpacing: '-0.03em' }],
  			mega: ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
  			xl: ['1.25rem', { lineHeight: '1.7' }],
  			lg: ['1.125rem', { lineHeight: '1.7' }],
  			base: ['1rem', { lineHeight: '1.65' }],
  		},
  		spacing: {
  			18: '4.5rem',
  			22: '5.5rem',
  			26: '6.5rem',
  			30: '7.5rem',
  			36: '9rem',
  			48: '12rem',
  			60: '15rem',
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			},
  			'shimmer': {
  				'0%': { backgroundPosition: '-200% 0' },
  				'100%': { backgroundPosition: '200% 0' },
  			},
  			'glow-pulse': {
  				'0%, 100%': { opacity: '0.5', filter: 'blur(20px)' },
  				'50%': { opacity: '1', filter: 'blur(30px)' },
  			},
  			'float': {
  				'0%, 100%': { transform: 'translateY(0px)' },
  				'50%': { transform: 'translateY(-20px)' },
  			},
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			'shimmer': 'shimmer 2s linear infinite',
  			'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
  			'float': 'float 6s ease-in-out infinite',
  		},
  		backgroundSize: {
  			'200': '200%',
  		},
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;

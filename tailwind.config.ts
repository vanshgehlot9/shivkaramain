import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        // Custom color palette
        lavender: "#9C89B8",
        pink: "#F0A6CA",
        "light-pink": "#EFC3E6",
        "very-light-pink": "#F0E6EF",
        "light-blue": "#B8BEDD",
        teal: "#219ebc",
        // Extended palette with variations
        "lavender-light": "#219ebc",
        "lavender-dark": "#8A7AA0",
        "pink-light": "#F4B8D4",
        "pink-dark": "#E095B8",
        "light-pink-light": "#F5D0ED",
        "light-pink-dark": "#E7B0D8",
        "very-light-pink-light": "#F8F0F7",
        "very-light-pink-dark": "#E8D8E7",
        "light-blue-light": "#C8D0E8",
        "light-blue-dark": "#A8B0D0",
        "teal-light": "#4FC3F7",
        "teal-dark": "#1976D2",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-down": {
          "0%": { opacity: "0", transform: "translateY(-20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-left": {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "slide-in-right": {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-5px)" },
        },
        "float-delayed": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "pulse-slow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        "gradient-x": {
          "0%, 100%": {
            "background-size": "200% 200%",
            "background-position": "left center",
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "right center",
          },
        },
        "gradient-y": {
          "0%, 100%": {
            "background-size": "200% 200%",
            "background-position": "center top",
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "center bottom",
          },
        },
        "gradient-xy": {
          "0%, 100%": {
            "background-size": "400% 400%",
            "background-position": "left center",
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "right center",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "fade-in-up": "fade-in-up 0.5s ease-out",
        "fade-in-down": "fade-in-down 0.5s ease-out",
        "slide-in-left": "slide-in-left 0.5s ease-out",
        "slide-in-right": "slide-in-right 0.5s ease-out",
        "scale-in": "scale-in 0.5s ease-out",
        "float": "float 3s ease-in-out infinite",
        "float-slow": "float-slow 4s ease-in-out infinite",
        "float-delayed": "float-delayed 3.5s ease-in-out infinite",
        "pulse-slow": "pulse-slow 3s ease-in-out infinite",
        "gradient-x": "gradient-x 15s ease infinite",
        "gradient-y": "gradient-y 15s ease infinite",
        "gradient-xy": "gradient-xy 15s ease infinite",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-glass": "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
        "gradient-hero": "linear-gradient(135deg, #9C89B8 0%, #F0A6CA 100%)",
        "gradient-primary": "linear-gradient(135deg, #9C89B8 0%, #F0A6CA 100%)",
        "gradient-secondary": "linear-gradient(135deg, #EFC3E6 0%, #B8BEDD 100%)",
        "gradient-accent": "linear-gradient(135deg, #F0A6CA 0%, #EFC3E6 100%)",
        "gradient-warm": "linear-gradient(135deg, #F0A6CA 0%, #F0E6EF 100%)",
        "gradient-cool": "linear-gradient(135deg, #B8BEDD 0%, #F0E6EF 100%)",
        "gradient-dark": "linear-gradient(135deg, #8A7AA0 0%, #E095B8 100%)",
        "gradient-light": "linear-gradient(135deg, #F0E6EF 0%, #EFC3E6 100%)",
        "gradient-lavender": "linear-gradient(135deg, #9C89B8 0%, #B8BEDD 100%)",
        "gradient-pink": "linear-gradient(135deg, #F0A6CA 0%, #EFC3E6 100%)",
        "gradient-soft": "linear-gradient(135deg, #F0E6EF 0%, #EFC3E6 100%)",
        "gradient-teal": "linear-gradient(135deg, #219ebc 0%, #B8BEDD 100%)",
        "gradient-mixed": "linear-gradient(135deg, #9C89B8 0%, #F0A6CA 50%, #EFC3E6 100%)",
        "gradient-pastel": "linear-gradient(135deg, #F0E6EF 0%, #EFC3E6 50%, #B8BEDD 100%)",
        "gradient-teal-pink": "linear-gradient(135deg, #219ebc 0%, #F0A6CA 100%)",
        "gradient-lavender-teal": "linear-gradient(135deg, #9C89B8 0%, #219ebc 100%)",
      },
      boxShadow: {
        "glass": "0 8px 32px 0 rgba(156, 137, 184, 0.37)",
        "glass-light": "0 8px 32px 0 rgba(156, 137, 184, 0.1)",
        "glow": "0 0 20px rgba(156, 137, 184, 0.5)",
        "glow-pink": "0 0 20px rgba(240, 166, 202, 0.5)",
        "glow-lavender": "0 0 20px rgba(156, 137, 184, 0.5)",
        "glow-soft": "0 0 20px rgba(239, 195, 230, 0.5)",
        "glow-teal": "0 0 20px rgba(33, 158, 188, 0.5)",
        "inner-glow": "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
        "soft": "0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)",
        "medium": "0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        "large": "0 10px 40px -10px rgba(0, 0, 0, 0.15), 0 2px 10px -2px rgba(0, 0, 0, 0.05)",
        "xl-soft": "0 20px 60px -12px rgba(0, 0, 0, 0.08), 0 4px 20px -4px rgba(0, 0, 0, 0.03)",
        "lavender": "0 4px 14px 0 rgba(156, 137, 184, 0.39)",
        "pink": "0 4px 14px 0 rgba(240, 166, 202, 0.39)",
        "teal": "0 4px 14px 0 rgba(33, 158, 188, 0.39)",
        "soft-lavender": "0 2px 8px 0 rgba(156, 137, 184, 0.2)",
        "soft-pink": "0 2px 8px 0 rgba(240, 166, 202, 0.2)",
        "soft-teal": "0 2px 8px 0 rgba(33, 158, 188, 0.2)",
      },
      backdropBlur: {
        xs: "2px",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "Noto Sans", "sans-serif"],
        display: ["Inter", "ui-sans-serif", "system-ui"],
        body: ["Inter", "ui-sans-serif", "system-ui"],
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.75rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
        "5xl": ["3rem", { lineHeight: "1" }],
        "6xl": ["3.75rem", { lineHeight: "1" }],
        "7xl": ["4.5rem", { lineHeight: "1" }],
        "8xl": ["6rem", { lineHeight: "1" }],
        "9xl": ["8rem", { lineHeight: "1" }],
      },
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
        "128": "32rem",
        "144": "36rem",
      },
      maxWidth: {
        "8xl": "88rem",
        "9xl": "96rem",
      },
      zIndex: {
        "60": "60",
        "70": "70",
        "80": "80",
        "90": "90",
        "100": "100",
      },
      transitionProperty: {
        "height": "height",
        "spacing": "margin, padding",
      },
      transitionDuration: {
        "400": "400ms",
        "600": "600ms",
        "800": "800ms",
        "1000": "1000ms",
        "1500": "1500ms",
        "2000": "2000ms",
      },
      transitionTimingFunction: {
        "bounce-in": "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        "smooth": "cubic-bezier(0.4, 0, 0.2, 1)",
        "ease-out-quart": "cubic-bezier(0.25, 1, 0.5, 1)",
        "ease-in-quart": "cubic-bezier(0.5, 0, 0.75, 0)",
      },
    },
  },
  plugins: [],
};

export default config;

// Global Themes Configuration
const THEMES = [
    // --- FRESH LIQUID & FLUID ART ---
    { url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1920&q=80', color: '#00ffff' }, // Electric Blue Liquid
    { url: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=1920&q=80', color: '#8a2be2' }, // Dark Purple Swirl
    { url: 'https://images.unsplash.com/photo-1604076913837-52ab5629fba9?auto=format&fit=crop&w=1920&q=80', color: '#ffd700' }, // Golden Oil Flow
    { url: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?auto=format&fit=crop&w=1920&q=80', color: '#00fa9a' }, // Neon Green Fluid
    { url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1920&q=80', color: '#ff69b4' }, // Pastel Pink/Blue Marble

    // --- NEON & CYBERPUNK ---
    { url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1920&q=80', color: '#9d4edd' }, // Cyberpunk City Rain (Purple)
    { url: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1920&q=80', color: '#ff00ff' }, // Neon Magenta Abstract (Kept as favorite base style but fresh link if possible)
    { url: 'https://images.unsplash.com/photo-1581822261290-991b38693d13?auto=format&fit=crop&w=1920&q=80', color: '#4361ee' }, // Blue Neon Tech
    { url: 'https://images.unsplash.com/photo-1535868463750-c78d9543614f?auto=format&fit=crop&w=1920&q=80', color: '#f72585' }, // Pink Neon Glow

    // --- DIGITAL & 3D ABSTRACT ---
    { url: 'https://images.unsplash.com/photo-1618544199616-aeffb226e6fa?auto=format&fit=crop&w=1920&q=80', color: '#7209b7' }, // Deep 3D Purple
    { url: 'https://images.unsplash.com/photo-1620121692029-d088224ddc74?auto=format&fit=crop&w=1920&q=80', color: '#3f37c9' }, // Geometric Dark Blue
    { url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1920&q=80', color: '#fb8500' }, // Orange/Blue Contrast
    { url: 'https://images.unsplash.com/photo-1617791160505-6f00504e3519?auto=format&fit=crop&w=1920&q=80', color: '#ff006e' }, // Hot Pink 3D Shapes

    // --- DARK TEXTURED ---
    { url: 'https://images.unsplash.com/photo-1605218457336-92716447c2f0?auto=format&fit=crop&w=1920&q=80', color: '#ffffff' }, // Black & White Marble (White accent)
    { url: 'https://images.unsplash.com/photo-1614730341194-75c60740a2d3?auto=format&fit=crop&w=1920&q=80', color: '#ffbe0b' }, // Gold Particles on Black
    { url: 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?auto=format&fit=crop&w=1920&q=80', color: '#3a86ff' }, // Blue Smoke

    // --- VIBRANT & COLORFUL ---
    { url: 'https://images.unsplash.com/photo-1502014822147-1aed806137cc?auto=format&fit=crop&w=1920&q=80', color: '#aacc00' }, // Lime Green Abstract
    { url: 'https://images.unsplash.com/photo-1550005886-92758ca912b7?auto=format&fit=crop&w=1920&q=80', color: '#ff0054' }, // Red/Pink Explosion
    { url: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=1920&q=80', color: '#f15bb5' }, // Soft Pink/Purple Gradient
];

// Supabase Configuration
// RENAME THIS FILE TO 'config.js' AND FILL IN YOUR DETAILS
const SUPABASE_URL = 'https://cropltgcbhpvtttfgitx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNyb3BsdGdjYmhwdnR0dGZnaXR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5MTc3ODcsImV4cCI6MjA4NjQ5Mzc4N30.G_d71M52Vi-uSmZ5tIEEC3j0et6dn-XRAj2UoxXmC8s';

// Initialize Supabase Client
let supabaseClient;
if (typeof supabase !== 'undefined') {
    const { createClient } = supabase;
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} else {
    console.warn('Supabase not loaded.');
}

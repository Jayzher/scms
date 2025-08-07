// Tailwind configuration
tailwind.config = {
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: '#3b82f6',
                secondary: '#64748b',
                // Azure color palette for dark mode
                azure: {
                    100: '#e6f3ff',
                    200: '#bde0ff',
                    300: '#80c7ff',
                    400: '#40a9ff',
                    500: '#1890ff',
                    600: '#096dd9',
                    700: '#0050b3',
                    800: '#003a8c',
                    900: '#002766'
                },
                // Color scheme palette
                'scheme-blue': '#3b82f6',
                'scheme-green': '#10b981',
                'scheme-purple': '#8b5cf6',
                'scheme-red': '#ef4444',
                'scheme-yellow': '#f59e0b',
                'scheme-pink': '#ec4899',
                'scheme-indigo': '#6366f1',
                'scheme-gray': '#4b5563'
            }
        }
    }
}

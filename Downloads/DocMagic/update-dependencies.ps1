Write-Host "Updating DocMagic dependencies..." -ForegroundColor Cyan

# Update dependencies
npm install @google/generative-ai@^0.3.1 @stripe/stripe-js@^3.5.0 @supabase/auth-helpers-nextjs@^0.10.0 @supabase/supabase-js@^2.52.0 eslint@^8.57.1 framer-motion@^12.23.6 jspdf@^2.5.2 next-themes@^0.4.6 officeparser@^5.2.0 postcss@^8.5.6 react@^18.3.1 react-dom@^18.3.1 react-hook-form@^7.60.0 react-resizable-panels@^2.1.9 recharts@^2.15.4 sonner@^1.7.4 stripe@^14.25.0 tailwind-merge@^2.6.0 tailwindcss@3.4.17 zod@^3.25.76 zustand@^4.5.7 @types/react@19.1.8

Write-Host "Dependencies updated successfully!" -ForegroundColor Green
Write-Host "Please run 'npm run dev' to test the application with the updated dependencies." -ForegroundColor Yellow

import { createRoot } from 'react-dom/client';
import './index.css';
import { Provider } from 'react-redux';
import { store } from './app/routes/store.tsx';
import AppRoutes from './app/routes/AppRoutes.tsx';
import { ClerkProvider } from '@clerk/clerk-react';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Clerk Publishable Key — add VITE_CLERK_PUBLISHABLE_KEY to your .env.local file');
}

createRoot(document.getElementById('root')!).render(
  <ClerkProvider
    publishableKey={PUBLISHABLE_KEY}
    appearance={{
      baseTheme: undefined,
      variables: {
        colorPrimary: '#FFFFFF',
        colorBackground: '#08080A',
        colorInputBackground: '#111114',
        colorInputText: '#FFFFFF',
        colorText: '#FFFFFF',
        colorTextSecondary: '#A3A3A3',
        colorNeutral: '#17171A',
        colorDanger: '#EF4444',
        colorSuccess: '#10B981',
        borderRadius: '0.85rem',
        fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif",
      },
      elements: {
        rootBox: 'w-full',
        card: 'bg-[#08080a] border border-white/15 shadow-2xl shadow-black/90 backdrop-blur-2xl rounded-2xl',
        headerTitle: 'text-white font-display font-extrabold tracking-tight text-xl',
        headerSubtitle: 'text-neutral-400 font-sans text-xs',
        socialButtonsBlockButton:
          'bg-white/[0.04] border border-white/15 text-white hover:bg-white/[0.08] hover:border-white/35 transition-all font-sans font-medium',
        dividerLine: 'bg-white/10',
        dividerText: 'text-neutral-500 font-mono text-[10px] uppercase tracking-wider',
        formFieldLabel: 'text-neutral-300 font-medium font-sans text-xs',
        formFieldInput:
          'bg-[#111114] border border-white/15 text-white placeholder:text-neutral-500 focus:border-white focus:ring-1 focus:ring-white/30 rounded-xl transition-all',
        formButtonPrimary:
          'bg-white hover:bg-neutral-200 text-black font-bold uppercase font-mono tracking-wider text-xs rounded-xl py-3.5 transition-all shadow-lg shadow-white/15 active:scale-[0.98]',
        footerActionLink: 'text-white hover:text-neutral-300 underline underline-offset-4 font-medium transition-colors',
        identityPreviewText: 'text-white',
        identityPreviewEditButton: 'text-neutral-300 hover:text-white',
        formResendCodeLink: 'text-white hover:text-neutral-300 font-medium',
        alertText: 'text-neutral-300',
        userButtonAvatarBox: 'ring-2 ring-white/30 hover:ring-white/70 transition-all',
        userButtonPopoverCard:
          'bg-[#08080a] border border-white/15 shadow-2xl shadow-black/90 backdrop-blur-xl text-white',
        userButtonPopoverActionButton: 'text-neutral-200 hover:bg-white/10 hover:text-white transition-colors',
        userButtonPopoverActionButtonText: 'text-neutral-200',
        userButtonPopoverFooter: 'hidden',
        userPreviewMainIdentifier: 'text-white font-semibold',
        userPreviewSecondaryIdentifier: 'text-neutral-400',
        profileSectionTitle: 'text-white font-display font-bold',
        profileSectionTitleText: 'text-white',
        profileSectionContent: 'text-neutral-300',
        accordionTriggerButton: 'text-neutral-200 hover:bg-white/[0.06]',
        badge: 'bg-white/10 text-white border border-white/20',
        navbar: 'bg-[#08080a] border-r border-white/15',
        navbarButton: 'text-neutral-400 hover:text-white hover:bg-white/[0.06]',
        navbarButtonIcon: 'text-neutral-400',
      },
    }}
  >
    <Provider store={store}>
      <AppRoutes />
    </Provider>
  </ClerkProvider>
);

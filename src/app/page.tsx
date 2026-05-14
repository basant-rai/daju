import React from 'react';
// import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import { CheckIcon, ArrowRightIcon, ZapIcon, ShieldCheckIcon, HeartIcon } from 'lucide-react';
import Logo from '@/components/logo/logo';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#FDFCF7] font-sans text-slate-900">
      {/* --- Navigation --- */}
      <nav className="flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
        <Logo />
        <div className="flex items-center gap-6">
          <button className="text-sm font-semibold text-slate-600 hover:text-blue-700">Login</button>
          <button className="bg-blue-700 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-blue-200 hover:bg-blue-800 transition-all">
            Get Started
          </button>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      {/* <section className="px-6 pt-20 pb-32 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 px-4 py-1.5 rounded-full text-emerald-700 text-sm font-medium mb-8">
          <HeartIcon size={14} /> Built for the Nepali Neighbourhood
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold text-blue-950 mb-6 leading-tight">
          Attendance software that feels like <span className="text-blue-700">Family.</span>
        </h1>
        <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          Forget heavy apps and broken scanners. Daju is the reliable digital assistant that manages your members via a simple WhatsApp link. Fast, cheap, and trustable.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="w-full sm:w-auto bg-blue-700 text-white px-8 py-4 rounded-2xl text-lg font-bold hover:scale-105 transition-transform flex items-center justify-center gap-2">
            Start your free trial <ArrowRightIcon size={20} />
          </button>
          <button className="w-full sm:w-auto bg-white border-2 border-slate-200 text-slate-700 px-8 py-4 rounded-2xl text-lg font-bold hover:bg-slate-50">
            See how it works
          </button>
        </div>
      </section> */}

      <section className="px-6 pt-20 pb-32 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 px-4 py-1.5 rounded-full text-emerald-700 text-sm font-medium mb-8">
          <HeartIcon size={14} /> Made for Nepal’s local businesses
        </div>

        {/* The New Hook */}
        <h1 className="text-5xl md:text-7xl font-extrabold text-blue-950 mb-6 leading-tight">
          The smartest way to say <span className="text-blue-700">"Welcome."</span>
        </h1>

        <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          Daju replaces your messy notebooks with a <strong>simple digital key</strong> sent straight to WhatsApp. No apps, no scanners, no headaches. Just a reliable system that recognizes your people instantly.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="w-full sm:w-auto bg-blue-700 text-white px-8 py-4 rounded-2xl text-lg font-bold hover:scale-105 transition-transform flex items-center justify-center gap-2">
            Get your Digital Khata <ArrowRightIcon size={20} />
          </button>
        </div>
      </section>

      {/* --- The "Daju" Difference --- */}
      <section className="bg-white py-24 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12">
          <FeatureCard
            icon={<ZapIcon className="text-blue-600" />}
            title="One-Tap Entry"
            description="Members get a unique link on WhatsApp. No app to download. They tap, they're in."
          />
          <FeatureCard
            icon={<ShieldCheckIcon className="text-blue-600" />}
            title="Reliable Records"
            description="Like a true Daju, the system never forgets. Accurate logs of every entry and expiry."
          />
          <FeatureCard
            icon={<CheckIcon className="text-blue-600" />}
            title="Built for Nepal"
            description="Works perfectly on slow data. Designed for gym owners who value simplicity over complex tech."
          />
        </div>
      </section>

      {/* --- Pricing Section --- */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-blue-950 mb-4">Simple, Honest Pricing</h2>
          <p className="text-slate-600">No hidden fees. No hardware costs. Just Daju helping you out.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <PriceCard
            duration="1 Month"
            price="1499"
            subtitle="Perfect for small setups"
            features={['Unlimited Members', 'WhatsApp Link Support', 'Basic Analytics']}
          />
          <PriceCard
            duration="3 Months"
            price="999"
            perMonth
            popular
            subtitle="The neighbourhood favorite"
            features={['Unlimited Members', 'Priority Support', 'Expiry Reminders', 'Daily Reports']}
          />
          <PriceCard
            duration="Annual"
            price="799"
            perMonth
            subtitle="Long-term commitment"
            features={['Everything in 3 Months', 'Custom Branding', 'Lead Architect Support']}
          />
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="bg-blue-950 text-blue-200 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-white text-xl font-bold">Daju</h3>
            <p className="text-sm">Reliable. Local. Simple.</p>
          </div>
          <p className="text-sm">© 2026 Daju Systems. Crafted with care in Nepal.</p>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: any) => (
  <div className="flex flex-col items-center text-center p-4">
    <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-blue-950 mb-3">{title}</h3>
    <p className="text-slate-600 leading-relaxed">{description}</p>
  </div>
);

const PriceCard = ({ duration, price, subtitle, features, popular, perMonth }: any) => (
  <div className={`relative p-8 rounded-3xl border-2 transition-all hover:shadow-xl ${popular ? 'border-blue-600 bg-white scale-105 z-10' : 'border-slate-100 bg-slate-50/50'}`}>
    {popular && (
      <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
        Most Popular
      </span>
    )}
    <h3 className="text-xl font-bold text-slate-900 mb-1">{duration}</h3>
    <p className="text-slate-500 text-sm mb-6">{subtitle}</p>
    <div className="flex items-baseline gap-1 mb-8">
      <span className="text-4xl font-black text-blue-950">Rs. {price}</span>
      {perMonth && <span className="text-slate-500 font-medium">/month</span>}
    </div>
    <ul className="space-y-4 mb-8">
      {features.map((f, i) => (
        <li key={i} className="flex items-center gap-3 text-slate-700 text-sm font-medium">
          <CheckIcon className="text-emerald-500" size={18} /> {f}
        </li>
      ))}
    </ul>
    <button className={`w-full py-4 rounded-xl font-bold transition-colors ${popular ? 'bg-blue-700 text-white hover:bg-blue-800' : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-blue-700 hover:text-blue-700'}`}>
      Choose {duration}
    </button>
  </div>
);

export default LandingPage;
'use client';

import { useBooking } from './context';
import Landing from '@/app/features/booking/components/Landing';
import UnitSelection from '@/app/features/booking/components/UnitSelection';
import DaysSelection from '@/app/features/booking/components/DaysSelection';
import AccessGranted from '@/app/features/booking/components/AccessGranted';
import ExtendStay from '@/app/features/booking/components/ExtendStay';
import Expiration from '@/app/features/booking/components/Expiration';
import Payment from '@/app/features/payment/components/Payment';
import IdentityVerification from '@/app/features/identity/components/IdentityVerification';
import { AuthModal } from '@/app/features/auth/components';
import Header from '@/app/shared/components/Header';
import Footer from '@/app/shared/components/Footer';

export default function Home() {
  const { state } = useBooking();

  const renderStep = () => {
    switch (state.step) {
      case 'landing':
        return <Landing />;
      case 'unit-selection':
        return <UnitSelection />;
      case 'days-selection':
        return <DaysSelection />;
      case 'payment':
        return <Payment />;
      case 'identity-verification':
        return <IdentityVerification />;
      case 'access-granted':
        return <AccessGranted />;
      case 'extend-stay':
        return <ExtendStay />;
      case 'expiration':
        return <Expiration />;
      default:
        return <Landing />;
    }
  };

  return (
    <main className="min-h-screen bg-slate-900 flex flex-col">
      <Header />
      <div className="flex-1">
        {renderStep()}
      </div>
      <Footer />
      <AuthModal />
    </main>
  );
}

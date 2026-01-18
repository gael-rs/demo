'use client';

import { useBooking } from './context';
import {
  Landing,
  UnitSelection,
  DaysSelection,
  Payment,
  IdentityVerification,
  AccessGranted,
  ExtendStay,
  Expiration,
} from './components';
import { AuthScreen } from './components/auth';

export default function Home() {
  const { state } = useBooking();

  const renderStep = () => {
    switch (state.step) {
      case 'landing':
        return <Landing />;
      case 'auth':
        return <AuthScreen />;
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

  return <main className="min-h-screen">{renderStep()}</main>;
}

"use client";

import { RegistrationPage } from '@/components/registration/registration-page';

export default function CompanyRegistrationPage() {
  // In a real app, you'd get the userId from session/auth
  // For now, using a placeholder
  const userId = "temp-user-id"; // TODO: Get from session

  return <RegistrationPage userType="company" userId={userId} />;
}

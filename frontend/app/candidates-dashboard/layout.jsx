// app/employers-dashboard/layout.jsx
import OnboardingGuard from '@/components/auth/OnboardingGuard';

export default function EmployersDashboardLayout({ children }) {
  return (
    <OnboardingGuard>
      <div className="dashboard-wrapper">
        {/* Add any common dashboard elements here like sidebar, header, etc */}
        {children}
      </div>
    </OnboardingGuard>
  );
}
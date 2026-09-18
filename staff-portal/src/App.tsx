import { Routes, Route } from 'react-router-dom';
import { AppShell } from '@/components/AppShell';
import { Placeholder } from '@/pages/Placeholder';
import { Today } from '@/pages/Today';
import { StudentProfile } from '@/pages/StudentProfile';
import { RaiseConcern } from '@/pages/RaiseConcern';
import { MedicalDaily } from '@/portals/medical/MedicalDaily';
import { HealthcarePlans } from '@/portals/medical/HealthcarePlans';
import { AllergiesMedication } from '@/portals/medical/AllergiesMedication';
import { WellbeingOverview } from '@/portals/wellbeing/WellbeingOverview';
import { SupportPlans } from '@/portals/wellbeing/SupportPlans';
import { CounsellingReferrals } from '@/portals/wellbeing/CounsellingReferrals';
import { YearPatterns } from '@/portals/wellbeing/YearPatterns';
import { TriageQueue } from '@/portals/safeguarding/TriageQueue';
import { Register } from '@/portals/safeguarding/Register';
import { Stalled } from '@/portals/safeguarding/Stalled';
import { CaseView } from '@/portals/safeguarding/CaseView';
import { ActivitiesList } from '@/pages/ActivitiesList';
import { TripView } from '@/pages/TripView';
import { Reporting } from '@/pages/Reporting';
import { Settings } from '@/pages/Settings';

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Today />} />
        <Route path="/raise-concern" element={<RaiseConcern />} />
        <Route path="/students/:studentId" element={<StudentProfile />} />

        <Route path="/medical" element={<MedicalDaily />} />
        <Route path="/medical/plans" element={<HealthcarePlans />} />
        <Route path="/medical/allergies" element={<AllergiesMedication />} />

        <Route path="/wellbeing" element={<WellbeingOverview />} />
        <Route path="/wellbeing/plans" element={<SupportPlans />} />
        <Route path="/wellbeing/referrals" element={<CounsellingReferrals />} />
        <Route path="/wellbeing/patterns" element={<YearPatterns />} />

        <Route path="/safeguarding" element={<Register />} />
        <Route path="/safeguarding/triage" element={<TriageQueue />} />
        <Route path="/safeguarding/register" element={<Register />} />
        <Route path="/safeguarding/stalled" element={<Stalled />} />
        <Route path="/safeguarding/cases/:caseId" element={<CaseView />} />

        <Route path="/activities" element={<ActivitiesList />} />
        <Route path="/activities/:activityId" element={<TripView />} />

        <Route path="/reporting" element={<Reporting />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Placeholder title="Not found" />} />
      </Routes>
    </AppShell>
  );
}

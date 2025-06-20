import { useState } from 'react';
import AfyakenDashboard from '@/components/Dashboards/AfyakenDashboard';
import EdukenDashboard from '@/components/Dashboards/EdukenDashboard';
type DashboardType = 'EdukenDashboard' | 'AfyakenDashboard';
const DataDashboards = () => {
  const [componentToRender, setComponentToRender] =
    useState<DashboardType | null>(null);

  const renderEdukenDashboard = () => setComponentToRender('EdukenDashboard');
  const renderAfyakenDashboard = () => setComponentToRender('AfyakenDashboard');

  return (
    <div className="mt-40 text-center">
      <div id="Buttons" className=" ">
        <button
          onClick={renderEdukenDashboard}
          className="border-n-3 hover:bg-n-5 cursor-pointer rounded-xl border px-4 py-3 md:mr-10 md:px-9"
        >
          EduKen
        </button>

        <button
          onClick={renderAfyakenDashboard}
          className="border-n-3 hover:bg-n-5 cursor-pointer rounded-xl border px-4 py-3 md:mr-10 md:px-9"
        >
          Afyaken
        </button>
      </div>

      <div id="dashboards" className="child-container">
        {componentToRender === 'EdukenDashboard' && <EdukenDashboard />}
        {componentToRender === 'AfyakenDashboard' && <AfyakenDashboard />}
      </div>
    </div>
  );
};

export default DataDashboards;

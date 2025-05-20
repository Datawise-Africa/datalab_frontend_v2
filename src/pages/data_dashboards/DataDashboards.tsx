import { useState } from 'react';
import AfyakenDashboard from '../../components/Dashboards/AfyakenDashboard';
import EdukenDashboard from '../../components/Dashboards/EdukenDashboard';

const DataDashboards = () => {
  const [componentToRender, setComponentToRender] = useState(null);

  const renderEdukenDashboard = () => setComponentToRender('EdukenDashboard');
  const renderAfyakenDashboard = () => setComponentToRender('AfyakenDashboard');

  return (
    <div className="text-center mt-40">
      <div id="Buttons" className=" ">
        <button
          onClick={renderEdukenDashboard}
          className="border border-n-3 py-3 px-4 md:px-9 rounded-xl hover:bg-n-5 cursor-pointer md:mr-10"
        >
          EduKen
        </button>

        <button
          onClick={renderAfyakenDashboard}
          className="border border-n-3 py-3 px-4 md:px-9 rounded-xl hover:bg-n-5 cursor-pointer md:mr-10"
        >
          Afyaken
        </button>
      </div>

      <div id="dashboards" className="child-container ">
        {componentToRender === 'EdukenDashboard' && <EdukenDashboard />}
        {componentToRender === 'AfyakenDashboard' && <AfyakenDashboard />}
      </div>
    </div>
  );
};

export default DataDashboards;

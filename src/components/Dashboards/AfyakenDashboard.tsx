
const AfyakenDashboard = () => {
  return (
    <section className="h-fit ">
      {/* <h2 className="text-2xl font-semibold mb-6 text-center">AfyaKen Dashboard</h2> */}

      {/* <div className="w-full max-w-6xl rounded-2xl overflow-hidden shadow-lg"> */}
        <iframe 
          title="AfyaKen Health Dashboard"
          src="https://app.powerbi.com/reportEmbed?reportId=dc1ec3a3-f1fe-4caf-8b23-203f8adcab0a&autoAuth=true&ctid=4eb15420-3f9b-4655-90c4-6b6c2a7d21d8"
          allowFullScreen
          className="w-full  min-h-screen border-0 rounded-2xl"
        />
      {/* </div> */}
    </section>
  );
};

export default AfyakenDashboard;

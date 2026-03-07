const Loader = () => {
  return (
    <div className="mx-auto mt-20 grid max-w-7xl md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 12 }, (_, index) => (
        <div key={index} className="mt-10 h-64 animate-pulse space-y-4 p-4">
          <div className="bg-n-13 h-4 rounded"></div>
          <div className="space-y-2">
            <div className="h-10 w-5/6 rounded bg-[#6C7275]"></div>
            <div className="h-10 w-4/6 rounded bg-[#6C7275]"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Loader;

const Dashboard = () => {
  return (
    <div>
      {/* max-w-7xl = max width 80rem (1280px) */}
      {/* mx-auto = center horizontally */}
      <div className="max-w-7xl mx-auto">
        {/* text-3xl = font size 1.875rem (30px) */}
        {/* font-bold = font weight 700 */}
        {/* text-gray-900 = very dark gray text */}
        {/* mb-6 = margin bottom 1.5rem */}
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>

        {/* bg-white = white background */}
        {/* p-6 = padding 1.5rem all sides */}
        {/* rounded-lg = large border radius */}
        {/* shadow = medium box shadow */}
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600">Welcome to your dashboard!</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

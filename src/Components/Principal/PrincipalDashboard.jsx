import React, { useEffect, useState } from 'react'
import { fetchPrincipalDashboardStats } from '../../Slices/dashboardslice'
import { useSelector ,useDispatch} from 'react-redux'
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

 


const PrincipalDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const { stats, loading, error } = useSelector((state) => state.dashboard);
  const dispatch = useDispatch();

  const getRandomColors = (numcolor) => {
    let colors = [];

    for (let i = 0; i < numcolor; i++) {
      const color = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
      colors.push(color);
    }
    return colors;
  };


  useEffect(() => {
    if (user?.id) {
      const result = dispatch(fetchPrincipalDashboardStats());
      console.log("stats result",result);
    }
  }, [dispatch]);

  // Prepare chart data only if stats exist
  const chartData = stats
    ? {
        labels: ["Total Uploaded","Pending", "Approved", "Rejected"],
        datasets: [
          {
            data: [stats.total,stats.pending, stats.approved, stats.rejected],
            backgroundColor: getRandomColors(stats.total)
          },
        ],
      }
    : null;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Principal Dashboard</h1>

      {loading && <p>Loading stats...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {stats && (
        <>
          {/* ── Totals Div ───────────────────────────── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-100 text-blue-800 p-4 rounded-lg text-center">
              <p className="text-lg font-bold">{stats.total}</p>
              <p className="text-sm">Total Uploaded</p>
            </div>
            <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg text-center">
              <p className="text-lg font-bold">{stats.pending}</p>
              <p className="text-sm">Pending</p>
            </div>
            <div className="bg-green-100 text-green-800 p-4 rounded-lg text-center">
              <p className="text-lg font-bold">{stats.approved}</p>
              <p className="text-sm">Approved</p>
            </div>
            <div className="bg-red-100 text-red-800 p-4 rounded-lg text-center">
              <p className="text-lg font-bold">{stats.rejected}</p>
              <p className="text-sm">Rejected</p>
            </div>
          </div>

          {/* ── Pie Chart ───────────────────────────── */}
          <div className="w-96 mx-auto">
            <Pie data={chartData} />
          </div>
        </>
      )}
    </div>
  );
};

export default PrincipalDashboard

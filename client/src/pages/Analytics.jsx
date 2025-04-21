import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useAuth } from "../context/auth.context";
import { getAdsByUserId } from "../api/ads";
import { use } from "react";

const Analytics = () => {
  const { user } = useAuth();
  const [adsPostedCount, setAdsPostedCount] = useState(0);
  const [adStats, setAdStats] = useState({
    totalViews: 0,
    totalSearches: 0,
    totalChats: 0,
  });
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        console.log("user: ", user?.role, user?._id);
        const adsData = await getAdsByUserId({ userId: user?._id, role: user?.role });

        setAdsPostedCount(adsData?.ads?.length || 0);
        setAdStats({
          totalViews: adsData?.totalViews || 0,
          totalSearches: adsData?.totalSearches || 0,
          totalChats: adsData?.totalChats || 0,
        });

        console.log("adsData: ", adsData);
      } catch (error) {
        console.error("Error loading analytics:", error);
      }
    };

    if (user?._id) {
      fetchAds();
    }
  }, [user]);

  useEffect(() => {
    const computedTotal =
      (adStats?.totalChats || 0) +
      (adStats?.totalViews || 0) +
      (adStats?.totalSearches || 0) +
      (user?.views || 0);

    setTotal(computedTotal);
  }, [adStats, user?.views]);


  const pieChartData = [
    { name: "Profile Views", value: user?.views || 0, color: "#FFB703" },
    { name: "AD Search", value: adStats.totalSearches, color: "#F72585" },
    { name: "AD Viewed", value: adStats.totalViews, color: "#7209B7" },
    { name: "Chat on AD", value: adStats.totalChats, color: "#3A86FF" },
  ];

  const barChartData = [
    { name: "Ads Posted", value: adsPostedCount, color: "#06D6A0" },
    ...pieChartData,
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-white">
      <div className="bg-white border border-gray-200 p-6 sm:p-10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] w-full max-w-6xl flex flex-col lg:flex-row gap-10">
        {/* Charts & Labels Section */}
        <div className="flex flex-col md:flex-row gap-10 flex-1 items-center justify-center">
          {/* Pie Chart */}
          <div className="relative">
            <PieChart width={220} height={280}>
              <Pie
                data={pieChartData}
                dataKey="value"
                cx="50%"
                cy="50%"
                innerRadius={75}
                outerRadius={100}
                startAngle={90}
                endAngle={-270}
                paddingAngle={5}
                cornerRadius={10}
                stroke="none"
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>

            {/* Center Text */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
              <h2 className="text-gray-800 text-4xl font-extrabold">{total}</h2>
              <p className="text-gray-500 text-sm mt-1">Total Actions</p>
            </div>
          </div>

          {/* Labels */}
          <div className="flex flex-col gap-6 w-full max-w-xs">
            {pieChartData.map((item, idx) => {
              const percentage = total === 0 ? "0.0" : ((item.value / total) * 100).toFixed(1);
              return (
                <div key={idx} className="flex items-center gap-4">
                  <span
                    className="inline-block w-4 h-4 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <div>
                    <p className="text-gray-800 font-medium text-lg">{percentage}%</p>
                    <p className="text-gray-500 text-sm">{item.name}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bar Chart */}
        <div className="w-full lg:w-[400px] h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barChartData}>
              <XAxis dataKey="name" tick={{ fill: "#333", fontSize: 12 }} />
              <YAxis tick={{ fill: "#333", fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                  color: "#333",
                  fontSize: 14,
                }}
                itemStyle={{ color: "#333" }}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {barChartData.map((entry, index) => (
                  <Cell key={`bar-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;

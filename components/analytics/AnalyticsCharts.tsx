import React, { useEffect, useState } from "react";
import type { ChartData, ChartOptions } from 'chart.js';
import { collection, query, orderBy, getDocs, where, Timestamp } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  ArcElement,
  BarElement,
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { Line, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  ArcElement,
  BarElement,
  Title, 
  Tooltip, 
  Legend
);

export const AnalyticsCharts = () => {
  const [ordersData, setOrdersData] = useState<ChartData<'line', number[], string>>({
    labels: [],
    datasets: []
  });
  const [earningsData, setEarningsData] = useState<ChartData<'pie', number[], string>>({
    labels: [],
    datasets: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Get last 6 months for orders trend
        const today = new Date();
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(today.getMonth() - 6);
        
        // Fetch orders
        const ordersQuery = query(
          collection(db, "orders"),
          where("createdAt", ">=", Timestamp.fromDate(sixMonthsAgo)),
          orderBy("createdAt", "asc")
        );
        
        const ordersSnapshot = await getDocs(ordersQuery);
        
        // Process orders by month
  const monthlyOrders: Record<string, number> = {};
  const monthNames: string[] = [];
        
        // Initialize last 6 months
        for (let i = 0; i < 6; i++) {
          const d = new Date();
          d.setMonth(d.getMonth() - 5 + i);
          const monthYear = d.toLocaleString('default', { month: 'short', year: '2-digit' });
          monthlyOrders[monthYear] = 0;
          monthNames.push(monthYear);
        }
        
        // Count orders per month
        ordersSnapshot.forEach(doc => {
          const data = doc.data();
          const date = data.createdAt.toDate();
          const monthYear = date.toLocaleString('default', { month: 'short', year: '2-digit' });
          
          if (monthlyOrders[monthYear] !== undefined) {
            monthlyOrders[monthYear]++;
          }
        });
        
        // Prepare chart data
        const orderChartData = {
          labels: monthNames,
          datasets: [
            {
              label: 'Orders',
              data: monthNames.map(month => monthlyOrders[month]),
              borderColor: 'rgb(59, 130, 246)',
              backgroundColor: 'rgba(59, 130, 246, 0.5)',
              tension: 0.3,
            },
          ],
        };
        
        setOrdersData(orderChartData);
        
        // Fetch earnings data by service category
        const earningsQuery = query(
          collection(db, "orders"),
          where("status", "==", "completed")
        );
        
        const earningsSnapshot = await getDocs(earningsQuery);
        
        // Process earnings by service category
        const serviceEarnings: Record<string, number> = {
          'Web Development': 0,
          'Mobile Apps': 0,
          'UI/UX Design': 0,
          'Digital Marketing': 0,
          'Other Services': 0,
        };
        
        earningsSnapshot.forEach(doc => {
          const data = doc.data();
          const category = data.serviceType || 'Other Services';
          const amount = parseFloat(data.amount || 0);
          
          if (serviceEarnings[category] !== undefined) {
            serviceEarnings[category] += amount;
          } else {
            serviceEarnings['Other Services'] += amount;
          }
        });
        
        // Prepare earnings chart data
        const earningsChartData = {
          labels: Object.keys(serviceEarnings),
          datasets: [
            {
              data: Object.values(serviceEarnings),
              backgroundColor: [
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 99, 132, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(153, 102, 255, 0.6)',
                'rgba(255, 159, 64, 0.6)',
              ],
              borderColor: [
                'rgb(54, 162, 235)',
                'rgb(255, 99, 132)',
                'rgb(75, 192, 192)',
                'rgb(153, 102, 255)',
                'rgb(255, 159, 64)',
              ],
              borderWidth: 1,
            },
          ],
        };
        
        setEarningsData(earningsChartData);
        
      } catch (err) {
        console.error("Error fetching analytics data:", err);
  setError(err instanceof Error ? err.message : String(err));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-blue-100 to-blue-300 rounded-xl p-6 shadow flex flex-col items-center">
          <span className="font-semibold text-blue-700 mb-2">Orders Trend</span>
          <div className="w-full h-48 flex items-center justify-center text-blue-400">Loading...</div>
        </div>
        <div className="bg-gradient-to-br from-pink-100 to-pink-300 rounded-xl p-6 shadow flex flex-col items-center">
          <span className="font-semibold text-pink-700 mb-2">Earnings Breakdown</span>
          <div className="w-full h-48 flex items-center justify-center text-pink-400">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded-md">
        <p className="text-red-700">Error loading chart data: {error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-gradient-to-br from-blue-100 to-blue-300 rounded-xl p-6 shadow flex flex-col items-center">
        <span className="font-semibold text-blue-700 mb-2">Orders Trend (Last 6 Months)</span>
        <div className="w-full h-64">
          <Line 
            data={ordersData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'top',
                },
                tooltip: {
                  mode: 'index',
                  intersect: false,
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    precision: 0
                  }
                }
              }
            }}
          />
        </div>
      </div>
      <div className="bg-gradient-to-br from-pink-100 to-pink-300 rounded-xl p-6 shadow flex flex-col items-center">
        <span className="font-semibold text-pink-700 mb-2">Earnings Breakdown by Service</span>
        <div className="w-full h-64">
          <Pie 
            data={earningsData} 
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'right',
                },
                tooltip: {
                  callbacks: {
                    label: function(context) {
                      const label = context.label || '';
                      const value = context.raw || 0;
                      return `${label}: ₹${value.toLocaleString()}`;
                    }
                  }
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

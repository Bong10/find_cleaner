'use client'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useEffect, useState } from "react";
// Future: import { getProfileViews } from '@/services/cleanerService';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ProfileChart = () => {
  const [chartData, setChartData] = useState(null);
  const [timeRange, setTimeRange] = useState('week'); // week, month, year
  const [loading, setLoading] = useState(true);
  const [currentDayIndex, setCurrentDayIndex] = useState(new Date().getDay());

  // Get current week days
  const getCurrentWeekDays = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const currentDay = today.getDay();
    setCurrentDayIndex(currentDay);
    
    const weekDays = [];
    
    // Start from Sunday of current week
    const sunday = new Date(today);
    sunday.setDate(today.getDate() - currentDay);
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(sunday);
      date.setDate(sunday.getDate() + i);
      const dayName = days[i];
      const isToday = i === currentDay;
      weekDays.push(isToday ? `${dayName} (Today)` : dayName);
    }
    
    return weekDays;
  };

  // Get current month weeks
  const getCurrentMonthWeeks = () => {
    return ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
  };

  // Get current year months
  const getCurrentYearMonths = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    // Return months up to current month
    return months.slice(0, currentMonth + 1);
  };

  // Update current day every minute to keep it real-time
  useEffect(() => {
    const interval = setInterval(() => {
      const newDay = new Date().getDay();
      if (newDay !== currentDayIndex && timeRange === 'week') {
        setCurrentDayIndex(newDay);
        fetchProfileViews();
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [currentDayIndex, timeRange]);

  useEffect(() => {
    fetchProfileViews();
  }, [timeRange]);

  const fetchProfileViews = async () => {
    try {
      setLoading(true);
      
      // TODO: Uncomment when backend endpoint is ready
      // const response = await getProfileViews(timeRange);
      // const views = response?.data?.views || [];
      
      // For now, use zero data
      let labels = [];
      let data = [];
      let pointColors = [];
      let pointSizes = [];
      
      switch (timeRange) {
        case 'week':
          labels = getCurrentWeekDays();
          data = new Array(7).fill(0); // All zeros for current week
          // Create arrays for point customization
          pointColors = new Array(7).fill("#1967d2");
          pointSizes = new Array(7).fill(4);
          // Highlight current day
          const today = new Date().getDay();
          pointColors[today] = "#ff4d4f"; // Red for current day
          pointSizes[today] = 6; // Bigger for current day
          break;
        case 'month':
          labels = getCurrentMonthWeeks();
          data = new Array(4).fill(0); // All zeros for 4 weeks
          pointColors = new Array(4).fill("#1967d2");
          pointSizes = new Array(4).fill(4);
          // Highlight current week
          const currentWeek = Math.floor((new Date().getDate() - 1) / 7);
          if (currentWeek < 4) {
            pointColors[currentWeek] = "#ff4d4f";
            pointSizes[currentWeek] = 6;
          }
          break;
        case 'year':
          labels = getCurrentYearMonths();
          data = new Array(labels.length).fill(0); // All zeros for months
          pointColors = new Array(labels.length).fill("#1967d2");
          pointSizes = new Array(labels.length).fill(4);
          // Highlight current month
          const currentMonth = new Date().getMonth();
          if (currentMonth < labels.length) {
            pointColors[currentMonth] = "#ff4d4f";
            pointSizes[currentMonth] = 6;
          }
          break;
        default:
          labels = getCurrentWeekDays();
          data = new Array(7).fill(0);
          pointColors = new Array(7).fill("#1967d2");
          pointSizes = new Array(7).fill(4);
      }

      // When backend is ready, replace with:
      // data = response?.data?.views || new Array(labels.length).fill(0);

      setChartData({
        labels,
        datasets: [
          {
            label: "Profile Views",
            data: data,
            borderColor: "#1967d2",
            backgroundColor: "rgba(25, 103, 210, 0.1)",
            borderWidth: 2,
            tension: 0.4, // Smooth line
            fill: true,
            pointBackgroundColor: pointColors, // Array of colors for each point
            pointBorderColor: pointColors.map(color => color === "#ff4d4f" ? "#fff" : "#fff"),
            pointBorderWidth: 2,
            pointRadius: pointSizes, // Array of sizes for each point
            pointHoverRadius: pointSizes.map(size => size + 2),
            pointHoverBackgroundColor: pointColors,
          },
        ],
      });
    } catch (error) {
      console.error('Error fetching profile views:', error);
      // Set default zero data on error
      const labels = getCurrentWeekDays();
      const today = new Date().getDay();
      const pointColors = new Array(7).fill("#1967d2");
      const pointSizes = new Array(7).fill(4);
      pointColors[today] = "#ff4d4f";
      pointSizes[today] = 6;
      
      setChartData({
        labels,
        datasets: [
          {
            label: "Profile Views",
            data: new Array(7).fill(0),
            borderColor: "#1967d2",
            backgroundColor: "rgba(25, 103, 210, 0.1)",
            borderWidth: 2,
            tension: 0.4,
            fill: true,
            pointBackgroundColor: pointColors,
            pointBorderColor: "#fff",
            pointBorderWidth: 2,
            pointRadius: pointSizes,
            pointHoverRadius: pointSizes.map(size => size + 2),
          },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#1967d2",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "#1967d2",
        borderWidth: 1,
        cornerRadius: 5,
        padding: 10,
        displayColors: false,
        callbacks: {
          label: function(context) {
            return `Views: ${context.parsed.y}`;
          },
          title: function(tooltipItems) {
            const label = tooltipItems[0].label;
            return label.replace(' (Today)', '');
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        min: 0,
        max: 10, // Start with max 10 for better visibility of zero line
        ticks: {
          stepSize: 2,
          callback: function(value) {
            return value;
          }
        },
        grid: {
          borderDash: [5, 5],
          color: "rgba(0, 0, 0, 0.05)",
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            weight: function(context) {
              // Bold font for current day
              const label = context.tick.label;
              return label && label.includes('(Today)') ? 'bold' : 'normal';
            }
          }
        }
      },
    },
  };

  const handleTimeRangeChange = (e) => {
    setTimeRange(e.target.value);
  };

  if (loading || !chartData) {
    return (
      <div className="tabs-box">
        <div className="widget-title">
          <h4>Your Profile Views</h4>
        </div>
        <div className="widget-content" style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span>Loading chart...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="tabs-box">
      <div className="widget-title">
        <h4>Your Profile Views</h4>
        <div className="chosen-outer">
          <select 
            className="chosen-single form-select"
            value={timeRange}
            onChange={handleTimeRangeChange}
          >
            <option value="week">Current Week</option>
            <option value="month">Current Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>
      {/* End widget top bar */}

      <div className="widget-content" style={{ height: '300px' }}>
        <Line options={options} data={chartData} />
      </div>
      {/* End profile chart */}

      {/* Show zero message */}
      {chartData.datasets[0].data.every(val => val === 0) && (
        <div style={{ 
          textAlign: 'center', 
          padding: '10px', 
          color: '#999',
          fontSize: '14px'
        }}>
          No profile views yet for this period
          {timeRange === 'week' && (
            <div style={{ marginTop: '5px', fontSize: '12px' }}>
              <span style={{ color: '#ff4d4f' }}>●</span> Current day
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileChart;

/* 
  Backend Integration Notes:
  
  1. Expected API endpoint: GET /api/profile/views?range=week|month|year
  
  2. Expected response format:
  {
    data: {
      views: [0, 2, 1, 0, 5, 3, 0], // Array of view counts
      labels: ["Sun", "Mon", "Tue", ...], // Optional, we can generate locally
      total: 11 // Total views for the period
    }
  }
  
  3. Time ranges:
     - week: Last 7 days (Sun-Sat)
     - month: Last 4 weeks
     - year: Months from Jan to current month
*/

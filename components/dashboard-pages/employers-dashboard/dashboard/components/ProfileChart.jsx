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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function toISOWeekKey(d = new Date()) {
  // ISO week, same approach as used in your dashboard page
  const date = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const day = (date.getUTCDay() + 6) % 7; // Mon=0..Sun=6
  const thurs = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() - day + 3));
  const firstThu = new Date(Date.UTC(thurs.getUTCFullYear(), 0, 4));
  const week = 1 + Math.round(((thurs - firstThu) / 86400000 - 3) / 7);
  return `${thurs.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

export default function ProfileChart({
  loading = false,
  title = 'Overview',
  labels = [],
  data = [],
}) {
  // Prepare labels and data with safe defaults
  const chartLabels = labels.length ? labels : ["Week 1", "Week 2", "Week 3", "Week 4"];
  const chartValues = (labels.length ? data : [0, 0, 0, 0]).map((v) => Number(v) || 0);

  // Find current ISO week index; if not present in labels, fall back to the last point
  const currentWeekKey = toISOWeekKey(new Date());
  const currentIdx = labels.length
    ? chartLabels.indexOf(currentWeekKey)
    : chartLabels.length - 1;
  const highlightIdx = currentIdx >= 0 ? currentIdx : null;

  // Style points: default blue, current week red and slightly larger
  const pointColors = chartLabels.map((_, i) => (i === highlightIdx ? "#ff4d4f" : "#1967d2"));
  const pointSizes = chartLabels.map((_, i) => (i === highlightIdx ? 6 : 4));

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: {
        backgroundColor: "#1967d2",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "#1967d2",
        borderWidth: 1,
        cornerRadius: 6,
        padding: 10,
        displayColors: false,
        callbacks: {
          title: (items) => (items?.[0]?.label || "").replace(" (Current)", ""),
          label: (ctx) => `Applications: ${ctx.parsed.y}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
        grid: { borderDash: [5, 5], color: "rgba(0, 0, 0, 0.06)" },
      },
      x: {
        grid: { display: false },
      },
    },
  };

  const chartData = {
    labels: chartLabels.map((l, i) =>
      i === highlightIdx ? `${l} (Current)` : l
    ),
    datasets: [
      {
        label: title,
        data: chartValues,
        borderColor: "#1967d2",
        backgroundColor: "rgba(25, 103, 210, 0.12)",
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: pointColors,
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: pointSizes,
        pointHoverRadius: pointSizes.map((s) => s + 2),
        pointHoverBackgroundColor: pointColors,
      },
    ],
  };

  if (loading) {
    return (
      <div className="tabs-box">
        <div className="widget-title"><h4>{title}</h4></div>
        <div className="widget-content" style={{ height: "300px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span>Loading chart...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="tabs-box">
      <div className="widget-title">
        <h4>{title}</h4>
        {highlightIdx !== null && highlightIdx >= 0 && (
          <div className="badge-nowrap">
            <span className="dot">●</span> Current week
          </div>
        )}
      </div>

      <div className="widget-content chart-wrapper">
        <Line options={options} data={chartData} />
      </div>

      <style jsx>{`
        .chart-wrapper {
          position: relative;
          height: 300px;
          border-radius: 12px;
          background: radial-gradient(1200px 400px at 90% 0%, rgba(25, 103, 210, 0.06), transparent 60%),
                      radial-gradient(900px 300px at 10% 100%, rgba(25, 103, 210, 0.05), transparent 60%);
          overflow: hidden;
        }
        .badge-nowrap {
          margin-left: auto;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 10px;
          border-radius: 9999px;
          background: #f3f6fd;
          color: #334155;
          font-size: 12px;
          font-weight: 600;
        }
        .badge-nowrap .dot {
          color: #ff4d4f;
          font-size: 14px;
          line-height: 1;
        }
      `}</style>
    </div>
  );
}

import {useEffect, useState} from "react";
import {useCookies} from "react-cookie";
import {CategoryStatsApi} from "../API calls/Dashboard/CategoryStats.jsx";
import {Bar} from "react-chartjs-2";
import "chart.js/auto";
import "../css/categoryStats.css";

export default function CategoryStats() {
  useEffect(() => {
    document.title = "Category Stats";
  }, []);

  const [cookies] = useCookies();
  const [categoryStats, setCategoryStats] = useState(null);

  useEffect(() => {
    const fetchCategoryStats = async () => {
      const response = await CategoryStatsApi(cookies.jwt);
      if (response !== null) {
        setCategoryStats(response.data);
      } else {
        console.log("Error fetching data");
      }
    };
    fetchCategoryStats();
  }, []);

  if (!categoryStats) return <h1>Loading...</h1>;

  const categories = categoryStats.category_stats.map((stat) => ({
    label: stat.category.title,
    revenue: parseFloat(stat.category.total_revenue).toFixed(2),
    orders: stat.category.total_orders,
    avgPrice: parseFloat(stat.average_price_per_order).toFixed(2),
  }));

  const data = {
    labels: categories.map((cat) => cat.label),
    datasets: [
      {
        label: "Total Revenue (LE)",
        data: categories.map((cat) => cat.revenue),
        backgroundColor: "#ff6600",
      },
      {
        label: "Total Orders",
        data: categories.map((cat) => cat.orders),
        backgroundColor: "#ffbe33",
      },
      {
        label: "Avg Price per Order (LE)",
        data: categories.map((cat) => cat.avgPrice),
        backgroundColor: "#33ff99",
      },
    ],
  };

  return (
    <div className="category-stats-container">
      <h1>Category Stats</h1>
      <div className="stats-grid">
        {categoryStats.category_stats.map((stat, index) => (
          <div key={index} className="category-card">
            <h2>{stat.category.title}</h2>
            <div className="stats-details">
              <div className="stat-item">
                <span className="icon">💰</span>
                <p>Revenue: <strong>LE{parseFloat(stat.category.total_revenue).toFixed(2)}</strong></p>
              </div>
              <div className="stat-item">
                <span className="icon">📦</span>
                <p>Orders: <strong>{stat.category.total_orders}</strong></p>
              </div>
              <div className="stat-item">
                <span className="icon">💲</span>
                <p>Avg. Price: <strong>LE{parseFloat(stat.average_price_per_order).toFixed(2)}</strong></p>
              </div>
            </div>
            <div className="food-details">
              <div className="food-item">
                <h4>Most Ordered</h4>
                <p>{stat.most_ordered_food?.name || "N/A"}</p>
              </div>
              <div className="food-item">
                <h4>Least Ordered</h4>
                <p>{stat.least_ordered_food?.name || "N/A"}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="chart-section">
        <h2>Category Overview</h2>
        <Bar data={data}/>
      </div>
    </div>
  );
}

import {useEffect, useState} from "react";
import {useCookies} from "react-cookie";
import {OverallDetailsApi} from "../API calls/Dashboard/OverallDetails.jsx";
import "../css/overallStats.css";

export default function OverallStats() {
  useEffect(() => {
    document.title = "Overall Stats";
  });

  const [cookies] = useCookies();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      const response = await OverallDetailsApi(cookies.jwt);
      if (response !== null) {
        setStats(response);
      } else {
        console.log("Error fetching data");
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="StatsWrapper">
      <h1 className="StatsTitle">📊 Overall Stats</h1>
      <div className="StatsGrid">
        {stats &&
          Object.entries(stats).map(([key, value]) => (
            <div className="StatCard" key={key}>
              <h2 className="StatName">
                {key.replace(/_/g, " ").toUpperCase()}
              </h2>
              <p className="StatValue">{value}</p>
            </div>
          ))}
      </div>
    </div>
  );
}

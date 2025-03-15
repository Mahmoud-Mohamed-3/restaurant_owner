import {useEffect, useState} from "react";
import {useCookies} from "react-cookie";
import {ReservationsStatsApi} from "../API calls/Dashboard/ReservationsStats.jsx";
import {Bar} from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import "../css/reservations_stats.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function ReservationsStats() {
  useEffect(() => {
    document.title = "Reservations Stats";
  }, []);

  const [cookies] = useCookies();
  const [stats, setStats] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);  // State for current page
  const [rowsPerPage, setRowsPerPage] = useState(5);  // State for rows per page

  useEffect(() => {
    const fetchStats = async () => {
      const response = await ReservationsStatsApi(cookies.jwt);
      if (response !== null) {
        setStats(response);
      } else {
        console.log("Error fetching data");
      }
    };
    fetchStats();
  }, [cookies]);

  if (!stats) return <div>Loading...</div>;

  // Group reservations by date
  const groupedReservations = stats.reservations.reduce((acc, reservation) => {
    const date = new Date(reservation.booked_from).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = 0;
    }
    acc[date]++;
    return acc;
  }, {});

  const dates = Object.keys(groupedReservations);
  const reservationCounts = Object.values(groupedReservations);

  // User reservation data for new chart
  const userNames = stats.user_details.map(user => user.user_name);
  const userReservationCounts = stats.user_details.map(user => user.reservation_count);

  // Pagination Logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = stats.reservations.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(stats.reservations.length / rowsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Bar Chart Data for Reservations Trend
  const trendChartData = {
    labels: dates,
    datasets: [
      {
        label: "Number of Reservations",
        data: reservationCounts,
        backgroundColor: "#ff6600",
        borderColor: "#ff6600",
        borderWidth: 1,
      }
    ]
  };

  // Bar Chart Options for Reservations Trend
  const trendChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "Reservations Trend",
        color: "#ffbe33",
        font: {
          size: 20
        }
      },
      tooltip: {
        backgroundColor: "#ff6600",
        titleColor: "white",
        bodyColor: "white"
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Date",
          color: "#ffbe33",
        },
        ticks: {
          color: "white"
        }
      },
      y: {
        title: {
          display: true,
          text: "Number of Reservations",
          color: "#ffbe33",
        },
        ticks: {
          color: "white",
          beginAtZero: true
        }
      }
    }
  };

  // Bar Chart Data for User Reservation Counts
  const userChartData = {
    labels: userNames,
    datasets: [
      {
        label: "Number of Reservations per User",
        data: userReservationCounts,
        backgroundColor: "#ff6600",
        borderColor: "#ff6600",
        borderWidth: 1,
      }
    ]
  };

  // Bar Chart Options for User Reservation Counts
  const userChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "Reservations per User",
        color: "#ffbe33",
        font: {
          size: 20
        }
      },
      tooltip: {
        backgroundColor: "#ff6600",
        titleColor: "white",
        bodyColor: "white"
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "User Name",
          color: "#ffbe33",
        },
        ticks: {
          color: "white"
        }
      },
      y: {
        title: {
          display: true,
          text: "Number of Reservations",
          color: "#ffbe33",
        },
        ticks: {
          color: "white",
          beginAtZero: true
        }
      }
    }
  };

  return (
    <div className="reservations-stats-container">
      <h1 className="page-title">Reservations Stats</h1>

      {/* Reservations Table */}
      <div className="table-container">
        <table className="reservations-table">
          <thead>
          <tr>
            <th className="table-header">ID</th>
            <th className="table-header">Table</th>
            <th className="table-header">Seats</th>
            <th className="table-header">User Name</th>
            <th className="table-header">Phone Number</th>
            <th className="table-header">Booking Time</th>
          </tr>
          </thead>
          <tbody>
          {currentRows.map((reservation) => (
            <tr key={reservation.id}>
              <td className="table-cell">{reservation.id}</td>
              <td className="table-cell">{reservation.table_name}</td>
              <td className="table-cell">{reservation.num_of_seats}</td>
              <td className="table-cell">{reservation.user_name}</td>
              <td className="table-cell">{reservation.phone_number}</td>
              <td className="table-cell">
                {`${new Date(reservation.booked_from).toLocaleString()} - ${new Date(reservation.booked_to).toLocaleString()}`}
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="pagination-container">
        <button
          className="pagination-button"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        <span className="pagination-info">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="pagination-button"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {/* Reservation Trend Chart (Bar Chart) */}
      <div className="chart-container">
        <Bar data={trendChartData} options={trendChartOptions}/>
      </div>

      {/* User Reservation Counts Chart (Bar Chart) */}
      <div className="chart-container">
        <Bar data={userChartData} options={userChartOptions}/>
      </div>
    </div>
  );
}

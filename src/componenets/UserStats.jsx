import React, {useMemo, useState, useEffect} from 'react';
import {useTable, useSortBy, usePagination} from 'react-table';
import {useCookies} from 'react-cookie';
import {UserStatsApi} from '../API calls/Dashboard/UserStats.jsx';
// import { useHistory } from 'react-router-dom';
import {Line} from 'react-chartjs-2';
import {Chart as ChartJS, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend} from 'chart.js';
import "../css/userStats.css"
// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

export default function UserStats() {
  useEffect(() => {
    document.title = 'User Stats';
  }, []);

  const [cookies] = useCookies();
  const [stats, setStats] = useState([]);
  // const history = useHistory();

  useEffect(() => {
    const fetchStats = async () => {
      const response = await UserStatsApi(cookies.jwt);
      if (response !== null) {
        setStats(response.data);
      } else {
        console.log('Error fetching data');
      }
    };
    fetchStats();
  }, [cookies.jwt]);

  const data = useMemo(() => stats, [stats]);

  const columns = useMemo(
    () => [
      {
        Header: 'User ID',
        accessor: 'user.id',
      },
      {
        Header: 'Email',
        accessor: 'user.email',
      },
      {
        Header: 'First Name',
        accessor: 'user.first_name',
      },
      {
        Header: 'Last Name',
        accessor: 'user.last_name',
      },
      {
        Header: 'Phone Number',
        accessor: 'user.phone_number', // Add Phone Number column
      },
      {
        Header: 'Total Orders',
        accessor: 'total_orders',
      },
      {
        Header: 'Total Reservations',
        accessor: 'total_reservations',
      },
      {
        Header: 'Total Spent',
        accessor: 'total_spent',
      },
      {
        Header: 'Average Spent',
        accessor: 'average_spent',
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state: {pageIndex, pageSize},
    canNextPage,
    canPreviousPage,
    pageOptions,
    nextPage,
    previousPage,
    setPageSize,
  } = useTable(
    {
      columns,
      data,
      initialState: {
        pageIndex: 0,
        pageSize: 10,
      },
    },
    useSortBy,
    usePagination
  );

  // Prepare data for the chart (Total Spent by user)
  const chartData = {
    labels: stats.map((item) => `${item.user.first_name} ${item.user.last_name}`),
    datasets: [
      {
        label: 'Total Spent',
        data: stats.map((item) => item.total_spent),
        backgroundColor: '#ff6600',
        borderColor: '#ff6600',
        borderWidth: 2,
        pointBackgroundColor: '#ff6600',
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  return (
    <div className="user-stats-container">
      <h1>User Stats</h1>

      {/* Table */}
      <div className="table-container">
        <table {...getTableProps()} className="user-stats-table">
          <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? ' 🔽'
                          : ' 🔼'
                        : ''}
                    </span>
                </th>
              ))}
            </tr>
          ))}
          </thead>
          <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                })}
              </tr>
            );
          })}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className="pagination-controls">
          <button onClick={() => previousPage()} disabled={!canPreviousPage}>
            Previous
          </button>
          <span>
            Page {pageIndex + 1} of {pageOptions.length}
          </span>
          <button onClick={() => nextPage()} disabled={!canNextPage}>
            Next
          </button>
        </div>
      </div>

      {/* Line Chart with Points */}
      <div className="chart-container">
        <h2>Total Spent by User</h2>
        <Line data={chartData}/>
      </div>
    </div>
  );
}

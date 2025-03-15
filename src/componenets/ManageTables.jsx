import {useEffect, useState} from "react";
import {useCookies} from "react-cookie";
import {Modal, Button, Input, Select, notification} from "antd";
import "../css/ManageTables.css";
import {GetAllTablesApi} from "../API calls/Dashboard/Tables/GetAllTables.jsx";
import {AddTableApi} from "../API calls/Dashboard/Tables/AddTable.js";
import {UpdateTableApi} from "../API calls/Dashboard/Tables/UpdateTable.jsx";
import {DeleteTableApi} from "../API calls/Dashboard/Tables/DeleteTable.jsx";

export default function ManageTables() {
  useEffect(() => {
    document.title = "Manage Tables";
  }, []);

  const [cookies] = useCookies();
  const [tables, setTables] = useState(null);
  const [sortAscending, setSortAscending] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [newTable, setNewTable] = useState({table_name: "", num_of_seats: 4});
  const [editTable, setEditTable] = useState({id: null, table_name: "", num_of_seats: 4});

  useEffect(() => {
    fetchTables();
  }, [cookies.jwt]);

  const fetchTables = async () => {
    const response = await GetAllTablesApi(cookies.jwt);
    if (response) {
      setTables(response.data);
    } else {
      console.error("Failed to fetch tables");
    }
  };

  const handleAddTable = async () => {
    const response = await AddTableApi(cookies.jwt, newTable);
    if (response) {
      notification.success({message: "Table added successfully"});
      fetchTables();
      setModalVisible(false);
      setNewTable({table_name: "", num_of_seats: 4});
    } else {
      notification.error({message: "Failed to add table Change the table name"});
    }
  };

  const handleEditTable = async () => {
    const response = await UpdateTableApi(cookies.jwt, editTable.id, {table: editTable});
    if (response) {
      notification.success({message: "Table updated successfully"});
      fetchTables();
      setEditModalVisible(false);
      setEditTable({table_name: "", num_of_seats: 4});
    }
  };

  const handleRemoveTable = async (id) => {
    const response = await DeleteTableApi(cookies.jwt, id);
    if (response) {
      notification.success({message: "Table removed successfully"});
      fetchTables();
    } else {
      console.error("Failed to remove table");
    }
  };

  const handleSort = () => {
    const sortedTables = [...tables].sort((a, b) =>
      sortAscending ? a.num_of_reservations - b.num_of_reservations : b.num_of_reservations - a.num_of_reservations
    );
    setTables(sortedTables);
    setSortAscending(!sortAscending);
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTables = tables ? tables.slice(indexOfFirstItem, indexOfLastItem) : [];

  if (!tables) return <div className="loading">Loading...</div>;

  return (
    <div className="manage-tables">
      <div className="header">
        <h1>Manage Tables</h1>
        <button className="add-btn" onClick={() => setModalVisible(true)}>+ Add New Table</button>
      </div>

      <div className="table-container">
        <table>
          <thead>
          <tr>
            <th>ID</th>
            <th>Table Name</th>
            <th>Seats</th>
            <th onClick={handleSort} className="sortable">
              Reservations {sortAscending ? "▲" : "▼"}
            </th>
            <th>Actions</th>
          </tr>
          </thead>
          <tbody>
          {currentTables.map((table) => (
            <tr key={table.id}>
              <td>{table.id}</td>
              <td>{table.table_name}</td>
              <td>{table.num_of_seats}</td>
              <td>{table.num_of_reservations}</td>
              <td>
                <button className="edit-btn" onClick={() => {
                  setEditTable(table);
                  setEditModalVisible(true);
                }}>Edit
                </button>
                <button className="remove-btn" onClick={() => handleRemoveTable(table.id)}>Remove</button>
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="pagination">
        {Array.from({length: Math.ceil(tables.length / itemsPerPage)}, (_, i) => (
          <Button key={i + 1} onClick={() => setCurrentPage(i + 1)} className={currentPage === i + 1 ? "active" : ""}>
            {i + 1}
          </Button>
        ))}
      </div>

      {/* Add Table Modal */}
      <Modal title="Add New Table" open={modalVisible} onOk={handleAddTable} onCancel={() => setModalVisible(false)}>
        <Input placeholder="Table Name" value={newTable.table_name}
               onChange={(e) => setNewTable({...newTable, table_name: e.target.value})}/>
        <Select value={newTable.num_of_seats} onChange={(value) => setNewTable({...newTable, num_of_seats: value})}
                style={{width: "100%", marginTop: "10px"}}>
          {[2, 3, 4, 5, 6].map((num) => (
            <Select.Option key={num} value={num}>{num} Seats</Select.Option>
          ))}
        </Select>
      </Modal>

      {/* Edit Table Modal */}
      <Modal title="Edit Table" open={editModalVisible} onOk={handleEditTable}
             onCancel={() => setEditModalVisible(false)}>
        <Input placeholder="Table Name" value={editTable.table_name}
               onChange={(e) => setEditTable({...editTable, table_name: e.target.value})}/>
        <Select value={editTable.num_of_seats} onChange={(value) => setEditTable({...editTable, num_of_seats: value})}
                style={{width: "100%", marginTop: "10px"}}>
          {[2, 3, 4, 5, 6].map((num) => (
            <Select.Option key={num} value={num}>{num} Seats</Select.Option>
          ))}
        </Select>
      </Modal>
    </div>
  );
}

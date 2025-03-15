import axios from "axios";

export const UpdateTableApi = async (jwt, id, tableData) => {
  try {
    const response = await axios.put(`http://127.0.0.1:3000/api/v1/owner/update_table/${id}`, tableData, {
      headers: {
        Authorization: `${jwt}`,
      },
    });
    if (response.status === 200) {
      return response.data;

    } else {
      return null;
    }
  } catch (error) {
    console.error("Failed to update table", error);
    return null;
  }
}
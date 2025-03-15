import axios from "axios";

export const AddTableApi = async (jwt, table) => {
  try {
    const response = await axios.post(`http://127.0.0.1:3000/api/v1/owner/add_table`, table, {
      headers: {
        Authorization: `${jwt}`,
      },
    });
    if (response.status === 201) {
      return response.data;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Failed to add table", error);
    return null;
  }
}
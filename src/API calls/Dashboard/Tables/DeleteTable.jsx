import axios from "axios";

export const DeleteTableApi = async (jwt, id) => {
  try {
    const response = await axios.delete(`http://127.0.0.1:3000/api/v1/owner/delete_table/${id}`, {
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
    console.error("Failed to delete table", error);
    return null;
  }
}
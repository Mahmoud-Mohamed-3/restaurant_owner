import axios from "axios";

export const GetAllTablesApi = async (jwt) => {
  try {
    const response = await axios.get('http://127.0.0.1:3000/api/v1/owner/show_tables', {
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
    console.error("Failed to fetch tables", error);
    return null;
  }
}
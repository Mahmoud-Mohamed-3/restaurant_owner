import axios from "axios";

export const CategoryStatsApi = async (token) => {
  try {
    const response = await axios.get('http://127.0.0.1:3000/api/v1/category_stats', {
      headers: {
        Authorization: `${token}`
      }
    });
    if (response.status === 200) {
      return response.data;
    } else {
      return null;
    }
  } catch (e) {
    console.log(e);
    return null;
  }
}
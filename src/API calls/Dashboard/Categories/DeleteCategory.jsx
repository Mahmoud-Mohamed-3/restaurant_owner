import axios from "axios";

export const DeleteCategoryApi = async (token, id) => {
  try {
    const response = await axios.delete(`http://127.0.0.1:3000/api/v1/owner/delete_category/${id}`, {
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
import axios from "axios";

export const UpdateChefApi = async (token, dataObj, id) => {
  try {
    const response = await axios.put(`http://127.0.0.1:3000/api/v1/owner/update_chef/${id}`, dataObj, {
      headers: {
        Authorization: `${token}`,
        "Content-Type": "multipart/form-data"
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
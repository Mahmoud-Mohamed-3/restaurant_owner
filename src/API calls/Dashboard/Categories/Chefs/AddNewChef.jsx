import axios from "axios";

export const AddNewChefApi = async (token, dataObj) => {
  try {
    const response = await axios.post(`http://127.0.0.1:3000/api/v1/owner/add_chef`, dataObj, {
      headers: {
        Authorization: `${token}`,
        "Content-Type": "multipart/form-data"
      }
    });
    if (response.status === 201) {
      return response.data;
    } else {
      return null;
    }
  } catch (e) {
    console.log(e);
    return null;
  }
}
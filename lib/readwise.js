import axios from "axios";

const base_url = process.env.READWISE_API_BASEURL;
const access_token = process.env.READWISE_ACCESS_TOKEN;

export async function getBooks() {
  // get list of books
  try {
    const response = await axios.get(`${base_url}/books/`, {
      headers: {
        Authorization: `Token ${access_token}`,
      },
      params: {
        category: "books",
      },
    });
    console.log(response.data.results);
    return response.data.results;
  } catch (error) {
    console.error(error);
  }
}

const axios = require("axios");

const token = process.env.AIRTABLE_KEY;

export async function getBooks() {
  let books = [];
  const base_url = "https://api.airtable.com/v0/appRKfe8arFWdsDok";

  try {
    const response = await axios.get(`${base_url}/Books`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.records) {
      response.data.records.forEach((record) => {
        books.push({
          id: record.id,
          fields: record.fields,
        });
      });
    }
  } catch (e) {
    console.error(e.message);
  }
  return books;
}

// config files for the app

const API_BASE_URL = 'https://api.tvmaze.com';

// user-defined function to perform a HTTP request to the API
export async function apiGet(queryString) {
  // calling the fetch() function to make a HTTP request
  const response = await fetch(`${API_BASE_URL}${queryString}`).then(r =>
    r.json()
  );

  return response;
}

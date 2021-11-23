const getApiHeader = (token) => ({
  'Content-Type': 'application/json',
  Authorization: `Token ${token}`,
});

export default getApiHeader;

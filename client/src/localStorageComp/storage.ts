export const saveDataToLocalStorage = (key: string, data: any) => {
  const timestamp = new Date().getTime();
  const dataWithTimestamp = { timestamp, data };
  localStorage.setItem(key, JSON.stringify(dataWithTimestamp));
  return data;
};

export const getDataFromLocalStorage = (key: string) => {
  const storedData = localStorage.getItem(`${key}`);
  if (storedData) {
      const { timestamp, data } = JSON.parse(storedData);
    const oneDayInMillis = 24 * 60 * 60 * 1000; // One day in milliseconds

    // Check if the data is older than one day
    if (new Date().getTime() - timestamp > oneDayInMillis) {
      // Data is older than one day, remove it
      localStorage.removeItem(key);
      return null;
    }
    return data;
  }
  return null;
};

export const getUserDetailsFromLocalStorage = () => {
  return getDataFromLocalStorage("userDetails");
};

import axios from 'axios';

const API_KEY = process.env.TOMORROW_IO_API_KEY;

export const getWeatherForecast = async (lat: number, lng: number) => {
  try {
    const response = await axios.get(
      `https://api.tomorrow.io/v4/weather/forecast?location=${lat},${lng}&apikey=${API_KEY}`
    );
    return response.data;
  } catch (error) {
    console.error('Weather API error:', error);
    return null;
  }
}; 
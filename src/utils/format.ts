export const formatDuration = (seconds: number) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  return `${hrs > 0 ? hrs + '小时' : ''}${mins}分钟`;
};

export const getWeatherIcon = (condition: string) => {
  const icons: { [key: string]: string } = {
    '晴': '01d',
    '多云': '02d',
    '雨': '10d',
    '雪': '13d'
  };
  return icons[condition] || '01d';
}; 
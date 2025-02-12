export const calculateCalories = (time: number, speed: number) => {
  // 基础代谢率计算（假设体重70kg）
  const weight = 70; // 单位：kg
  const met = speed < 15 ? 6 : 8; // 不同速度对应代谢当量
  return Math.round((met * 3.5 * weight * time) / 1000);
}; 
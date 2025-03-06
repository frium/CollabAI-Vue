export const formatConferenceTimeAPI = (startTime, endTime) => {
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return { year, month, day, hours, minutes };
  };

  const startDate = new Date(startTime);
  const endDate = new Date(endTime);
  const currentTime = new Date();

  const start = formatDate(startDate);
  const end = formatDate(endDate);

  // 计算持续时间
  const timeDiffInMs = endDate - startDate;
  const hoursDiff = Math.floor(timeDiffInMs / (1000 * 60 * 60));
  const minutesDiff = Math.floor((timeDiffInMs % (1000 * 60 * 60)) / (1000 * 60));

  let lastTime = "";
  if (hoursDiff) lastTime += `${hoursDiff}小时`;
  if (minutesDiff) lastTime += `${minutesDiff}分`;

  // 计算状态
  let status = "未开始";
  if (currentTime >= startDate && currentTime <= endDate) {
    status = "进行中";
  } else if (currentTime >= endDate) {
    status = "已结束";
  }

  return {
    startDate: `${start.year}年${start.month}月${start.day}日`,
    startTime: `${start.hours}:${start.minutes}`,
    endDate: `${end.year}年${end.month}月${end.day}日`,
    endTime: `${end.hours}:${end.minutes}`,
    lastTime,
    status,
  };
}

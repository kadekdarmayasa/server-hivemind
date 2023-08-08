const MONTHS: string[] = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
const DAYS: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function dateFormat(date: Date): string {
  const day = DAYS[date.getDay()];
  const month = MONTHS[date.getMonth()];
  const year = date.getFullYear();

  return `${day}, ${date.getDate()} ${month} ${year}`;
}

export default dateFormat;

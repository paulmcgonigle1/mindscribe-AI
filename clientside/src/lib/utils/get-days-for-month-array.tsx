function getDaysArrayForMonth(date: Date): Date[] {
  const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  const daysArray: Date[] = [];
  let day = new Date(startOfMonth);

  while (day <= endOfMonth) {
    daysArray.push(new Date(day));
    day.setDate(day.getDate() + 1);
  }

  return daysArray;
}

export default getDaysArrayForMonth;

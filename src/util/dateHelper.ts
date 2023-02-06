export const formatDayName = (day: number) => {
  switch (day) {
    case 1:
      return "Понеделник";
    case 2:
      return "Вторник";
    case 3:
      return "Сряда";
    case 4:
      return "Четвъртък";
    case 5:
      return "Петък";
    case 6:
      return "Събота";
    case 7:
      return "Неделя";
    default:
      "Невалиден Ден";
      break;
  }
};

export const formatMinutes = (minutes: number) => {
  switch (minutes) {
    case 0:
      return "00";
    case 1:
      return "01";
    case 2:
      return "02";
    case 3:
      return "03";
    case 4:
      return "04";
    case 5:
      return "05";
    case 6:
      return "06";
    case 7:
      return "07";
    case 8:
      return "08";
    case 9:
      return "09";
    default:
      break;
  }
};

import dayjs from "dayjs";
import isLeapYear from "dayjs/plugin/isLeapYear"; // import plugin
import "dayjs/locale/th"; // import locale

dayjs.extend(isLeapYear); // use plugin
dayjs.locale("th"); // use locale

export default dayjs;

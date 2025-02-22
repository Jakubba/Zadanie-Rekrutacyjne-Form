import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import { Holiday } from "./BookingCalendar.types";
import AvailableTimes from "./../AvailableTimes/AvailableTimes";
import errorIconPink from "./../../assets/icons/error-icon-pink.svg";

const API_URL = import.meta.env.VITE_HOLIDAYS_API_URL;
const API_KEY = import.meta.env.VITE_API_NINJAS_KEY;

const NATIONAL_HOLIDAY = "NATIONAL_HOLIDAY";

interface BookingCalendarProps {
  label: string;
  selectedDate: Date | null;
  onDateChange: (date: Date) => void;
  selectedTime: string | null;
  setSelectedTime: (time: string | null) => void;
  holidayMessage?: string | null;
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({
  label,
  selectedDate,
  onDateChange,
  selectedTime,
  setSelectedTime,
}) => {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [unavailableMessage, setUnavailableMessage] = useState<string | null>(null);

  const isDateDisabled = (date: Date): boolean => {
    const formattedDate = date.toISOString().split("T")[0];
    const isHoliday = holidays.some((h) => h.date === formattedDate && h.type === NATIONAL_HOLIDAY);
    const IS_SUNDAY = date.getDay() === 0;
    return isHoliday || IS_SUNDAY;
  };

  useEffect(() => {
    axios
      .get<Holiday[]>(`${API_URL}?country=PL&year=2024`, {
        headers: { "X-Api-Key": API_KEY },
      })
      .then((response) => {
        console.log("Full API response:", response.data);
        if (Array.isArray(response.data)) {
          console.log("Holidays fetched:", response.data);
          setHolidays(response.data);
        } else {
          console.error("Unexpected API response format:", response.data);
        }
      })
      .catch((error) => console.error("Error fetching holidays:", error));
  }, []);

  const handleDateClick = (date: Date): void => {
    if (isDateDisabled(date)) {
      const formattedDate = date.toISOString().split("T")[0];
      const holiday = holidays.find((h) => h.date === formattedDate);

      setSelectedTime(null);

      if (holiday) {
        setUnavailableMessage(`It is ${holiday.name}.`);
      } else {
        setUnavailableMessage("This date is unavailable for booking.");
      }
    } else {
      setUnavailableMessage(null);
      onDateChange(date);
    }
  };

  const tileClassName = ({ date }: { date: Date }): string => {
    const formattedDate = date.toISOString().split("T")[0];
    const isHoliday = holidays.some((h) => h.date === formattedDate);
    const isDisabled = isDateDisabled(date);

    if (isHoliday) return "date-holiday";
    if (isDisabled) return "disable-date";
    return "";
  };
  return (
    <section className="flex flex-col justify-start">
      <div className="mb-2 flex flex-col md:flex-row justify-start">
        <div className="w-full lg:w-[calc(100% - 76px)] lg:max-w-[326px]">
          <h3 className="mb-2 text-left text-base text-[#000853]">{label}</h3>
          <Calendar
            onChange={(date) => handleDateClick(date as Date)}
            value={selectedDate}
            tileClassName={tileClassName}
            className="border p-2 w-full"
            defaultActiveStartDate={new Date(2024, 10, 1)}
          />
        </div>

        {selectedDate && !unavailableMessage && !isDateDisabled(selectedDate) && (
          <AvailableTimes selectedTime={selectedTime} setSelectedTime={setSelectedTime} />
        )}
      </div>
      {unavailableMessage && (
        <div className="text-sm w-full flex gap-2 flex-nowrap">
          <img src={errorIconPink} alt="Error Icon" />
          {unavailableMessage}
        </div>
      )}
    </section>
  );
};

export default BookingCalendar;

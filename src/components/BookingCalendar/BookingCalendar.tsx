import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import { Holiday } from "./BookingCalendar.types";
import AvailableTimes from "./../AvailableTimes/AvailableTimes";

const API_URL = import.meta.env.VITE_HOLIDAYS_API_URL;
const API_KEY = import.meta.env.VITE_API_NINJAS_KEY;

interface BookingCalendarProps {
  label: string;
  selectedDate: Date | null;
  onDateChange: (date: Date) => void;
  isDateDisabled?: (date: Date) => boolean;
  holidayMessage?: string;
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({
  label,
  selectedDate,
  onDateChange,
  isDateDisabled,
  holidayMessage,
}) => {
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [unavailableMessage, setUnavailableMessage] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get(`${API_URL}?country=PL&year=2024`, {
        headers: { "X-Api-Key": API_KEY },
      })
      .then((response) => setHolidays(response.data.holidays || []))
      .catch((error) => console.error("Error fetching holidays:", error));
  }, []);

  const handleDateClick = (date: Date) => {
    if (isDateDisabled && isDateDisabled(date)) {
      setUnavailableMessage("This date is unavailable for booking.");
    } else {
      setUnavailableMessage(null);
      onDateChange(date);
    }
  };

  const tileClassName = ({ date }: { date: Date }) => {
    const formattedDate = date.toISOString().split("T")[0];
    return holidays.some((h) => h.date === formattedDate) ? "date-holiday" : "";
  };

  const tileDisabled = ({ date }: { date: Date }) => {
    return isDateDisabled ? isDateDisabled(date) : false;
  };

  const onClickDay = (date: Date) => {
    if (isDateDisabled && isDateDisabled(date)) {
      const formattedDate = date.toISOString().split("T")[0];
      const holiday = holidays.find((h) => h.date === formattedDate);

      if (holiday) {
        setUnavailableMessage(`It is ${holiday.name}.`);
      } else {
        setUnavailableMessage("This date is unavailable for booking.");
      }
    } else {
      setUnavailableMessage(null);
    }
  };

  return (
    <section className="mb-4 flex flex-col md:flex-row justify-start">
      <div className="w-full lg:w-[calc(100% - 100px)] lg:max-w-[326px]">
        <h3 className="mb-2 text-left text-base text-[#000853]">{label}</h3>
        <Calendar
          onChange={(date) => handleDateClick(date as Date)}
          value={selectedDate}
          tileClassName={tileClassName}
          tileDisabled={tileDisabled}
          onClickDay={onClickDay}
          className="border p-2 w-full"
        />
      </div>

      {unavailableMessage && <p className="text-red-600 mt-2">{unavailableMessage}</p>}
      {holidayMessage && <p className="text-yellow-600 mt-2">{holidayMessage}</p>}

      {selectedDate && !holidayMessage && (
        <AvailableTimes selectedTime={selectedTime} setSelectedTime={setSelectedTime} />
      )}
    </section>
  );
};

export default BookingCalendar;

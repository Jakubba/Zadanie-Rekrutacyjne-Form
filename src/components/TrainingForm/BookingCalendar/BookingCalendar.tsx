import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const API_URL = import.meta.env.VITE_HOLIDAYS_API_URL;
const API_KEY = import.meta.env.VITE_API_NINJAS_KEY;

interface Holiday {
  date: string;
}

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

  const availableTimes = ["12:00", "14:00", "16:30", "18:30", "20:00"];

  useEffect(() => {
    fetch(`${API_URL}?country=PL&year=2024`, {
      headers: { "X-Api-Key": API_KEY },
    })
      .then((response) => response.json())
      .then((data) => setHolidays(data.holidays || []))
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

  return (
    <div className="mb-4 flex flex-col md:flex-row justify-start">
      <div className="w-full lg:w-[calc(100% - 100px)] lg:max-w-[326px]">
        <h3 className="mb-2 text-left text-base text-[#000853]">{label}</h3>
        <Calendar
          onChange={(date) => handleDateClick(date as Date)}
          value={selectedDate}
          tileClassName={({ date }) => {
            const formattedDate = date.toISOString().split("T")[0];
            if (holidays.some((h) => h.date === formattedDate)) {
              return "date-holiday";
            }
            return "";
          }}
          tileDisabled={({ date }) => {
            return isDateDisabled ? isDateDisabled(date) : false;
          }}
          onClickDay={(date) => {
            if (isDateDisabled && isDateDisabled(date)) {
              setUnavailableMessage("It is All Saints’ Day.");
            } else {
              setUnavailableMessage(null);
            }
          }}
          className="border p-2 w-full"
        />
      </div>

      {unavailableMessage && <p className="text-red-600 mt-2">{unavailableMessage}</p>}
      {holidayMessage && <p className="text-yellow-600 mt-2">{holidayMessage}</p>}

      <div className="md:ml-2 md:min-w-[100px]">
        {selectedDate && !holidayMessage && (
          <div className="flex flex-col">
            <h3 className="mb-2 text-left text-base text-[#000853]">Time</h3>
            <div className="flex flex-wrap md:flex-col">
              {availableTimes.map((time) => (
                <button
                  key={time}
                  type="button"
                  className={`m-1 p-2 rounded cursor-pointer border transition duration-200 ease-in-out ${
                    selectedTime === time
                      ? "border-2 border-[#761BE4]"
                      : "border hover:border-[#761BE4]"
                  }`}
                  onClick={() => setSelectedTime(time)}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingCalendar;

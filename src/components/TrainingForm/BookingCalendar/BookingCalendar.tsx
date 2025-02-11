import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

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
  const availableTimes = ["12:00", "14:00", "16:30", "18:30", "20:00"];

  return (
    <div className="mb-4 flex flex-col md:flex-row justify-start">
      <div className="w-full md:w-[calc(100% - 100px)]">
        <h3 className="mb-[8px] text-left text-base text-[#000853]">{label}</h3>
        <Calendar
          onChange={(date) => onDateChange(date as Date)}
          value={selectedDate}
          tileDisabled={({ date }) => (isDateDisabled ? isDateDisabled(date) : false)}
          className="border p-2 w-full"
        />
      </div>

      {holidayMessage && <p className="text-yellow-600">{holidayMessage}</p>}

      <div className="md:ml-2 md:min-w-[100px]">
        {selectedDate && !holidayMessage && (
          <div className="flex flex-col">
            <h3 className="mb-[8px] text-left text-base text-[#000853]">Time</h3>
            <div className="flex flex-wrap md:flex-col">
              {availableTimes.map((time) => (
                <button
                  key={time}
                  type="button"
                  className={`m-1 p-2 rounded cursor-pointer ${
                    selectedTime === time
                      ? "border-2 border-[#761BE4]"
                      : "border-1 hover:outline-2 border-[#761BE4]"
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

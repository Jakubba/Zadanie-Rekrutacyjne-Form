import React from "react";

interface AvailableTimesProps {
  selectedTime: string | null;
  setSelectedTime: (time: string) => void;
}

const availableTimes = ["12:00", "14:00", "16:30", "18:30", "20:00"];

const AvailableTimes: React.FC<AvailableTimesProps> = ({ selectedTime, setSelectedTime }) => {
  return (
    <div className="md:ml-[24px] md:min-w-[76px]">
      <h3 className="mb-2 text-left text-base text-[#000853]">Time</h3>
      <ul className="flex flex-wrap md:flex-col">
        {availableTimes.map((time) => (
          <li key={time} className="m-2 md:m-0 md:!mb-2">
            <button
              type="button"
              className={`p-2 w-full bg-white rounded-lg cursor-pointer border border-[#cbb6e5] transition duration-200 ease-in-out ${
                selectedTime === time
                  ? "border-2 border-[#761BE4]"
                  : "border hover:border-[#761BE4]"
              }`}
              onClick={() => {
                console.log("Selected time:", time);
                setSelectedTime(time);
              }}
            >
              {time}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AvailableTimes;

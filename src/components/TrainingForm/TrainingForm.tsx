import React, { useState, useEffect } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Holiday } from "./../../types";
import { DEFAULT_ERRORS, DEFAULT_FORM_DATA } from "./constansts";
import errorIcon from "./../../assets/icons/error-icon.svg";
import deleteIcon from "./../../assets/icons/default-close-icon.svg";

const API_URL = import.meta.env.VITE_HOLIDAYS_API_URL;
const API_KEY = import.meta.env.VITE_API_NINJAS_KEY;
const WORKOUT_API_URL = import.meta.env.VITE_WORKOUT_API_URL;

const TrainingForm: React.FC = () => {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [holidayMessage, setHolidayMessage] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [errors, setErrors] = useState(DEFAULT_ERRORS);
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);

  useEffect(() => {
    fetch(`${API_URL}?country=PL&year=2024`, {
      headers: { "X-Api-Key": API_KEY },
    })
      .then((response) => response.json())
      .then((data) => setHolidays(data))
      .catch((error) => console.error("Error fetching holidays:", error));
  }, []);

  const NATIONAL_HOLIDAY = "NATIONAL_HOLIDAY";

  const isDateDisabled = (date: Date) => {
    const formattedDate = date.toISOString().split("T")[0];
    return (
      holidays.some((h) => h.date === formattedDate && h.type === NATIONAL_HOLIDAY) ||
      date.getDay() === 0
    );
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime(null);
    const formattedDate = date.toISOString().split("T")[0];
    const holiday = holidays.find((h) => h.date === formattedDate);
    setHolidayMessage(holiday ? `It's ${holiday.name}` : null);
  };

  const validateInput = (name: string, value: string) => {
    let errorMessage = "";

    switch (name) {
      case "firstName":
      case "lastName":
        if (!/^[A-Za-z]+$/.test(value)) {
          errorMessage = "Please use only letters.";
        }
        break;
      case "email":
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errorMessage = (
            <>
              Please use correct formatting. <br />
              Example: address@email.com
            </>
          );
        }
        break;
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: errorMessage }));
  };
  let tooltipPosition = ((formData.age - 8) / (100 - 8)) * 100;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    validateInput(name, value);
    setShowTooltip(true);
  };

  //do photo
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        // adding 2MB limit
        setErrors((prev) => ({ ...prev, photo: "File size must be less than 2MB." }));
        return;
      }
      setErrors((prev) => ({ ...prev, photo: "" }));
      setFormData((prev) => ({ ...prev, photo: file }));
    }
  };

  const handleRemoveFile = () => {
    setFormData((prev) => ({ ...prev, photo: null }));
  };

  //walidacja
  const isFormValid = () => {
    return (
      formData.firstName.trim() !== "" &&
      formData.lastName.trim() !== "" &&
      formData.email.trim() !== "" &&
      selectedDate !== null &&
      selectedTime !== null &&
      Object.values(errors).every((error) => error === "")
    );
  };

  // submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid()) {
      alert("Please complete all required fields correctly before submitting.");
      return;
    }

    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null) {
        form.append(key, key === "photo" && value instanceof File ? value : value.toString());
      }
    });
    form.append("workoutDate", selectedDate!.toISOString().split("T")[0]);
    if (selectedTime) form.append("workoutTime", selectedTime);

    try {
      const response = await axios.post(WORKOUT_API_URL, form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        alert("Form successfully submitted!");
      } else {
        alert("Error submitting form.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting form.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto pl-[23px] pr-[25px]">
      <h2 className="text-2xl font-medium mb-4 text-[#000853] text-left">Personal Info</h2>
      {/* First Name */}
      <div className="mb-4 flex flex-col justify-start align-items-start">
        <label className="mb-[8px] text-left text-base text-[#000853]">First Name</label>
        <input
          type="text"
          name="firstName"
          required
          placeholder="First Name"
          onChange={handleChange}
          className={`w-full border p-2 rounded ${errors.email ? "input-error" : ""}`}
        />
        {errors.firstName && (
          <div className="flex justify-start items-start">
            <img src={errorIcon} alt="Error icon" className="w-4 h-4 mt-[2px] mr-[9px]" />
            <p className="text-sm">{errors.firstName}</p>
          </div>
        )}
      </div>
      {/* Last Name */}
      <div className="mb-4 flex flex-col justify-start align-items-start">
        <label className="mb-[8px] text-left text-base text-[#000853]">Last Name</label>
        <input
          type="text"
          name="lastName"
          required
          placeholder="Last Name"
          onChange={handleChange}
          className={`w-full border p-2 rounded ${errors.email ? "input-error" : ""}`}
        />
        {errors.lastName && (
          <div className="flex justify-start items-start">
            <img src={errorIcon} alt="Error icon" className="w-4 h-4 mt-[2px] mr-[9px]" />
            <p className="text-red-500 text-sm">{errors.lastName}</p>
          </div>
        )}
      </div>
      {/* Email */}
      <div className="mb-4 flex flex-col justify-start align-items-start">
        <label className="mb-[8px] text-left text-base text-[#000853]">Email Address</label>
        <input
          className={`w-full border p-2 rounded ${errors.email ? "input-error" : ""}`}
          onChange={handleChange}
          type="email"
          name="email"
          required
          placeholder="Email"
        />
        {errors.email && (
          <div className="flex justify-start items-start">
            <img src={errorIcon} alt="Error icon" className="w-4 h-4 mt-[4px] mr-[9px]" />
            <p className="text-red-500 text-sm">{errors.email}</p>
          </div>
        )}
      </div>
      {/* Age */}
      <div className="mb-4 flex flex-col justify-start align-items-start">
        <label className="mb-[8px] text-left text-base text-[#000853]">Age</label>
        <div className="flex justify-between items-center pl-[5px]">
          <span className="text-[12px]">8</span>
          <span className="text-[12px]">100</span>
        </div>
        <div className="relative">
          <input
            type="range"
            name="age"
            min="8"
            max="100"
            value={formData.age}
            onChange={handleChange}
            className="w-full mt-1 custom-range"
          />
          <div
            className={`age-tooltip ${showTooltip ? "visible" : "hidden"}`}
            style={{ left: `calc(${tooltipPosition}%)` }}
          >
            {formData.age}
          </div>
        </div>
      </div>
      {/* Photo */}
      <div className="mb-4 flex flex-col justify-start align-items-start">
        <label htmlFor="photo-upload" className="block mb-2 text-left text-base text-[#000853]">
          Photo
        </label>
        <div className="bg-white p-2 rounded border border-[#cbb6e5] h-[96px] flex justify-center items-center">
          {!formData.photo ? (
            <div className="relative flex justify-center items-center text-center">
              <input
                id="photo-upload"
                type="file"
                name="photo"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
              />
              <label
                htmlFor="photo-upload"
                className="flex justify-center items-center w-full h-full flex-nowrap"
              >
                <button className="relative cursor-pointer text-[#761be4] mr-2 after:content after:absolute after:top-[80%] after:left-[50%] after:translate-x-[-50%] after:h-[1px] after:w-full after:bg-[#761be4]">
                  Upload File
                </button>
                <p className="hidden md:block text-sm text-[#898DA9] pointer-events-none">
                  or drag & drop here
                </p>
              </label>
            </div>
          ) : (
            <div className="flex justify-center items-center gap-2">
              <p className="text-sm">{formData.photo.name}</p>
              <button type="button" onClick={handleRemoveFile} className="cursor-pointer">
                <img src={deleteIcon} alt="delete icon" />
              </button>
            </div>
          )}
        </div>
        {errors.photo && <p className="text-red-500 text-sm">{errors.photo}</p>}
      </div>
      {/* Date */}
      <h3 className="text-2xl font-medium mb-4 text-[#000853] text-left">Your workout</h3>
      <div className="mb-4 flex flex-col md:flex-row justify-start align-items-start">
        <div className="w-full md:w-[calc(100% - 100px)]">
          <h3 className="mb-[8px] text-left text-base text-[#000853]">Date</h3>
          <Calendar
            onChange={handleDateChange}
            value={selectedDate}
            tileDisabled={({ date }) => isDateDisabled(date)}
            className="border p-2 w-full"
          />
        </div>
        {holidayMessage && <p className="text-yellow-600">{holidayMessage}</p>}
        <div className="md:ml-2 md:min-w-[100px]">
          {selectedDate && !holidayMessage && (
            <div className="flex flex-col">
              <h3 className="mb-[8px] text-left text-base text-[#000853]">Time</h3>
              <div className="flex flex-wrap md:flex-col">
                {["12:00", "14:00", "16:30", "18:30", "20:00"].map((time) => (
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
      {/* Submit */}
      <button
        type="submit"
        className={`w-full py-2 px-4 rounded mt-4 ${
          isFormValid()
            ? "bg-[#761BE4] text-white cursor-pointer hover:bg-[#6a19cd]"
            : "btn-disactive text-white"
        }`}
        disabled={!isFormValid()}
      >
        Send Application
      </button>
    </form>
  );
};

export default TrainingForm;

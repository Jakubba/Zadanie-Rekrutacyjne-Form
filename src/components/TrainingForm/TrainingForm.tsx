import React, { useState, useEffect } from "react";
import axios from "axios";

// types
import { Holiday } from "./../../types";
import { DEFAULT_ERRORS, DEFAULT_FORM_DATA } from "./constansts";
// components
import InputText from "./InputText/InputText";
import InputEmail from "./InputEmail/InputEmail";
import InputRange from "./InputRange/InputRange";
import InputFile from "./InputFile/InputFile";
import BookingCalendar from "./BookingCalendar/BookingCalendar";
// env
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
      <InputText
        label="First Name"
        name="firstName"
        placeholder="First Name"
        value={formData.firstName}
        onChange={handleChange}
        error={errors.firstName}
      />
      {/* Last Name */}
      <InputText
        label="Last Name"
        name="lastName"
        placeholder="Last Name"
        value={formData.lastName}
        onChange={handleChange}
        error={errors.lastName}
      />
      {/* Email */}
      <InputEmail
        label="Email Address"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
      />

      {/* Age */}
      <InputRange
        label="Age"
        name="age"
        min={8}
        max={100}
        value={formData.age}
        onChange={handleChange}
      />
      {/* Photo */}
      <InputFile
        label="Photo"
        name="photo"
        file={formData.photo}
        onChange={handleFileChange}
        onRemove={handleRemoveFile}
        error={errors.photo}
      />

      {/* Date */}
      <h3 className="text-2xl font-medium mb-4 text-[#000853] text-left">Your workout</h3>
      <BookingCalendar
        label="Date"
        selectedDate={selectedDate}
        onDateChange={handleDateChange}
        isDateDisabled={isDateDisabled}
        holidayMessage={holidayMessage}
      />

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

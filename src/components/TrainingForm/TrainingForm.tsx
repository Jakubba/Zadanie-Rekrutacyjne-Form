import React, { useState, useEffect } from "react";
import axios from "axios";
// types
import { Holiday } from "./../BookingCalendar/BookingCalendar.types";
//data
import { DEFAULT_ERRORS, DEFAULT_FORM_DATA } from "./TrainingForm.constants.ts";
// env
const WORKOUT_API_URL = import.meta.env.VITE_WORKOUT_API_URL;
// components
import SectionTitle from "./../SectionTitle/SectionTitle";
import InputText from "./../InputText/InputText";
import InputEmail from "./../InputEmail/InputEmail";
import InputRange from "./../InputRange/InputRange";
import InputFile from "./../InputFile/InputFile";
import BookingCalendar from "./../BookingCalendar/BookingCalendar";

const TrainingForm: React.FC = () => {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [holidayMessage, setHolidayMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState(DEFAULT_ERRORS);
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);

  const NATIONAL_HOLIDAY = "NATIONAL_HOLIDAY";

  const isDateDisabled = (date: Date) => {
    const formattedDate = date.toISOString().split("T")[0];
    const isHoliday = holidays.some((h) => h.date === formattedDate && h.type === NATIONAL_HOLIDAY);
    // console.log(
    //   `Checking date ${formattedDate}: isHoliday=${isHoliday}, isSunday=${date.getDay() === 0}`
    // );
    return isHoliday || date.getDay() === 0;
  };

  // const handleDateChange = (date: Date) => {
  //   setSelectedDate(date);
  //   setSelectedTime(null);

  //   const formattedDate = date.toISOString().split("T")[0];
  //   const holiday = holidays.find((h) => h.date === formattedDate);

  //   console.log("Selected date:", formattedDate);
  //   console.log("Holiday found:", holiday);

  //   setHolidayMessage(holiday ? `It's ${holiday.name}` : null);
  // };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime(null);

    const formattedDate = date.toISOString().split("T")[0];
    const holiday = holidays.find((h) => h.date === formattedDate);

    if (holiday) {
      setHolidayMessage(`It's ${holiday.name}`);
    } else {
      setHolidayMessage(null);
    }
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
  };

  //function for file
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
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

  //function for validation
  const isFormValid = () => {
    // console.log("First Name:", formData.firstName.trim() !== "");
    // console.log("Last Name:", formData.lastName.trim() !== "");
    // console.log("Email:", formData.email.trim() !== "");
    // console.log("Age:", formData.age, "Valid Age:", formData.age >= 8 && formData.age <= 100);
    // console.log("Selected Date:", selectedDate !== null);
    // console.log("Selected Time:", selectedTime !== null);
    // console.log("Errors:", errors);
    // console.log(
    //   "Errors Valid:",
    //   Object.values(errors).every((error) => error === "")
    // );

    return (
      formData.firstName.trim() !== "" &&
      formData.lastName.trim() !== "" &&
      formData.email.trim() !== "" &&
      selectedDate !== null &&
      selectedTime !== null &&
      formData.age >= 8 &&
      formData.age <= 100 &&
      Object.values(errors).every((error) => error === "")
    );
  };

  //function for submit
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
    <form onSubmit={handleSubmit} className="w-[calc(100%-48px)] md:w-full mx-auto  max-w-[426px]">
      <SectionTitle level="h2">Personal Info</SectionTitle>
      <InputText
        label="First Name"
        name="firstName"
        placeholder="First Name"
        value={formData.firstName}
        onChange={handleChange}
        error={errors.firstName}
      />
      <InputText
        label="Last Name"
        name="lastName"
        placeholder="Last Name"
        value={formData.lastName}
        onChange={handleChange}
        error={errors.lastName}
      />
      <InputEmail
        label="Email Address"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
      />
      <InputRange
        label="Age"
        name="age"
        min={8}
        max={100}
        value={formData.age}
        onChange={handleChange}
      />
      <InputFile
        label="Photo"
        name="photo"
        file={formData.photo}
        onChange={handleFileChange}
        onRemove={handleRemoveFile}
        error={errors.photo}
      />
      <SectionTitle level="h3">Your Workout</SectionTitle>
      <BookingCalendar
        label="Date"
        selectedDate={selectedDate}
        onDateChange={handleDateChange}
        isDateDisabled={isDateDisabled}
        holidayMessage={holidayMessage}
      />
      <button
        type="submit"
        className={`w-full py-2 px-4 rounded-lg mt-12 ${
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

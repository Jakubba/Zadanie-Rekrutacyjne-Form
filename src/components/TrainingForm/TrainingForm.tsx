import { useState, useMemo } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Holiday } from "./../BookingCalendar/BookingCalendar.types";
import { DEFAULT_ERRORS, DEFAULT_FORM_DATA } from "./TrainingForm.constants.ts";
const WORKOUT_API_URL = import.meta.env.VITE_WORKOUT_API_URL;
import SectionTitle from "./../SectionTitle/SectionTitle";
import InputText from "./../InputText/InputText";
import InputEmail from "./../InputEmail/InputEmail";
import InputRange from "./../InputRange/InputRange";
import InputFile from "./../InputFile/InputFile";
import BookingCalendar from "./../BookingCalendar/BookingCalendar";

const TrainingForm: React.FC = () => {
  const [holidays] = useState<Holiday[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [holidayMessage, setHolidayMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>(DEFAULT_ERRORS);
  const [formData, setFormData] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    age: number;
    photo: File | null;
  }>(DEFAULT_FORM_DATA);

  const handleDateChange = (date: Date): void => {
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

  const validateInput = (name: string, value: string): void => {
    let errorMessage: JSX.Element | string = "";
    const NAME_REGEX = /^[A-Za-z]+$/;
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if ((name === "firstName" || name === "lastName") && !NAME_REGEX.test(value)) {
      errorMessage = "Please use only letters.";
    } else if (name === "email" && !EMAIL_REGEX.test(value)) {
      errorMessage = (
        <>
          Please use correct formatting.
          <br />
          Example: address@email.com
        </>
      );
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: errorMessage }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    validateInput(name, value);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const MAX_FILE_SIZE = 2 * 1024 * 1024;
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setErrors((prev) => ({ ...prev, photo: "File size must be less than 2MB." }));
        return;
      }
      setErrors((prev) => ({ ...prev, photo: "" }));
      setFormData((prev) => ({ ...prev, photo: file }));
    }
  };

  const handleRemoveFile = (): void => {
    setFormData((prev) => ({ ...prev, photo: null }));
  };

  const isFormValid = useMemo(() => {
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
  }, [formData, selectedDate, selectedTime, errors]);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!isFormValid) {
      toast.error("Please complete all required fields correctly before submitting.");
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
        toast.success("Form successfully submitted!");
      } else {
        toast.error("Error submitting form.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Error submitting form.");
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="w-[calc(100%-48px)] md:w-full mx-auto max-w-[426px] py-8"
      >
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
          holidayMessage={holidayMessage}
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
        />
        <button
          type="submit"
          className={`w-full py-2 px-4 rounded-lg mt-12 ${
            isFormValid
              ? "bg-[#761BE4] text-white cursor-pointer hover:bg-[#6a19cd]"
              : "btn-disactive text-white"
          }`}
          disabled={!isFormValid}
        >
          Send Application
        </button>
      </form>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default TrainingForm;

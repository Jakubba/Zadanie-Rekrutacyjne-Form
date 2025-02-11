import React from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export const TrainingForm = () => {
  return (
    <form className="max-w-lg mx-auto pl-[23px] pr-[25px]">
      <h2 className="text-2xl font-medium mb-4 text-[#000853] text-left">Personal Info</h2>
      {/* First Name */}
      <div className="mb-4 flex flex-col justify-start align-items-start">
        <label className="mb-[8px] text-left text-base text-[#000853]">First Name</label>
        <input
          className="w-full border p-2 rounded"
          type="text"
          name="firstName"
          required
          placeholder="First Name"
        />
      </div>
      {/* Last Name */}
      <div className="mb-4 flex flex-col justify-start align-items-start">
        <label className="mb-[8px] text-left text-base text-[#000853]">Last Name</label>
        <input
          className="w-full border p-2 rounded"
          type="text"
          name="lastName"
          required
          placeholder="Last Name"
        />
      </div>
      {/* Email */}
      <div className="mb-4 flex flex-col justify-start align-items-start">
        <label className="mb-[8px] text-left text-base text-[#000853]">Email Address</label>
        <input
          className="w-full border p-2 rounded"
          type="email"
          name="email"
          required
          placeholder="Email"
        />
      </div>
      {/* Age */}
      <div className="mb-4 flex flex-col justify-start align-items-start">
        <label className="mb-[8px] text-left text-base text-[#000853]">Age</label>
        <div className="flex justify-between items-center pl-[5px]">
          <span className="text-[12px]">8</span>
          <span className="text-[12px]">100</span>
        </div>
        <div className="relative">
          <input className="w-full mt-1 custom-range" type="range" name="age" min="8" max="100" />
          <div className="age-tooltip visible">10</div>
        </div>
      </div>
      {/* Photo */}
      <div className="mb-4 flex flex-col justify-start align-items-start">
        <label htmlFor="photo-upload" className="block mb-2 text-left text-base text-[#000853]">
          Photo
        </label>
        <div className="bg-white p-2 rounded border border-[#cbb6e5] h-[96px] flex justify-center items-center">
          <div className="relative  flex justify-center items-center text-center">
            <input
              className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
              id="photo-upload"
              type="file"
              name="photo"
              accept="image/*"
            />
            <label
              htmlFor="file-upload"
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
        </div>
      </div>
      {/* Date */}
      <h3 className="text-2xl font-medium mb-4 text-[#000853] text-left">Your workout</h3>
      <div className="mb-4 flex flex-col md:flex-row justify-start align-items-start ">
        <div className="w-full md:w-[calc(100% - 100px)]">
          <h3 className="mb-[8px] text-left text-base text-[#000853]">Date</h3>
          <Calendar className="border p-2 w-full" />
        </div>
        <div className="md:ml-2 md:min-w-[100px]">
          <div className="flex flex-col">
            <h3 className="mb-[8px] text-left text-base text-[#000853]">Time</h3>
            <div className="flex flex-wrap md:flex-col">
              {["12:00", "14:00", "16:30", "18:30", "20:00"].map((time) => (
                <button
                  key={time}
                  type="button"
                  className="m-1 p-2 rounded cursor-pointer border-2 border-[#761BE4]"
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Submit */}
      <button
        className="w-full py-2 px-4 rounded mt-4 bg-[#761BE4] text-white cursor-pointer hover:bg-[#6a19cd]"
        type="submit"
      >
        Send Application
      </button>
    </form>
  );
};

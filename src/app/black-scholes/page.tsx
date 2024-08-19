"use client";

import { FieldValues, useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { TfiAngleDown } from "react-icons/tfi";
import { Spinner } from "@/components/Spinner";

export default function Home() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [prices, setPrices] = useState<number[]>([]);
  const [ticker, setTicker] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm({
    reValidateMode: "onSubmit",
  });

  const tickerValue = watch("ticker", "");
  const strikeValue = watch("strike", "");
  const volatilityValue = watch("volatility", "");
  const rateValue = watch("rate", "");

  const submitOption = async (data: FieldValues) => {
    setSubmitting(true);
    setError("");
    console.log(data);

    try {
      const response = await fetch("/api/black-scholes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data }),
      });
      if (!response.ok) {
        const errorMessage = await response.text();
        setError(errorMessage);
        return;
      }

      const prices = await response.json();
      setPrices(prices);
      setTicker(data.ticker);
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
    setSubmitting(false);
  };

  const fieldClass =
    "w-full p-3 border border-gray-300 placeholder:font-[300] placeholder:text-[15px] bg-white text-black rounded-xl";
  const errorClass = "text-red-500 text-[12px] mt-1";
  const labelClass =
    "rounded-md absolute left-3 -top-2 text-[#162341] text-[12px] bg-white px-1 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base transition-all duration-200 transform";

  return (
    <>
      <p className="text-center mt-10 text-2xl underline font-semibold">
        Black-Scholes Model
      </p>
      <div className="flex justify-center mt-4">
        <form
          className="flex flex-col px-7 w-1/2"
          onSubmit={handleSubmit(submitOption)}
        >
          <div className="relative">
            <input
              placeholder="Ticker"
              id="ticker"
              className={`${fieldClass} ${
                errors.ticker ? "border-red-500" : ""
              }`}
              {...register("ticker", { required: "Ticker is required" })}
            ></input>
            <label
              htmlFor="ticker"
              className={`${labelClass}
                      ${
                        tickerValue
                          ? " opacity-100 translate-y-0"
                          : " opacity-0 translate-y-4"
                      }`}
            >
              Ticker
            </label>
            {errors.ticker && (
              <p className={errorClass}>{errors.ticker.message as string}</p>
            )}
          </div>
          <div className="relative mt-6">
            <input
              placeholder="Strike Price"
              id="strike"
              className={`${fieldClass} ${
                errors.strike ? "border-red-500" : ""
              }`}
              {...register("strike", {
                required: "Strike Price is required",
                validate: (value) =>
                  parseFloat(value) >= 0 || "Amount must be a positive number",
              })}
            ></input>
            <label
              htmlFor="strike"
              className={`${labelClass}
                      ${
                        strikeValue
                          ? " opacity-100 translate-y-0"
                          : " opacity-0 translate-y-4"
                      }`}
            >
              Strike Price
            </label>
            {errors.strike && (
              <p className={errorClass}>{errors.strike.message as string}</p>
            )}
          </div>
          <div className="relative mt-6">
            <input
              type="date"
              placeholder="Expiration Date"
              id="expiration"
              className={`${fieldClass} ${
                errors.expiration ? "border-red-500" : ""
              }`}
              {...register("expiration", {
                required: "Expiration Date is required",
                validate: (value) => {
                  const selectedDate = new Date(value);
                  const today = new Date();

                  today.setHours(0, 0, 0, 0);

                  return (
                    selectedDate > today ||
                    "Expiration Date must be later than today"
                  );
                },
              })}
            ></input>
            <label htmlFor="amount" className={labelClass}>
              Expiration Date
            </label>
            {errors.expiration && (
              <p className={errorClass}>
                {errors.expiration.message as string}
              </p>
            )}
          </div>
          <div className="relative mt-6">
            <input
              placeholder="Volatility"
              id="volatility"
              className={`${fieldClass} ${
                errors.volatility ? "border-red-500" : ""
              }`}
              {...register("volatility", {
                required: "Volatility is required",
                validate: (value) =>
                  parseFloat(value) >= 0 ||
                  "Volatility must be a positive number",
              })}
            ></input>
            <label
              htmlFor="volatility"
              className={`${labelClass}
                      ${
                        volatilityValue
                          ? " opacity-100 translate-y-0"
                          : " opacity-0 translate-y-4"
                      }`}
            >
              Volatility
            </label>
            {errors.volatility && (
              <p className={errorClass}>
                {errors.volatility.message as string}
              </p>
            )}
          </div>
          <div className="relative mt-6">
            <input
              placeholder="Risk-Free Rate"
              id="rate"
              className={`${fieldClass} ${errors.rate ? "border-red-500" : ""}`}
              {...register("rate", {
                required: "Risk-Free Rate is required",
                validate: (value) =>
                  (parseFloat(value) <= 1 && parseFloat(value) >= -1) ||
                  "Rate must be between -1 and 1",
              })}
            ></input>
            <label
              htmlFor="rate"
              className={`${labelClass}
                      ${
                        rateValue
                          ? " opacity-100 translate-y-0"
                          : " opacity-0 translate-y-4"
                      }`}
            >
              Risk-Free Rate
            </label>
            {errors.rate && (
              <p className={errorClass}>{errors.rate.message as string}</p>
            )}
          </div>
          <button
            disabled={submitting}
            type="submit"
            className={`mb-2 mt-7 duration-500 transition-all w-full border-2 bg-black border-black text-white rounded-xl font-bold hover:bg-white hover:-translate-y-2 hover:text-black ${
              submitting ? "py-0" : "py-3"
            }`}
          >
            {submitting ? <Spinner /> : "Check Price"}
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </form>
      </div>
      {prices.length > 0 && (
        <div className="mt-6 text-center">
          <p className="font-bold">
            {ticker} Call Option Price: {prices[0]}
          </p>
          <p className="font-bold">
            {ticker} Put Option Price: {prices[1]}
          </p>
        </div>
      )}
    </>
  );
}

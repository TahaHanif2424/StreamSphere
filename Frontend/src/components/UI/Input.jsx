import { useRef } from "react";

export default function Input({
  type,
  label,
  id,
  validation,
  value,
  isTouched,
  isValid,
  setValue,
  setIsTouched,
}) {
  const timerRef = useRef(null);

  function handleInputChange(event) {
    setValue(event.target.value);

    if (!isTouched) {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setIsTouched(true);
      }, 500);
    }
  }

  let borderClass = "border-gray-300 focus:ring-blue-400 focus:border-blue-400";
  let bgClass = "bg-white";

  if (validation && isTouched) {
    if (isValid) {
      borderClass = "border-green-400 focus:ring-green-400 focus:border-green-400";
      bgClass = "bg-green-50";
    } else {
      borderClass = "border-red-400 focus:ring-red-400 focus:border-red-400";
      bgClass = "bg-red-50";
    }
  }

  return (
    <div className="flex flex-col gap-1 w-full">
      <label
        htmlFor={id}
        className="text-sm font-semibold text-gray-800 tracking-wide"
      >
        {label}
      </label>
      <input
        type={type}
        id={id}
        value={value}
        onChange={handleInputChange}
        className={`w-full px-3 py-2 text-gray-800 rounded-lg shadow-sm transition duration-200 outline-none border ${borderClass} ${bgClass} focus:ring-2`}
      />
    </div>
  );
}

import { useRef } from "react";

export default function Input({
  type,
  label,
  id,
  name,
  validation,
  value,
  isTouched,
  isValid,
  setValue,
  setIsTouched,
  Icon, 
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

  let borderClass = "border-gray-300 focus:ring-blue-500 focus:border-blue-500";
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
    <div className="flex flex-col gap-1 w-full transition-all duration-300">
      <label
        htmlFor={id}
        className="text-sm font-semibold text-gray-700 tracking-wide"
      >
        {label}
      </label>

      <div
        className={`flex items-center gap-3 px-3 py-2 rounded-lg shadow-sm border transition-all duration-300 ${borderClass} ${bgClass}`}
      >
        {Icon && <Icon className="text-gray-500 text-lg" />}
        <input
          type={type}
          id={id}
          value={value}
          name={name}
          onChange={handleInputChange}
          className="w-full text-gray-800 bg-transparent outline-none text-sm"
        />
      </div>
    </div>
  );
}

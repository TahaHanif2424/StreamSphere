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

  let bgClass = "bg-white";

  if (validation && isTouched) {
    if (isValid) bgClass = "bg-sky-500";
    else bgClass = "bg-red-300";
  }

  return (
    <div className="flex gap-4">
      <label className="text-lg font-semibold text-gray-600" htmlFor={id}>
        {label}
      </label>
      <input
        onChange={handleInputChange}
        className={`outline-none border border-solid border-gray-800 px-2 ${bgClass}`}
        type={type}
        id={id}
        value={value}
      />
    </div>
  );
}

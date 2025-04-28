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
    if (isValid) bgClass = "bg-sky-100";
    else bgClass = "bg-red-200";
  }

  return (
    <div className="flex flex-col gap-1 items-start justify-start w-full">
      <label className="text-sm font-medium text-gray-900 tracking-wide" htmlFor={id}>
        {label}
      </label>
      <input
        onChange={handleInputChange}
        className={`outline-none border border-solid border-gray-800 px-1 py-0.5 rounded-md text-md ${bgClass}`}
        type={type}
        id={id}
        value={value}
        fuc
      />
    </div>
  );
};

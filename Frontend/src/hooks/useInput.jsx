import { useEffect } from "react";
import { useState } from "react";

export default function useInput(validation, initialState) {
  const [value, setValue] = useState(initialState);
  const [isValid, setIsValid] = useState(false);
  const [isTouched, setIsTouched] = useState(false);

  useEffect(() => {
    if (!validation.isValidationOn || !isTouched) return;
    const id = setTimeout(() => {
      setIsValid(validation.validationFunc(value));
    }, [100]);

    return () => {
      clearTimeout(id);
    };
  }, [value, isTouched]);

  return [value, setValue, isTouched, setIsTouched, isValid];
}

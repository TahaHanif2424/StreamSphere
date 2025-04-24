import { useEffect } from "react";
import { useState } from "react";

let i = 0;

export default function useInput(validation, initialState) {
  const [value, setValue] = useState(initialState);
  const [isValid, setIsValid] = useState(false);
  const [isTouched, setIsTouched] = useState(false);

  useEffect(() => {
    if (!validation.isValidationOn || !isTouched) return;
    if (isTouched && !i) {
      setIsValid(validation.validationFunc(value));
      i++;
    } else {
      var id = setTimeout(() => {
        setIsValid(validation.validationFunc(value));
      }, [500]);
    }

    return () => {
      clearTimeout(id);
    };
  }, [value, isTouched]);

  return [value, setValue, isTouched, setIsTouched, isValid];
}

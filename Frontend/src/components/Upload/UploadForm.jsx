import { Form } from "react-router-dom";
import useInput from "../../hooks/useInput";
import { validateTitle } from "../../utils/validation";
import Input from '../UI/Input';
import FileDropZone from "./FileDropZone";
import { useState } from "react";

export default function UploadForm({ title, thumbnail }) {
  const [files, setFiles] = useState({ image: null, video: null });
  const [
    enteredTitle,
    setEnteredTitle,
    isTitleTouched,
    setIsTitleTouched,
    isTitleValid,
  ] = useInput(
    { isValidationOn: true, validationFunc: validateTitle },
    title ? title : ""
  );

  return (
    <Form method="POST" className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-xl space-y-6">
      <h1 className="text-2xl font-bold text-blue-600 text-center">
        {(!title && !thumbnail) ? 'Upload a New Video' : 'Edit Video'}
      </h1>

      <div>
        <Input
          type={'text'}
          label={'Title'}
          id={'title'}
          validation={true}
          isTouched={isTitleTouched}
          setIsTouched={setIsTitleTouched}
          value={enteredTitle}
          setValue={setEnteredTitle}
          isValid={isTitleValid}
        />
      </div>

      <FileDropZone setFiles={setFiles} />

      <div className="text-center">
        <button
          type="submit"
          className="bg-blue-500 text-white text-lg font-semibold rounded-md py-2 px-6 transition-colors duration-200 hover:bg-white hover:text-blue-600 border border-blue-500 cursor-pointer"
        >
          Submit
        </button>
      </div>
    </Form>
  );
}

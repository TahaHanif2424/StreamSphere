import Input from "./components/UI/Input";
import useInput from "./hooks/useInput";
import './App.css';

function App() {
  const [emailValue, setEmailValue, isEmailTouched, setIsEmailTouched, isEmailValid] = useInput({isValidationOn: true, validationFunc: (value) => value.length >= 16}, '');

  return <Input type={'email'} label={'Enter Email'} id={'email'} value={emailValue} validation={true} isTouched={isEmailTouched} isValid={isEmailValid} setValue={setEmailValue} setIsTouched={setIsEmailTouched} />
};

export default App

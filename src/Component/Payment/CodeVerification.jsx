import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./codverify.module.css";
import { useDispatch, useSelector } from "react-redux";
import { registerVerifyMobile, registerVerifyOtp } from "../../action/RegisterationAction";

const CodeVerification = ({mobile,setCodVerify,setDirect}) => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const inputsRef = useRef([]);
  const dispatch = useDispatch();
  const registerOtp = useSelector((state) => state.registerVerify?.data?.otp);

  useEffect(()=>{
    if(mobile){

      dispatch(registerVerifyMobile({mobile: Number(mobile)}))
    }

  },[])

  useEffect(() => {
    // Timer countdown effect
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(countdown); // Cleanup interval on unmount
    }
  }, [timer]);

  const handleChange = (e, index) => {
    const { value } = e.target;
    if (/^[0-9]$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      // Move to the next input if there's a valid value
      if (index < code.length - 1 && value) {
        inputsRef.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    const { key } = e;

    if (key === "Backspace") {
      const newCode = [...code];

      if (newCode[index] === "") {
        // Move back to the previous input and clear it
        if (index > 0) {
          inputsRef.current[index - 1].focus();
        }
      } else {
        // Clear the current input
        newCode[index] = "";
        setCode(newCode);
      }
    }
  };



  const handleSubmit  = async () => {
    if (code.every((digit) => digit !== "")) {
      // alert(`Submitted OTP: ${code.join("")}`);
      if(registerOtp === code.join('')){

        const response = await registerVerifyOtp({
           mobile: mobile,
           otp: code.join('')
         })
   
         if(response.status){
           setCodVerify(false)
           setDirect()
         }
      }else{
        alert('wrong otp')
      }
      

    } else {
      alert("Please fill in all fields");
    }
  };

  const handleResendOTP = () => {
    setCode(["", "", "", "", "", ""]);
    setTimer(60);
    dispatch(registerVerifyMobile({mobile: mobile}))
    inputsRef.current[0].focus();
  };

  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <div className={`${styles.colSm6} ${styles.colSmOffset2}`}>
          <h1>Check your Phone!</h1>
          <p className={styles.desc}>
            We’ve sent a six-digit confirmation code to <strong>987363506</strong>.
            Enter it below to confirm your Order.
          </p>

          <label>
            <span className={styles.normal}>ENTER YOUR</span> <strong>OTP NUMBER</strong>
          </label>

          <div
            className={`${styles.confirmationCode} ${styles.splitInput} ${styles.largeBottomMargin}`}
            data-multi-input-code="true"
          >
            {code.slice(0, 3).map((digit, index) => (
              <div
                key={index}
                className={`${styles.splitInputItem} ${styles.inputWrapper}`}
              >
                <input
                  type="text"
                  className={styles.inlineInput}
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  ref={(el) => (inputsRef.current[index] = el)}
                />
              </div>
            ))}

            <div className={styles.confirmationCodeSpanCell}>—</div>

            {code.slice(3).map((digit, index) => (
              <div
                key={index + 3}
                className={`${styles.splitInputItem} ${styles.inputWrapper}`}
              >
                <input
                  type="text"
                  className={styles.inlineInput}
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(e, index + 3)}
                  onKeyDown={(e) => handleKeyDown(e, index + 3)}
                  ref={(el) => (inputsRef.current[index + 3] = el)}
                />
              </div>
            ))}
          </div>

          <div className={styles.timer}>
            {timer > 0 ? (
                <div>
                   <p>Resend code in: {timer}s</p>
                <button
                  onClick={handleSubmit}
                  disabled={timer === 0} // Disable if timer has expired
                  className={styles.submitButton}
                >
                  {"Submit OTP" }
                </button>
              </div>
            ) : (
              <>
              <p>Resend code in: {timer}s</p>
              <button onClick={handleResendOTP} className={styles.submitButton}>Resend Code</button>
              </>
            )}
          </div>

        
        </div>
      </div>
    </div>
  );
};

export default CodeVerification;

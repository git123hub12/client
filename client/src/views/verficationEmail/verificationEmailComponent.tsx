import { useEffect, useState } from 'react';
import styles from './verificationEmailComponent.module.css';
import { useNavigate } from 'react-router-dom';
const VerificationEmail: React.FC = () => {
  const [countdown, setCountdown] = useState(5);
  const navigate = useNavigate();
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);
 
    if (countdown === 0) {
      navigate("/");
    }
 
    return () => clearInterval(intervalId);
  }, [countdown, navigate]);
 
  return (
<div className={styles.confirmation}>
<img className={styles.logoImg} src="/icons/logo.svg" alt="Logo" />
<b className={styles.thanksForThe}>Thanks for the registration!</b>
<b className={styles.weHaveSent}>
        We have sent you a verification email.
</b>
<p className={styles.redirectMessage}>
        Redirecting to login page in {countdown} seconds...
</p>
<img
        className={styles.iconCheckCircle}
        src="/icons/Check Circle.png"
        alt="Check Circle"
      />
</div>
  );
};
 
export default VerificationEmail;
import { useEffect, useState } from 'react';
import styles from '../verficationEmail/verificationEmailComponent.module.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { getDataFromLocalStorage, saveDataToLocalStorage } from '../../localStorageComp/storage';

const UserVerified: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState(5);
  const userEmail = new URLSearchParams(location.search).get('email');
  const token = new URLSearchParams(location.search).get('token');

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSeconds((prevSeconds) => (prevSeconds > 0 ? prevSeconds - 1 : 0));
    }, 1000);

    // Clear the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (seconds === 0 && (userEmail !== null || userEmail !== undefined)) {
      saveDataToLocalStorage('user', { email: userEmail });
      navigate(`/profile`); // Send to profile page to fill the user profile.
    }
  }, [seconds, navigate, userEmail]);

  return (

    
    <div className={styles.confirmation}>
      <img className={styles.logoImg} src="/icons/logo.svg" alt="Logo" />
      
      <b className={styles.thanksForThe}>Your e-mail has been verified.</b>
      <img
              className={styles.iconCheckCircle}
              src="/icons/Check Circle.png"
              alt="Check Circle"
            />
      
      
      <b className={styles.yourEMailHas}>Your e-mail has been verified.</b>
       {seconds > 0 && <p className={styles.youWillBe}>You will be redirected in {seconds} seconds</p>}
      </div>
  );
};

export default UserVerified;
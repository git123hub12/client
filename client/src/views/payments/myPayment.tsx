// #index.jsx
import React, { useState } from "react";
import styles from './myPayment.module.css';
import CategoryMenu from "../userProfile/categoryMenu";
import { logout } from "../../controller/registerController";
import { useNavigate } from 'react-router-dom';
import { getUserDetails} from '../../controller/registerController';

// import { getDataFromLocalStorage } from '../../localStorageComp/storage';




const MyPayment:React.FC = () => {
    const navigate = useNavigate();
    const [cardNumber, setCardNumber] = useState('');
    const [cardHolderName, setCardHolderName] = useState('');
    const [expirationDate, setExpirationDate] = useState('');
    const [cvc, setCvc] = useState('');
    const handleChange = (e: { target: { value: string; }; }) => {
        const input = e.target.value.replace(/\D/g, ''); // Remove non-digit characters
        const formattedInput = input.replace(/(\d{4})(?=\d)/g, '$1 ');
        if (formattedInput.length <= 19) {
          setCardNumber(formattedInput);
        }
      };
    const handleCardHolderNameChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setCardHolderName(e.target.value);
      };
      const handleExpirationDateChange = (e: { target: { value: any; }; }) => {
        const input = e.target.value;
        if (/^\d{0,2}\/\d{0,2}$/.test(input)) { // Validate MM/YY format
          setExpirationDate(input);
        }
      };
      const handleCvcChange = (e: { target: { value: any; }; }) => {
        const input = e.target.value;
        const maskedCvc = input.replace(/\d/g, '*'); // Replace digits with asterisks
        setCvc(maskedCvc.slice(0, 3)); // Limit to 3 characters
      };
      
      const handleLogout = async () => {
        try {
          // Handle the Google login response
          const result = await logout();
          console.log("google login result => ", result);
    
          // remove user from local storage
          localStorage.removeItem('user');
        } catch (error) {
          // Handle registration error
          console.error('Error while loggin out the user:', error);
        }
      };


      const handleProfileClick = () =>{
        navigate('/profile');
      }
      

    
  return (
    <div className={styles.index}>
      <div className={styles.overlapwrapper}>
        <div className={styles.overlap}>
          <div className={styles.dashboardlayout}>
            <div className={styles.topbar}>
              <div className={styles.chat}>
                <img
                  className={styles.vector}
                  alt="Vector"
                  src="https://cdn.animaapp.com/projects/65bd4a20752f679da804a025/releases/65c640543cfe941a2618b505/img/vector-1.png"
                />
              </div>
              <div className={styles.userprofile}>
                <div className={styles.overlapgroup}>
                  <img
                    className={styles.DALLE}
                    alt="Dalle"
                    src="https://cdn.animaapp.com/projects/65bd4a20752f679da804a025/releases/65c640543cfe941a2618b505/img/dall-e-2022-11-11-13-44-1@2x.png"
                  />
                  <div className={styles.frame}>
                  {/* <img className={styles.dalle2022111113441} onClick={handleProfileClick} alt="" src={user?.picture ? user?.picture : '/images/noDp.png'} />	 */}
                    <div className={styles.textwrapper}>PRO</div>
                  </div>
                </div>
              </div>
              
                 <img className={styles.logoutButton} onClick={handleLogout} alt="" src="/images/LogoutIcon.svg" />

        				
            </div>
            <div className={styles.hamburgermenu}>
              <img
                className={styles.mainlogo}
                alt="Main logo"
                src="https://cdn.animaapp.com/projects/65bd4a20752f679da804a025/releases/65c640543cfe941a2618b505/img/main-logo.png"
              />
            </div>
          </div>
          <img
            className={styles.line}
            alt="Line"
            src="https://cdn.animaapp.com/projects/65bd4a20752f679da804a025/releases/65c651ce3cfe941a2618b536/img/line-54.svg"
          />
          <img
            className={styles.img}
            alt="Line"
            src="https://cdn.animaapp.com/projects/65bd4a20752f679da804a025/releases/65c651ce3cfe941a2618b536/img/line-55.svg"
          />
          <div className={styles.lightdarkversion}>
            <div className={styles.div}>
              {/* <div className={styles.frame2} />
              <div className={styles.frame3} />
              <div className={styles.frame4} /> */}
              {/* <img
                className={styles.vector2}
                alt="Vector"
                src="https://cdn.animaapp.com/projects/65bd4a20752f679da804a025/releases/65c640543cfe941a2618b505/img/vector-2.svg"
              /> */}
              {/* <img
                className={styles.vector3}
                alt="Vector"
                src="https://cdn.animaapp.com/projects/65bd4a20752f679da804a025/releases/65c640543cfe941a2618b505/img/vector-3.svg"
              /> */}
            </div>
          </div>
          <div className={styles.rectangle} />
          <CategoryMenu selectedCategory="MyPayments" />
          <div className={styles.login}>
            <div className={styles.login2}>
              <div className={styles.title}>
                <div className={styles.textwrapper4}>My payments</div>
              </div>
              <div className={styles.accountinfo}>
                <div className={styles.accountinfo}>
                  <div className={styles.frame6}>
                    <div className={styles.textwrapper5}>Credit card</div>
                    <div className={styles.frame7}>
                      <div className={styles.frame8}>
                        <div className={styles.frame9}>
                          <div className={styles.textwrapper6}>Visa ••••••9999</div>
                          <div className={styles.textwrapper7}>Expiration: 02/2024</div>
                        </div>
                        <button className={styles.button}>
                          <div className={styles.label}>Add payment method</div>
                        </button>
                      </div>
                      <div className={styles.frame8}>
                        <div className={styles.textwrapper8}>Add new credit card</div>
                        <img
                          className={styles.logo}
                          alt="Logo"
                          src="https://cdn.animaapp.com/projects/65bd4a20752f679da804a025/releases/65c651ce3cfe941a2618b536/img/logo.svg"
                        />
                      </div>
                      <div className={styles.frame10}>
                        <div className={styles.simpleinput}>
                          <div className={styles.textwrapper9}>CARD NUMBER</div>
                          {/* <div className={styles.singleinputfield}> */}
                          <div >
								<input className={styles.singleinputfield } type="text" id="cardNumber" name="cardNumber" value={cardNumber} onChange={handleChange} maxLength={19} ></input>
							</div>
                            <div className={styles.frame11}>

                              {/* <div className={styles.frame12}>
                                <div className={styles.textwrapper10}>9224 0000 1111 3333</div>
                                <div className={styles.cursor} />
                              </div> */}
                              {/* <img
                                className={styles.img3}
                                alt="Icons check line"
                                src="https://cdn.animaapp.com/projects/65bd4a20752f679da804a025/releases/65c651ce3cfe941a2618b536/img/icons-check-line.svg"
                              /> */}
                            </div>
                          {/* </div> */}
                        </div>
                        <div className={styles.simpleinput}>
                          <div className={styles.textwrapper9}>CARD HOLDER</div>
                          {/* <div className={styles.singleinputfield}>
                            <p className={styles.textwrapper11}>PHAM TRAN LAN CAM NGOC</p>
                          </div> */}
                          <div >
								<input className={styles.singleinputfield } type="text" id="cardHolderName" name="cardHolderName" value={cardHolderName} onChange={handleCardHolderNameChange} ></input>
							</div>
                        </div>
                        <div className={styles.frame13}>
                          <div className={styles.simpleinput2}>
                            <div className={styles.textwrapper9}>EXPIRATION DATE</div>
                            <div>
                            <input className={styles.singleinputfield} type="text" id="expirationDate" name="expirationDate" value={expirationDate} onChange={handleExpirationDateChange} maxLength={5} placeholder="MM/YY"/>

                            </div>
                            {/* <div className={styles.singleinputfield}>
                              <div className={styles.textwrapper11}>MM / YY</div>
                            </div> */}
                          </div>
                          <div className={styles.simpleinput2}>
                            <div className={styles.textwrapper9}>CVC</div>
                            <div>
                            <input className={styles.singleinputfield} type="text"  id="cvc" name="cvc" value={cvc} onChange={handleCvcChange} maxLength={3} placeholder="CVC"/>
                              {/* <div className={styles.textwrapper11}>{""}</div> */}
                            </div>
                          </div>
                        </div>
                        <div className={styles.checkbox}>
                          <img
                            className={styles.img3}
                            alt="Ratio button"
                            src="https://cdn.animaapp.com/projects/65bd4a20752f679da804a025/releases/65c651ce3cfe941a2618b536/img/ratio-button.svg"
                          />
                          <div className={styles.textwrapper10}>Save Card</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPayment;
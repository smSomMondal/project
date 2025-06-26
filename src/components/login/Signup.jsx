import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { useContext } from "react";
import { UserContext } from "../../context/userContext";

const Signup = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [contact, setContact] = useState("");
    const [userType, setUserType] = useState("");
    const [password, setPassword] = useState("");
    const [rePassword, setRePassword] = useState("");

    const nave = useNavigate();

    const { login } = useContext(UserContext);

    const togglePasswordVisibility = () => {
        setShowPassword((prevState) => !prevState);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Handle form submission here
        if (password !== rePassword) {
            alert("Passwords do not match!");
            return;
        }
        const userData = {
            name,
            email,
            contact,
            userType,
            password,
        };
        try {
            const data  = await axios.post('http://127.0.0.1:5000/user/signup', userData, {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            //console.log(data.data.status);
            if (data.status === 200) {
                console.log("Signup successful", data); 
                nave("/login")    
                    
            }          

        }catch (error) {    
            console.log(error.response.data);
            // console.error("Error during signup:", error);
            if (error.response.status === 400) {
                alert(error.response.data.message);               
            }else{
                alert("Error during signup:", error.response.data.message);
            }
        }
    }
        return (
            <>
                <div className="login-container">
                    <form className="modern-form" onSubmit={handleSubmit}>
                        <div className="form-title">Signup</div>

                        <div className="form-body">
                            <div className="input-group">
                                <div className="input-wrapper">
                                    <svg fill="none" viewBox="0 0 24 24" className="input-icon">
                                        <circle strokeWidth="1.5" stroke="currentColor" r="4" cy="8" cx="12"></circle>
                                        <path
                                            strokeLinecap="round"
                                            strokeWidth="1.5"
                                            stroke="currentColor"
                                            d="M5 20C5 17.2386 8.13401 15 12 15C15.866 15 19 17.2386 19 20"
                                        ></path>
                                    </svg>
                                    <input
                                        required
                                        placeholder="Username"
                                        className="form-input"
                                        type="text"
                                        name="username"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="input-group">
                                <div className="input-wrapper">
                                    <svg fill="none" viewBox="0 0 24 24" className="input-icon">
                                        <path
                                            strokeWidth="1.5"
                                            stroke="currentColor"
                                            d="M3 8L10.8906 13.2604C11.5624 13.7083 12.4376 13.7083 13.1094 13.2604L21 8M5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19Z"
                                        ></path>
                                    </svg>
                                    <input
                                        required
                                        placeholder="Email"
                                        className="form-input"
                                        type="email"
                                        name="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="input-group">
                                <div className="input-wrapper">
                                    <svg fill="none" viewBox="0 0 24 24" className="input-icon">
                                        <path
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            d="M2 4.5C2 3.67157 2.67157 3 3.5 3H6.25C6.94036 3 7.5 3.55964 7.5 4.25V6.25C7.5 6.94036 6.94036 7.5 6.25 7.5H5.75C5.33579 7.5 5 7.83579 5 8.25V9C5 13.4183 8.58172 17 13 17H13.75C14.1642 17 14.5 16.6642 14.5 16.25V15.75C14.5 15.0596 15.0596 14.5 15.75 14.5H17.75C18.4404 14.5 19 15.0596 19 15.75V18.5C19 19.3284 18.3284 20 17.5 20C10.0442 20 4 13.9558 4 6.5C4 5.67157 4.67157 5 5.5 5H6.25C6.66421 5 7 4.66421 7 4.25V4.25C7 3.83579 6.66421 3.5 6.25 3.5H3.5C2.67157 3.5 2 4.17157 2 5V4.5Z"
                                        />
                                    </svg>
                                    <input
                                        required
                                        placeholder="contact number"
                                        className="form-input"
                                        type="number"
                                        name="contact"
                                        value={contact}
                                        onChange={(e) => setContact(e.target.value)}
                                    />
                                </div>
                            </div>



                            <div className="input-group">
                                <div className="input-wrapper">
                                    <div style={{ width: "100%", display: 'flex', gap: '16px', alignItems: 'center', justifyContent: 'space-around' }}>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                                            <input type="radio" name="userType" value="buyer" className="form-input" onChange={(e) => setUserType(e.target.value)} />
                                            Buyer
                                        </label>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                                            <input type="radio" name="userType" value="seller" className="form-input" onChange={(e) => setUserType(e.target.value)} />
                                            Seller
                                        </label>
                                    </div>
                                </div>
                            </div>



                            <div className="input-group">
                                <div className="input-wrapper">
                                    <svg fill="none" viewBox="0 0 24 24" className="input-icon">
                                        <path
                                            strokeWidth="1.5"
                                            stroke="currentColor"
                                            d="M12 10V14M8 6H16C17.1046 6 18 6.89543 18 8V16C18 17.1046 17.1046 18 16 18H8C6.89543 18 6 17.1046 6 16V8C6 6.89543 6.89543 6 8 6Z"
                                        ></path>
                                    </svg>
                                    <input
                                        required
                                        placeholder="Password"
                                        className="form-input"
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button
                                        className="password-toggle"
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                    >
                                        <svg fill="none" viewBox="0 0 24 24" className="eye-icon">
                                            <path
                                                strokeWidth="1.5"
                                                stroke="currentColor"
                                                d="M2 12C2 12 5 5 12 5C19 5 22 12 22 12C22 12 19 19 12 19C5 19 2 12 2 12Z"
                                            ></path>
                                            <circle
                                                strokeWidth="1.5"
                                                stroke="currentColor"
                                                r="3"
                                                cy="12"
                                                cx="12"
                                            ></circle>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div className="input-group">
                                <div className="input-wrapper">
                                    <svg fill="none" viewBox="0 0 24 24" className="input-icon">
                                        <path
                                            strokeWidth="1.5"
                                            stroke="currentColor"
                                            d="M12 10V14M8 6H16C17.1046 6 18 6.89543 18 8V16C18 17.1046 17.1046 18 16 18H8C6.89543 18 6 17.1046 6 16V8C6 6.89543 6.89543 6 8 6Z"
                                        ></path>
                                    </svg>
                                    <input
                                        required
                                        placeholder="reEnter Password"
                                        className="form-input"
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={rePassword}
                                        onChange={(e) => setRePassword(e.target.value)}
                                    />
                                    <button
                                        className="password-toggle"
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                    >
                                        <svg fill="none" viewBox="0 0 24 24" className="eye-icon">
                                            <path
                                                strokeWidth="1.5"
                                                stroke="currentColor"
                                                d="M2 12C2 12 5 5 12 5C19 5 22 12 22 12C22 12 19 19 12 19C5 19 2 12 2 12Z"
                                            ></path>
                                            <circle
                                                strokeWidth="1.5"
                                                stroke="currentColor"
                                                r="3"
                                                cy="12"
                                                cx="12"
                                            ></circle>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button className="submit-button" type="submit">
                            <span className="button-text">Signup</span>
                            <div className="button-glow"></div>
                        </button>

                        <div className="form-footer">
                            <div className="login-link">
                                have an account? <span onClick={(e)=>nave('/login')}>Sign in</span>
                            </div>
                        </div>
                    </form>
                </div>
            </>

        );
    };

    export default Signup;

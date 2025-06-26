import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { useContext } from "react";
import { UserContext } from "../../context/userContext";

const UpdateUser = () => {
    const [state, setState] = useState("");
    const [district, setDistric] = useState("");
    const [city, setCity] = useState("");
    const [pin, setPin] = useState("");
    const [road, setRoad] = useState("");
    const [houseNo, setHouseNo] = useState("");

    const nave = useNavigate();

    const { login } = useContext(UserContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const storedData = JSON.parse(localStorage.getItem("user"));
        const token = storedData?.token;
        const userData = {
            email: JSON.parse(localStorage.getItem("user")).email,
            address: {
                state,
                city,
                pin,
                district,
                road,
                houseNo
            }
        };
        try {
            const userRes = await axios.post('http://127.0.0.1:5000/user/updateInfo', userData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            })
            //console.log(data.data.status);
            if (userRes.status === 200) {
                const user = userRes.data;
                console.log(user);
                login(user);
                nave(-1);
            }else{
                alert("some thing wrong login and try")
                nave('login')
            }
        } catch (error) {
            console.log(error.response.data);
            // console.error("Error during signup:", error);
            if (error.response.status === 400) {
                alert(error.response.data.message);
            } else {
                alert("Error during signup:", error.response.data.message);
            }
        }
    }
    return (
        <>
            <div className="login-container">
                <form className="modern-form" onSubmit={handleSubmit}>
                    <div className="form-title">Update Info</div>

                    <div className="form-body">
                        <div className="input-group">
                            <div className="input-wrapper">
                                <input
                                    required
                                    placeholder="state"
                                    className="form-input"
                                    type="text"
                                    name="State"
                                    value={state}
                                    onChange={(e) => setState(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="input-group">
                            <div className="input-wrapper">
                                <input
                                    required
                                    placeholder="district"
                                    className="form-input"
                                    type="text"
                                    name="district"
                                    value={district}
                                    onChange={(e) => setDistric(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="input-group">
                            <div className="input-wrapper">
                                <input
                                    required
                                    placeholder="city"
                                    className="form-input"
                                    type="text"
                                    name="city"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="input-group">
                            <div className="input-wrapper">
                                <input
                                    required
                                    placeholder="pin"
                                    className="form-input"
                                    type="text"
                                    name="pin"
                                    value={pin}
                                    onChange={(e) => setPin(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="input-group">
                            <div className="input-wrapper">
                                <input
                                    required
                                    placeholder="road"
                                    className="form-input"
                                    type="text"
                                    name="road"
                                    value={road}
                                    onChange={(e) => setRoad(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="input-group">
                            <div className="input-wrapper">
                                <input
                                    required
                                    placeholder="houseNo"
                                    className="form-input"
                                    type="text"
                                    name="houseNo"
                                    value={houseNo}
                                    onChange={(e) => setHouseNo(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <button className="submit-button" type="submit">
                        <span className="button-text">Update</span>
                        <div className="button-glow"></div>
                    </button>

                    <div className="form-footer">
                        <div className="login-link">
                            Return to previous? <span onClick={(e) => nave('/login')}>Return</span>
                        </div>
                    </div>
                </form>
            </div>
        </>

    );
};

export default UpdateUser;

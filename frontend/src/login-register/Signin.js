import React, { useState } from 'react';
import './Signin.css';
import FormInput from './FormInput';

function Signin() {
    const [loginPageVisible, toggleLoginPage] = useState(false);
    const [registerPageVisible, toggleRegisterPage] = useState(false);

    const [registervalues, setRegisterValues] = useState({
        regusername: "",
        regemail: "",
        regpassword: "",
        regconfirmPassword: "",
      });
    const [loginvalues, setLoginValues] = useState({
        loginemail: "",
        loginpassword: ""
      });
    
      const registerinputs = [
        {
          id: 1,
          name: "regusername",
          type: "text",
          placeholder: "Username",
          errorMessage:
            "Username should be 3-16 characters and shouldn't include any special character!",
          pattern: "^[A-Za-z0-9]{3,16}$",
          required: true,
        },
        {
          id: 2,
          name: "regemail",
          type: "email",
          placeholder: "Email",
          errorMessage: "It should be a valid email address!",
          required: true,
        },
        {
          id: 3,
          name: "regpassword",
          type: "password", 
          placeholder: "Password",
          errorMessage:
            "Password should be 8-20 characters and include at least 1 letter, 1 number and 1 special character!",
          pattern: `^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$`,
          required: true,
        },
        {
          id: 4,
          name: "regconfirmPassword",
          type: "password",
          placeholder: "Confirm Password",
          errorMessage: "Passwords don't match!",
          pattern: registervalues.regpassword,
          required: true,
        },
      ];

      const logininputs = [
        {
          id: 0,
          name: "loginemail",
          type: "email",
          placeholder: "Email",
          errorMessage: "It should be a valid email address!",
          required: true
        },
        {
          id: 1,
          name: "loginpassword",
          type: "password",
          placeholder: "Password",
          errorMessage:
            "Password should be 8-20 characters and include at least 1 letter, 1 number and 1 special character!",
          pattern: `^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$`,
          required: true
        }
      ];
    
      const handleLoginSubmit = async (logininfo) => {
            // Perform a POST request to your backend API using the fetch API
            console.log(logininfo)
            const result = await fetch("http://localhost:5000/login", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(logininfo),
          })
          const success = await result.json();
          console.log(success);
        };

      const handleRegisterSubmit = async (registerinfo) => {
            // Perform a POST request to your backend API using the fetch API
            const result = await fetch("http://localhost:5000/register", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(registerinfo),
          })
          const accountresults = await result.json();
          console.log(accountresults);
        };
    
      const onRegChange = (e) => {
        setRegisterValues({ ...registervalues, [e.target.name]: e.target.value });
      };

      const onLoginChange = (e) => {
        setLoginValues({ ...loginvalues, [e.target.name]: e.target.value });
      };


    const openLoginPage = () => {
        toggleLoginPage(true);
        toggleRegisterPage(false);
        console.log("loginpage");
    }

    const openRegisterPage = () => {
        toggleRegisterPage(true);
        toggleLoginPage(false);
        console.log("registerpage");
    }

    const closeForms = () => {
        toggleLoginPage(false);
        console.log("loginpageclosed");
        toggleRegisterPage(false);
        console.log("registerpageclosed");
        setRegisterValues({
          regusername: "",
          regemail: "",
          regpassword: "",
          regconfirmPassword: "",
        });
        setLoginValues({
          loginemail: "",
          loginpassword: ""
        });
    }

    return (
        <div>
            <div className="login-buttons">
                <button onClick={openLoginPage} className="login">Login</button>
                <button onClick={openRegisterPage} className="register">Register</button>
            </div>
            <div className={`login-page-container ${loginPageVisible ? 'visible' : ''}`}>
                <div className="login-form">
                    <form onSubmit={(e) => { e.preventDefault(); handleLoginSubmit(loginvalues); }}>
                        <h1>Login</h1>
                        {logininputs.map((input) => (
                        <FormInput
                            key={input.id}
                            {...input}
                            value={loginvalues[input.name]}
                            onChange={onLoginChange}
                        />
                        ))}
                        <button className="submit-button">Login</button>
                    </form>
                    <button onClick={ closeForms } className="exit-button">x</button>
                </div>
            </div>
            <div className={`register-page-container ${registerPageVisible ? 'visible' : ''}`}>
                <div className="register-form">
                    <form onSubmit={(e) => { e.preventDefault(); handleRegisterSubmit(registervalues); }}>
                        <h1>Register</h1>
                        {registerinputs.map((input) => (
                        <FormInput
                            key={input.id}s
                            {...input}
                            value={registervalues[input.name]}
                            onChange={onRegChange}
                        />
                        ))}
                        <button className="submit-button">Register</button>
                    </form>
                    <button onClick={ closeForms } className="exit-button">x</button>
                </div>
            </div>
        </div>
    );
}

export default Signin
import React, { useState, useEffect } from 'react';
import axios from 'axios';
function Index() {
    const nameEl = React.useRef(null);
    const userTypeEl = React.useRef(null);
    const userCityEl = React.useRef(null);
    const adminCityEl = React.useRef(null);
    const initialFValues = {
        fullName: '',
        userType: "",
        userCity: "",
        adminCity: "",
        selectedType: "",
        isLoading: false,
        distResponse: "",
        erroinput: false
    }
    const [values, setValues] = useState(initialFValues);
    const userTypeOptions = [
        { id: '1', title: 'Admin' },
        { id: '2', title: 'User' }
    ]
    useEffect(() => {
        let user = JSON.parse(localStorage.getItem('user'))
        if (user) {
            setValues({
                selectedType: user.userType
            })
        }

    }, []);
    const handleInputChange = e => {
        const { name, value } = e.target
        setValues({
            ...values,
            [name]: value
        })
    }

    const handleSubmit = e => {
        e.preventDefault();
        const formData = {
            fullName: nameEl.current.value,
            userType: userTypeEl.current.value,
        }
        setValues({
            ...values,
            selectedType: userTypeEl.current.value,
            erroinput: false,
            distResponse: "",

        })
        localStorage.setItem('user', JSON.stringify(formData))
    }

    const submitCity = () => {
        if (adminCityEl.current.value) {
            setValues({
                ...values,
                adminCity: adminCityEl.current.value,
                isLoading: true,
                erroinput: false
            })
            axios.post(' https://safe-sea-74821.herokuapp.com/adminlocation', {
                admincity: adminCityEl.current.value
            })
                .then((response) => {
                    setValues({
                        ...values,
                        isLoading: false,
                        erroinput: false

                    })
                    localStorage.setItem('admincity', JSON.stringify(response.data.data[0]))
                }, (error) => {
                    console.log(error);
                    setValues({
                        ...values,
                        isLoading: false,
                        erroinput: false

                    })
                });
        } else {
            setValues({
                ...values,
                erroinput: true
            })
        }
    }

    const checkCity = () => {
        if (userCityEl.current.value !== "") {
            let admin = JSON.parse(localStorage.getItem('admincity'))
            setValues({
                ...values,
                isLoading: true,
                userCity: userCityEl.current.value,
                erroinput: false
            })
            axios.post(' https://safe-sea-74821.herokuapp.com/check', {
                admincity: admin,
                usercity: userCityEl.current.value
            })
                .then((response) => {
                    setValues({
                        ...values,
                        isLoading: false,
                        erroinput: false,
                        distResponse: response.data.distance
                    })
                }, (error) => {
                    console.log(error);
                    setValues({
                        ...values,
                        isLoading: false,
                        erroinput: false,


                    })
                });
        } else {
            setValues({
                ...values,
                erroinput: true
            })
        }
    }
    const logout = () => {
        setValues({
            ...values,
            selectedType: ""
        })
        localStorage.removeItem("user");
    }

    return (
        <div className="wrapper">

            {
                values.selectedType === "Admin" ? (
                    <div className="admin">
                        <h1>Admin</h1>
                        <label>
                            Enter City :
                                <input
                                type="text"
                                ref={adminCityEl}
                                required />
                        </label>
                        {values.erroinput ? (<p>Please enter city name </p>) : ""}
                        {values.isLoading ? (<button className="buttonload"><i class="fa fa-spinner fa-spin"></i>Loading  </button>) : <button onClick={submitCity}>Submit </button>}
                        <button className="logout" onClick={logout}>Log out</button>
                    </div>
                )
                    : values.selectedType === "User" ? (
                        <div className="user">
                            <h1>User</h1>
                            <label>
                                Enter City :
                                <input
                                    type="text"
                                    ref={userCityEl}
                                    required />
                            </label>
                            {values.erroinput ? <p>Please enter city name </p> : null}

                            {values.isLoading ? (<button className="buttonload"><i class="fa fa-spinner fa-spin"></i>Loading  </button>) : <button onClick={checkCity}>Check </button>}
                            <button className="logout" onClick={logout}>Log out</button>
                            <p>City falls within a radius of 100km </p>
                            {values.distResponse ? <span>{(Number(values.distResponse)) < 100 ? "Yes" : "No"}</span> : null}
                        </div>)
                        : values.selectedType === "" ?
                            (
                                <div className="login">
                                    <form onSubmit={handleSubmit}>
                                        <label>
                                            Name:
                                            <input
                                                name="fullName"
                                                type="text"
                                                ref={nameEl}
                                                required />
                                        </label>
                                        <label>
                                            User Type:
                                            <select
                                                name="userType"
                                                value={values.userType}
                                                ref={userTypeEl}
                                                onChange={handleInputChange}
                                                required>
                                                <option key=""></option>
                                                {userTypeOptions.map(type => (
                                                    <option key={type.id}>{type.title}</option>
                                                ))}
                                            </select>
                                        </label>
                                        <button>Login</button>
                                    </form>
                                </div>

                            ) : null
            }



        </div>
    )
}

export default Index;
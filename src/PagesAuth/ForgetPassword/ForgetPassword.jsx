// ForgetPassword.js
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

const ForgetPassword = () => {
    const auth = useSelector(state => state.auth);

    useEffect(() => {
        console.log(auth);
    }, [auth]);

    return (
        <div>ForgetPassword</div>
    );
};

export default ForgetPassword;

import React, { ChangeEvent, useEffect, useState } from 'react'
import { BiArrowBack } from 'react-icons/bi'
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { CartState, savaShippingInfo } from '../redux/Slices/CartSlice';
import { RootStates } from '../redux/store';

const Shipping = () => {

    const [formData, setFormData] = useState({
        address: '',
        city: '',
        state: '',
        country: '',
        pinCode: ''
    });

    const dispatch = useDispatch();
    const { cartItems, total } = useSelector((state: {CartSlice: CartState}) =>
    state.CartSlice
    )

    const navigate = useNavigate();

    const changeHandler = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        e.preventDefault();
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const res = useSelector((state: RootStates) => state.CartSlice)
console.log( " data in shipping: ",res);


    useEffect(()=>{
        
        if(cartItems.length <= 0 ) return navigate("/cart") 
        
    },[cartItems])

    console.log(formData);

    const submitHandler = async(e: React.FormEvent) => {
        e.preventDefault();

        dispatch(savaShippingInfo(formData));

        try {
            const data = await fetch("/api/payment/create", {
                method: "POST",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify({amount: total})
            })

            const res = await data.json();
            console.log(res);
            
            navigate("/pay", {
                state: res.clientSecret,
            });
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='shipping'>

            <button
                className='back-btn'
                onClick={() => navigate('/cart')}
            ><BiArrowBack />
            </button>
            <form className="input" onSubmit={submitHandler}>
                <h2>SHIPPING ADDRESS</h2>

                <input
                    required
                    type="text"
                    value={formData.address}
                    onChange={changeHandler}
                    name='address' placeholder='Address' />

                <input
                    required
                    type="text"
                    value={formData.city}
                    onChange={changeHandler}
                    name='city' placeholder='City' />

                <input
                    required
                    type="text"
                    value={formData.state}
                    onChange={changeHandler}
                    name='state' placeholder='State' />

                <select
                    name='country'
                    value={formData.country}
                    onChange={changeHandler}
                    required>
                    <option value="">Choose Country</option>
                    <option value="India">India</option>
                    <option value="Shri Lanka">Shri Lanka</option>
                    <option value="Nepal">Nepal</option>
                </select>

                <input
                    required
                    type="number"
                    value={formData.pinCode}
                    placeholder='Pin Code'
                    onChange={changeHandler}
                    name='pinCode' />
                <button type='submit'>Pay Now</button>
            </form>
        </div>
    )
}

export default Shipping
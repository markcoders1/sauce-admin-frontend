import { createSlice } from '@reduxjs/toolkit'
const initialState = {
    open:false,
    severity:"success",
    message:""
}
const SnackAlertSlice = createSlice({
name:"SnackAlert",
initialState,
reducers:{
    handleSnackAlert:(state, action)=>{
        const updateSnackAlert = {...state, ...action.payload}
        return updateSnackAlert
    }
}
})

export const {handleSnackAlert} = SnackAlertSlice.actions
export default SnackAlertSlice.reducer
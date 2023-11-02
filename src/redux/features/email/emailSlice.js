import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { toast } from "react-toastify"
import emailService from './emailService';



const initialState = {
    sendingEmail: false,
    emailSent: false,
    msg: "",
}

// Send Automated Email
export const sendAutomatedEmail = createAsyncThunk(
    "email/sendAutomatedEmail",
    async (emailData, thunkAPI) => {
        try {
            return await emailService.sendAutomatedEmail(emailData)
        } catch (error) {
            const message =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message)
        }
    }
)

const emailSlice = createSlice({
    name: "email",
    initialState,
    reducers: {
        EMAIL_RESET(state) {
            state.sendingEmail = false;
            state.emailSent = false;
            state.msg = "";
        }
    },
    extraReducers: (builder) => {
        builder
            // Send Automated Email
            .addCase(sendAutomatedEmail.pending, (state, action) => {
                state.sendingEmail = true;
            })
            .addCase(sendAutomatedEmail.fulfilled, (state, action) => {
                state.sendingEmail = false;
                state.emailSent = true;
                state.msg = action.payload;
                toast.success(action.payload)
            })
            .addCase(sendAutomatedEmail.rejected, (state, action) => {
                state.sendingEmail = false;
                state.emailSent = false;
                state.msg = action.payload;
                toast.success(action.payload)
            })
    }
});



export const { EMAIL_RESET } = emailSlice.actions

export default emailSlice.reducer
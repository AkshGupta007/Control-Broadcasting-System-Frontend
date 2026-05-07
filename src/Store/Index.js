import {configureStore} from '@reduxjs/toolkit'
import { combineReducers
 } from '@reduxjs/toolkit';

 import authReducer from '../Slices/authSlice';
 import contentReducer from "../Slices/contentSlice"
 import livecontentReducer from "../Slices/LiveContentSlice"
 import dashboardReducer from "../Slices/dashboardslice"
 import uiReducer from "../Slices/uiSlices"
 import ApprovalReducer from "../Slices/Approval"
 const rootReducer = combineReducers({
  auth:authReducer,
  content:contentReducer,
  approval:ApprovalReducer,
  live:livecontentReducer,
  dashboard:dashboardReducer,
  ui:uiReducer
 });


 export const store = configureStore({
  reducer: rootReducer,
});

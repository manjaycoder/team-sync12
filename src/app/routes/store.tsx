import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/state/auth/authSlice';
import employeeReducer from '../features/employee/state/employeeSlice';
import departmentReducer from '../features/departments/state/departmentSlice';
import projectReducer from '../features/projects/state/projectSlice';
import taskReducer from '../features/projects/state/taskSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    employee: employeeReducer,
    department: departmentReducer,
    projects: projectReducer,
    tasks: taskReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
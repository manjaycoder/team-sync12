import { useCallback } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  loginEmployee,
  registerEmployee,
  logoutEmployee,
  DEMO_USER,
} from "../state/auth/authAction";
import { addEmployee, clearError } from "../state/auth/authSlice";
import type { RootState, AppDispatch } from "../../../routes/store";

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  terms: boolean;
}

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { employee, isLoading, error, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  const loginForm = useForm<LoginData>({
    defaultValues: { email: "", password: "" },
  });

  const registerForm = useForm<RegisterData>({
    defaultValues: { fullName: "", email: "", password: "", terms: false },
  });

  const onLoginSubmit: SubmitHandler<LoginData> = async (data) => {
    const result = await dispatch(loginEmployee(data));
    if (loginEmployee.fulfilled.match(result)) {
      navigate("/home");
    }
  };

  const onRegisterSubmit: SubmitHandler<RegisterData> = async (data) => {
    const result = await dispatch(
      registerEmployee({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
      })
    );
    if (registerEmployee.fulfilled.match(result)) {
      navigate("/home");
    }
  };

  const handleLogout = async () => {
    await dispatch(logoutEmployee());
    navigate("/");
  };

  const loginWithDemo = () => {
    dispatch(addEmployee(DEMO_USER));
    navigate("/home");
  };

  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    // Login
    loginRegister: loginForm.register,
    loginHandleSubmit: loginForm.handleSubmit,
    loginErrors: loginForm.formState.errors,
    loginSetValue: loginForm.setValue,
    onLoginSubmit,

    // Register
    registerRegister: registerForm.register,
    registerHandleSubmit: registerForm.handleSubmit,
    registerErrors: registerForm.formState.errors,
    registerWatch: registerForm.watch,
    onRegisterSubmit,

    // State & Actions
    employee,
    isLoading,
    error,
    isAuthenticated,
    handleLogout,
    loginWithDemo,
    clearAuthError,
    navigate,
  };
};
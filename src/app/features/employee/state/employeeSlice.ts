import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { axiosInstance } from '../../../config/axiosInstance';

export interface EmployeeRecord {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'active' | 'remote' | 'on_leave';
  avatar: string;
  joinedDate: string;
  location: string;
}

interface EmployeeState {
  employees: EmployeeRecord[];
  searchQuery: string;
  selectedDepartment: string;
  statusFilter: string;
  isLoading: boolean;
}

const loadInitial = (): EmployeeRecord[] => {
  return [];
};

export const fetchEmployees = createAsyncThunk('employee/fetchAll', async () => {
  try {
    const res = await axiosInstance.get('/employees');
    return res.data as EmployeeRecord[];
  } catch {
    return loadInitial();
  }
});

export const createEmployeeApi = createAsyncThunk(
  'employee/create',
  async (newEmployee: Omit<EmployeeRecord, 'id'>, thunkApi) => {
    try {
      const res = await axiosInstance.post('/employees', newEmployee);
      return res.data as EmployeeRecord;
    } catch {
      // Return optimistic local record
      const fallback: EmployeeRecord = {
        ...newEmployee,
        id: `emp-${Date.now()}`,
      };
      thunkApi.dispatch(addEmployeeRecord(newEmployee));
      return fallback;
    }
  }
);

const initialState: EmployeeState = {
  employees: loadInitial(),
  searchQuery: '',
  selectedDepartment: 'All',
  statusFilter: 'All',
  isLoading: false,
};

const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    addEmployeeRecord: (state, action: PayloadAction<Omit<EmployeeRecord, 'id'>>) => {
      const newEmp: EmployeeRecord = {
        ...action.payload,
        id: `emp-${Date.now()}`,
      };
      state.employees.unshift(newEmp);
      try {
        localStorage.setItem('team_sync_employees', JSON.stringify(state.employees));
      } catch {
        // Ignore
      }
    },
    updateEmployeeRecord: (state, action: PayloadAction<EmployeeRecord>) => {
      const index = state.employees.findIndex((e) => e.id === action.payload.id);
      if (index !== -1) {
        state.employees[index] = action.payload;
        try {
          localStorage.setItem('team_sync_employees', JSON.stringify(state.employees));
        } catch {
          // Ignore
        }
      }
    },
    deleteEmployeeRecord: (state, action: PayloadAction<string>) => {
      state.employees = state.employees.filter((e) => e.id !== action.payload);
      try {
        axiosInstance.delete(`/employees/${action.payload}`).catch(() => {});
        localStorage.setItem('team_sync_employees', JSON.stringify(state.employees));
      } catch {
        // Ignore
      }
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSelectedDepartment: (state, action: PayloadAction<string>) => {
      state.selectedDepartment = action.payload;
    },
    setStatusFilter: (state, action: PayloadAction<string>) => {
      state.statusFilter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        if (action.payload) {
          state.employees = action.payload;
          try {
            localStorage.setItem('team_sync_employees', JSON.stringify(action.payload));
          } catch {
            // Ignore
          }
        }
      })
      .addCase(createEmployeeApi.fulfilled, (state, action) => {
        const exists = state.employees.some((e) => e.id === action.payload.id);
        if (!exists) {
          state.employees.unshift(action.payload);
          try {
            localStorage.setItem('team_sync_employees', JSON.stringify(state.employees));
          } catch {
            // Ignore
          }
        }
      });
  },
});

export const {
  addEmployeeRecord,
  updateEmployeeRecord,
  deleteEmployeeRecord,
  setSearchQuery,
  setSelectedDepartment,
  setStatusFilter,
} = employeeSlice.actions;

export default employeeSlice.reducer;

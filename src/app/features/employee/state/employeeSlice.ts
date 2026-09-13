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

const INITIAL_EMPLOYEES: EmployeeRecord[] = [
  {
    id: 'emp-1',
    name: 'Alex Morgan',
    email: 'alex.morgan@team-sync.space',
    role: 'Lead Systems Architect',
    department: 'Engineering',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    joinedDate: 'Jan 2023',
    location: 'San Francisco, CA',
  },
  {
    id: 'emp-2',
    name: 'Elena Rostova',
    email: 'elena.r@team-sync.space',
    role: 'Staff ML Engineer',
    department: 'AI Research',
    status: 'remote',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    joinedDate: 'Mar 2023',
    location: 'Berlin, DE',
  },
  {
    id: 'emp-3',
    name: 'Marcus Chen',
    email: 'marcus.c@team-sync.space',
    role: 'Principal UX Designer',
    department: 'Product & Design',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    joinedDate: 'Jun 2023',
    location: 'Seattle, WA',
  },
  {
    id: 'emp-4',
    name: 'Priya Sharma',
    email: 'priya.s@team-sync.space',
    role: 'Engineering Manager',
    department: 'Engineering',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    joinedDate: 'Sep 2023',
    location: 'Bangalore, IN',
  },
  {
    id: 'emp-5',
    name: 'David Kim',
    email: 'david.k@team-sync.space',
    role: 'Senior DevOps Specialist',
    department: 'Operations',
    status: 'remote',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    joinedDate: 'Nov 2023',
    location: 'Toronto, CA',
  },
  {
    id: 'emp-6',
    name: 'Sophia Alvarez',
    email: 'sophia.a@team-sync.space',
    role: 'Growth Marketing Director',
    department: 'Marketing & Growth',
    status: 'on_leave',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    joinedDate: 'Feb 2024',
    location: 'Austin, TX',
  },
];

const loadInitial = (): EmployeeRecord[] => {
  try {
    const raw = localStorage.getItem('team_sync_employees');
    return raw ? JSON.parse(raw) : INITIAL_EMPLOYEES;
  } catch {
    return INITIAL_EMPLOYEES;
  }
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
        if (action.payload && action.payload.length > 0) {
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

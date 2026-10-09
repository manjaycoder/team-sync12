import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { axiosInstance } from '../../../config/axiosInstance';

export interface DepartmentRecord {
  id: string;
  name: string;
  description: string;
  leadName: string;
  leadAvatar: string;
  memberCount: number;
  activeProjects: number;
  budget: string;
  color: string;
}

interface DepartmentState {
  departments: DepartmentRecord[];
  isLoading: boolean;
}

const loadInitial = (): DepartmentRecord[] => {
  return [];
};

export const fetchDepartments = createAsyncThunk('department/fetchAll', async () => {
  try {
    const res = await axiosInstance.get('/departments');
    return res.data as DepartmentRecord[];
  } catch {
    return loadInitial();
  }
});

const initialState: DepartmentState = {
  departments: loadInitial(),
  isLoading: false,
};

const departmentSlice = createSlice({
  name: 'department',
  initialState,
  reducers: {
    addDepartmentRecord: (state, action: PayloadAction<Omit<DepartmentRecord, 'id'>>) => {
      const newDept: DepartmentRecord = {
        ...action.payload,
        id: `dept-${Date.now()}`,
      };
      state.departments.unshift(newDept);
      try {
        axiosInstance.post('/departments', action.payload).catch(() => {});
        localStorage.setItem('team_sync_departments', JSON.stringify(state.departments));
      } catch {
        // Ignore
      }
    },
    updateDepartmentRecord: (state, action: PayloadAction<DepartmentRecord>) => {
      const idx = state.departments.findIndex((d) => d.id === action.payload.id);
      if (idx !== -1) {
        state.departments[idx] = action.payload;
        try {
          localStorage.setItem('team_sync_departments', JSON.stringify(state.departments));
        } catch {
          // Ignore
        }
      }
    },
    deleteDepartmentRecord: (state, action: PayloadAction<string>) => {
      state.departments = state.departments.filter((d) => d.id !== action.payload);
      try {
        axiosInstance.delete(`/departments/${action.payload}`).catch(() => {});
        localStorage.setItem('team_sync_departments', JSON.stringify(state.departments));
      } catch {
        // Ignore
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchDepartments.fulfilled, (state, action) => {
      if (action.payload) {
        state.departments = action.payload;
        try {
          localStorage.setItem('team_sync_departments', JSON.stringify(action.payload));
        } catch {
          // Ignore
        }
      }
    });
  },
});

export const { addDepartmentRecord, updateDepartmentRecord, deleteDepartmentRecord } =
  departmentSlice.actions;

export default departmentSlice.reducer;

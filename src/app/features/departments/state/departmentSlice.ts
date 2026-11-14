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

export const INITIAL_DEPARTMENTS: DepartmentRecord[] = [
  {
    id: 'dept-01',
    name: 'Engineering',
    description: 'Core infrastructure, platform architecture, and distributed services.',
    leadName: 'Alex Morgan',
    leadAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    memberCount: 18,
    activeProjects: 8,
    budget: '$450,000',
    color: 'from-blue-600 to-indigo-600',
  },
  {
    id: 'dept-02',
    name: 'AI Research',
    description: 'Large language model orchestration, synthetic reasoning, and agent pipelines.',
    leadName: 'Elena Rostova',
    leadAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    memberCount: 12,
    activeProjects: 5,
    budget: '$380,000',
    color: 'from-purple-600 to-pink-600',
  },
  {
    id: 'dept-03',
    name: 'Product & Design',
    description: 'Awwwards-grade monochromatic user interfaces, 3D WebGL visuals, and ergonomic UX.',
    leadName: 'Marcus Chen',
    leadAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    memberCount: 9,
    activeProjects: 4,
    budget: '$220,000',
    color: 'from-amber-500 to-orange-600',
  },
  {
    id: 'dept-04',
    name: 'Operations & Security',
    description: 'SOC2 compliance, zero-trust perimeter, and cloud deployment pipelines.',
    leadName: 'David Kim',
    leadAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    memberCount: 6,
    activeProjects: 4,
    budget: '$290,000',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'dept-05',
    name: 'Marketing & Growth',
    description: 'Global enterprise go-to-market and community engineering.',
    leadName: 'Priya Sharma',
    leadAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    memberCount: 7,
    activeProjects: 3,
    budget: '$175,000',
    color: 'from-cyan-500 to-blue-600',
  },
];

const loadInitial = (): DepartmentRecord[] => {
  return INITIAL_DEPARTMENTS;
};

export const fetchDepartments = createAsyncThunk('department/fetchAll', async () => {
  try {
    const res = await axiosInstance.get('/departments');
    if (Array.isArray(res.data) && res.data.length > 0) {
      return res.data as DepartmentRecord[];
    }
    return INITIAL_DEPARTMENTS;
  } catch {
    return INITIAL_DEPARTMENTS;
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

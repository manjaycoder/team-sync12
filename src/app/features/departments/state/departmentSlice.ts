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

const INITIAL_DEPARTMENTS: DepartmentRecord[] = [
  {
    id: 'dept-1',
    name: 'Engineering',
    description: 'Core cloud platform architecture, distributed systems & API infrastructure.',
    leadName: 'Alex Morgan',
    leadAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    memberCount: 24,
    activeProjects: 8,
    budget: '$450,000',
    color: 'from-blue-600 to-indigo-600',
  },
  {
    id: 'dept-2',
    name: 'AI Research',
    description: 'Fine-tuning LLM pipelines, autonomous agents and predictive synthesis models.',
    leadName: 'Elena Rostova',
    leadAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    memberCount: 14,
    activeProjects: 5,
    budget: '$620,000',
    color: 'from-violet-600 to-fuchsia-600',
  },
  {
    id: 'dept-3',
    name: 'Product & Design',
    description: 'User experience research, design systems, design sprint prototyping.',
    leadName: 'Marcus Chen',
    leadAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    memberCount: 12,
    activeProjects: 6,
    budget: '$280,000',
    color: 'from-amber-500 to-rose-500',
  },
  {
    id: 'dept-4',
    name: 'Operations',
    description: 'DevOps pipelines, SOC2 compliance, telemetry, cloud infrastructure reliability.',
    leadName: 'David Kim',
    leadAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    memberCount: 9,
    activeProjects: 4,
    budget: '$310,000',
    color: 'from-emerald-600 to-teal-600',
  },
  {
    id: 'dept-5',
    name: 'Marketing & Growth',
    description: 'Enterprise brand campaigns, customer acquisition, partner ecosystems.',
    leadName: 'Sophia Alvarez',
    leadAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    memberCount: 8,
    activeProjects: 3,
    budget: '$190,000',
    color: 'from-pink-600 to-purple-600',
  },
];

const loadInitial = (): DepartmentRecord[] => {
  try {
    const raw = localStorage.getItem('team_sync_departments');
    return raw ? JSON.parse(raw) : INITIAL_DEPARTMENTS;
  } catch {
    return INITIAL_DEPARTMENTS;
  }
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
      if (action.payload && action.payload.length > 0) {
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

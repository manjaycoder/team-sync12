import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { axiosInstance } from '../../../config/axiosInstance';

export interface ProjectRecord {
  id: string;
  name: string;
  description: string;
  department: string;
  leadName: string;
  leadAvatar?: string;
  status: 'planning' | 'active' | 'in_progress' | 'completed' | 'on_hold';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  progress: number;
  budget: string;
  startDate?: string;
  deadline?: string;
}

interface ProjectState {
  projects: ProjectRecord[];
  isLoading: boolean;
}

export const fetchProjects = createAsyncThunk('projects/fetchProjects', async () => {
  try {
    const res = await axiosInstance.get('/projects');
    return res.data as ProjectRecord[];
  } catch {
    return [];
  }
});

export const createProjectApi = createAsyncThunk(
  'projects/createProject',
  async (newProj: Omit<ProjectRecord, 'id'>) => {
    try {
      const res = await axiosInstance.post('/projects', newProj);
      return res.data as ProjectRecord;
    } catch {
      const fallback: ProjectRecord = {
        ...newProj,
        id: `proj-${Date.now()}`,
      };
      return fallback;
    }
  }
);

export const updateProjectApi = createAsyncThunk(
  'projects/updateProject',
  async ({ id, updates }: { id: string; updates: Partial<ProjectRecord> }) => {
    try {
      const res = await axiosInstance.put(`/projects/${id}`, updates);
      return res.data as ProjectRecord;
    } catch {
      return { id, ...updates } as ProjectRecord;
    }
  }
);

const initialState: ProjectState = {
  projects: [],
  isLoading: false,
};

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setProjects: (state, action: PayloadAction<ProjectRecord[]>) => {
      state.projects = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(createProjectApi.fulfilled, (state, action) => {
        state.projects.unshift(action.payload);
      })
      .addCase(updateProjectApi.fulfilled, (state, action) => {
        const idx = state.projects.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) {
          state.projects[idx] = { ...state.projects[idx], ...action.payload };
        }
      });
  },
});

export const { setProjects } = projectSlice.actions;
export default projectSlice.reducer;

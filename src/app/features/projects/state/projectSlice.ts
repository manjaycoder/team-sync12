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

export const INITIAL_PROJECTS: ProjectRecord[] = [
  {
    id: 'proj-01',
    name: 'Quantum Mesh Neural Engine',
    description: 'Distributed neural inference pipeline running LLM function calling with sub-50ms latency.',
    department: 'AI Research',
    leadName: 'Elena Rostova',
    leadAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    status: 'active',
    priority: 'urgent',
    progress: 72,
    budget: '$210,000',
    startDate: 'Nov 1, 2026',
    deadline: 'Dec 2026',
  },
  {
    id: 'proj-02',
    name: 'Monochromatic Awwwards Design System',
    description: 'High-contrast black & white WebGL 3D design system with Framer Motion and Three.js physics.',
    department: 'Product & Design',
    leadName: 'Marcus Chen',
    leadAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    status: 'active',
    priority: 'high',
    progress: 88,
    budget: '$140,000',
    startDate: 'Oct 15, 2026',
    deadline: 'Nov 2026',
  },
  {
    id: 'proj-03',
    name: 'Enterprise SOC2 Telemetry Vault',
    description: 'Automated zero-trust cryptographic audit trail and Prometheus telemetry instrumentation.',
    department: 'Operations & Security',
    leadName: 'David Kim',
    leadAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    status: 'active',
    priority: 'high',
    progress: 94,
    budget: '$180,000',
    startDate: 'Sep 1, 2026',
    deadline: 'Q1 2027',
  },
  {
    id: 'proj-04',
    name: 'Java Spring Boot Modular Monolith',
    description: 'High-throughput enterprise backend migration with Java 21, Spring Boot 3, and MongoDB.',
    department: 'Engineering',
    leadName: 'Alex Morgan',
    leadAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    status: 'active',
    priority: 'urgent',
    progress: 85,
    budget: '$160,000',
    startDate: 'Nov 5, 2026',
    deadline: 'Nov 2026',
  },
];

export const fetchProjects = createAsyncThunk('projects/fetchProjects', async () => {
  try {
    const res = await axiosInstance.get('/projects');
    if (Array.isArray(res.data) && res.data.length > 0) {
      return res.data as ProjectRecord[];
    }
    return INITIAL_PROJECTS;
  } catch {
    return INITIAL_PROJECTS;
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
  projects: INITIAL_PROJECTS,
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

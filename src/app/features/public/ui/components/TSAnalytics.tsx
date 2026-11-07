import { lazy, Suspense } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import { TrendingUp, Activity, CheckCircle2 } from 'lucide-react';
import { TS3DCard } from './TS3DCard';

const AnalyticsDashboard3D = lazy(() =>
  import('./3d/AnalyticsDashboard3D').then((m) => ({ default: m.AnalyticsDashboard3D }))
);

const velocityData = [
  { name: 'W1', completed: 18, planned: 20 },
  { name: 'W2', completed: 25, planned: 24 },
  { name: 'W3', completed: 32, planned: 30 },
  { name: 'W4', completed: 28, planned: 28 },
  { name: 'W5', completed: 42, planned: 38 },
  { name: 'W6', completed: 48, planned: 45 },
];

const departmentOutput = [
  { dept: 'Eng', tasks: 142 },
  { dept: 'Design', tasks: 98 },
  { dept: 'Product', tasks: 76 },
  { dept: 'AI Lab', tasks: 110 },
  { dept: 'Ops', tasks: 54 },
];

export const TSAnalytics = () => {
  return (
    <section id="analytics" className="relative py-28 sm:py-36 scroll-mt-20 bg-black text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mb-14 pb-8 border-b border-white/10">
          <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-400 font-medium block mb-3">
            Predictive Telemetry
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Real-time throughput &amp; <span className="aw-text-gradient">velocity intelligence</span>.
          </h2>
          <p className="mt-4 text-sm sm:text-base text-neutral-400 font-sans leading-relaxed">
            Eliminate guesswork with live algorithmic telemetry. Spot velocity bottlenecks before they
            compromise quarterly product release targets.
          </p>
        </div>

        {/* 3-Column Visual Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* 3D Analytics Model */}
          <div className="lg:col-span-5">
            <TS3DCard depth={12} className="p-6 h-full flex flex-col justify-between !bg-[#09090b] border-white/15">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-white flex items-center gap-2">
                    <Activity size={14} className="text-white" />
                    3D TELEMETRY MATRIX
                  </span>
                  <span className="text-[10px] font-mono text-white bg-white/10 border border-white/20 px-2.5 py-0.5 rounded-full font-bold">
                    LIVE
                  </span>
                </div>
                <p className="text-xs text-neutral-400 font-sans">
                  Volumetric spatial simulation of sprint throughput cadence across divisions.
                </p>
              </div>

              <div className="relative h-[270px] w-full my-4">
                <Suspense
                  fallback={
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-24 h-24 rounded-full border border-white/20 animate-spin" />
                    </div>
                  }
                >
                  <AnalyticsDashboard3D />
                </Suspense>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-neutral-400">
                <span>SAMPLE: 6 SPRINTS</span>
                <span className="text-white font-bold">TARGET: 99.4% ON-TIME</span>
              </div>
            </TS3DCard>
          </div>

          {/* Monochromatic Area Chart: Velocity Trend */}
          <div className="lg:col-span-4 rounded-3xl border border-white/15 p-6 flex flex-col justify-between bg-[#09090b]">
            <div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-bold text-white flex items-center gap-2 font-display">
                  <TrendingUp size={16} className="text-white" />
                  Sprint Velocity Trend
                </h3>
                <span className="text-xs font-mono font-bold text-white bg-white/10 px-2 py-0.5 rounded-full">
                  +24% YoY
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 mb-4 font-sans">Completed vs Planned throughput</p>

              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={velocityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorWhite" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ffffff" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="#52525B" fontSize={10} tickLine={false} />
                    <YAxis stroke="#52525B" fontSize={10} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        background: '#09090b',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: 12,
                        fontSize: 11,
                        color: '#fff',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="completed"
                      stroke="#ffffff"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorWhite)"
                    />
                    <Area
                      type="monotone"
                      dataKey="planned"
                      stroke="#71717A"
                      strokeWidth={1.5}
                      strokeDasharray="3 3"
                      fillOpacity={0}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-neutral-400">
              <span className="flex items-center gap-1.5 font-mono text-[11px]">
                <span className="h-2 w-2 rounded-full bg-white" /> Actual Output
              </span>
              <span className="flex items-center gap-1.5 font-mono text-[11px]">
                <span className="h-2 w-2 rounded-full bg-neutral-500" /> Target Line
              </span>
            </div>
          </div>

          {/* Monochromatic Bar Chart: Department Output */}
          <div className="lg:col-span-3 rounded-3xl border border-white/15 p-6 flex flex-col justify-between bg-[#09090b]">
            <div>
              <h3 className="text-sm font-bold text-white mb-1 font-display">Division Throughput</h3>
              <p className="text-[11px] text-neutral-400 mb-4 font-sans">Closed deliverables this sprint</p>

              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={departmentOutput} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <XAxis dataKey="dept" stroke="#52525B" fontSize={10} tickLine={false} />
                    <YAxis stroke="#52525B" fontSize={10} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        background: '#09090b',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: 12,
                        fontSize: 11,
                        color: '#fff',
                      }}
                    />
                    <Bar dataKey="tasks" fill="#ffffff" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center gap-2 text-xs text-neutral-400">
              <CheckCircle2 size={14} className="text-white" />
              <span>480 tickets closed sprint-to-date</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

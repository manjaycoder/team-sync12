import { useNavigate } from 'react-router-dom';
import {
  FiArrowDown,
  FiArrowRight,
  FiCalendar,
  FiCheck,
  FiCheckCircle,
  FiCpu,
  FiGrid,
  FiLayers,
  FiMessageSquare,
  FiShield,
  FiTarget,
  FiUsers,
  FiZap,
} from 'react-icons/fi';

const benefits = [
  {
    icon: FiTarget,
    title: 'Make priorities visible',
    description:
      'Keep projects, tasks, owners, and deadlines together so everyone knows what matters next.',
    tone: 'bg-indigo-50 text-indigo-600',
  },
  {
    icon: FiUsers,
    title: 'Bring teams into sync',
    description:
      'Connect people and departments around shared work instead of scattered updates.',
    tone: 'bg-cyan-50 text-cyan-700',
  },
  {
    icon: FiZap,
    title: 'Move work forward',
    description:
      'Track work through clear stages, spot blockers, and use AI assistance when you need a starting point.',
    tone: 'bg-amber-50 text-amber-700',
  },
];

const workflow = [
  {
    number: '01',
    title: 'Plan together',
    description: 'Organize projects and break goals into clear, owned tasks.',
  },
  {
    number: '02',
    title: 'Stay aligned',
    description: 'See progress across teams and keep important context in one place.',
  },
  {
    number: '03',
    title: 'Deliver with focus',
    description: 'Update work as it moves and identify what needs attention.',
  },
];

const productFeatures = [
  {
    icon: FiGrid,
    title: 'Projects and task boards',
    description:
      'Plan work by project and move tasks through Kanban, list, and calendar views. Set owners, priorities, and due dates so the next step is clear.',
    tone: 'bg-indigo-50 text-indigo-600',
  },
  {
    icon: FiUsers,
    title: 'People and departments',
    description:
      'Keep employee profiles and department information organized, and see who is responsible for work across your teams.',
    tone: 'bg-cyan-50 text-cyan-700',
  },
  {
    icon: FiCalendar,
    title: 'Progress at a glance',
    description:
      'Use the dashboard to review task status, upcoming deadlines, department activity, and work that may need attention.',
    tone: 'bg-emerald-50 text-emerald-700',
  },
  {
    icon: FiMessageSquare,
    title: 'Collaboration in context',
    description:
      'Keep comments, replies, and checklists alongside project work, making it easier to follow decisions and handoffs.',
    tone: 'bg-violet-50 text-violet-700',
  },
  {
    icon: FiCpu,
    title: 'AI workspace copilot',
    description:
      'Ask questions about workspace activity and get AI assistance with task planning and work summaries.',
    tone: 'bg-amber-50 text-amber-700',
  },
];

const PublicWebsite = () => {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen overflow-hidden bg-white text-slate-900">
      <header className="relative z-10 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8">
          <a href="#" className="flex items-center gap-3" aria-label="Team-Sync home">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-sm font-bold text-white shadow-lg shadow-indigo-600/20">
              TS
            </span>
            <span>
              <span className="block text-sm font-bold tracking-tight">Team-Sync</span>
              <span className="block text-[10px] font-medium text-slate-500">
                Work, in sync.
              </span>
            </span>
          </a>

          <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
            <a href="#platform" className="text-sm text-slate-600 transition hover:text-indigo-600">
              Why Team-Sync
            </a>
            <a href="#features" className="text-sm text-slate-600 transition hover:text-indigo-600">
              Features
            </a>
            <a href="#how-it-works" className="text-sm text-slate-600 transition hover:text-indigo-600">
              How it works
            </a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 sm:px-4 sm:text-sm"
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="rounded-lg bg-indigo-600 px-3.5 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 transition hover:bg-indigo-700 sm:px-4 sm:text-sm"
            >
              Get started
            </button>
          </div>
        </div>
      </header>

      <section className="relative isolate">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -right-32 -top-40 h-[520px] w-[520px] rounded-full bg-indigo-100/70 blur-3xl" />
          <div className="absolute -left-32 top-48 h-72 w-72 rounded-full bg-cyan-100/50 blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f018_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f018_1px,transparent_1px)] bg-[size:48px_48px]" />
        </div>

        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 pb-20 pt-16 sm:px-8 sm:pb-24 sm:pt-24 lg:grid-cols-[1.02fr_0.98fr] lg:gap-10 lg:py-28">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/80 px-3 py-1.5 text-xs font-semibold text-indigo-700 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
              A clearer way to work together
            </div>

            <h1 className="mt-7 text-4xl font-bold leading-[1.08] tracking-[-0.045em] text-slate-950 sm:text-5xl lg:text-[3.75rem]">
              Less chasing updates.
              <span className="mt-1 block bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-600 bg-clip-text text-transparent">
                More meaningful progress.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
              Team-Sync is a collaborative work management platform for organizing projects,
              assigning and tracking tasks, coordinating departments, and keeping conversations
              close to the work. Teams get a shared view of ownership and progress, with an AI
              copilot to help make sense of workspace activity.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:-translate-y-0.5 hover:bg-indigo-700"
              >
                Create your account
                <FiArrowRight aria-hidden="true" />
              </button>
              <a
                href="#platform"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white/80 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-white"
              >
                Explore the platform
                <FiArrowDown aria-hidden="true" />
              </a>
            </div>

            <div className="mt-7 flex items-center gap-2 text-xs text-slate-500">
              <FiShield className="text-emerald-600" aria-hidden="true" />
              <span>Your workspace is private to signed-in users.</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -inset-5 rounded-[2rem] bg-gradient-to-br from-indigo-200/70 via-white to-cyan-100/80 blur-xl" />
            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-indigo-950/10">
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <FiLayers size={17} aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Project overview</p>
                    <p className="mt-0.5 text-[10px] text-slate-500">One view of work in motion</p>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700">
                  Workspace preview
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 p-5">
                {[
                  { label: 'Projects', value: 'Plan' },
                  { label: 'Tasks', value: 'Track' },
                  { label: 'Teams', value: 'Align' },
                ].map((item, index) => (
                  <div key={item.label} className="rounded-xl border border-slate-100 bg-slate-50/80 p-3">
                    <div className={`mb-3 h-1 w-8 rounded-full ${index === 1 ? 'bg-cyan-500' : index === 2 ? 'bg-emerald-500' : 'bg-indigo-500'}`} />
                    <p className="text-[10px] font-medium text-slate-500">{item.label}</p>
                    <p className="mt-1 text-sm font-bold text-slate-900">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="px-5 pb-5">
                <div className="rounded-xl border border-slate-100">
                  <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                    <p className="text-xs font-semibold text-slate-800">Work moves forward</p>
                    <span className="text-[10px] font-medium text-slate-400">A simple shared view</span>
                  </div>
                  <div className="space-y-3 p-4">
                    {[
                      { label: 'Define the next milestone', state: 'Complete', width: 'w-full', color: 'bg-emerald-500' },
                      { label: 'Coordinate team handoffs', state: 'In progress', width: 'w-3/5', color: 'bg-indigo-500' },
                      { label: 'Review upcoming priorities', state: 'Up next', width: 'w-1/4', color: 'bg-cyan-500' },
                    ].map((task, index) => (
                      <div key={task.label} className="flex items-center gap-3">
                        <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${index === 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                          {index === 0 ? <FiCheck size={14} aria-hidden="true" /> : <FiCheckCircle size={14} aria-hidden="true" />}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="truncate text-[11px] font-medium text-slate-700">{task.label}</p>
                            <span className="shrink-0 text-[9px] text-slate-400">{task.state}</span>
                          </div>
                          <div className="mt-2 h-1 overflow-hidden rounded-full bg-slate-100">
                            <div className={`h-full rounded-full ${task.color} ${task.width}`} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-3 rounded-xl bg-indigo-50/70 px-4 py-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-indigo-600 shadow-sm">
                    <FiMessageSquare size={15} aria-hidden="true" />
                  </span>
                  <p className="text-[10px] leading-5 text-slate-600">
                    <span className="font-semibold text-indigo-700">AI when it helps.</span>{' '}
                    Get assistance with workspace questions and task planning.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="platform" className="scroll-mt-20 border-y border-slate-100 bg-slate-50/70 px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">The value</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              The context to do your best work.
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
              When teams share a clear view of goals and ownership, collaboration gets simpler.
              Team-Sync gives the work a home from kickoff through delivery.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <article key={benefit.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-900/[0.02]">
                  <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${benefit.tone}`}>
                    <Icon size={19} aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-base font-bold text-slate-900">{benefit.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{benefit.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="features" className="scroll-mt-20 px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
              Built for everyday teamwork
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Everything your team needs to keep work moving.
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
              A connected set of tools for planning delivery, coordinating people, and staying
              informed from kickoff to completion.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {productFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <article
                  key={feature.title}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-900/[0.02] transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${feature.tone}`}>
                    <Icon size={19} aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-base font-bold text-slate-900">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{feature.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="scroll-mt-20 px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">A simple rhythm</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              From scattered work to shared momentum.
            </h2>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3 md:gap-5">
            {workflow.map((step, index) => (
              <article key={step.number} className="relative border-t border-slate-200 pt-5">
                {index < workflow.length - 1 && (
                  <FiArrowRight className="absolute right-0 top-5 hidden -translate-y-1/2 text-slate-300 md:block" aria-hidden="true" />
                )}
                <p className="text-xs font-bold tracking-[0.12em] text-indigo-600">{step.number}</p>
                <h3 className="mt-3 text-lg font-bold text-slate-900">{step.title}</h3>
                <p className="mt-2 max-w-sm text-sm leading-6 text-slate-600">{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="why-team-sync" className="scroll-mt-20 px-5 pb-20 sm:px-8 sm:pb-24">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-3xl bg-slate-950 px-6 py-12 text-center sm:px-12 sm:py-16">
            <div className="pointer-events-none absolute -right-24 -top-36 h-80 w-80 rounded-full bg-indigo-600/30 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-44 -left-20 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" />
            <div className="relative mx-auto max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-300">Make room for progress</p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Give good work a better way forward.
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base">
                Bring your projects and people together in a workspace built for clarity,
                coordination, and focused delivery.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => navigate('/register')}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-indigo-50"
                >
                  Get started
                  <FiArrowRight aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="inline-flex items-center justify-center rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Sign in
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 px-5 py-6 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-xs text-slate-500 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-[10px] font-bold text-white">
              TS
            </span>
            <span className="font-semibold text-slate-700">Team-Sync</span>
          </div>
          <span>One shared workspace. More room to make progress.</span>
        </div>
      </footer>
    </main>
  );
};

export default PublicWebsite;

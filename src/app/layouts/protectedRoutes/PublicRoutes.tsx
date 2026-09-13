import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import type { RootState } from '../../routes/store';

const PublicRoutes = () => {
  const { employee, isLoading } = useSelector((store: RootState) => store.auth);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#090611] flex flex-col items-center justify-center text-white">
        <div className="relative flex items-center justify-center">
          <div className="h-16 w-16 rounded-full border-4 border-violet-500/20 border-t-violet-500 animate-spin" />
          <div className="absolute h-8 w-8 rounded-full bg-violet-600/30 blur-sm" />
        </div>
        <p className="mt-4 text-xs tracking-wider text-gray-400 uppercase font-medium">
          Verifying Session...
        </p>
      </div>
    );
  }

  if (employee) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
};

export default PublicRoutes;
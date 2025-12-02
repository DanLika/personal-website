import { Navbar } from "./components/Navbar";
import { AppRoutes } from "./components/Routes";
import { ErrorBoundary } from "./components/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#050505]">
        <Navbar />
        <AppRoutes />
      </div>
    </ErrorBoundary>
  );
}

export default App;

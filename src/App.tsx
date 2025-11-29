import { Navbar } from "./components/Navbar";
import { AppRoutes } from "./components/Routes";

function App() {
  return (
    <div className="min-h-screen bg-[#050505]">
      <Navbar />
      <AppRoutes />
    </div>
  );
}

export default App;

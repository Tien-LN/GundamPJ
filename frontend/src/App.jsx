import AllRoutes from "./components/AllRoutes";
import { AuthProvider } from "./contexts/AuthContext";
import "katex/dist/katex.min.css";
import katex from "katex";
import renderMathInElement from "katex/dist/contrib/auto-render";

function App() {
  return (
    <AuthProvider>
      <AllRoutes />
    </AuthProvider>
  );
}

export default App;

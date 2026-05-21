import NaverNewsPage from "./pages/NaverNewsPage";
import AdminPage from "./pages/AdminPage";

function App() {
  const path = window.location.pathname;
  if (path === "/admin" || path.startsWith("/admin/")) {
    return <AdminPage />;
  }
  return <NaverNewsPage />;
}

export default App;

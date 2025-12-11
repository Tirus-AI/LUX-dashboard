import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Analytic from "./pages/analytics/Analytic";
import Chatbot from "./chatbot/Chatbot";
import Home from "./pages/home/Home";
import WorkflowPage from "./pages/workflows/WorkflowPage";

export default function App() {
  return (
    <BrowserRouter>
      <Chatbot />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/claims" element={<WorkflowPage />} />
          <Route path="/analytics" element={<Analytic />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
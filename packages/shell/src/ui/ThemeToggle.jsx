import { useTheme,ThemeProvider } from "../context/ThemeContext";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="btn btn-primary rounded-circle position-fixed bottom-0 end-0 m-4"
      style={{ zIndex: 1030 }}
    >
      <i className={`fas ${theme === "light" ? "fa-moon" : "fa-sun"}`}></i>
    </button>
  );
};

export default ThemeToggle;
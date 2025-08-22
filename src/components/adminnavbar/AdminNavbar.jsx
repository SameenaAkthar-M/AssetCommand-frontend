import "../../pages/admin/admin.css";

const AdminNavbar = ({ activeSection, setActiveSection }) => {
  const sections = [
    "bases",
    "assets",
    "purchases",
    "transfers",
    "assignments",
    "expenditures",
    "users"
  ];

  return (
    <nav className="admin-navbar">
      {sections.map((section) => (
        <button
          key={section}
          onClick={() => setActiveSection(section)}
          className={activeSection === section ? "active" : ""}
        >
          {section.charAt(0).toUpperCase() + section.slice(1)}
        </button>
      ))}
    </nav>
  );
};

export default AdminNavbar;

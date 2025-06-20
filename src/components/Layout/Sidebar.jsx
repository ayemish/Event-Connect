const Sidebar = ({ activeTab, setActiveTab }) => {
  return (
    <aside className="dashboard-sidebar">
      <nav>
        <ul>
          <li 
            className={activeTab === 'packages' ? 'active' : ''}
            onClick={() => setActiveTab('packages')}
          >
            Event Packages
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
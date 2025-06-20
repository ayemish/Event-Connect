import { useNavigate } from 'react-router-dom';

const AddPackageButton = ({ count }) => {
  const navigate = useNavigate();
  return (
    <button className="add-package-btn" onClick={() => navigate('/create-event')}>
      {count} + Add New
    </button>
  );
};

export default AddPackageButton;
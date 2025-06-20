const AddServiceButton = ({ count, onAdd }) => {
  return (
    <button className="add-service-btn" onClick={onAdd}>
      {count} + Add New
    </button>
  );
};

export default AddServiceButton;
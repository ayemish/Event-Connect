import PackageCard from './PackageCard';
import AddPackageButton from './AddPackageButton';
import { getVendorEvents } from '../../utils/vendorUtils';
import './eventPackages.css';

const EventPackages = () => {
  const events = getVendorEvents();
  console.log('Events in EventPackages:', events);

  return (
    <section className="event-packages">
      <div className="section-header">
        <h2>Event Packages</h2>
        <AddPackageButton count={events.length} />
      </div>
      
      <div className="packages-grid">
        {events.map(event => (
          <PackageCard 
            key={event.id} 
            packageData={{
              id: event.id,
              name: event.name,
              image: event.image,
              details: event.description
            }} 
          />
        ))}
      </div>
    </section>
  );
};

export default EventPackages;
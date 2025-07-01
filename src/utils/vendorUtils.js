class VendorContentManager {
    constructor() {
        this.storageKey = 'vendor_content_data';
        this.initStorage();
        console.log('VendorContentManager: Initialized.');
    }

    initStorage() {
        if (!localStorage.getItem(this.storageKey)) {
            localStorage.setItem(this.storageKey, JSON.stringify({}));
            console.log('VendorContentManager: Initialized empty storage.');
        }
    }

    getAllData() {
        const data = JSON.parse(localStorage.getItem(this.storageKey) || '{}');
        console.log('VendorContentManager: Retrieved all data from localStorage:', data);
        return data;
    }

    saveAllData(data) {
        console.log('VendorContentManager: Saving all data to localStorage:', data);
        localStorage.setItem(this.storageKey, JSON.stringify(data));
        // Verify immediately after saving
        console.log('VendorContentManager: Data in localStorage after save:', JSON.parse(localStorage.getItem(this.storageKey)));
    }

    // Add or update vendor's main profile data and initialize content
    addOrUpdateVendorProfile(vendorId, profileData) {
        const allData = this.getAllData();
        allData[vendorId] = {
            ...allData[vendorId],
            profile: { ...allData[vendorId]?.profile, ...profileData },
            events: allData[vendorId]?.events || [],
            services: allData[vendorId]?.services || [],
            createdAt: allData[vendorId]?.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        console.log('VendorContentManager: Adding/Updating vendor profile for', vendorId, allData[vendorId]);
        this.saveAllData(allData);
    }

    // Get all content for a specific vendor
    getVendorContent(vendorId) {
        const allData = this.getAllData();
        const content = allData[vendorId] || null;
        console.log('VendorContentManager: Getting content for vendor', vendorId, content);
        return content;
    }

    // Update specific content (events or services) for a vendor
    updateVendorContent(vendorId, contentKey, updatedContent) {
        const allData = this.getAllData();
        if (allData[vendorId]) {
            allData[vendorId][contentKey] = updatedContent;
            allData[vendorId].updatedAt = new Date().toISOString();
            console.log('VendorContentManager: Updating content for vendor', vendorId, 'key:', contentKey, 'new content:', updatedContent);
            this.saveAllData(allData);
            return true;
        }
        console.log('VendorContentManager: Vendor not found for update', vendorId);
        return false;
    }

    // Retrieve all vendor IDs
    getAllVendorIds() {
        return Object.keys(this.getAllData());
    }

    // Retrieve all data for all vendors (useful for customer view)
    getAllVendorsContent() {
        return Object.values(this.getAllData());
    }

    // Add a confirmation for an event by a customer
    addEventConfirmation(vendorId, eventId, customerId = 'anonymous_customer', customerName = 'Anonymous Customer', date = '', invitees = '', selectedServices = [], customizationInfo = {}) {
        console.log('VendorContentManager: Attempting to add confirmation for vendor', vendorId, 'event', eventId, 'customer', customerId, 'name', customerName, 'date', date, 'invitees', invitees, 'selectedServices', selectedServices);
        const allData = this.getAllData();
        if (!allData[vendorId]) {
            console.warn('VendorContentManager: Vendor not found for confirmation - ID:', vendorId);
            return false;
        }

        if (!allData[vendorId].confirmations) {
            allData[vendorId].confirmations = [];
        }

        // Always add a new confirmation with a unique confirmationId
        const newConfirmation = {
            confirmationId: `CONF${Date.now()}${Math.floor(Math.random() * 10000)}`,
            eventId,
            customerId,
            customerName,
            date,
            invitees,
            selectedServices,
            timestamp: new Date().toISOString(),
            paymentStatus: 'Pending', // Default to pending
            paymentTimestamp: null,
            status: 'Pending', // Default event status
            ...customizationInfo
        };
        allData[vendorId].confirmations.push(newConfirmation);
        console.log('VendorContentManager: Added new event confirmation:', newConfirmation, 'for vendor:', vendorId);
        this.saveAllData(allData);
        console.log('VendorContentManager: Confirmations after add/update:', allData[vendorId].confirmations);
        return true;
    }

    // Remove a confirmation for an event by confirmationId
    removeEventConfirmation(vendorId, confirmationId) {
        console.log('VendorContentManager: Attempting to remove confirmation for vendor', vendorId, 'confirmationId', confirmationId);
        const allData = this.getAllData();
        if (!allData[vendorId] || !allData[vendorId].confirmations) {
            console.log('VendorContentManager: No confirmations found for vendor or vendor not found.', vendorId);
            return false;
        }

        const initialLength = allData[vendorId].confirmations.length;
        allData[vendorId].confirmations = allData[vendorId].confirmations.filter(
            conf => conf.confirmationId !== confirmationId
        );

        if (allData[vendorId].confirmations.length < initialLength) {
            console.log('VendorContentManager: Removed event confirmation for confirmationId:', confirmationId);
            this.saveAllData(allData);
            console.log('VendorContentManager: Confirmations after remove:', allData[vendorId].confirmations);
            return true;
        }
        console.log('VendorContentManager: Confirmation not found for removal.');
        return false;
    }

    // Get all confirmations for a specific vendor
    getVendorConfirmations(vendorId) {
        console.log('VendorContentManager: Getting confirmations for vendor:', vendorId);
        const allData = this.getAllData();
        const confirmations = allData[vendorId]?.confirmations || [];
        console.log('VendorContentManager: Retrieved confirmations:', confirmations, 'for vendor:', vendorId);
        return confirmations;
    }

    // Update the status of a confirmation for a vendor's event by confirmationId
    updateConfirmationStatus(vendorId, confirmationId, newStatus) {
        const allData = this.getAllData();
        if (!allData[vendorId] || !allData[vendorId].confirmations) return false;
        const confIndex = allData[vendorId].confirmations.findIndex(
            conf => conf.confirmationId === confirmationId
        );
        if (confIndex !== -1) {
            allData[vendorId].confirmations[confIndex].status = newStatus;
            this.saveAllData(allData);
            return true;
        }
        return false;
    }

    // Update payment status for a confirmation
    updatePaymentStatus(vendorId, confirmationId, status = 'Clear') {
        const allData = this.getAllData();
        if (!allData[vendorId] || !allData[vendorId].confirmations) return false;
        const confIndex = allData[vendorId].confirmations.findIndex(
            conf => conf.confirmationId === confirmationId
        );
        if (confIndex !== -1) {
            allData[vendorId].confirmations[confIndex].paymentStatus = status;
            allData[vendorId].confirmations[confIndex].paymentTimestamp = status === 'Clear' ? new Date().toISOString() : null;
            this.saveAllData(allData);
            return true;
        }
        return false;
    }

    // Get all payments for a vendor (events and services)
    getVendorPayments(vendorId) {
        const allData = this.getAllData();
        if (!allData[vendorId] || !allData[vendorId].confirmations) return [];
        return allData[vendorId].confirmations.map(conf => ({
            ...conf
        }));
    }
}

const vendorManager = new VendorContentManager();

// Get current vendor's session data
export const getCurrentVendor = () => {
  return JSON.parse(localStorage.getItem('vendor'));
};

// Get specific vendor's content data using the manager
export const getVendorData = () => {
  const vendor = getCurrentVendor();
  if (!vendor || !vendor.id) return null;
  return vendorManager.getVendorContent(vendor.id);
};

// Update vendor's specific content data using the manager
export const updateVendorData = (newData) => {
  const vendor = getCurrentVendor();
  if (!vendor || !vendor.id) return false;
  
  if (newData.events) {
    vendorManager.updateVendorContent(vendor.id, 'events', newData.events);
  }
  if (newData.services) {
    vendorManager.updateVendorContent(vendor.id, 'services', newData.services);
  }
  if (newData.profile) {
    vendorManager.addOrUpdateVendorProfile(vendor.id, newData.profile);
  }
  return true;
};

// Add event to vendor's data using the manager
export const addVendorEvent = (event) => {
  const vendor = getCurrentVendor();
  if (!vendor || !vendor.id) return false;

  const vendorContent = vendorManager.getVendorContent(vendor.id);
  if (!vendorContent) return false;

  const newEvent = {
    id: `EVT${Date.now()}`,
    ...event,
    image: event.images && event.images.length > 0 ? event.images[0].preview : 'https://via.placeholder.com/180',
    images: event.images ? event.images.map(img => img.preview) : [],
    services: []
  };

  console.log('Adding new event:', newEvent); // Debug log
  const updatedEvents = [...vendorContent.events, newEvent];
  return vendorManager.updateVendorContent(vendor.id, 'events', updatedEvents);
};

// Add service to vendor's data using the manager
export const addVendorService = (service) => {
  const vendor = getCurrentVendor();
  if (!vendor || !vendor.id) return false;

  const vendorContent = vendorManager.getVendorContent(vendor.id);
  if (!vendorContent) return false;

  const newService = {
    id: `SRV${Date.now()}`,
    ...service,
    image: service.image || '', // Assume service.image is an object with a preview property
  };
  
  const updatedServices = [...vendorContent.services, newService];
  return vendorManager.updateVendorContent(vendor.id, 'services', updatedServices);
};

// Get vendor's events using the manager
export const getVendorEvents = () => {
  const vendorContent = getVendorData();
  console.log('Retrieved vendor events:', vendorContent?.events || []); // Debug log
  return vendorContent?.events || [];
};

// Get vendor's services using the manager
export const getVendorServices = () => {
  const vendorContent = getVendorData();
  return vendorContent?.services || [];
};

// Export the manager instance for direct use where needed (e.g., signup/login)
export { vendorManager }; 
class CustomerSessionManager {
    constructor() {
        this.currentCustomerKey = 'current_customer_session';
        this.customerDataPrefix = 'customer_session_';
        this.customersKey = 'all_customers';
    }

    // Generate a unique customer ID
    generateCustomerId() {
        return `customer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    // Get all registered customers
    getAllCustomers() {
        const customers = localStorage.getItem(this.customersKey);
        return customers ? JSON.parse(customers) : {};
    }

    // Set current active customer
    setCurrentCustomer(customerId, customerData) {
        // Store current customer reference
        localStorage.setItem(this.currentCustomerKey, customerId);
        
        // Store customer session data
        const sessionKey = `${this.customerDataPrefix}${customerId}`;
        const sessionData = {
            ...customerData,
            id: customerId,
            sessionStart: new Date().toISOString(),
            lastActivity: new Date().toISOString()
        };
        
        localStorage.setItem(sessionKey, JSON.stringify(sessionData));

        // Update all customers list
        const allCustomers = this.getAllCustomers();
        allCustomers[customerId] = {
            id: customerId,
            name: customerData.name,
            firstName: customerData.firstName,
            lastName: customerData.lastName,
            email: customerData.email,
            phoneNumber: customerData.phoneNumber,
            password: customerData.password,
            createdAt: customerData.createdAt
        };
        localStorage.setItem(this.customersKey, JSON.stringify(allCustomers));
    }

    // Get current active customer
    getCurrentCustomer() {
        const customerId = localStorage.getItem(this.currentCustomerKey);
        if (!customerId) return null;
        
        const sessionKey = `${this.customerDataPrefix}${customerId}`;
        const sessionData = localStorage.getItem(sessionKey);
        
        return sessionData ? JSON.parse(sessionData) : null;
    }

    // Update customer activity
    updateCustomerActivity(customerId = null) {
        const targetCustomerId = customerId || localStorage.getItem(this.currentCustomerKey);
        if (!targetCustomerId) return false;
        
        const sessionKey = `${this.customerDataPrefix}${targetCustomerId}`;
        const sessionData = localStorage.getItem(sessionKey);
        
        if (sessionData) {
            const data = JSON.parse(sessionData);
            data.lastActivity = new Date().toISOString();
            localStorage.setItem(sessionKey, JSON.stringify(data));
            return true;
        }
        
        return false;
    }

    // Clear current customer session
    clearCurrentCustomer() {
        const customerId = localStorage.getItem(this.currentCustomerKey);
        if (customerId) {
            const sessionKey = `${this.customerDataPrefix}${customerId}`;
            localStorage.removeItem(sessionKey);
        }
        localStorage.removeItem(this.currentCustomerKey);
    }

    // Get all active customer sessions
    getAllActiveSessions() {
        const sessions = [];
        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith(this.customerDataPrefix)) {
                const sessionData = JSON.parse(localStorage.getItem(key));
                sessions.push(sessionData);
            }
        }
        
        return sessions;
    }

    // Check if customer is logged in
    isLoggedIn() {
        return !!this.getCurrentCustomer();
    }

    // Register a new customer
    registerCustomer(customerData) {
        const customerId = this.generateCustomerId();
        this.setCurrentCustomer(customerId, customerData);
        return customerId;
    }

    // Login customer
    loginCustomer(email, password) {
        const allCustomers = this.getAllCustomers();
        const customer = Object.values(allCustomers).find(c => c.email === email);
        
        if (customer && customer.password === password) {
            this.setCurrentCustomer(customer.id, customer);
            return true;
        }
        return false;
    }
}

export default CustomerSessionManager; 
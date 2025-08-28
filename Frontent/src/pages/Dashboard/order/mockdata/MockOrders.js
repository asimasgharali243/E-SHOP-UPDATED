export const mockOrders = [
  {
    id: '1001',
    orderNumber: 'ORD-2025-001',
    customer: {
      id: 'cust-001',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+1 (555) 123-4567'
    },
    items: [
      {
        id: 'item-001',
        name: 'Wireless Bluetooth Headphones',
        quantity: 1,
        price: 129.99
      },
      {
        id: 'item-002',
        name: 'Phone Case',
        quantity: 2,
        price: 24.99
      }
    ],
    status: 'delivered',
    orderDate: '2025-01-15T10:30:00Z',
    shippingAddress: {
      street: '123 Main Street, Apt 4B',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    paymentMethod: 'Credit Card',
    subtotal: 179.97,
    shipping: 9.99,
    tax: 14.40,
    total: 204.36,
    trackingNumber: 'TRK123456789'
  },
  {
    id: '1002',
    orderNumber: 'ORD-2025-002',
    customer: {
      id: 'cust-002',
      name: 'Michael Chen',
      email: 'michael.chen@email.com',
      phone: '+1 (555) 987-6543'
    },
    items: [
      {
        id: 'item-003',
        name: 'Smart Watch',
        quantity: 1,
        price: 299.99
      }
    ],
    status: 'shipped',
    orderDate: '2025-01-14T15:45:00Z',
    shippingAddress: {
      street: '456 Oak Avenue',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102',
      country: 'USA'
    },
    paymentMethod: 'PayPal',
    subtotal: 299.99,
    shipping: 12.99,
    tax: 24.00,
    total: 336.98,
    trackingNumber: 'TRK987654321'
  },
  {
    id: '1003',
    orderNumber: 'ORD-2025-003',
    customer: {
      id: 'cust-003',
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@email.com',
      phone: '+1 (555) 456-7890'
    },
    items: [
      {
        id: 'item-004',
        name: 'Laptop Stand',
        quantity: 1,
        price: 79.99
      },
      {
        id: 'item-005',
        name: 'Wireless Mouse',
        quantity: 1,
        price: 49.99
      },
      {
        id: 'item-006',
        name: 'Keyboard',
        quantity: 1,
        price: 89.99
      }
    ],
    status: 'processing',
    orderDate: '2025-01-13T09:15:00Z',
    shippingAddress: {
      street: '789 Pine Street',
      city: 'Austin',
      state: 'TX',
      zipCode: '73301',
      country: 'USA'
    },
    paymentMethod: 'Credit Card',
    subtotal: 219.97,
    shipping: 7.99,
    tax: 17.60,
    total: 245.56
  },
  {
    id: '1004',
    orderNumber: 'ORD-2025-004',
    customer: {
      id: 'cust-004',
      name: 'David Thompson',
      email: 'david.thompson@email.com',
      phone: '+1 (555) 234-5678'
    },
    items: [
      {
        id: 'item-007',
        name: 'Gaming Chair',
        quantity: 1,
        price: 349.99
      }
    ],
    status: 'pending',
    orderDate: '2025-01-12T14:20:00Z',
    shippingAddress: {
      street: '321 Elm Street',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'USA'
    },
    paymentMethod: 'Credit Card',
    subtotal: 349.99,
    shipping: 19.99,
    tax: 28.00,
    total: 397.98
  },
  {
    id: '1005',
    orderNumber: 'ORD-2025-005',
    customer: {
      id: 'cust-005',
      name: 'Jessica Brown',
      email: 'jessica.brown@email.com',
      phone: '+1 (555) 345-6789'
    },
    items: [
      {
        id: 'item-008',
        name: 'Bluetooth Speaker',
        quantity: 2,
        price: 89.99
      },
      {
        id: 'item-009',
        name: 'Phone Charger',
        quantity: 3,
        price: 19.99
      }
    ],
    status: 'cancelled',
    orderDate: '2025-01-11T11:30:00Z',
    shippingAddress: {
      street: '654 Maple Drive',
      city: 'Denver',
      state: 'CO',
      zipCode: '80201',
      country: 'USA'
    },
    paymentMethod: 'PayPal',
    subtotal: 239.95,
    shipping: 8.99,
    tax: 19.20,
    total: 268.14
  },
  {
    id: '1006',
    orderNumber: 'ORD-2025-006',
    customer: {
      id: 'cust-006',
      name: 'Robert Wilson',
      email: 'robert.wilson@email.com',
      phone: '+1 (555) 567-8901'
    },
    items: [
      {
        id: 'item-010',
        name: 'Tablet',
        quantity: 1,
        price: 499.99
      },
      {
        id: 'item-011',
        name: 'Tablet Case',
        quantity: 1,
        price: 39.99
      }
    ],
    status: 'processing',
    orderDate: '2025-01-10T16:45:00Z',
    shippingAddress: {
      street: '987 Cedar Lane',
      city: 'Miami',
      state: 'FL',
      zipCode: '33101',
      country: 'USA'
    },
    paymentMethod: 'Credit Card',
    subtotal: 539.98,
    shipping: 15.99,
    tax: 43.20,
    total: 599.17
  },
  {
    id: '1007',
    orderNumber: 'ORD-2025-007',
    customer: {
      id: 'cust-007',
      name: 'Amanda Davis',
      email: 'amanda.davis@email.com',
      phone: '+1 (555) 678-9012'
    },
    items: [
      {
        id: 'item-012',
        name: 'Fitness Tracker',
        quantity: 1,
        price: 199.99
      }
    ],
    status: 'shipped',
    orderDate: '2025-01-09T08:00:00Z',
    shippingAddress: {
      street: '159 Birch Road',
      city: 'Seattle',
      state: 'WA',
      zipCode: '98101',
      country: 'USA'
    },
    paymentMethod: 'Apple Pay',
    subtotal: 199.99,
    shipping: 6.99,
    tax: 16.00,
    total: 222.98,
    trackingNumber: 'TRK456789123'
  },
  {
    id: '1008',
    orderNumber: 'ORD-2025-008',
    customer: {
      id: 'cust-008',
      name: 'Christopher Lee',
      email: 'christopher.lee@email.com',
      phone: '+1 (555) 789-0123'
    },
    items: [
      {
        id: 'item-013',
        name: 'Desktop Monitor',
        quantity: 2,
        price: 249.99
      },
      {
        id: 'item-014',
        name: 'HDMI Cable',
        quantity: 2,
        price: 15.99
      }
    ],
    status: 'delivered',
    orderDate: '2025-01-08T13:15:00Z',
    shippingAddress: {
      street: '753 Willow Court',
      city: 'Portland',
      state: 'OR',
      zipCode: '97201',
      country: 'USA'
    },
    paymentMethod: 'Credit Card',
    subtotal: 531.96,
    shipping: 24.99,
    tax: 42.56,
    total: 599.51,
    trackingNumber: 'TRK789123456'
  },
  {
    id: '1009',
    orderNumber: 'ORD-2025-009',
    customer: {
      id: 'cust-009',
      name: 'Michelle Garcia',
      email: 'michelle.garcia@email.com',
      phone: '+1 (555) 890-1234'
    },
    items: [
      {
        id: 'item-015',
        name: 'Coffee Maker',
        quantity: 1,
        price: 179.99
      },
      {
        id: 'item-016',
        name: 'Coffee Beans',
        quantity: 3,
        price: 12.99
      }
    ],
    status: 'pending',
    orderDate: '2025-01-07T07:30:00Z',
    shippingAddress: {
      street: '852 Spruce Avenue',
      city: 'Phoenix',
      state: 'AZ',
      zipCode: '85001',
      country: 'USA'
    },
    paymentMethod: 'Credit Card',
    subtotal: 218.96,
    shipping: 9.99,
    tax: 17.52,
    total: 246.47
  },
  {
    id: '1010',
    orderNumber: 'ORD-2025-010',
    customer: {
      id: 'cust-010',
      name: 'Kevin Martinez',
      email: 'kevin.martinez@email.com',
      phone: '+1 (555) 901-2345'
    },
    items: [
      {
        id: 'item-017',
        name: 'Running Shoes',
        quantity: 1,
        price: 129.99
      },
      {
        id: 'item-018',
        name: 'Sports Socks',
        quantity: 4,
        price: 9.99
      }
    ],
    status: 'processing',
    orderDate: '2025-01-06T12:00:00Z',
    shippingAddress: {
      street: '741 Aspen Boulevard',
      city: 'Las Vegas',
      state: 'NV',
      zipCode: '89101',
      country: 'USA'
    },
    paymentMethod: 'Google Pay',
    subtotal: 169.95,
    shipping: 8.99,
    tax: 13.60,
    total: 192.54
  },
  {
    id: '1011',
    orderNumber: 'ORD-2025-011',
    customer: {
      id: 'cust-011',
      name: 'Lisa Anderson',
      email: 'lisa.anderson@email.com',
      phone: '+1 (555) 012-3456'
    },
    items: [
      {
        id: 'item-019',
        name: 'Wireless Earbuds',
        quantity: 1,
        price: 159.99
      },
      {
        id: 'item-020',
        name: 'Charging Case',
        quantity: 1,
        price: 49.99
      }
    ],
    status: 'delivered',
    orderDate: '2025-01-05T14:30:00Z',
    shippingAddress: {
      street: '246 Redwood Street',
      city: 'Boston',
      state: 'MA',
      zipCode: '02101',
      country: 'USA'
    },
    paymentMethod: 'Credit Card',
    subtotal: 209.98,
    shipping: 8.99,
    tax: 16.80,
    total: 235.77,
    trackingNumber: 'TRK321654987'
  },
  {
    id: '1012',
    orderNumber: 'ORD-2025-012',
    customer: {
      id: 'cust-012',
      name: 'James Taylor',
      email: 'james.taylor@email.com',
      phone: '+1 (555) 123-0987'
    },
    items: [
      {
        id: 'item-021',
        name: 'Smart Home Hub',
        quantity: 1,
        price: 199.99
      },
      {
        id: 'item-022',
        name: 'Smart Light Bulbs',
        quantity: 4,
        price: 29.99
      }
    ],
    status: 'shipped',
    orderDate: '2025-01-04T09:45:00Z',
    shippingAddress: {
      street: '135 Oakwood Drive',
      city: 'Atlanta',
      state: 'GA',
      zipCode: '30301',
      country: 'USA'
    },
    paymentMethod: 'PayPal',
    subtotal: 319.95,
    shipping: 12.99,
    tax: 25.60,
    total: 358.54,
    trackingNumber: 'TRK654987321'
  },
  {
    id: '1013',
    orderNumber: 'ORD-2025-013',
    customer: {
      id: 'cust-013',
      name: 'Rachel White',
      email: 'rachel.white@email.com',
      phone: '+1 (555) 234-0987'
    },
    items: [
      {
        id: 'item-023',
        name: 'Yoga Mat',
        quantity: 1,
        price: 39.99
      },
      {
        id: 'item-024',
        name: 'Water Bottle',
        quantity: 2,
        price: 24.99
      }
    ],
    status: 'pending',
    orderDate: '2025-01-03T16:20:00Z',
    shippingAddress: {
      street: '468 Magnolia Lane',
      city: 'Nashville',
      state: 'TN',
      zipCode: '37201',
      country: 'USA'
    },
    paymentMethod: 'Credit Card',
    subtotal: 89.97,
    shipping: 6.99,
    tax: 7.20,
    total: 104.16
  },
  {
    id: '1014',
    orderNumber: 'ORD-2025-014',
    customer: {
      id: 'cust-014',
      name: 'Daniel Kim',
      email: 'daniel.kim@email.com',
      phone: '+1 (555) 345-0987'
    },
    items: [
      {
        id: 'item-025',
        name: 'Mechanical Keyboard',
        quantity: 1,
        price: 149.99
      },
      {
        id: 'item-026',
        name: 'Gaming Mouse',
        quantity: 1,
        price: 79.99
      },
      {
        id: 'item-027',
        name: 'Mouse Pad',
        quantity: 1,
        price: 19.99
      }
    ],
    status: 'processing',
    orderDate: '2025-01-02T11:15:00Z',
    shippingAddress: {
      street: '579 Cypress Avenue',
      city: 'San Diego',
      state: 'CA',
      zipCode: '92101',
      country: 'USA'
    },
    paymentMethod: 'Apple Pay',
    subtotal: 249.97,
    shipping: 9.99,
    tax: 20.00,
    total: 279.96
  },
  {
    id: '1015',
    orderNumber: 'ORD-2025-015',
    customer: {
      id: 'cust-015',
      name: 'Stephanie Moore',
      email: 'stephanie.moore@email.com',
      phone: '+1 (555) 456-0987'
    },
    items: [
      {
        id: 'item-028',
        name: 'Air Purifier',
        quantity: 1,
        price: 299.99
      }
    ],
    status: 'delivered',
    orderDate: '2025-01-01T13:00:00Z',
    shippingAddress: {
      street: '802 Hickory Road',
      city: 'Dallas',
      state: 'TX',
      zipCode: '75201',
      country: 'USA'
    },
    paymentMethod: 'Credit Card',
    subtotal: 299.99,
    shipping: 14.99,
    tax: 24.00,
    total: 338.98,
    trackingNumber: 'TRK987321654'
  },
  {
    id: '1016',
    orderNumber: 'ORD-2025-016',
    customer: {
      id: 'cust-016',
      name: 'Mark Johnson',
      email: 'mark.johnson@email.com',
      phone: '+1 (555) 567-0987'
    },
    items: [
      {
        id: 'item-029',
        name: 'Webcam',
        quantity: 1,
        price: 89.99
      },
      {
        id: 'item-030',
        name: 'Microphone',
        quantity: 1,
        price: 129.99
      }
    ],
    status: 'shipped',
    orderDate: '2024-12-31T10:30:00Z',
    shippingAddress: {
      street: '913 Poplar Street',
      city: 'Minneapolis',
      state: 'MN',
      zipCode: '55401',
      country: 'USA'
    },
    paymentMethod: 'PayPal',
    subtotal: 219.98,
    shipping: 11.99,
    tax: 17.60,
    total: 249.57,
    trackingNumber: 'TRK159753486'
  },
  {
    id: '1017',
    orderNumber: 'ORD-2025-017',
    customer: {
      id: 'cust-017',
      name: 'Nicole Thompson',
      email: 'nicole.thompson@email.com',
      phone: '+1 (555) 678-0987'
    },
    items: [
      {
        id: 'item-031',
        name: 'Desk Lamp',
        quantity: 2,
        price: 59.99
      },
      {
        id: 'item-032',
        name: 'Desk Organizer',
        quantity: 1,
        price: 34.99
      }
    ],
    status: 'pending',
    orderDate: '2024-12-30T15:45:00Z',
    shippingAddress: {
      street: '357 Sycamore Court',
      city: 'Philadelphia',
      state: 'PA',
      zipCode: '19101',
      country: 'USA'
    },
    paymentMethod: 'Credit Card',
    subtotal: 154.97,
    shipping: 7.99,
    tax: 12.40,
    total: 175.36
  },
  {
    id: '1018',
    orderNumber: 'ORD-2025-018',
    customer: {
      id: 'cust-018',
      name: 'Brian Clark',
      email: 'brian.clark@email.com',
      phone: '+1 (555) 789-0987'
    },
    items: [
      {
        id: 'item-033',
        name: 'Portable Charger',
        quantity: 3,
        price: 39.99
      },
      {
        id: 'item-034',
        name: 'USB Cable',
        quantity: 5,
        price: 12.99
      }
    ],
    status: 'processing',
    orderDate: '2024-12-29T08:30:00Z',
    shippingAddress: {
      street: '680 Chestnut Avenue',
      city: 'Detroit',
      state: 'MI',
      zipCode: '48201',
      country: 'USA'
    },
    paymentMethod: 'Google Pay',
    subtotal: 184.92,
    shipping: 8.99,
    tax: 14.80,
    total: 208.71
  },
  {
    id: '1019',
    orderNumber: 'ORD-2025-019',
    customer: {
      id: 'cust-019',
      name: 'Jennifer Adams',
      email: 'jennifer.adams@email.com',
      phone: '+1 (555) 890-0987'
    },
    items: [
      {
        id: 'item-035',
        name: 'Bluetooth Keyboard',
        quantity: 1,
        price: 99.99
      }
    ],
    status: 'delivered',
    orderDate: '2024-12-28T12:15:00Z',
    shippingAddress: {
      street: '124 Walnut Street',
      city: 'Columbus',
      state: 'OH',
      zipCode: '43201',
      country: 'USA'
    },
    paymentMethod: 'Credit Card',
    subtotal: 99.99,
    shipping: 5.99,
    tax: 8.00,
    total: 113.98,
    trackingNumber: 'TRK753159486'
  },
  {
    id: '1020',
    orderNumber: 'ORD-2025-020',
    customer: {
      id: 'cust-020',
      name: 'Ryan Miller',
      email: 'ryan.miller@email.com',
      phone: '+1 (555) 901-0987'
    },
    items: [
      {
        id: 'item-036',
        name: 'External Hard Drive',
        quantity: 1,
        price: 129.99
      },
      {
        id: 'item-037',
        name: 'USB Hub',
        quantity: 1,
        price: 29.99
      }
    ],
    status: 'cancelled',
    orderDate: '2024-12-27T17:00:00Z',
    shippingAddress: {
      street: '791 Beech Boulevard',
      city: 'Charlotte',
      state: 'NC',
      zipCode: '28201',
      country: 'USA'
    },
    paymentMethod: 'PayPal',
    subtotal: 159.98,
    shipping: 7.99,
    tax: 12.80,
    total: 180.77
  }
];
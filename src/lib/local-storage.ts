// Local storage fallback for when MySQL is not available
import { DataRow } from './database';

// In-memory storage for development
let localData: DataRow[] = [];
let localUsers: any[] = [];

// Sample data for testing
const sampleData: DataRow[] = [
  {
    id: '1',
    section: 'Health',
    level: 'National',
    label: 'Sample Health Indicator',
    value: '85',
    unit: '%',
    frequency: 'Annual',
    period: '2024',
    year: '2024',
    quarter: 'Q1',
    responsible: 'Health Ministry',
    disaggregation: 'All',
    notes: 'Sample data for testing',
    status: 'draft',
    savedAt: new Date().toISOString(),
    submitterMessage: '',
    reviewerMessage: '',
    approverMessage: '',
    user: 'demo@example.com'
  }
];

const sampleUsers = [
  {
    id: '1',
    email: 'admin@datacollect.app',
    name: 'System Administrator',
    role: 'admin',
    isActive: true,
    createdAt: new Date().toISOString(),
    passwordHash: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' // password: admin123
  }
];

// Initialize with sample data
if (typeof window !== 'undefined') {
  // Browser environment
  const storedData = localStorage.getItem('datacollect_data');
  const storedUsers = localStorage.getItem('datacollect_users');
  
  if (storedData) {
    localData = JSON.parse(storedData);
  } else {
    localData = [...sampleData];
    localStorage.setItem('datacollect_data', JSON.stringify(localData));
  }
  
  if (storedUsers) {
    localUsers = JSON.parse(storedUsers);
  } else {
    localUsers = [...sampleUsers];
    localStorage.setItem('datacollect_users', JSON.stringify(localUsers));
  }
} else {
  // Server environment
  localData = [...sampleData];
  localUsers = [...sampleUsers];
}

// Data operations
export async function addRow(row: DataRow): Promise<DataRow> {
  localData.push(row);
  if (typeof window !== 'undefined') {
    localStorage.setItem('datacollect_data', JSON.stringify(localData));
  }
  return row;
}

export async function getRows(): Promise<DataRow[]> {
  return [...localData];
}

export async function updateSpecificRow(id: string, savedAt: string, updates: Partial<DataRow>): Promise<DataRow | null> {
  const index = localData.findIndex(row => row.id === id);
  if (index !== -1) {
    localData[index] = { ...localData[index], ...updates, savedAt };
    if (typeof window !== 'undefined') {
      localStorage.setItem('datacollect_data', JSON.stringify(localData));
    }
    return localData[index];
  }
  return null;
}

export async function updateRow(id: string, updates: Partial<DataRow>): Promise<DataRow | null> {
  const index = localData.findIndex(row => row.id === id);
  if (index !== -1) {
    localData[index] = { ...localData[index], ...updates };
    if (typeof window !== 'undefined') {
      localStorage.setItem('datacollect_data', JSON.stringify(localData));
    }
    return localData[index];
  }
  return null;
}

export async function getRowById(id: string): Promise<DataRow | undefined> {
  return localData.find(row => row.id === id);
}

export async function getRowsByStatus(status: string): Promise<DataRow[]> {
  return localData.filter(row => row.status === status);
}

export async function deleteRow(id: string, savedAt: string): Promise<boolean> {
  const index = localData.findIndex(row => row.id === id);
  if (index !== -1) {
    localData.splice(index, 1);
    if (typeof window !== 'undefined') {
      localStorage.setItem('datacollect_data', JSON.stringify(localData));
    }
    return true;
  }
  return false;
}

export async function getRowsByUser(user: string): Promise<DataRow[]> {
  return localData.filter(row => row.user === user);
}

export async function clearData(): Promise<void> {
  localData = [];
  if (typeof window !== 'undefined') {
    localStorage.setItem('datacollect_data', JSON.stringify(localData));
  }
}

// User operations
export async function createUser(userData: {
  email: string;
  role: 'submitter' | 'reviewer' | 'approver' | 'admin';
  name: string;
  password: string;
  isActive?: boolean;
}): Promise<any> {
  const bcrypt = require('bcryptjs');
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  
  const newUser = {
    id: Date.now().toString(),
    email: userData.email,
    name: userData.name,
    role: userData.role,
    isActive: userData.isActive || false,
    createdAt: new Date().toISOString(),
    passwordHash: hashedPassword
  };
  
  localUsers.push(newUser);
  if (typeof window !== 'undefined') {
    localStorage.setItem('datacollect_users', JSON.stringify(localUsers));
  }
  
  return newUser;
}

export async function getUserByEmail(email: string): Promise<any | null> {
  return localUsers.find(user => user.email === email) || null;
}

export async function getAllUsers(): Promise<any[]> {
  return [...localUsers];
}

export async function getUserById(id: string): Promise<any | null> {
  return localUsers.find(user => user.id === id) || null;
}

import { 
  connectToDatabase, 
  getDatabase, 
  executeQuery, 
  closeConnection,
  isMySQLConfigured,
  addRow as mysqlAddRow,
  getRows as mysqlGetRows,
  updateSpecificRow as mysqlUpdateSpecificRow,
  updateRow as mysqlUpdateRow,
  getRowById as mysqlGetRowById,
  getRowsByStatus as mysqlGetRowsByStatus,
  deleteRow as mysqlDeleteRow,
  getRowsByUser as mysqlGetRowsByUser,
  createUser as mysqlCreateUser,
  getUserByEmail as mysqlGetUserByEmail,
  getAllUsers as mysqlGetAllUsers
} from './mysql-database'

import {
  addRow as localAddRow,
  getRows as localGetRows,
  updateSpecificRow as localUpdateSpecificRow,
  updateRow as localUpdateRow,
  getRowById as localGetRowById,
  getRowsByStatus as localGetRowsByStatus,
  deleteRow as localDeleteRow,
  getRowsByUser as localGetRowsByUser,
  clearData as localClearData,
  createUser as localCreateUser,
  getUserByEmail as localGetUserByEmail,
  getAllUsers as localGetAllUsers
} from './local-storage'

// Data types compatible with existing code
export interface DataRow {
  id: string
  section: string
  level: string
  label: string
  value: string
  unit: string
  frequency: string
  period: string
  year: string
  quarter: string
  responsible: string
  disaggregation: string
  notes: string
  status: 'draft' | 'submitted' | 'reviewed' | 'approved' | 'rejected' | 'deleted'
  savedAt: string
  submitterMessage: string
  reviewerMessage: string
  approverMessage: string
  user: string
  assignedReviewer?: string
  assignedApprover?: string
  // User tracking fields
  submittedBy?: string
  reviewedBy?: string
  approvedBy?: string
  rejectedBy?: string
  deletedBy?: string
  restoredBy?: string
  editedBy?: string
  // Timestamp fields for each operation
  submittedAt?: string
  reviewedAt?: string
  approvedAt?: string
  rejectedAt?: string
  deletedAt?: string
  restoredAt?: string
  editedAt?: string
}

// Database operations that match the existing storage interface
export async function addRow(row: DataRow) {
  if (isMySQLConfigured()) {
    return await mysqlAddRow(row);
  }
  return await localAddRow(row);
}

export async function getRows(): Promise<DataRow[]> {
  if (isMySQLConfigured()) {
    return await mysqlGetRows();
  }
  return await localGetRows();
}

// No temporary memory storage - all data goes to MySQL database

export async function updateSpecificRow(id: string, savedAt: string, updates: Partial<DataRow>) {
  if (isMySQLConfigured()) {
    return await mysqlUpdateSpecificRow(id, savedAt, updates);
  }
  return await localUpdateSpecificRow(id, savedAt, updates);
}

export async function updateRow(id: string, updates: Partial<DataRow>) {
  if (isMySQLConfigured()) {
    return await mysqlUpdateRow(id, updates);
  }
  return await localUpdateRow(id, updates);
}

export async function getRowById(id: string): Promise<DataRow | undefined> {
  if (isMySQLConfigured()) {
    return await mysqlGetRowById(id);
  }
  return await localGetRowById(id);
}

export async function getRowsByStatus(status: string): Promise<DataRow[]> {
  if (isMySQLConfigured()) {
    return await mysqlGetRowsByStatus(status);
  }
  return await localGetRowsByStatus(status);
}

export async function deleteRow(id: string, savedAt: string): Promise<boolean> {
  if (isMySQLConfigured()) {
    return await mysqlDeleteRow(id, savedAt);
  }
  return await localDeleteRow(id, savedAt);
}

export async function getRowsByUser(user: string): Promise<DataRow[]> {
  if (isMySQLConfigured()) {
    return await mysqlGetRowsByUser(user);
  }
  return await localGetRowsByUser(user);
}

export async function clearData() {
  try {
    if (isMySQLConfigured()) {
      const query = "DELETE FROM submissions";
      await executeQuery(query);
      console.log("All submissions cleared from MySQL database");
    } else {
      await localClearData();
      console.log("All submissions cleared from local storage");
    }
  } catch (error) {
    console.error("Error clearing data:", error);
  }
}

// No sample data - all data comes from MySQL database
export function forceRefreshSampleData() {
  console.log('✅ All data comes from MySQL database - no sample data needed');
  return [];
}

// User management functions
export async function createUser(userData: {
  email: string;
  role: 'submitter' | 'reviewer' | 'approver' | 'admin';
  fullName: string;
  password?: string;
  isActive?: boolean;
}) {
  if (isMySQLConfigured()) {
    return await mysqlCreateUser(userData);
  }
  return await localCreateUser(userData);
}

export async function getUserByEmail(email: string) {
  if (isMySQLConfigured()) {
    return await mysqlGetUserByEmail(email);
  }
  return await localGetUserByEmail(email);
}

export async function getAllUsers() {
  if (isMySQLConfigured()) {
    return await mysqlGetAllUsers();
  }
  return await localGetAllUsers();
}



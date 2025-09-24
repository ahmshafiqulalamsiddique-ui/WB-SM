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
  if (isMySQLConfigured) {
    return await mysqlAddRow(row);
  }
  throw new Error('MySQL database not configured');
}

export async function getRows(): Promise<DataRow[]> {
  if (isMySQLConfigured) {
    return await mysqlGetRows();
  }
  return [];
}

// No temporary memory storage - all data goes to MySQL database

export async function updateSpecificRow(id: string, savedAt: string, updates: Partial<DataRow>) {
  if (isMySQLConfigured) {
    return await mysqlUpdateSpecificRow(id, savedAt, updates);
  }
  throw new Error('MySQL database not configured');
}

export async function updateRow(id: string, updates: Partial<DataRow>) {
  if (isMySQLConfigured) {
    return await mysqlUpdateRow(id, updates);
  }
  throw new Error('MySQL database not configured');
}

export async function getRowById(id: string): Promise<DataRow | undefined> {
  if (isMySQLConfigured) {
    return await mysqlGetRowById(id);
  }
  return undefined;
}

export async function getRowsByStatus(status: string): Promise<DataRow[]> {
  if (isMySQLConfigured) {
    return await mysqlGetRowsByStatus(status);
  }
  return [];
}

export async function deleteRow(id: string, savedAt: string): Promise<boolean> {
  if (isMySQLConfigured) {
    return await mysqlDeleteRow(id, savedAt);
  }
  return false;
}

export async function getRowsByUser(user: string): Promise<DataRow[]> {
  if (isMySQLConfigured) {
    return await mysqlGetRowsByUser(user);
  }
  return [];
}

export async function clearData() {
  try {
    if (isMySQLConfigured) {
      const query = "DELETE FROM submissions";
      await executeQuery(query);
      console.log("All submissions cleared from MySQL database");
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
}) {
  if (isMySQLConfigured) {
    return await mysqlCreateUser(userData);
  }
  throw new Error('MySQL database not configured');
}

export async function getUserByEmail(email: string) {
  if (isMySQLConfigured) {
    return await mysqlGetUserByEmail(email);
  }
  return null;
}

export async function getAllUsers() {
  if (isMySQLConfigured) {
    return await mysqlGetAllUsers();
  }
  return [];
}



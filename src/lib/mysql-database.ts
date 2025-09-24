import mysql from 'mysql2/promise';

// MySQL configuration
const MYSQL_CONFIG = {
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'taleskillz_db',
  port: parseInt(process.env.MYSQL_PORT || '3306'),
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
};

let pool: mysql.Pool;

// Create MySQL connection pool
export async function connectToDatabase() {
  if (pool) {
    return pool;
  }

  try {
    pool = mysql.createPool(MYSQL_CONFIG);
    console.log('✅ Connected to MySQL database');
    return pool;
  } catch (error) {
    console.error('❌ MySQL connection error:', error);
    throw error;
  }
}

// Get database connection
export async function getDatabase() {
  if (!pool) {
    await connectToDatabase();
  }
  return pool;
}

// Execute query
export async function executeQuery(query: string, params: any[] = []) {
  const connection = await getDatabase();
  try {
    const [rows] = await connection.execute(query, params);
    return rows;
  } catch (error) {
    console.error('❌ Query execution error:', error);
    throw error;
  }
}

// Close connection
export async function closeConnection() {
  if (pool) {
    await pool.end();
    console.log('🔌 MySQL connection closed');
  }
}

// Check if MySQL is configured
// MySQL database configuration
export const isMySQLConfigured = true;

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

// Convert between database and app formats
function dbToApp(dbRow: any): DataRow {
  return {
    id: dbRow.id?.toString() || '',
    section: dbRow.section || '',
    level: dbRow.level || '',
    label: dbRow.label || '',
    value: dbRow.value || '',
    unit: dbRow.unit || '',
    frequency: dbRow.frequency || '',
    period: dbRow.period || '',
    year: dbRow.year || '',
    quarter: dbRow.quarter || '',
    responsible: dbRow.responsible || '',
    disaggregation: dbRow.disaggregation || '',
    notes: dbRow.notes || '',
    status: dbRow.status || 'draft',
    savedAt: dbRow.saved_at || new Date().toISOString(),
    submitterMessage: dbRow.submitter_message || '',
    reviewerMessage: dbRow.reviewer_message || '',
    approverMessage: dbRow.approver_message || '',
    user: dbRow.user_email || '',
    assignedReviewer: dbRow.assigned_reviewer || '',
    assignedApprover: dbRow.assigned_approver || '',
    submittedBy: dbRow.submitted_by || '',
    reviewedBy: dbRow.reviewed_by || '',
    approvedBy: dbRow.approved_by || '',
    rejectedBy: dbRow.rejected_by || '',
    deletedBy: dbRow.deleted_by || '',
    restoredBy: dbRow.restored_by || '',
    editedBy: dbRow.edited_by || '',
    submittedAt: dbRow.submitted_at || '',
    reviewedAt: dbRow.reviewed_at || '',
    approvedAt: dbRow.approved_at || '',
    rejectedAt: dbRow.rejected_at || '',
    deletedAt: dbRow.deleted_at || '',
    restoredAt: dbRow.restored_at || '',
    editedAt: dbRow.edited_at || ''
  };
}

function appToDb(appRow: DataRow): any {
  return {
    id: appRow.id,
    section: appRow.section,
    level: appRow.level,
    label: appRow.label,
    value: appRow.value,
    unit: appRow.unit,
    frequency: appRow.frequency,
    period: appRow.period,
    year: appRow.year,
    quarter: appRow.quarter,
    responsible: appRow.responsible,
    disaggregation: appRow.disaggregation,
    notes: appRow.notes,
    status: appRow.status,
    saved_at: appRow.savedAt,
    submitter_message: appRow.submitterMessage,
    reviewer_message: appRow.reviewerMessage,
    approver_message: appRow.approverMessage,
    user_email: appRow.user,
    assigned_reviewer: appRow.assignedReviewer,
    assigned_approver: appRow.assignedApprover,
    submitted_by: appRow.submittedBy,
    reviewed_by: appRow.reviewedBy,
    approved_by: appRow.approvedBy,
    rejected_by: appRow.rejectedBy,
    deleted_by: appRow.deletedBy,
    restored_by: appRow.restoredBy,
    edited_by: appRow.editedBy,
    submitted_at: appRow.submittedAt,
    reviewed_at: appRow.reviewedAt,
    approved_at: appRow.approvedAt,
    rejected_at: appRow.rejectedAt,
    deleted_at: appRow.deletedAt,
    restored_at: appRow.restoredAt,
    edited_at: appRow.editedAt
  };
}

// Database operations that match the existing storage interface
export async function addRow(row: DataRow) {
  console.log("Adding row to MySQL database:", row);
  const dbRow = appToDb(row);
  
  // Check if record already exists
  const existingRecord = await getRowById(row.id);
  if (existingRecord) {
    console.log("Record already exists, updating instead:", row.id);
    // Update the existing record instead of inserting
    const updates: Partial<DataRow> = {
      status: row.status,
      savedAt: row.savedAt,
      submitterMessage: row.submitterMessage,
      reviewerMessage: row.reviewerMessage,
      approverMessage: row.approverMessage,
      value: row.value,
      unit: row.unit,
      frequency: row.frequency,
      period: row.period,
      year: row.year,
      quarter: row.quarter,
      responsible: row.responsible,
      disaggregation: row.disaggregation,
      notes: row.notes,
      editedBy: row.user,
      editedAt: new Date().toISOString()
    };
    
    return await updateSpecificRow(row.id, existingRecord.savedAt, updates);
  }
  
  // Use a simpler INSERT query with only essential fields
  const query = `
    INSERT INTO submissions (
      id, section, level, label, value, unit, frequency, period, year, quarter,
      responsible, disaggregation, notes, status, saved_at, submitter_message,
      reviewer_message, approver_message, user_email
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  const params = [
    dbRow.id, dbRow.section, dbRow.level, dbRow.label, dbRow.value, dbRow.unit,
    dbRow.frequency, dbRow.period, dbRow.year, dbRow.quarter, dbRow.responsible,
    dbRow.disaggregation, dbRow.notes, dbRow.status, dbRow.saved_at,
    dbRow.submitter_message, dbRow.reviewer_message, dbRow.approver_message,
    dbRow.user_email
  ];
  
  const result = await executeQuery(query, params);
  console.log("Added row to MySQL database:", row.id);
  return { id: row.id, ...row };
}

export async function getRows(): Promise<DataRow[]> {
  console.log("Fetching rows from MySQL database");
  const query = "SELECT * FROM submissions ORDER BY created_at DESC";
  const dbRows = await executeQuery(query) as any[];
  const appRows = dbRows.map(dbToApp);
  console.log("Retrieved rows from MySQL database:", appRows.length);
  return appRows;
}

export async function updateSpecificRow(id: string, savedAt: string, updates: Partial<DataRow>) {
  try {
    console.log("Updating specific row in MySQL database:", id, savedAt, updates);
    
    const updateFields = [];
    const params = [];
    
    if (updates.status) {
      updateFields.push('status = ?');
      params.push(updates.status);
    }
    if (updates.submitterMessage) {
      updateFields.push('submitter_message = ?');
      params.push(updates.submitterMessage);
    }
    if (updates.reviewerMessage) {
      updateFields.push('reviewer_message = ?');
      params.push(updates.reviewerMessage);
    }
    if (updates.approverMessage) {
      updateFields.push('approver_message = ?');
      params.push(updates.approverMessage);
    }
    if (updates.savedAt) {
      updateFields.push('saved_at = ?');
      params.push(updates.savedAt);
    }
    if (updates.value) {
      updateFields.push('value = ?');
      params.push(updates.value);
    }
    if (updates.unit) {
      updateFields.push('unit = ?');
      params.push(updates.unit);
    }
    if (updates.frequency) {
      updateFields.push('frequency = ?');
      params.push(updates.frequency);
    }
    if (updates.responsible) {
      updateFields.push('responsible = ?');
      params.push(updates.responsible);
    }
    if (updates.disaggregation) {
      updateFields.push('disaggregation = ?');
      params.push(updates.disaggregation);
    }
    if (updates.notes) {
      updateFields.push('notes = ?');
      params.push(updates.notes);
    }
    if (updates.editedBy) {
      updateFields.push('edited_by = ?');
      params.push(updates.editedBy);
    }
    if (updates.editedAt) {
      updateFields.push('edited_at = ?');
      params.push(updates.editedAt);
    }
    if (updates.submittedBy) {
      updateFields.push('submitted_by = ?');
      params.push(updates.submittedBy);
    }
    if (updates.submittedAt) {
      updateFields.push('submitted_at = ?');
      params.push(updates.submittedAt);
    }
    if (updates.reviewedBy) {
      updateFields.push('reviewed_by = ?');
      params.push(updates.reviewedBy);
    }
    if (updates.reviewedAt) {
      updateFields.push('reviewed_at = ?');
      params.push(updates.reviewedAt);
    }
    if (updates.approvedBy) {
      updateFields.push('approved_by = ?');
      params.push(updates.approvedBy);
    }
    if (updates.approvedAt) {
      updateFields.push('approved_at = ?');
      params.push(updates.approvedAt);
    }
    if (updates.rejectedBy) {
      updateFields.push('rejected_by = ?');
      params.push(updates.rejectedBy);
    }
    if (updates.rejectedAt) {
      updateFields.push('rejected_at = ?');
      params.push(updates.rejectedAt);
    }
    
    if (updateFields.length === 0) {
      console.log("No fields to update");
      return null;
    }
    
    updateFields.push('updated_at = NOW()');
    params.push(id, savedAt);
    
    const query = `UPDATE submissions SET ${updateFields.join(', ')} WHERE id = ? AND saved_at = ?`;
    await executeQuery(query, params);
    
    console.log("MySQL update successful");
    return { id, savedAt, ...updates };
  } catch (error) {
    console.error("MySQL error updating specific row:", error);
    throw error;
  }
}

export async function updateRow(id: string, updates: Partial<DataRow>) {
  try {
    console.log("Updating row in MySQL database:", id, updates);
    
    const updateFields = [];
    const params = [];
    
    if (updates.status) {
      updateFields.push('status = ?');
      params.push(updates.status);
    }
    if (updates.reviewerMessage) {
      updateFields.push('reviewer_message = ?');
      params.push(updates.reviewerMessage);
    }
    if (updates.approverMessage) {
      updateFields.push('approver_message = ?');
      params.push(updates.approverMessage);
    }
    if (updates.value) {
      updateFields.push('value = ?');
      params.push(updates.value);
    }
    if (updates.unit) {
      updateFields.push('unit = ?');
      params.push(updates.unit);
    }
    if (updates.frequency) {
      updateFields.push('frequency = ?');
      params.push(updates.frequency);
    }
    if (updates.responsible) {
      updateFields.push('responsible = ?');
      params.push(updates.responsible);
    }
    if (updates.disaggregation) {
      updateFields.push('disaggregation = ?');
      params.push(updates.disaggregation);
    }
    if (updates.notes) {
      updateFields.push('notes = ?');
      params.push(updates.notes);
    }
    if (updates.savedAt) {
      updateFields.push('saved_at = ?');
      params.push(updates.savedAt);
    }
    if (updates.deletedBy) {
      updateFields.push('deleted_by = ?');
      params.push(updates.deletedBy);
    }
    if (updates.deletedAt) {
      updateFields.push('deleted_at = ?');
      params.push(updates.deletedAt);
    }
    if (updates.submittedBy) {
      updateFields.push('submitted_by = ?');
      params.push(updates.submittedBy);
    }
    if (updates.submittedAt) {
      updateFields.push('submitted_at = ?');
      params.push(updates.submittedAt);
    }
    if (updates.editedBy) {
      updateFields.push('edited_by = ?');
      params.push(updates.editedBy);
    }
    if (updates.editedAt) {
      updateFields.push('edited_at = ?');
      params.push(updates.editedAt);
    }
    if (updates.restoredBy) {
      updateFields.push('restored_by = ?');
      params.push(updates.restoredBy);
    }
    if (updates.restoredAt) {
      updateFields.push('restored_at = ?');
      params.push(updates.restoredAt);
    }
    
    if (updateFields.length === 0) {
      console.log("No fields to update");
      return null;
    }
    
    updateFields.push('updated_at = NOW()');
    params.push(id);
    
    const query = `UPDATE submissions SET ${updateFields.join(', ')} WHERE id = ?`;
    await executeQuery(query, params);
    
    console.log("Updated row in MySQL database:", id, "to status:", updates.status);
    return { id, ...updates };
  } catch (error) {
    console.error("MySQL error updating row:", error);
    throw error;
  }
}

export async function getRowById(id: string): Promise<DataRow | undefined> {
  try {
    const query = "SELECT * FROM submissions WHERE id = ? ORDER BY created_at DESC LIMIT 1";
    const rows = await executeQuery(query, [id]) as any[];
    
    if (rows.length > 0) {
      return dbToApp(rows[0]);
    }
    
    return undefined;
  } catch (error) {
    console.error("MySQL error getting row by ID:", error);
    return undefined;
  }
}

export async function getRowsByStatus(status: string): Promise<DataRow[]> {
  try {
    const query = "SELECT * FROM submissions WHERE status = ? ORDER BY created_at DESC";
    const dbRows = await executeQuery(query, [status]) as any[];
    return dbRows.map(dbToApp);
  } catch (error) {
    console.error("MySQL error getting rows by status:", error);
    return [];
  }
}

export async function deleteRow(id: string, savedAt: string): Promise<boolean> {
  try {
    console.log(`Deleting row: ${id} saved at ${savedAt}`);
    const query = "DELETE FROM submissions WHERE id = ? AND saved_at = ?";
    await executeQuery(query, [id, savedAt]);
    console.log(`Successfully deleted row: ${id}`);
    return true;
  } catch (error) {
    console.error("MySQL error deleting row:", error);
    return false;
  }
}

export async function getRowsByUser(user: string): Promise<DataRow[]> {
  try {
    const query = "SELECT * FROM submissions WHERE user_email = ? ORDER BY created_at DESC";
    const dbRows = await executeQuery(query, [user]) as any[];
    return dbRows.map(dbToApp);
  } catch (error) {
    console.error("MySQL error getting rows by user:", error);
    return [];
  }
}

export async function clearData() {
  console.log("Clear data not implemented for MySQL - use admin panel");
}

// User management functions
export async function createUser(userData: {
  email: string;
  role: 'submitter' | 'reviewer' | 'approver' | 'admin';
  fullName: string;
}) {
  try {
    const query = `
      INSERT INTO users (email, password, name, role, status) 
      VALUES (?, ?, ?, ?, ?)
    `;
    const params = [userData.email, '', userData.fullName, userData.role, 'pending'];
    await executeQuery(query, params);
    
    console.log("Created user:", userData.email);
    return { email: userData.email, role: userData.role, name: userData.fullName };
  } catch (error) {
    console.error("MySQL error creating user:", error);
    throw error;
  }
}

export async function getUserByEmail(email: string) {
  try {
    const query = "SELECT * FROM users WHERE email = ?";
    const rows = await executeQuery(query, [email]) as any[];
    
    if (rows.length > 0) {
      return {
        id: rows[0].id,
        email: rows[0].email,
        password: rows[0].password,
        name: rows[0].name,
        role: rows[0].role,
        status: rows[0].status
      };
    }
    
    return null;
  } catch (error) {
    console.error("MySQL error getting user:", error);
    return null;
  }
}

export async function getAllUsers() {
  try {
    const query = "SELECT * FROM users ORDER BY created_at DESC";
    const rows = await executeQuery(query) as any[];
    return rows.map(row => ({
      id: row.id,
      email: row.email,
      password: row.password,
      name: row.name,
      role: row.role,
      status: row.status,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));
  } catch (error) {
    console.error("MySQL error getting users:", error);
    return [];
  }
}

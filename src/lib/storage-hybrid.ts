// Hybrid storage system - uses MySQL database when available, localStorage as fallback
import * as DatabaseStorage from './database'
import * as MemoryStorage from './storage'

// Check if MySQL is configured
const isDatabaseAvailable = () => {
  return !!(
    process.env.MYSQL_HOST && 
    process.env.MYSQL_USER && 
    process.env.MYSQL_DATABASE
  )
}

// Log storage mode
const storageMode = isDatabaseAvailable() ? 'MYSQL' : 'MEMORY';
console.log(`🗄️ Storage Mode: ${storageMode}`);

// Export the appropriate storage functions
export const addRow = isDatabaseAvailable() 
  ? DatabaseStorage.addRow 
  : MemoryStorage.addRow

export const getRows = isDatabaseAvailable() 
  ? DatabaseStorage.getRows 
  : MemoryStorage.getRows

export const updateRow = isDatabaseAvailable() 
  ? DatabaseStorage.updateRow 
  : MemoryStorage.updateRow

export const getRowById = isDatabaseAvailable() 
  ? DatabaseStorage.getRowById 
  : MemoryStorage.getRowById

export const getRowsByStatus = isDatabaseAvailable() 
  ? DatabaseStorage.getRowsByStatus 
  : MemoryStorage.getRowsByStatus

export const deleteRow = isDatabaseAvailable() 
  ? DatabaseStorage.deleteRow 
  : MemoryStorage.deleteRow

export const getRowsByUser = isDatabaseAvailable() 
  ? DatabaseStorage.getRowsByUser 
  : MemoryStorage.getRowsByUser

export const clearData = isDatabaseAvailable() 
  ? DatabaseStorage.clearData 
  : MemoryStorage.clearData

// Database-only functions (graceful fallback)
export const createUser = isDatabaseAvailable() 
  ? DatabaseStorage.createUser 
  : async () => { throw new Error('Database required for user management') }

export const getUserByEmail = isDatabaseAvailable() 
  ? DatabaseStorage.getUserByEmail 
  : async () => null

export const getAllUsers = isDatabaseAvailable() 
  ? DatabaseStorage.getAllUsers 
  : async () => []

// Re-export types
export type { DataRow } from './database'





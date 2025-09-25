import { User, Role } from "./session";
import { getUserByEmail as mysqlGetUserByEmail, getAllUsers as mysqlGetAllUsers, createUser as mysqlCreateUser, executeQuery, isMySQLConfigured } from "./mysql-database";
import { getUserByEmail as localGetUserByEmail, getAllUsers as localGetAllUsers, createUser as localCreateUser } from "./local-storage";

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: Role;
  department?: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
  passwordHash: string;
  deletedAt?: string; // Added for soft delete
}

// Convert database user to UserProfile format
function dbUserToProfile(dbUser: any, passwordHash?: string): UserProfile {
  return {
    id: dbUser.id?.toString() || '',
    email: dbUser.email,
    name: dbUser.name,
    role: dbUser.role,
    isActive: dbUser.status === 'active',
    createdAt: dbUser.created_at || new Date().toISOString(),
    passwordHash: passwordHash || dbUser.password || '',
    deletedAt: dbUser.deleted_at || undefined, // Map deleted_at
  };
}

// Convert UserProfile to database user format
function profileToDbUser(profile: Omit<UserProfile, 'id' | 'createdAt' | 'passwordHash'>): any {
  return {
    email: profile.email,
    role: profile.role,
    name: profile.name,
    status: profile.isActive ? 'active' : 'inactive',
  };
}

export interface UserStats {
  totalUsers: number;
  submitters: number;
  reviewers: number;
  approvers: number;
  activeUsers: number;
}

// Password hashing is handled directly with bcryptjs

export async function getAllUsers(): Promise<UserProfile[]> {
  try {
    if (isMySQLConfigured()) {
      // Get only non-deleted users
      const query = "SELECT * FROM users WHERE deleted_at IS NULL ORDER BY created_at DESC";
      const rows = await executeQuery(query) as any[];
      return rows.map(user => dbUserToProfile(user));
    } else {
      const localUsers = await localGetAllUsers();
      return localUsers.map(user => ({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        passwordHash: user.passwordHash
      }));
    }
  } catch (error) {
    console.error('Error getting users:', error);
    return [];
  }
}

export async function getUserByEmail(email: string): Promise<UserProfile | undefined> {
  try {
    if (isMySQLConfigured()) {
      // Get only non-deleted users
      const query = "SELECT * FROM users WHERE email = ? AND deleted_at IS NULL";
      const rows = await executeQuery(query, [email]) as any[];
      
      if (rows.length > 0) {
        return dbUserToProfile(rows[0]);
      }
      
      return undefined;
    } else {
      const localUser = await localGetUserByEmail(email);
      if (localUser) {
        return {
          id: localUser.id,
          email: localUser.email,
          name: localUser.name,
          role: localUser.role,
          isActive: localUser.isActive,
          createdAt: localUser.createdAt,
          passwordHash: localUser.passwordHash
        };
      }
      return undefined;
    }
  } catch (error) {
    console.error('Error fetching user by email:', error);
    return undefined;
  }
}

export async function getUserById(id: string): Promise<UserProfile | undefined> {
  try {
    console.log('🔍 getUserById called with ID:', id, typeof id);
    
    // Get only non-deleted users
    const query = "SELECT * FROM users WHERE id = ? AND deleted_at IS NULL";
    const rows = await executeQuery(query, [id]) as any[];
    
    console.log('🔍 Database query result:', rows.length, 'rows');
    
    if (rows.length > 0) {
      const user = dbUserToProfile(rows[0]);
      console.log('🔍 Returning user:', user);
      return user;
    }
    
    console.log('🔍 No user found with ID:', id);
    return undefined;
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    return undefined;
  }
}

export async function createUser(userData: Omit<UserProfile, 'id' | 'createdAt' | 'passwordHash'> & { password: string }): Promise<UserProfile> {
  try {
    if (isMySQLConfigured()) {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      const query = `
        INSERT INTO users (email, password, name, role, status) 
        VALUES (?, ?, ?, ?, ?)
      `;
      const params = [
        userData.email,
        hashedPassword,
        userData.name,
        userData.role,
        userData.role === 'admin' ? 'active' : 'pending'
      ];
      
      const result = await executeQuery(query, params) as any;
      
      return {
        id: result.insertId?.toString() || Date.now().toString(),
        email: userData.email,
        name: userData.name,
        role: userData.role,
        isActive: userData.role === 'admin',
        createdAt: new Date().toISOString(),
        passwordHash: hashedPassword
      };
    } else {
      const localUser = await localCreateUser({
        email: userData.email,
        name: userData.name,
        role: userData.role,
        password: userData.password,
        isActive: userData.role === 'admin'
      });
      
      return {
        id: localUser.id,
        email: localUser.email,
        name: localUser.name,
        role: localUser.role,
        isActive: localUser.isActive,
        createdAt: localUser.createdAt,
        passwordHash: localUser.passwordHash
      };
    }
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

export async function updateUser(id: string, updates: Partial<UserProfile>): Promise<UserProfile | null> {
  try {
    console.log('🔄 updateUser called:', { id, updates, idType: typeof id });
    
    const updateFields = [];
    const params = [];
    
    if (updates.name) {
      updateFields.push('name = ?');
      params.push(updates.name);
    }
    if (updates.role) {
      updateFields.push('role = ?');
      params.push(updates.role);
    }
    if (updates.isActive !== undefined) {
      updateFields.push('status = ?');
      params.push(updates.isActive ? 'active' : 'inactive');
      console.log('📝 Status update:', { isActive: updates.isActive, status: updates.isActive ? 'active' : 'inactive' });
    }
    
    if (updateFields.length === 0) {
      console.log('❌ No fields to update');
      return null;
    }
    
    updateFields.push('updated_at = NOW()');
    params.push(id);
    
    const query = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`;
    console.log('📝 Executing query:', query, params);
    const result = await executeQuery(query, params);
    console.log('📝 Query result:', result);
    
    // Get updated user
    console.log('🔍 Fetching updated user...');
    const updatedUser = await getUserById(id);
    console.log('✅ Updated user:', updatedUser);
    return updatedUser || null;
  } catch (error) {
    console.error('❌ Error updating user:', error);
    return null;
  }
}

export async function deactivateUser(id: string): Promise<boolean> {
  try {
    const query = "UPDATE users SET status = 'inactive', updated_at = NOW() WHERE id = ?";
    await executeQuery(query, [id]);
    return true;
  } catch (error) {
    console.error('Error deactivating user:', error);
    return false;
  }
}

export async function getUserStats(): Promise<UserStats> {
  try {
    const activeUsers = await getAllUsers();
    return {
      totalUsers: activeUsers.length,
      submitters: activeUsers.filter(user => user.role === "submitter").length,
      reviewers: activeUsers.filter(user => user.role === "reviewer").length,
      approvers: activeUsers.filter(user => user.role === "approver").length,
      activeUsers: activeUsers.length,
    };
  } catch (error) {
    console.error('Error getting user stats:', error);
    return { totalUsers: 0, submitters: 0, reviewers: 0, approvers: 0, activeUsers: 0 };
  }
}

export async function getUsersByRole(role: Role): Promise<UserProfile[]> {
  try {
    const query = "SELECT * FROM users WHERE role = ? AND status = 'active'";
    const rows = await executeQuery(query, [role]) as any[];
    return rows.map(user => dbUserToProfile(user));
  } catch (error) {
    console.error('Error fetching users by role:', error);
    return [];
  }
}

export async function validateUserCredentials(email: string, password: string): Promise<UserProfile | null> {
  try {
    console.log(`🔍 Attempting login for: ${email}`);
    
    // Check if MySQL is configured
    const isMySQLConfigured = 
      process.env.MYSQL_HOST && 
      process.env.MYSQL_USER && 
      process.env.MYSQL_DATABASE;

    let user: UserProfile | undefined;

    if (isMySQLConfigured) {
      console.log('🗄️ Using MySQL database for authentication');
      const dbUser = await mysqlGetUserByEmail(email);
      if (dbUser) {
        user = dbUserToProfile(dbUser);
      }
    } else {
      console.log('❌ MySQL not configured - cannot authenticate');
      return null;
    }
    
    if (!user) {
      console.log(`❌ User not found: ${email}`);
      return null;
    }
    
    // Check user status - only active users can login
    if (user.isActive === false) {
      console.log(`❌ User not active: ${email}`);
      return null;
    }
    
    // Verify password
    const bcrypt = require('bcryptjs');
    const passwordValid = await bcrypt.compare(password, user.passwordHash);
    if (!passwordValid) {
      console.log(`❌ Invalid password for: ${email}`);
      return null;
    }
    
    console.log(`✅ Login successful for: ${email}`);
    
    // Update last login (skip if update fails)
    try {
      if (isMySQLConfigured) {
        const query = "UPDATE users SET updated_at = NOW() WHERE email = ?";
        await executeQuery(query, [email]);
      }
    } catch (updateError) {
      console.log('Could not update last login, continuing anyway');
    }
    
    return user;
  } catch (error) {
    console.error('Error validating credentials:', error);
    return null;
  }
}

export async function canAddUser(role: Role, excludeUserId?: string): Promise<boolean> {
  try {
    const stats = await getUserStats();
    
    // Check role limits
    if (role === "reviewer" && stats.reviewers >= 3) return false;
    if (role === "approver" && stats.approvers >= 3) return false;
    
    return true;
  } catch (error) {
    console.error('Error checking user limits:', error);
    return false;
  }
}

export async function getAvailableRoles(): Promise<{ role: Role; available: boolean; current: number; max?: number }[]> {
  try {
    const stats = await getUserStats();
    
    return [
      { role: "submitter", available: true, current: stats.submitters },
      { role: "reviewer", available: stats.reviewers < 3, current: stats.reviewers, max: 3 },
      { role: "approver", available: stats.approvers < 3, current: stats.approvers, max: 3 },
      { role: "admin", available: false, current: 1, max: 1 }, // Only one admin
    ];
  } catch (error) {
    console.error('Error getting available roles:', error);
    return [];
  }
}

// User registration (for submitters only)
export async function registerUser(userData: {
  name: string;
  email: string;
  password: string;
  department?: string;
  phone?: string;
}): Promise<{ success: boolean; message: string; user?: UserProfile }> {
  try {
    // Check if email already exists
    const existingUser = await getUserByEmail(userData.email);
    if (existingUser) {
      return { success: false, message: "Email already registered" };
    }

    // Create new submitter user with pending status
    const newUser = await createUser({
      ...userData,
      role: "submitter",
      isActive: false, // User needs admin approval
    });

    return { 
      success: true, 
      message: "Registration successful. Your account is pending approval.", 
      user: newUser 
    };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, message: "Registration failed. Please try again." };
  }
}

// Change user role (admin only)
export async function changeUserRole(userId: string, newRole: Role): Promise<{ success: boolean; message: string }> {
  try {
    console.log('🔄 changeUserRole called:', { userId, newRole });
    
    const user = await getUserById(userId);
    if (!user) {
      console.log('❌ User not found:', userId);
      return { success: false, message: "User not found" };
    }

    console.log('👤 Current user:', { id: user.id, email: user.email, currentRole: user.role, newRole });

    // Check if trying to change to admin (only one admin allowed)
    if (newRole === "admin") {
      const allUsers = await getAllUsers();
      const adminCount = allUsers.filter(u => u.role === "admin" && u.isActive).length;
      console.log('👑 Admin count check:', adminCount);
      if (adminCount >= 1) {
        return { success: false, message: "Only one admin user is allowed" };
      }
    }

    // Check role limits (only if changing to a different role)
    if (user.role !== newRole) {
      console.log('🔍 Checking role limits for:', newRole);
      const canAdd = await canAddUser(newRole, userId);
      console.log('✅ Can add user to role:', canAdd);
      if (!canAdd) {
        return { success: false, message: `Cannot change to ${newRole}. Limit reached.` };
      }
    }

    // Update user role
    console.log('🔄 Updating user role...');
    const updated = await updateUser(userId, { role: newRole });
    if (!updated) {
      console.log('❌ Failed to update user');
      return { success: false, message: "Failed to update user role" };
    }

    console.log('✅ User role changed successfully');
    return { success: true, message: `User role changed to ${newRole}` };
  } catch (error) {
    console.error('❌ Error changing user role:', error);
    return { success: false, message: "Failed to update user role" };
  }
}

// Check if user can manage roles
export function canManageRoles(user: UserProfile | null): boolean {
  return user?.role === "admin";
}

// Get users that can be promoted/demoted
export async function getManageableUsers(): Promise<UserProfile[]> {
  try {
    const allUsers = await getAllUsers();
    return allUsers.filter(user => user.isActive && user.role !== "admin");
  } catch (error) {
    console.error('Error getting manageable users:', error);
    return [];
  }
}

// Get pending users (for admin approval)
export async function getPendingUsers(): Promise<UserProfile[]> {
  try {
    const query = "SELECT * FROM users WHERE status = 'pending' AND deleted_at IS NULL ORDER BY created_at DESC";
    const rows = await executeQuery(query) as any[];
    
    const pendingUsers = rows.map(user => ({
      id: user.id?.toString() || '',
      email: user.email,
      name: user.name,
      role: user.role,
      isActive: user.status === 'active',
      createdAt: user.created_at || new Date().toISOString(),
      passwordHash: ''
    }));
    
    console.log('✅ Found pending users from MySQL:', pendingUsers.length);
    return pendingUsers;
  } catch (error) {
    console.error('❌ Error getting pending users:', error);
    return [];
  }
}

// Approve user
export async function approveUser(userId: string): Promise<{ success: boolean; message: string }> {
  try {
    console.log('🚀 approveUser function called with ID:', userId);
    
    const query = "UPDATE users SET status = 'active', updated_at = NOW() WHERE id = ?";
    await executeQuery(query, [userId]);
    
    console.log('✅ User approval successful in MySQL');
    return { success: true, message: "User approved successfully" };
  } catch (error) {
    console.error('❌ Error approving user:', error);
    return { success: false, message: "Failed to approve user" };
  }
}

// Reject user
export async function rejectUser(userId: string): Promise<{ success: boolean; message: string }> {
  try {
    console.log('🚫 rejectUser function called with ID:', userId);
    
    const query = "UPDATE users SET status = 'rejected', updated_at = NOW() WHERE id = ?";
    await executeQuery(query, [userId]);
    
    console.log('✅ User rejection successful in MySQL');
    return { success: true, message: "User rejected successfully" };
  } catch (error) {
    console.error('❌ Error rejecting user:', error);
    return { success: false, message: "Failed to reject user" };
  }
}

// Reactivate user
export async function reactivateUser(userId: string): Promise<{ success: boolean; message: string }> {
  try {
    console.log('🔄 reactivateUser function called with ID:', userId);
    
    const query = "UPDATE users SET status = 'active', updated_at = NOW() WHERE id = ?";
    await executeQuery(query, [userId]);
    
    console.log('✅ User reactivation successful in MySQL');
    return { success: true, message: "User reactivated successfully" };
  } catch (error) {
    console.error('❌ Error reactivating user:', error);
    return { success: false, message: "Failed to reactivate user" };
  }
}

// Soft delete user (set deleted_at timestamp)
export async function deleteUser(userId: string): Promise<{ success: boolean; message: string }> {
  try {
    console.log('🗑️ Soft delete user function called with ID:', userId);
    
    const query = "UPDATE users SET deleted_at = NOW(), updated_at = NOW() WHERE id = ?";
    await executeQuery(query, [userId]);
    
    console.log('🗑️ User soft deletion successful in MySQL');
    return { success: true, message: "User deleted successfully (can be recovered)" };
  } catch (error) {
    console.error('🗑️ Error soft deleting user:', error);
    return { success: false, message: "Failed to delete user" };
  }
}

// Recover soft-deleted user
export async function recoverUser(userId: string): Promise<{ success: boolean; message: string }> {
  try {
    console.log('🔄 recoverUser function called with ID:', userId);
    
    const query = "UPDATE users SET deleted_at = NULL, updated_at = NOW() WHERE id = ?";
    await executeQuery(query, [userId]);
    
    console.log('🔄 User recovery successful in MySQL');
    return { success: true, message: "User recovered successfully" };
  } catch (error) {
    console.error('🔄 Error recovering user:', error);
    return { success: false, message: "Failed to recover user" };
  }
}

// Get soft-deleted users
export async function getDeletedUsers(): Promise<UserProfile[]> {
  try {
    const query = "SELECT * FROM users WHERE deleted_at IS NOT NULL ORDER BY deleted_at DESC";
    const rows = await executeQuery(query) as any[];
    
    const deletedUsers = rows.map(user => ({
      id: user.id?.toString() || '',
      email: user.email,
      name: user.name,
      role: user.role,
      isActive: user.status === 'active',
      createdAt: user.created_at || new Date().toISOString(),
      passwordHash: '',
      deletedAt: user.deleted_at
    }));
    
    console.log('✅ Found deleted users from MySQL:', deletedUsers.length);
    return deletedUsers;
  } catch (error) {
    console.error('❌ Error getting deleted users:', error);
    return [];
  }
}

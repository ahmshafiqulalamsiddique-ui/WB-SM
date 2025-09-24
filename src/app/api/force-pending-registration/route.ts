import { NextRequest, NextResponse } from "next/server";
import { createUser, getUserByEmail } from '@/lib/users';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  organization: z.string().optional(),
  phone: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, fullName, organization, phone } = registerSchema.parse(body)

    // Always create user as PENDING - no exceptions
    console.log('🚀 FORCE PENDING REGISTRATION for:', email)

    // Check if user already exists
    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Create user in database with pending status (ALWAYS PENDING)
    const newUser = await createUser({
      email,
      role: 'submitter',
      name: fullName,
      password,
      isActive: false // ALWAYS FALSE
    })
    
    console.log('✅ User created as PENDING:', email)
    
    return NextResponse.json({
      success: true,
      message: 'Registration submitted successfully! Your account is pending admin approval. You will receive an email once approved.',
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        isActive: false, // Always false
        createdAt: newUser.createdAt
      }
    })

  } catch (error) {
    console.error('Force pending registration error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
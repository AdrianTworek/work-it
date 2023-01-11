import { MockContext, Context, createMockContext } from '../../../context'
import { RoleEnum } from '../../../types/role'

let mockCtx: MockContext
let ctx: Context
let date: Date

beforeEach(() => {
  mockCtx = createMockContext()
  ctx = mockCtx as unknown as Context
  date = new Date()
})

interface CreateUser {
  name: string
  email: string
  password: string
}

export async function createUser(user: CreateUser, ctx: Context) {
  if (!user.name || !user.email || !user.password) {
    return new Error('User must provide email, name and password')
  }

  if (user.password.length < 8) {
    return new Error('Password must contain at least 8 characters')
  }

  return await ctx.prisma.user.create({
    data: user,
  })
}

test('should create new user ', async () => {
  const user = {
    id: '6720e753-d123-4986-850a-694789310727',
    name: 'Test',
    email: 'test@test.com',
    password: 'test1234',
    role: RoleEnum.CANDIDATE,
    photo: '',
    createdAt: date,
    updatedAt: date,
  }
  mockCtx.prisma.user.create.mockResolvedValue(user)

  await expect(createUser(user, ctx)).resolves.toEqual({
    id: '6720e753-d123-4986-850a-694789310727',
    name: 'Test',
    email: 'test@test.com',
    password: 'test1234',
    role: RoleEnum.CANDIDATE,
    photo: '',
    createdAt: date,
    updatedAt: date,
  })
})

test('should fail without providing name, email and password', async () => {
  const user = {
    id: '6720e753-d123-4986-850a-694789310727',
    name: '',
    email: '',
    password: '',
    role: RoleEnum.CANDIDATE,
    photo: '',
    createdAt: date,
    updatedAt: date,
  }
  mockCtx.prisma.user.create.mockResolvedValue(user)

  await expect(createUser(user, ctx)).resolves.toThrowError()
})

test('should fail when providing duplicate email', async () => {
  const userOne = {
    id: '6720e753-d123-4986-850a-694789310727',
    name: 'Test 1',
    email: 'test@test.com',
    password: 'test1234',
    role: RoleEnum.CANDIDATE,
    photo: '',
    createdAt: date,
    updatedAt: date,
  }
  const userTwo = {
    id: '6720e753-d123-4986-850a-694789310728',
    name: 'Test 2',
    email: 'test@test.com',
    password: 'test1234',
    role: RoleEnum.CANDIDATE,
    photo: '',
    createdAt: date,
    updatedAt: date,
  }

  mockCtx.prisma.user.create.mockResolvedValue(userOne)

  await expect(createUser(userOne, ctx)).resolves.toEqual({
    id: '6720e753-d123-4986-850a-694789310727',
    name: 'Test 1',
    email: 'test@test.com',
    password: 'test1234',
    role: RoleEnum.CANDIDATE,
    photo: '',
    createdAt: date,
    updatedAt: date,
  })

  mockCtx.prisma.user.create.mockResolvedValue(userTwo)

  await expect(createUser(userTwo, ctx)).resolves.not.toEqual({
    id: '6720e753-d123-4986-850a-694789310727',
    name: 'Test 1',
    email: 'test@test.com',
    password: 'test1234',
    role: RoleEnum.CANDIDATE,
    photo: '',
    createdAt: date,
    updatedAt: date,
  })
})

test('should fail when providing password shorter than 8 characters', async () => {
  const user = {
    id: '6720e753-d123-4986-850a-694789310727',
    name: 'Test 1',
    email: 'test@test.com',
    password: 'test123',
    role: RoleEnum.CANDIDATE,
    photo: '',
    createdAt: date,
    updatedAt: date,
  }
  mockCtx.prisma.user.create.mockResolvedValue(user)

  await expect(createUser(user, ctx)).resolves.toThrowError()
})

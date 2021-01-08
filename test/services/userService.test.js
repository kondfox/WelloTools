import { userService } from '../../src/services'
import * as mockFactory from '../mockFactory'
import * as testConstants from '../testConstants'

let mockUserRepository
let mockValidatationService
let mockEncoder
let register

beforeEach(() => {
  mockUserRepository = mockFactory.createMockUserRepository()
  mockValidatationService = mockFactory.createMockValidationService()
  mockEncoder = mockFactory.createMockEncoder()
  register = userService(
    mockUserRepository,
    mockValidatationService,
    mockEncoder
  ).register
})

describe('userService', () => {
  describe('register', () => {
    it('should resolve with saved user id when valid user input is given', async () => {
      mockUserRepository.save = jest.fn(() =>
        Promise.resolve(testConstants.exampleUserId)
      )

      const userId = await register(testConstants.validUserInput)

      expect(userId).toBe(testConstants.exampleUserId)
    })

    it('should save user with encoded password when valid user input is given', async () => {
      mockUserRepository.save = jest.fn(() =>
        Promise.resolve(testConstants.exampleUserId)
      )
      const expectedUserToSave = {
        ...testConstants.validUserInput,
        password: await mockEncoder(testConstants.validUserInput.password),
      }

      await register(testConstants.validUserInput)

      expect(mockUserRepository.save).toHaveBeenCalledWith(expectedUserToSave)
    })

    it('should reject with validation errors when invalid user input is given', async () => {
      mockValidatationService.validate = jest.fn(
        () => testConstants.validationErrors
      )
      const expectedError = {
        status: 400,
        message: 'validation error',
        details: testConstants.validationErrors,
      }

      await expect(register({})).rejects.toStrictEqual(expectedError)
    })
  })
})

import { userController } from '../../src/controllers/userController'
import * as mockFactory from '../mockFactory'
import * as testConstants from '../testConstants'

let mockUserService
let mockMessageFactory
let controller

beforeEach(() => {
  mockUserService = mockFactory.createMockUserService()
  mockMessageFactory = mockFactory.createMockMessageFactory()
  controller = userController(mockUserService, mockMessageFactory)
})

describe('userController', () => {
  describe('create user', () => {
    it('should return HTTP 201 when valid user data is given', async () => {
      const req = { body: testConstants.validUserInput }
      const res = mockFactory.createMockResponseObject()
      mockUserService.register = jest.fn(() =>
        Promise.resolve(testConstants.exampleUserId)
      )

      await controller.create(req, res)

      expect(res.status).toHaveBeenCalledWith(201)
    })

    it('should return saved userId when valid user data is given', async () => {
      const req = { body: testConstants.validUserInput }
      const res = mockFactory.createMockResponseObject()
      const expectedMessage = {
        status: 'ok',
        userId: testConstants.exampleUserId,
      }
      mockUserService.register = jest.fn(() =>
        Promise.resolve(testConstants.exampleUserId)
      )

      await controller.create(req, res)

      expect(mockMessageFactory.okMessage).toHaveBeenCalledWith({
        userId: testConstants.exampleUserId,
      })
      expect(res.json).toHaveBeenCalledWith(expectedMessage)
    })

    it('should forward error when error happens', async () => {
      const invalidUserInput = {}
      const req = { body: invalidUserInput }
      const res = jest.fn()
      const next = jest.fn()
      mockUserService.register = jest.fn(() =>
        Promise.reject(testConstants.validationErrors)
      )

      await controller.create(req, res, next)

      expect(next).toHaveBeenCalled()
    })
  })
})

import request from 'supertest'

import app from '../../src/app'
import { appContext } from '../../src/diContainer'
import * as testConstants from '../testConstants'

const userRepository = appContext.userRepository
let mockfindOne

beforeEach(() => {
  mockfindOne = jest.fn(() =>
    Promise.resolve({ _doc: testConstants.exampleUser })
  )
  jest
    .spyOn(userRepository.userModel, 'findOne')
    .mockImplementation(mockfindOne)
})

afterEach(() => {
  mockfindOne.mockClear()
})

describe('GET /api/users/:id', () => {
  const userId = testConstants.exampleUser._id
  const expectedUser = { ...testConstants.exampleUser }
  delete expectedUser.password

  it('should return HTTP 200 and user when valid input is given', done => {
    const expectedResult = {
      status: 'ok',
      user: expectedUser,
    }

    request(app)
      .get(`/api/users/${userId}`)
      .auth(testConstants.userToken, { type: 'bearer' })
      .expect('Content-Type', /json/)
      .end((err, res) => {
        expect(res.status).toBe(200)
        expect(res.body).toStrictEqual(expectedResult)
        return done()
      })
  })

  it('should return less fields when no valid token is given', done => {
    const expectedResult = {
      status: 'ok',
      user: {
        name: expectedUser.name,
        avatar: expectedUser.avatar,
      },
    }

    request(app)
      .get(`/api/users/${userId}`)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        expect(res.body).toStrictEqual(expectedResult)
        return done()
      })
  })

  it('should return HTTP 404 when no such userId found', done => {
    mockfindOne = jest.fn(() => Promise.resolve(null))
    jest
      .spyOn(userRepository.userModel, 'findOne')
      .mockImplementation(mockfindOne)
    const expectedResult = {
      status: 'error',
      message: 'no such user found',
    }

    request(app)
      .get(`/api/users/${userId}`)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        expect(res.status).toBe(404)
        expect(res.body).toStrictEqual(expectedResult)
        return done()
      })
  })

  it('should return HTTP 400 when not valid userId is given', done => {
    mockfindOne = jest.fn(() =>
      Promise.reject({ message: 'Cast to ObjectId failed for value' })
    )
    jest
      .spyOn(userRepository.userModel, 'findOne')
      .mockImplementation(mockfindOne)
    const invalidUserId = 'invalidUserId'
    const expectedResult = {
      status: 'error',
      message: 'invalid userId is given',
    }

    request(app)
      .get(`/api/users/${invalidUserId}`)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        expect(res.status).toBe(400)
        expect(res.body).toStrictEqual(expectedResult)
        return done()
      })
  })
})

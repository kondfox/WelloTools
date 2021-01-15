import request from 'supertest'

import app from '../../src/app'
import { appContext } from '../../src/diContainer'
import * as testConstants from '../testConstants'

const userRepository = appContext.userRepository
let mockFindByIdAndRemove

beforeEach(() => {
  mockFindByIdAndRemove = jest.fn(() =>
    Promise.resolve(testConstants.exampleUser)
  )
  jest
    .spyOn(userRepository.userModel, 'findByIdAndRemove')
    .mockImplementation(mockFindByIdAndRemove)
})

afterEach(() => {
  mockFindByIdAndRemove.mockClear()
})

describe('DELETE /api/users/:id', () => {
  const userId = testConstants.exampleUser._id

  it('should return HTTP 200 when admin token and valid input is given', done => {
    request(app)
      .delete(`/api/users/${userId}`)
      .set('Content-Type', 'application/json')
      .auth(testConstants.adminToken, { type: 'bearer' })
      .expect('Content-Type', /json/)
      .end((err, res) => {
        expect(res.status).toBe(200)
        expect(res.body.status).toBe('ok')
        return done()
      })
  })

  it('should delete user when admin token and valid input is given', done => {
    request(app)
      .delete(`/api/users/${userId}`)
      .set('Content-Type', 'application/json')
      .auth(testConstants.adminToken, { type: 'bearer' })
      .expect('Content-Type', /json/)
      .end(() => {
        expect(mockFindByIdAndRemove).toHaveBeenCalledWith(
          testConstants.exampleUser._id
        )
        return done()
      })
  })

  it('should return HTTP 401 when no token is given', done => {
    const expectedResult = {
      status: 'error',
      message: 'no valid token found',
    }

    request(app)
      .delete(`/api/users/${userId}`)
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /json/)
      .end((err, res) => {
        expect(res.status).toBe(401)
        expect(res.body).toStrictEqual(expectedResult)
        return done()
      })
  })

  it('should return HTTP 403 when not admin token is given', done => {
    const expectedResult = {
      status: 'error',
      message: "you don't have permission",
    }

    request(app)
      .delete(`/api/users/${userId}`)
      .set('Content-Type', 'application/json')
      .auth(testConstants.userToken, { type: 'bearer' })
      .expect('Content-Type', /json/)
      .end((err, res) => {
        expect(res.status).toBe(403)
        expect(res.body).toStrictEqual(expectedResult)
        return done()
      })
  })

  it('should return HTTP 404 when no such userId found', done => {
    mockFindByIdAndRemove = jest.fn(() => Promise.resolve(null))
    jest
      .spyOn(userRepository.userModel, 'findByIdAndRemove')
      .mockImplementation(mockFindByIdAndRemove)
    const expectedResult = {
      status: 'error',
      message: 'no such user found',
    }

    request(app)
      .delete(`/api/users/${userId}`)
      .auth(testConstants.adminToken, { type: 'bearer' })
      .expect('Content-Type', /json/)
      .end((err, res) => {
        expect(res.status).toBe(404)
        expect(res.body).toStrictEqual(expectedResult)
        return done()
      })
  })

  it('should return HTTP 400 when invalid userId is given', done => {
    mockFindByIdAndRemove = jest.fn(() =>
      Promise.reject({ message: 'Cast to ObjectId failed for value' })
    )
    jest
      .spyOn(userRepository.userModel, 'findByIdAndRemove')
      .mockImplementation(mockFindByIdAndRemove)
    const invalidUserId = 'invalidUserId'
    const expectedResult = {
      status: 'error',
      message: 'invalid userId is given',
    }

    request(app)
      .delete(`/api/users/${invalidUserId}`)
      .auth(testConstants.adminToken, { type: 'bearer' })
      .expect('Content-Type', /json/)
      .end((err, res) => {
        expect(res.status).toBe(400)
        expect(res.body).toStrictEqual(expectedResult)
        return done()
      })
  })
})

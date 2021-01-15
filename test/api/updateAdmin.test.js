import request from 'supertest'

import app from '../../src/app'
import { appContext } from '../../src/diContainer'
import * as testConstants from '../testConstants'

const userRepository = appContext.userRepository
let mockfindByIdAndUpdate

beforeEach(() => {
  mockfindByIdAndUpdate = jest.fn(() =>
    Promise.resolve(testConstants.exampleUser)
  )
  jest
    .spyOn(userRepository.userModel, 'findByIdAndUpdate')
    .mockImplementation(mockfindByIdAndUpdate)
})

afterEach(() => {
  mockfindByIdAndUpdate.mockClear()
})

describe('PUT /api/users/:id', () => {
  const userId = testConstants.exampleUser._id
  const updateParams = { name: 'Johnny' }

  it('should return HTTP 200 when admin token and valid input is given', done => {
    request(app)
      .put(`/api/users/${userId}`)
      .set('Content-Type', 'application/json')
      .auth(testConstants.adminToken, { type: 'bearer' })
      .send(updateParams)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        expect(res.status).toBe(200)
        expect(res.body.status).toBe('ok')
        return done()
      })
  })

  it('should update user when admin token and valid input is given', done => {
    request(app)
      .put(`/api/users/${userId}`)
      .set('Content-Type', 'application/json')
      .auth(testConstants.adminToken, { type: 'bearer' })
      .send(updateParams)
      .expect('Content-Type', /json/)
      .end(() => {
        expect(mockfindByIdAndUpdate).toHaveBeenCalledWith(
          testConstants.exampleUser._id,
          updateParams
        )
        return done()
      })
  })

  it('should allowed to update role when admin token is given', done => {
    const updateRoleParams = { role: 'ADMIN' }

    request(app)
      .put(`/api/users/${userId}`)
      .set('Content-Type', 'application/json')
      .auth(testConstants.adminToken, { type: 'bearer' })
      .send(updateRoleParams)
      .expect('Content-Type', /json/)
      .end(() => {
        expect(mockfindByIdAndUpdate).toHaveBeenCalledWith(
          testConstants.exampleUser._id,
          updateRoleParams
        )
        return done()
      })
  })

  it('should not update _id when _id param is given', done => {
    const updateIdParams = { ...updateParams, _id: '6000a45e83826d142d7682d9' }
    const expectedUpdateParams = updateParams

    request(app)
      .put(`/api/users/${userId}`)
      .set('Content-Type', 'application/json')
      .auth(testConstants.adminToken, { type: 'bearer' })
      .send(updateIdParams)
      .expect('Content-Type', /json/)
      .end(() => {
        expect(mockfindByIdAndUpdate).toHaveBeenCalledWith(
          testConstants.exampleUser._id,
          expectedUpdateParams
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
      .put(`/api/users/${userId}`)
      .set('Content-Type', 'application/json')
      .send(updateParams)
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
      .put(`/api/users/${userId}`)
      .set('Content-Type', 'application/json')
      .auth(testConstants.userToken, { type: 'bearer' })
      .send(updateParams)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        expect(res.status).toBe(403)
        expect(res.body).toStrictEqual(expectedResult)
        return done()
      })
  })

  it('should return HTTP 404 when no such userId found', done => {
    mockfindByIdAndUpdate = jest.fn(() => Promise.resolve(null))
    jest
      .spyOn(userRepository.userModel, 'findByIdAndUpdate')
      .mockImplementation(mockfindByIdAndUpdate)
    const expectedResult = {
      status: 'error',
      message: 'no such user found',
    }

    request(app)
      .put(`/api/users/${userId}`)
      .auth(testConstants.adminToken, { type: 'bearer' })
      .expect('Content-Type', /json/)
      .end((err, res) => {
        expect(res.status).toBe(404)
        expect(res.body).toStrictEqual(expectedResult)
        return done()
      })
  })

  it('should return HTTP 400 when invalid userId is given', done => {
    mockfindByIdAndUpdate = jest.fn(() =>
      Promise.reject({ message: 'Cast to ObjectId failed for value' })
    )
    jest
      .spyOn(userRepository.userModel, 'findByIdAndUpdate')
      .mockImplementation(mockfindByIdAndUpdate)
    const invalidUserId = 'invalidUserId'
    const expectedResult = {
      status: 'error',
      message: 'invalid userId is given',
    }

    request(app)
      .put(`/api/users/${invalidUserId}`)
      .auth(testConstants.adminToken, { type: 'bearer' })
      .expect('Content-Type', /json/)
      .end((err, res) => {
        expect(res.status).toBe(400)
        expect(res.body).toStrictEqual(expectedResult)
        return done()
      })
  })
})

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

describe('PUT /api/users', () => {
  const updateParams = { name: 'Johnny' }

  it('should return HTTP 200 when valid input is given', done => {
    request(app)
      .put('/api/users')
      .set('Content-Type', 'application/json')
      .auth(testConstants.userToken, { type: 'bearer' })
      .send(updateParams)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        expect(res.status).toBe(200)
        expect(res.body.status).toBe('ok')
        return done()
      })
  })

  it('should update user when valid input is given', done => {
    request(app)
      .put('/api/users')
      .set('Content-Type', 'application/json')
      .auth(testConstants.userToken, { type: 'bearer' })
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

  it('should not update _id or role fields when these fields are given', done => {
    const forbiddenUpdateParams = {
      ...updateParams,
      _id: '6000a45e83826d142d7682d9',
      role: 'ADMIN',
    }
    const expectedUpdateParams = updateParams

    request(app)
      .put('/api/users')
      .set('Content-Type', 'application/json')
      .auth(testConstants.userToken, { type: 'bearer' })
      .send(forbiddenUpdateParams)
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
    const expectedResult = { status: 'error', message: 'no valid token found' }

    request(app)
      .put('/api/users')
      .set('Content-Type', 'application/json')
      .send(updateParams)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        expect(res.status).toBe(401)
        expect(res.body).toStrictEqual(expectedResult)
        return done()
      })
  })
})

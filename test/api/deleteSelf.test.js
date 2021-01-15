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

describe('DELETE /api/users', () => {
  it('should return HTTP 200 when valid token is given', done => {
    request(app)
      .delete('/api/users')
      .auth(testConstants.userToken, { type: 'bearer' })
      .expect('Content-Type', /json/)
      .end((err, res) => {
        expect(res.status).toBe(200)
        expect(res.body.status).toBe('ok')
        return done()
      })
  })

  it('should delete user when valid token is given', done => {
    request(app)
      .delete('/api/users')
      .auth(testConstants.userToken, { type: 'bearer' })
      .expect('Content-Type', /json/)
      .end(() => {
        expect(mockFindByIdAndRemove).toHaveBeenCalledWith(
          testConstants.exampleUser._id
        )
        return done()
      })
  })

  it('should return HTTP 401 when no token is given', done => {
    const expectedResult = { status: 'error', message: 'no valid token found' }

    request(app)
      .delete('/api/users')
      .expect('Content-Type', /json/)
      .end((err, res) => {
        expect(res.status).toBe(401)
        expect(res.body).toStrictEqual(expectedResult)
        return done()
      })
  })
})

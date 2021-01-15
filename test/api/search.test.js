import request from 'supertest'

import app from '../../src/app'
import { appContext } from '../../src/diContainer'
import { dbProps } from '../../src/config/constants'
import * as testConstants from '../testConstants'
import * as mockFactory from '../mockFactory'

const userRepository = appContext.userRepository

let mockFind

beforeEach(() => {
  mockFind = jest.fn(() =>
    Promise.resolve([{ _doc: testConstants.exampleUser }])
  )
  jest.spyOn(userRepository.userModel, 'find').mockImplementation(mockFind)
})

afterEach(() => {
  mockFind.mockClear()
})

describe('GET /api/users', () => {
  it('should return HTTP 200 and users with only names and avatars when no auth', done => {
    const expectedResult = {
      status: 'ok',
      page: 1,
      users: [
        {
          name: testConstants.exampleUser.name,
          avatar: testConstants.exampleUser.avatar,
        },
      ],
    }

    request(app)
      .get('/api/users')
      .expect('Content-Type', /json/)
      .end((err, res) => {
        expect(res.status).toBe(200)
        expect(res.body).toStrictEqual(expectedResult)
        return done()
      })
  })

  it('should return HTTP 200 and users with when auth is given', done => {
    const expectedResult = {
      status: 'ok',
      page: 1,
      users: [
        {
          _id: testConstants.exampleUser._id,
          email: testConstants.exampleUser.email,
          name: testConstants.exampleUser.name,
          avatar: testConstants.exampleUser.avatar,
        },
      ],
    }

    request(app)
      .get('/api/users')
      .auth(testConstants.userToken, { type: 'bearer' })
      .expect('Content-Type', /json/)
      .end((err, res) => {
        expect(res.status).toBe(200)
        expect(res.body).toStrictEqual(expectedResult)
        return done()
      })
  })

  it('should return filtered users when filter params as given', done => {
    request(app)
      .get(`/api/users?email=${testConstants.exampleUser.email}`)
      .auth(testConstants.userToken, { type: 'bearer' })
      .expect('Content-Type', /json/)
      .end((err, res) => {
        expect(mockFind).toHaveBeenCalledWith(
          {
            email: testConstants.exampleUser.email,
          },
          null,
          { limit: dbProps.find.limit }
        )
        return done()
      })
  })
})

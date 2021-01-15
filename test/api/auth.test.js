import request from 'supertest'

import app from '../../src/app'
import { appContext } from '../../src/diContainer'
import * as testConstants from '../testConstants'

const userRepository = appContext.userRepository
let mockfindOne

beforeEach(() => {
  mockfindOne = jest.fn(() =>
    Promise.resolve({
      _doc: testConstants.exampleUser,
      ...testConstants.exampleUser,
    })
  )
  jest
    .spyOn(userRepository.userModel, 'findOne')
    .mockImplementation(mockfindOne)
})

afterEach(() => {
  mockfindOne.mockClear()
})

describe('POST /auth/login', () => {
  const validLogin = {
    email: testConstants.exampleUser.email,
    password: 'password',
  }

  it('should return HTTP 200 and token when valid input is given', done => {
    request(app)
      .post('/auth/login')
      .set('Content-Type', 'application/json')
      .send(validLogin)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        expect(res.status).toBe(200)
        expect(res.body.status).toBe('ok')
        expect(res.body.token).not.toBeUndefined()
        return done()
      })
  })

  it('should return HTTP 406 and validation errors when invalid input is given', done => {
    const invalidLogin = {}
    const expectedResult = {
      status: 'error',
      message: 'validation error',
      details: {
        email: testConstants.validationErrors.email,
        password: testConstants.validationErrors.password,
      },
    }
    request(app)
      .post('/auth/login')
      .set('Content-Type', 'application/json')
      .send(invalidLogin)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        expect(res.status).toBe(406)
        expect(res.body).toStrictEqual(expectedResult)
        return done()
      })
  })

  it('should return HTTP 400 when wrong credentials are given', done => {
    const otherPassword = 'otherEncodedPassword'
    mockfindOne = jest.fn(() =>
      Promise.resolve({
        _doc: { ...testConstants.exampleUser, password: otherPassword },
        ...testConstants.exampleUser,
        password: otherPassword,
      })
    )
    jest
      .spyOn(userRepository.userModel, 'findOne')
      .mockImplementation(mockfindOne)
    const expectedError = {
      status: 'error',
      message: 'wrong email or password',
    }

    request(app)
      .post('/auth/login')
      .set('Content-Type', 'application/json')
      .send(validLogin)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        expect(res.status).toBe(400)
        expect(res.body).toStrictEqual(expectedError)
        return done()
      })
  })
})

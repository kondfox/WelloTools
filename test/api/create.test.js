import request from 'supertest'

import app from '../../src/app'
import { appContext } from '../../src/diContainer'
import * as testConstants from '../testConstants'

const userRepository = appContext.userRepository
let mockCreate

beforeEach(() => {
  mockCreate = jest.fn(() => Promise.resolve(testConstants.exampleUser))
  jest.spyOn(userRepository.userModel, 'create').mockImplementation(mockCreate)
})

afterEach(() => {
  mockCreate.mockClear()
})

describe('POST /api/users', () => {
  it('should save return HTTP 201 when valid input is given', done => {
    request(app)
      .post('/api/users')
      .set('Content-Type', 'application/json')
      .send(testConstants.validUserInput)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        expect(res.status).toBe(201)
        return done()
      })
  })

  it('should return ok status with userId when valid input is given', done => {
    request(app)
      .post('/api/users')
      .set('Content-Type', 'application/json')
      .send(testConstants.validUserInput)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        expect(res.body.status).toBe('ok')
        expect(res.body.userId).toBe(testConstants.exampleUserId)
        done()
      })
  })

  it('should save user to database when valid input is given', done => {
    request(app)
      .post('/api/users')
      .set('Content-Type', 'application/json')
      .send(testConstants.validUserInput)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        expect(mockCreate).toHaveBeenCalled()
        done()
      })
  })

  it('should return HTTP 406 when invalid input is given', done => {
    request(app)
      .post('/api/users')
      .set('Content-Type', 'application/json')
      .send({})
      .expect('Content-Type', /json/)
      .end((err, res) => {
        expect(res.status).toBe(406)
        return done()
      })
  })

  it('should return validaton errors when invalid input is given', done => {
    const expectedError = {
      status: 'error',
      message: 'validation error',
      details: testConstants.validationErrors,
    }

    request(app)
      .post('/api/users')
      .set('Content-Type', 'application/json')
      .send({})
      .expect('Content-Type', /json/)
      .end((err, res) => {
        expect(res.body).toStrictEqual(expectedError)
        return done()
      })
  })

  it('should return HTTP 409 and error when given email is already registered', done => {
    jest
      .spyOn(appContext.userRepository, 'save')
      .mockImplementation(() => Promise.reject({ code: 11000 }))
    const expectedError = {
      status: 'error',
      message: 'email address already registered',
    }

    request(app)
      .post('/api/users')
      .set('Content-Type', 'application/json')
      .send(testConstants.validUserInput)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        expect(res.status).toBe(409)
        expect(res.body).toStrictEqual(expectedError)
        return done()
      })
  })
})

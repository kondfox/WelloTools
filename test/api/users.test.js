import request from 'supertest'

import app from '../../src/app'
import { appContext } from '../../src/diContainer'
import * as testConstants from '../testConstants'

describe('app', () => {
  const userRepository = appContext.userRepository

  describe('POST /api/users', () => {
    let mockSave

    beforeEach(() => {
      mockSave = jest.fn(() => Promise.resolve(testConstants.exampleUserId))
      jest.spyOn(userRepository, 'save').mockImplementation(mockSave)
    })

    afterEach(() => {
      mockSave.mockClear()
    })

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
          expect(mockSave).toHaveBeenCalledTimes(1)
          done()
        })
    })

    it('should return HTTP 400 when invalid input is given', done => {
      request(app)
        .post('/api/users')
        .set('Content-Type', 'application/json')
        .send({})
        .expect('Content-Type', /json/)
        .end((err, res) => {
          expect(res.status).toBe(400)
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
  })
})

import chai from 'chai'
import chaiHttp from 'chai-http'
import { app } from '../server'
import { describe } from 'mocha'
import { db } from '../lib/server.db'

const expect = chai.expect
chai.use(chaiHttp)

describe('API ENDPOINT TESTING', () => {
  it('GET: /api/v1/homepage', (done) => {
    chai
      .request(app)
      .get('/api/v1/homepage')
      .end((err, res) => {
        expect(err).to.be.null
        expect(res).to.have.status(200)
        expect(res.body).to.have.property('clients')
        expect(res.body).to.have.property('services')
        expect(res.body).to.have.property('portfolios')
        expect(res.body).to.have.property('testimonies')
        expect(res.body).to.have.property('blogs')
        done()
      })
  })

  it('GET: /api/v1/services', (done) => {
    chai
      .request(app)
      .get('/api/v1/services')
      .end((err, res) => {
        expect(err).to.be.null
        expect(res).to.have.status(200)
        expect(res.body.services).to.be.an('array')
        done()
      })
  })

  it('POST: /api/v1/blogs', (done) => {
    chai
      .request(app)
      .post('/api/v1/blogs')
      .send({
        page: 1,
      })
      .end((err, res) => {
        expect(err).to.be.null
        expect(res).to.have.status(200)
        expect(res.body).to.have.property('blogs')
        expect(res.body).to.have.property('hasMore')
        done()
      })
  })

  it('GET: /api/v1/faqs', (done) => {
    chai
      .request(app)
      .get('/api/v1/faqs')
      .end((err, res) => {
        expect(err).to.be.null
        expect(res).to.have.status(200)
        expect(res.body.faqs).to.be.an('array')
        done()
      })
  })

  it('GET:/api/v1/subscribers', (done) => {
    chai
      .request(app)
      .get('/api/v1/subscribers')
      .end((err, res) => {
        expect(err).to.be.null
        expect(res).to.have.status(200)
        expect(res.body.subscribers).to.be.an('array')
        done()
      })
  })

  describe('GET: /api/v1/images/:filename', () => {
    it('Should return 404 if image not found', (done) => {
      chai
        .request(app)
        .get('/api/v1/images/dummy.jpg')
        .end((err, res) => {
          expect(err).to.be.null
          expect(res).to.have.status(404)
          expect(res.body).to.have.property('message')
          expect(res.body.message).to.equal('Image not found')
          done()
        })
    })

    it('Should return 200 if image found', (done) => {
      chai
        .request(app)
        .get('/api/v1/images/blogThumbnail-1691897514189.jpg')
        .end((err, res) => {
          expect(err).to.be.null
          expect(res).to.have.status(200)
          done()
        })
    })
  })

  describe('GET: /api/v1/blogs/:slug', () => {
    it('Should return 404 if could not be found', (done) => {
      chai
        .request(app)
        .get('/api/v1/blogs/anything-you-want-zyx')
        .end((err, res) => {
          expect(err).to.be.null
          expect(res).to.have.status(404)
          expect(res.body).to.have.property('message')
          expect(res.body.message).to.equal('Blog not found')
          done()
        })
    })

    it('Should return 200 if blog found', (done) => {
      chai
        .request(app)
        .get(
          '/api/v1/blogs/the-importance-of-seo-for-your-business-1691896805375'
        )
        .end((err, res) => {
          expect(err).to.be.null
          expect(res).to.have.status(200)
          expect(res.body.blog).to.have.property('id')
          done()
        })
    })
  })

  describe('POST: /api/v1/portfolios', () => {
    it('Should return 200 if portfolios found', (done) => {
      chai
        .request(app)
        .post('/api/v1/portfolios')
        .send({ page: 1, serviceId: 1 })
        .end((err, res) => {
          expect(err).to.be.null
          expect(res).to.have.status(200)
          expect(res.body).to.have.property('portfolios')
          expect(res.body.portfolios).to.be.an('array')
          done()
        })
    })

    it('Should return empty array when the page is out of range', (done) => {
      chai
        .request(app)
        .post('/api/v1/portfolios')
        .send({ page: 100, serviceId: 1 })
        .end((err, res) => {
          expect(err).to.be.null
          expect(res).to.have.status(200)
          expect(res.body.portfolios).to.be.an('array')
          expect(res.body.portfolios.length).to.equal(0)
          done()
        })
    })

    it("Should return empty array when the portfolio's serviceId is not match any service id", (done) => {
      chai
        .request(app)
        .post('/api/v1/portfolios')
        .send({ page: 1, serviceId: 100 })
        .end((err, res) => {
          expect(err).to.be.null
          expect(res).to.have.status(200)
          expect(res.body.portfolios).to.be.an('array')
          expect(res.body.portfolios.length).to.equal(0)
          done()
        })
    })

    it('Should return empty array when service has no portfolio', (done) => {
      chai
        .request(app)
        .post('/api/v1/portfolios')
        .send({ page: 1, serviceId: 3 })
        .end((err, res) => {
          expect(err).to.be.null
          expect(res).to.have.status(200)
          expect(res.body.portfolios).to.be.an('array')
          expect(res.body.portfolios.length).to.equal(0)
          done()
        })
    })
  })

  describe('GET: /api/v1/teams', () => {
    it('Should return 200 if teams found', (done) => {
      chai
        .request(app)
        .get('/api/v1/teams')
        .end((err, res) => {
          expect(err).to.be.null
          expect(res).to.have.status(200)
          expect(res.body.teams).to.be.an('array')
          done()
        })
    })

    it('Should not return the team with role of Admin', (done) => {
      chai
        .request(app)
        .get('/api/v1/teams')
        .end((err, res) => {
          expect(err).to.be.null
          expect(res).to.have.status(200)
          const admin = res.body.teams.find(
            (team: any) => team.role.name === 'Admin'
          )
          expect(admin).to.be.undefined
          done()
        })
    })
  })

  describe('POST: /api/v1/subscribers', () => {
    it('Should return 400 if email is already subscribed', (done) => {
      chai
        .request(app)
        .post('/api/v1/subscribers')
        .send({ email: 'adiputrakadekdarmayasa@gmail.com' })
        .end((err, res) => {
          expect(err).to.be.null
          expect(res).to.have.status(400)
          expect(res.body).to.have.property('message')
          expect(res.body.message).to.equal('Email already subscribed')
          done()
        })
    })

    it('Should return 200 if email is successfully subscribed', (done) => {
      chai
        .request(app)
        .post('/api/v1/subscribers')
        .send({ email: 'xyz@gmail.com' })
        .end((err, res) => {
          expect(err).to.be.null
          expect(res).to.have.status(201)
          expect(res.body).to.have.property('message')
          expect(res.body.message).to.equal('Subscribed successfully')

          db.subscriber
            .findFirst({ where: { email: 'xyz@gmail.com' } })
            .then((subscriber) => {
              db.subscriber
                .delete({ where: { id: subscriber?.id } })
                .then(() => done())
            })
        })
    })
  })
})

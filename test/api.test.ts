import chai from 'chai'
import chaiHttp from 'chai-http'
import { app } from '../server'
import { describe } from 'mocha'
import { db } from '../lib/server.db'

const expect = chai.expect
chai.use(chaiHttp)

describe('GET: /api/v1/homepage', () => {
  const homepageEndpoint = '/api/v1/homepage'

  it('Response status code should have value of 200', (done) => {
    chai
      .request(app)
      .get(homepageEndpoint)
      .end((err, res) => {
        expect(res).to.have.status(200)
        done()
      })
  })

  it('Response header Content-Type should have value of application/json', (done) => {
    chai
      .request(app)
      .get(homepageEndpoint)
      .end((err, res) => {
        expect(res).to.have.header(
          'content-type',
          'application/json; charset=utf-8'
        )
        done()
      })
  })

  it('Response body should be an object', (done) => {
    chai
      .request(app)
      .get(homepageEndpoint)
      .end((err, res) => {
        expect(res.body).to.be.an('object')
        done()
      })
  })

  it('Response body should have specified properties', (done) => {
    chai
      .request(app)
      .get(homepageEndpoint)
      .end((err, res) => {
        const { data } = res.body
        expect(data).to.have.property('homepage')
        expect(data.homepage).to.have.property('clients')
        expect(data.homepage).to.have.property('services')
        expect(data.homepage).to.have.property('portfolios')
        expect(data.homepage).to.have.property('testimonies')
        expect(data.homepage).to.have.property('blogs')
        done()
      })
  })
})

describe('GET: /api/v1/services', () => {
  const serviceEndpoint = '/api/v1/services'

  it('Response code should have value of 200', (done) => {
    chai
      .request(app)
      .get(serviceEndpoint)
      .end((err, res) => {
        expect(res).to.have.status(200)
        done()
      })
  })

  it('Response header Content-Type should have value of application/json', (done) => {
    chai
      .request(app)
      .get(serviceEndpoint)
      .end((err, res) => {
        expect(res).to.have.header(
          'content-type',
          'application/json; charset=utf-8'
        )
        done()
      })
  })

  it('Response body should be an object', (done) => {
    chai
      .request(app)
      .get(serviceEndpoint)
      .end((err, res) => {
        expect(res.body).to.be.an('object')
        done()
      })
  })

  it('Response body should have specified properties', (done) => {
    chai
      .request(app)
      .get(serviceEndpoint)
      .end((err, res) => {
        const { data } = res.body
        expect(data).to.have.property('services')
        done()
      })
  })
})

describe('POST: /api/v1/blogs', () => {
  const blogEndpoint = '/api/v1/blogs'

  it('Response status code should have value of 200', (done) => {
    chai
      .request(app)
      .post(blogEndpoint)
      .send({ page: 1 })
      .end((err, res) => {
        expect(res).to.have.status(200)
        done()
      })
  })

  it('Response header Content-Type should have value of application/json', (done) => {
    chai
      .request(app)
      .post(blogEndpoint)
      .send({ page: 1 })
      .end((err, res) => {
        expect(res).to.have.header(
          'content-type',
          'application/json; charset=utf-8'
        )
        done()
      })
  })

  it('Response body should be an object', (done) => {
    chai
      .request(app)
      .post(blogEndpoint)
      .send({ page: 1 })
      .end((err, res) => {
        expect(res.body).to.be.an('object')
        done()
      })
  })

  it('Response body should have specified properties', (done) => {
    chai
      .request(app)
      .post(blogEndpoint)
      .send({ page: 1 })
      .end((err, res) => {
        const { data } = res.body
        expect(data).to.have.property('blogs')
        expect(data).to.have.property('hasMore')
        done()
      })
  })
})

describe('GET: /api/v1/blogs/:slug', () => {
  const blogEndpoint = '/api/v1/blogs'

  it('Response header Content-Type should have value of application/json', (done) => {
    chai
      .request(app)
      .get(
        `${blogEndpoint}/the-importance-of-seo-for-your-business-1691896805375`
      )
      .end((err, res) => {
        expect(res).to.have.header(
          'content-type',
          'application/json; charset=utf-8'
        )
        done()
      })
  })

  it('Response body should be an object', (done) => {
    chai
      .request(app)
      .get(
        `${blogEndpoint}/the-importance-of-seo-for-your-business-1691896805375`
      )
      .end((err, res) => {
        expect(res.body).to.be.an('object')
        done()
      })
  })

  describe('When the blog is could not be found', () => {
    it('Response status code should have value of 404', (done) => {
      chai
        .request(app)
        .get(`${blogEndpoint}/anything-you-want-zyx`)
        .end((err, res) => {
          expect(res).to.have.status(404)
          done()
        })
    })

    it('Response body should have property message with specified value', (done) => {
      chai
        .request(app)
        .get(`${blogEndpoint}/anything-you-want-zyx`)
        .end((err, res) => {
          expect(res.body).to.have.property('message', 'Blog not found')
          done()
        })
    })
  })

  describe('When the blog is could be found', () => {
    it('Response status code should have value of 200', (done) => {
      chai
        .request(app)
        .get(
          `${blogEndpoint}/the-importance-of-seo-for-your-business-1691896805375`
        )
        .end((err, res) => {
          expect(res).to.have.status(200)
          done()
        })
    })

    it('Response body should have specified properties', (done) => {
      chai
        .request(app)
        .get(
          `${blogEndpoint}/the-importance-of-seo-for-your-business-1691896805375`
        )
        .end((err, res) => {
          const { data } = res.body
          expect(data).to.have.property('blog')
          done()
        })
    })
  })
})

describe('GET: /api/v1/faqs', () => {
  const faqEndpoint = '/api/v1/faqs'

  it('Response code should have value of 200', (done) => {
    chai
      .request(app)
      .get(faqEndpoint)
      .end((err, res) => {
        expect(res).to.have.status(200)
        done()
      })
  })

  it('Response header Content-Type should have value of application/json', (done) => {
    chai
      .request(app)
      .get(faqEndpoint)
      .end((err, res) => {
        expect(res).to.have.header(
          'content-type',
          'application/json; charset=utf-8'
        )
        done()
      })
  })

  it('Response body should be an object', (done) => {
    chai
      .request(app)
      .get(faqEndpoint)
      .end((err, res) => {
        expect(res.body).to.be.an('object')
        done()
      })
  })

  it('Response body should have specified properties', (done) => {
    chai
      .request(app)
      .get(faqEndpoint)
      .end((err, res) => {
        const { data } = res.body
        expect(data).to.have.property('faqs')
        done()
      })
  })
})

describe('GET: /api/v1/subscribers', () => {
  const subscriberEndpoint = '/api/v1/subscribers'

  it('Response code should have value of 200', (done) => {
    chai
      .request(app)
      .get(subscriberEndpoint)
      .end((err, res) => {
        expect(res).to.have.status(200)
        done()
      })
  })

  it('Response header Content-Type should have value of application/json', (done) => {
    chai
      .request(app)
      .get(subscriberEndpoint)
      .end((err, res) => {
        expect(res).to.have.header(
          'content-type',
          'application/json; charset=utf-8'
        )
        done()
      })
  })

  it('Response body should be an object', (done) => {
    chai
      .request(app)
      .get(subscriberEndpoint)
      .end((err, res) => {
        expect(res.body).to.be.an('object')
        done()
      })
  })

  it('Response body should have specified properties', (done) => {
    chai
      .request(app)
      .get(subscriberEndpoint)
      .end((err, res) => {
        const { data } = res.body
        expect(data).to.have.property('subscribers')
        done()
      })
  })
})

describe('POST: /api/v1/subscribers', () => {
  const subscriberEndpoint = '/api/v1/subscribers'

  it('Response header Content-Type should have value of application/json', (done) => {
    chai
      .request(app)
      .post(subscriberEndpoint)
      .send({ email: 'adiputrakadekdarmayasa@gmail.com' })
      .end((err, res) => {
        expect(res).to.have.header(
          'content-type',
          'application/json; charset=utf-8'
        )
        done()
      })
  })

  it('Response body should be an object', (done) => {
    chai
      .request(app)
      .post(subscriberEndpoint)
      .send({ email: 'adiputrakadekdarmayasa@gmail.com' })
      .end((err, res) => {
        expect(res.body).to.be.an('object')
        done()
      })
  })

  describe('When user is already subscribed', () => {
    it('Response status code should have value of 400', (done) => {
      chai
        .request(app)
        .post(subscriberEndpoint)
        .send({ email: 'adiputrakadekdarmayasa@gmail.com' })
        .end((err, res) => {
          expect(res).to.have.status(400)
          done()
        })
    })

    it('Response body should have property message with specified value', (done) => {
      chai
        .request(app)
        .post(subscriberEndpoint)
        .send({ email: 'adiputrakadekdarmayasa@gmail.com' })
        .end((err, res) => {
          expect(res.body).to.have.property(
            'message',
            'Email already subscribed'
          )
          done()
        })
    })
  })

  describe('When user is successfully subscribed', () => {
    it('Response status code should have value of 201', (done) => {
      chai
        .request(app)
        .post(subscriberEndpoint)
        .send({ email: 'xyz@gmail.com' })
        .end((err, res) => {
          expect(res).to.have.status(201)
          db.subscriber
            .findFirst({ where: { email: 'xyz@gmail.com' } })
            .then((subscriber) => {
              db.subscriber
                .delete({ where: { id: subscriber?.id } })
                .then(() => done())
            })
        })
    })

    it('Response body should have property with specified value', (done) => {
      chai
        .request(app)
        .post(subscriberEndpoint)
        .send({ email: 'xyz@gmail.com' })
        .end((err, res) => {
          expect(res.body).to.have.property(
            'message',
            'Subscribed successfully'
          )
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

describe('GET: /api/v1/images/:filename', () => {
  const imageEndpoint = '/api/v1/images'

  it('Response body should be an object', (done) => {
    chai
      .request(app)
      .get(imageEndpoint)
      .end((err, res) => {
        expect(res.body).to.be.an('object')
        done()
      })
  })

  describe('When the image could not be found', () => {
    it('Response header Content-Type should have value of application/json', (done) => {
      chai
        .request(app)
        .get(`${imageEndpoint}/dummy.jpg`)
        .end((err, res) => {
          expect(res).to.have.header(
            'content-type',
            'application/json; charset=utf-8'
          )
          done()
        })
    })

    it('Response status code should have value of 404', (done) => {
      chai
        .request(app)
        .get(`${imageEndpoint}/dummy.jpg`)
        .end((err, res) => {
          expect(res).to.have.status(404)
          done()
        })
    })

    it('Response body should have property message with specified value', (done) => {
      chai
        .request(app)
        .get(`${imageEndpoint}/dummy.jpg`)
        .end((err, res) => {
          expect(res.body).to.have.property('message', 'Image not found')
          done()
        })
    })
  })

  describe('When the image could be found', () => {
    it('Response status code should have value of 200', (done) => {
      chai
        .request(app)
        .get(`${imageEndpoint}/blogThumbnail-1691897514189.jpg`)
        .end((err, res) => {
          expect(res).to.have.status(200)
          done()
        })
    })
  })
})

describe('POST: /api/v1/portfolios', () => {
  const portfolioEndpoint = '/api/v1/portfolios'

  it('Response header Content-Type should have value of application/json', (done) => {
    chai
      .request(app)
      .post(portfolioEndpoint)
      .send({ page: 1, serviceId: 1 })
      .end((err, res) => {
        expect(res).to.have.header(
          'content-type',
          'application/json; charset=utf-8'
        )
        done()
      })
  })

  it('Response body should be an object', (done) => {
    chai
      .request(app)
      .post(portfolioEndpoint)
      .send({ page: 1, serviceId: 1 })
      .end((err, res) => {
        expect(res.body).to.be.an('object')
        done()
      })
  })

  describe('When the portfolios are found', () => {
    it('Response status code should have value of 200', (done) => {
      chai
        .request(app)
        .post(portfolioEndpoint)
        .send({ page: 1, serviceId: 1 })
        .end((err, res) => {
          expect(res).to.have.status(200)
          done()
        })
    })

    it('Response body should have specified properties', (done) => {
      chai
        .request(app)
        .post(portfolioEndpoint)
        .send({ page: 1, serviceId: 1 })
        .end((err, res) => {
          const { data } = res.body
          expect(data).to.have.property('portfolios')
          expect(data).to.have.property('hasMore')
          done()
        })
    })
  })

  describe('When the page is out of range', () => {
    it("Portfolios's data should be an empty array", (done) => {
      chai
        .request(app)
        .post(portfolioEndpoint)
        .send({ page: 1, serviceId: 1 })
        .end((err, res) => {
          const { data } = res.body
          expect(data.portfolios.length).to.equal(0)
          done()
        })
    })
  })

  describe("When the portfolio's serviceId is not match any service id", () => {
    it("Portfolios' data should be an empty array", (done) => {
      chai
        .request(app)
        .post(portfolioEndpoint)
        .send({ page: 1, serviceId: 100 })
        .end((err, res) => {
          const { data } = res.body
          expect(data.portfolios.length).to.equal(0)
          done()
        })
    })
  })

  describe('When service has no portfolio', () => {
    it("Portfolios' data should be an empty array", (done) => {
      chai
        .request(app)
        .post(portfolioEndpoint)
        .send({ page: 1, serviceId: 3 })
        .end((err, res) => {
          const { data } = res.body
          expect(data.portfolios.length).to.equal(0)
          done()
        })
    })
  })
})

describe('GET: /api/v1/teams', () => {
  const teamEndpoint = '/api/v1/teams'

  it('Response header Content-Type should have value of application/json', (done) => {
    chai
      .request(app)
      .get(teamEndpoint)
      .end((err, res) => {
        expect(res).to.have.header(
          'content-type',
          'application/json; charset=utf-8'
        )
        done()
      })
  })

  it('Response body should be an object', (done) => {
    chai
      .request(app)
      .get(teamEndpoint)
      .end((err, res) => {
        expect(res.body).to.be.an('object')
        done()
      })
  })

  it("Team's data should be an array", (done) => {
    chai
      .request(app)
      .get(teamEndpoint)
      .end((err, res) => {
        const { data } = res.body
        expect(data.teams).to.be.an('array')
        done()
      })
  })

  it('Team with role admin should not be included in the array of teams of response body', (done) => {
    chai
      .request(app)
      .get(teamEndpoint)
      .end((err, res) => {
        const { data } = res.body
        const admin = data.teams.find((team: any) => team.role.name === 'Admin')
        expect(admin).to.be.undefined
        done()
      })
  })
})

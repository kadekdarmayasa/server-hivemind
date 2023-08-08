import chai from 'chai';
import chaiHttp from 'chai-http';
import { app } from '../app';
import { describe } from 'mocha';

const expect = chai.expect;
chai.use(chaiHttp);

describe('API ENDPOINT TESTING', () => {
  it('GET: /api/v1/homepage', (done) => {
    chai
      .request(app)
      .get('/api/v1/homepage')
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('clients');
        expect(res.body).to.have.property('services');
        expect(res.body).to.have.property('portfolios');
        expect(res.body).to.have.property('testimonies');
        expect(res.body).to.have.property('blogs');
        done();
      });
  });

  describe('GET: /api/v1/image/:filename', () => {
    it('Should return 404 if image not found', (done) => {
      chai
        .request(app)
        .get('/api/v1/image/dummy.jpg')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(404);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('Image not found');
          done();
        });
    });

    it('Should return 200 if image found', (done) => {
      chai
        .request(app)
        .get('/api/v1/image/blogThumbnail-1690895848358.jpg')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          done();
        });
    });
  });
});

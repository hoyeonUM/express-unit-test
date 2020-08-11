let sinon = require('sinon')
let app = require('../app')
const request = require('supertest')
const expect = require('expect')
const messenger = require('../modules/messenger')

describe('기본예외 테스트', () => {
  it("not found api test", async () => {
    await request(app).get('/notfound')
    .expect('Content-Type', /json/)
    .expect(404, {code: 404, message: 'api not found'})
  })

  it("error api test", async () => {
    await request(app).get('/error')
    .expect('Content-Type', /json/)
    .expect(500, {code: 500, message: 'Internal Server Error'})
  })
})

describe(`stub 를 활용한 문자 테스트 - spy 를 활용시에는 호출관련 위주로 테스트 가능하다.`, () => {
  const api = '/sms/send'
  function applyStub() {
    sinon.stub(messenger, 'sendSms').callsFake(() => {})
    sinon.stub(messenger, 'sendMms').callsFake(() => {})
  }
  beforeEach(() => {
    sinon.restore()
    applyStub()
  })

  it("80자 미만 SMS 전송확인 테스트", async () => {
    await request(app).post(api)
    .send({'content' : '80자 미만 MMS 전송확인 테스트'})
    .expect('Content-Type', /json/)
    .expect(200, {code: 200, message: 'success'})
  })

  it("80자 이상 MMS 전송확인 테스트", async () => {
    await request(app).post(api)
    .send({'content' : '80자 이상 테스트\n'.repeat(100)})
    .expect('Content-Type', /json/)
    .expect(200, {code: 200, message: 'success'})
  })
})


describe(`spy 를 활용한 문자 테스트 - spy 를 활용시에는 호출관련 위주로 테스트 가능하다.`, () => {
  const api = '/sms/send'
  function applySpy() {
    sinon.spy(messenger, 'sendSms')
    sinon.spy(messenger, 'sendMms')
  }
  beforeEach(() => {
    sinon.restore()
    applySpy()
  })

  it("80자 미만 SMS 전송확인 테스트", async () => {
    await request(app).post(api)
    .send({'content' : '80자 미만 MMS 전송확인 테스트'})
    .expect('Content-Type', /json/)
    .expect(200, {code: 200, message: 'success'})
    expect(messenger.sendSms.calledOnce).toBeTruthy()
    expect(messenger.sendMms.notCalled).toBeTruthy()
  })

  it("80자 이상 MMS 전송확인 테스트", async () => {
    await request(app).post(api)
    .send({'content' : '80자 이상 테스트\n'.repeat(100)})
    .expect('Content-Type', /json/)
    .expect(200, {code: 200, message: 'success'})
    expect(messenger.sendSms.notCalled).toBeTruthy()
    expect(messenger.sendMms.calledOnce).toBeTruthy()
  })
})

describe(`mock 을 활용한 문자 테스트 - mock 을 활용시에는 stub 과 spy 두가지의 기능을 전부 사용할수있다.`, () => {
  const api = '/sms/send'
  beforeEach(() => sinon.restore())
  it("80자 미만 SMS 전송확인 테스트", async () => {
    let mock = sinon.mock(messenger)
    mock.expects('sendSms').once().callsFake(() => true)
    mock.expects('sendMms').never()
    await request(app).post(api)
    .send({'content' : '80자 미만 MMS 전송확인 테스트'})
    .expect('Content-Type', /json/)
    .expect(200, {code: 200, message: 'success'})
    mock.verify()
  })

  it("80자 이상 MMS 전송확인 테스트", async () => {
    let mock = sinon.mock(messenger)
    mock.expects('sendSms').never()
    mock.expects('sendMms').once().callsFake(() => true)
    await request(app).post(api)
    .send({'content' : '80자 이상 테스트\n'.repeat(100)})
    .expect('Content-Type', /json/)
    .expect(200, {code: 200, message: 'success'})
    mock.verify()
  })
})

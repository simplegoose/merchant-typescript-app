import { dropUser, getAll, login, signUp } from "../controllers/auth-controller";
import { getSales } from "../controllers/sales-controller";
import { makeMockRequest, makeMockResponse, MockResponse } from "./mockReqRes";
const mongoose = require("mongoose");

describe('MongoDB service', () => {
    let mongoClient: typeof mongoose;

    beforeAll(async () => {
        mongoClient = await mongoose.connect(`mongodb://localhost:27017/glassmart-test`);
    });

    afterAll(async () => {
        await mongoClient.connection.db.dropDatabase();
        await mongoClient.connection.close();
    });

    describe('Check if signup works', () => {
        test('Signup', async () => {
            let req = makeMockRequest({ body: {
                username: 'timothy',
                email: 'timothy@gmail.com',
                phoneNumber: '0700307379',
                password: '123456'
            } });
            let res = <MockResponse>makeMockResponse();
            await signUp(req, res);
            expect(res.state.status).toBe(200);
            expect(res.state.json).toBeTruthy();
        });
    });

    describe('Check if user has been saved', () => {
        test('Signup', async () => {
            let req = makeMockRequest({});
            let res = <MockResponse>makeMockResponse();
            await getAll(req, res);
            expect(res.state.status).toBe(200);
            expect(res.state.json).toHaveLength(1);
        });
    });

    describe('Check if login works', () => {
        test('Login', async () => {
            let req = makeMockRequest({ body: { userName: 'timothy@gmail.com', password: '123456'} });
            let res = <MockResponse>makeMockResponse();
            await login(req, res);
            expect(res.state.status).toBe(200);
            expect(res.state.json).toBeTruthy();
        });
    });

    describe('Check if empty request body on login works', () => {
        test('Login', async () => {
            let req = makeMockRequest({});
            let res = <MockResponse>makeMockResponse();
            await login(req, res);
            expect(res.state.status).toBe(400);
            expect(res.state.json).toBeTruthy();
        });
    });

    describe('Check if request can execute when one required field is missing', () => {
        test('Login', async () => {
            let reqUsername = makeMockRequest({ body: { userName: '0700307379'}});
            let resUsername = <MockResponse>makeMockResponse();
            let reqPassword = makeMockRequest({ body: { password: '123456' }});
            let resPassword = <MockResponse>makeMockResponse();
            await login(reqUsername, resUsername);
            await login(reqPassword, resPassword);
            expect(resPassword.state.status).toBe(400);
            expect(resPassword.state.json).toBeTruthy();
            expect(resUsername.state.status).toBe(400);
            expect(resUsername.state.json).toBeTruthy();
        });
    });

    describe('Check if we can drop a non existent user', () => {
        test('Drop user', async () => {
            let req = makeMockRequest({ query: { userName: '0721447357' } });
            let res = <MockResponse>makeMockResponse();
            await dropUser(req, res);
            expect(res.state.status).toBe(404);
            expect(res.state.json).toBeTruthy();
        });
    });

    describe('Check if we can drop an existent user', () => {
        test('Drop user', async () => {
            let req = makeMockRequest({ query: { userName: 'timothy@gmail.com' } });
            let res = <MockResponse>makeMockResponse();
            await dropUser(req, res);
            expect(res.state.status).toBe(200);
            expect(res.state.json).toBeTruthy();
        });
    });
    
});
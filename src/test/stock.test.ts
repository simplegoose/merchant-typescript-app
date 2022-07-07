import { getStock, uploadStock } from "../controllers/stock-controller";
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

    describe('Check if one can upload without a req body object', () => {
        test('Add stock', async () => {
            let req = makeMockRequest({});
            let res = <MockResponse>makeMockResponse();
            await uploadStock(req, res);
            expect(res.state.status).toBe(400);
            expect(res.state.json).toBeTruthy();
        });
    });

    describe('Check if one can upload with an empty req body object', () => {
        test('Add stock', async () => {
            let req = makeMockRequest({ body: {} });
            let res = <MockResponse>makeMockResponse();
            await uploadStock(req, res);
            expect(res.state.status).toBe(400);
            expect(res.state.json).toBeTruthy();
        });
    });

    describe('Check if one can upload with one field missing', () => {
        test('Add stock', async () => {
            let req = makeMockRequest({ body: {
                itemName: 'Glass',
                itemPrice: 200,
                itemCount: 3000
            } });
            let res = <MockResponse>makeMockResponse();
            await uploadStock(req, res);
            expect(res.state.status).toBe(400);
            expect(res.state.json).toBeTruthy();
        });
    });

    describe('Check if one can upload and save the result', () => {
        test('Add stock', async () => {
            let reqStock = makeMockRequest({ body: {
                itemName: 'clear glass',
                itemPrice: 200,
                itemType: 'Glass',
                itemCount: 20
            } });
            let resStock = <MockResponse>makeMockResponse();
            await uploadStock(reqStock, resStock);

            expect(resStock.state.status).toBe(200);
            expect(resStock.state.json).toBeTruthy();
        });
    });

    describe('Check if one can upload with one field missing', () => {
        test('Get stock', async () => {
            let req = makeMockRequest({});
            let res = <MockResponse>makeMockResponse();
            await getStock(req, res);

            expect(res.state.status).toBe(200);
            expect(res.state.json).toHaveLength(1);
        });
    });
    
});
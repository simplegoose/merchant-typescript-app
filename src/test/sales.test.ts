import { dropUser, getAll, login, signUp } from "../controllers/auth-controller";
import { getSales, uploadSale } from "../controllers/sales-controller";
import { uploadStock } from "../controllers/stock-controller";
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
        test('Add sales', async () => {
            let req = makeMockRequest({});
            let res = <MockResponse>makeMockResponse();
            await uploadSale(req, res);
            expect(res.state.status).toBe(400);
            expect(res.state.json).toBeTruthy();
        });
    });

    describe('Check if one can upload with an empty req body object', () => {
        test('Add sales', async () => {
            let req = makeMockRequest({ body: {} });
            let res = <MockResponse>makeMockResponse();
            await uploadSale(req, res);
            expect(res.state.status).toBe(400);
            expect(res.state.json).toBeTruthy();
        });
    });

    describe('Check if one can upload with one field missing', () => {
        test('Add sales', async () => {
            let req = makeMockRequest({ body: {
                itemName: 'Glass',
                itemPrice: 200,
                totalSale: 3000
            } });
            let res = <MockResponse>makeMockResponse();
            await uploadSale(req, res);
            expect(res.state.status).toBe(400);
            expect(res.state.json).toBeTruthy();
        });
    });

    describe('Check if one can add to db with success', () => {
        test('Add sales', async () => {
            let reqSale = makeMockRequest({ body: {
                itemName: 'clear glass',
                itemPrice: 200,
                totalSale: 3000,
                itemType: 'Glass'
            } });
            let resSale = <MockResponse>makeMockResponse();
            let reqStock = makeMockRequest({ body: {
                itemName: 'clear glass',
                itemPrice: 200,
                itemType: 'Glass',
                itemCount: 20
            } });
            let resStock = <MockResponse>makeMockResponse();
            await uploadStock(reqStock, resStock);
            await uploadSale(reqSale, resSale);

            expect(resSale.state.status).toBe(200);
            expect(resSale.state.json).toBeTruthy();
        });
    });

    describe('Check if one can get the actual amount of data they have added to db', () => {
        test('Get sale', async () => {
            let reqSale = makeMockRequest({ body: {
                itemName: 'clear glass',
                itemPrice: 200,
                itemType: 'Glass',
                itemCount: 20
            } });
            let resSale = <MockResponse>makeMockResponse();
            let reqSale2 = makeMockRequest({ body: {
                itemName: 'clear glass',
                itemPrice: 200,
                itemType: 'Glass',
                itemCount: 20
            } });
            let resSale2 = <MockResponse>makeMockResponse();
            let getSaleReq = makeMockRequest({ params: { duration: 10, durationType: 'days'} });
            let getResSale = <MockResponse>makeMockResponse();
            await uploadSale(reqSale2, resSale2);
            await uploadSale(reqSale, resSale);
            await getSales(getSaleReq, getResSale);

            expect(getResSale.state.status).toBe(200);
            expect(getResSale.state.json).toHaveLength(1);
        });
    });
    
});
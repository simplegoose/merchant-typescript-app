import { Request, Response } from "express";

export type MockResponse = Response & {
    state: {
        status?: number | undefined,
        json?: unknown | undefined | Array<any>
    }
}

export function makeMockRequest({ params, body, query } : { params?: unknown, body?: unknown, query?: unknown}) : Request {
    return {
        params,
        body,
        query
    } as Request;
}

export function makeMockResponse() : Response {
    const res = {
        state: {

        }
    } as MockResponse;

    res.status = (status?: number) => {
        res.state.status = status;
        return res;
    }

    res.send = (message?: unknown) => {
        res.state.json = message;
        return res;
    }

    return res;
}
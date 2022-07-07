import { DurationTime } from "../interfaces/utils-interfaces";
export const responseMessage = {
    saved: 'Your upload has been saved',
    received: 'Your upload has been received',
    serverError: 'Internal server error has occured',
    401: 'Wrong username or password. If you don\'t have an account liase with root admin to have one.',
    400: 'Bad request',
    404: 'This resource is not available in the db'
};

export const formatToSeconds = (time: DurationTime) : number => {
    if (time?.durationType == 'years') {
        return time?.duration * 12 * 30 * 24 * 60 * 60 * 1000;
    }

    if (time?.durationType == 'months') {
        return time?.duration * 30 * 24 * 60 * 60 * 1000;
    }

    if (time?.durationType == 'weeks') {
        return time?.duration * 7 * 24 * 60 * 60 * 1000;
    }

    if (time?.durationType == 'days') {
        return time?.duration * 24 * 60 * 60 * 1000;
    }

    return 0;
};
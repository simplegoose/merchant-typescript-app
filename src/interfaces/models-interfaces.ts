export interface IUser {
    username: string;
    email: string;
    phoneNumber: string;
    password: string;
    token: string;
};

export interface ISales {
    itemName: string;
    itemPrice: string;
    totalSale: string;
    itemType: string;
};

export interface IStock {
    itemName: string;
    itemCount: number;
    itemPrice: string;
    itemType: string;
};
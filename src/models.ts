import Airtable = require('airtable');

export class User implements Airtable.Record<UserFields> {
    id: string;
    fields: UserFields;
}

export class UserFields {
    Id: string;
    Balance: number;
}

export class Investment implements Airtable.Record<InvestmentFields> {
    id: string;
    fields: InvestmentFields & { Id: string };
}

export class InvestmentFields {
    Item: string;
    Quantity: number;
    BuyPrice: number;
    SellPrice?: number;
    Bought: Date;
    Sold?: Date;
    Profit?: number;
    UserId: string;
}

export class Item {
    id: number;
    buy_average: number;
    buy_quantity: number;
    members: boolean;
    name: string;
    overall_average: number;
    overall_quantity: number;
    sell_average: number;
    sell_quantity: number;
    sp: number;
}
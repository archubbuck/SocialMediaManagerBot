import { Item } from "./models";
import fetch from 'node-fetch';

export class Items {

    public static async get(itemName: string) {
        const url = "https://storage.googleapis.com/osb-exchange/summary.json";

        const response = await fetch(url, {
            method: "GET"
        });

        const items: Record<number, Item> = await response.json();
        const item = Object.values(items).find(m => m.name.toLowerCase() === itemName.toLowerCase());

        if (!item) throw `Unable to find item: **${itemName}**`;

        return item;
    }

}

export class Numbers {

    public static toKMB(number: number) {
        if (number > 999999999 || number < -999999999) {
            return Math.round(number / 1000000000) + 'b';
        }
        else if (number > 999999 || number < -999999) {
            return Math.round(number / 1000000) + 'm';
        }
        else if (number > 999 || number < -999) {
            return Math.round(number / 1000) + 'k';
        }
        else {
            return Math.round(number).toString();
        }
    }

    public static fromKMB(number: string) {
        number = number.toLowerCase().replace(/,/g, '');
        const [numberBefore, numberAfter] = number.split(/[.kmb]/g);
        let newNum = numberBefore;
        if (number.includes('b')) {
            newNum += numberAfter + '0'.repeat(9).slice(numberAfter.length);
        }
        else if (number.includes('m')) {
            newNum += numberAfter + '0'.repeat(6).slice(numberAfter.length);
        }
        else if (number.includes('k')) {
            newNum += numberAfter + '0'.repeat(3).slice(numberAfter.length);
        }
        return parseInt(newNum);
    }

}

// function round(number)   {
//     return (Math.round(number * 100) / 100).toString();
// }
// function toKMB(number) {
//     if (number > 999999999 || number < -999999999) {
//         return round(number / 1000000000) + 'b';
//     }
//     else if (number > 999999 || number < -999999) {
//         return round(number / 1000000) + 'm';
//     }
//     else if (number > 999 || number < -999) {
//         return round(number / 1000) + 'k';
//     }
//     else {
//         return round(number);
//     }
// }
// exports.toKMB = toKMB;
// function fromKMB(number) {
//     number = number.toLowerCase().replace(/,/g, '');
//     const [numberBefore, numberAfter] = number.split(/[.kmb]/g);
//     let newNum = numberBefore;
//     if (number.includes('b')) {
//         newNum += numberAfter + '0'.repeat(9).slice(numberAfter.length);
//     }
//     else if (number.includes('m')) {
//         newNum += numberAfter + '0'.repeat(6).slice(numberAfter.length);
//     }
//     else if (number.includes('k')) {
//         newNum += numberAfter + '0'.repeat(3).slice(numberAfter.length);
//     }
//     return parseInt(newNum);
// }
export interface PerformanceData {
    userId: string;
    title: string;
    subTitle: string;
    startDate: string;
    endDate: string;
    category: string;
    runTime: string;
    showAddress: string;
    showSubAddress: string;
    bank: string;
    account: string;
    discriptionText: string;
    discriptionImg: string;
    caveats: string;
    posterPaths: string[];
    showAge: string;
}


export interface ShowInfo {
    title: string;
    subTitle: string;
    startDate: string;
    endDate: string;
    category: string;
    showAddress: string;
    showSubAddress: string;
    showAge: string;
    bank: string;
    accountNumber: string;
    runtime: string;
}

export interface Discription {
    discriptionText: String;
    discriptionImg: String;
}

export interface Actor {
    actorName: string;
    characterName: string;
    actorPath: any;
}

export interface Round {
    roundDate: String;
    roundTime: String;
}

export interface Seat {
    seatName: string;
    colSeat: number;
    rowSeat: number;
    seatClass: string;
    seatAmount: number|undefined;
    isReserved: Boolean;
}

export interface Coupon {
    couponName: string | number | readonly string[] | undefined;
    discount: number;
    couponCode: string;
    isPermit: boolean;
}

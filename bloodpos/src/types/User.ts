export interface User {
    _id?: string;
    phoneNumber: string;
    name: string;
    address: string;
    city: string;
    pincode: string;
    state: string;
    location: {
        latitude: number;
        longitude: number;
      },
    aadhaar: string;
    bloodGroup: string;
    gender: string;
    subscription : Subscription;

}

export interface Subscription{
    subscriptionId?: string;
    subscriptionTier: string;
    subscriptionStatus: string;
    subscriptionStartDate: string;
    subscriptionEndDate?: string;
    searchCount: string;
    callCount: string;
    donationRequestCount: string;
}


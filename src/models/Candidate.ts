export class Candidate{
    id?: number;
    firstName:String;
    middleName?:String;
    lastName:String;
    nricPassport:String;

    constructor(
        id: number,
        firstName:String,
        middleName:String,
        lastName:String,
        nricPassport:String,
    ){
        this.id = id;
        this.firstName = firstName;
        this.middleName = middleName;
        this.lastName = lastName;
        this.nricPassport = nricPassport;
    }
}
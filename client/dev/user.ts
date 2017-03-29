export class User{
    constructor(
        public first: string = '',
        public last: string = '',
        public username: string = '',
        public password: string = '',
        public confirm: string = '',
        public email: string = ''){ }
}
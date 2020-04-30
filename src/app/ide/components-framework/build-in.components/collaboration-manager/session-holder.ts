
class _SessionHolder {
    private _user: {
        id: string,
        username: string
    };

    constructor() {
        this._user = {
            id: "5ac8e06dac135912cc2314ac",
            username: "wtina"
        };
    }

    public get User(): { id: string, username: string } {
        return this._user;
    }

    public set User(user: { id: string, username: string }) {
        this._user = user;
    }
}

export let SessionHolder = new _SessionHolder();
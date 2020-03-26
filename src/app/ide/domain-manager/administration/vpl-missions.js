

export class VPLMissions {
    constructor(missions =[]) {
        this._missions = missions;
    }

    get missions() {
        return this._missions;
    }

    set missions(missions) {
        this._missions = missions;
    }

    load() {
        this._missions.forEach((mission) => {
            
        });
    }

    unload() {

    }
}

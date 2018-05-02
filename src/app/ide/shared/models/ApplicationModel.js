module.exports =
class ApplicationModel {
    constructor(
        id,
        title,
        description,
        img,
        lastUpdated
    ) {
        this._id = id;
        this.title = title;
        this.description = description;
        this.img = img;
        this.lastUpdated = lastUpdated;
    }

    static getElements() {
        let obj = {};
        Object.getOwnPropertyNames(new ApplicationModel()).forEach((name) => obj[name] = 1 );
        return obj;
    }
}
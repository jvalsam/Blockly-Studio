
export function getPItem(pItemId){
    var retVal = false;
    DB.projectItems.forEach(item => {
        if(item.systemID == pItemId){
            retVal = item;
            return;
        }
    });
    return retVal;
}

export function pItemExists(pItemId){
    var retVal = false;
    DB.projectItems.forEach(item => {
        if(item.systemID == pItemId){
            retVal = true;
            return;
        }
    });
    return retVal;
}

export function pItemAdd(pItem){
    DB.projectItems.push(pItem);
}

export function pItemRemove(pItemId){
    var position = 0;
    for(var item in DB.projectItems){
		item = DB.projectItems[item];
		if(item.systemID === pItemId){
            DB.projectItems.splice(position, 1);
			return true;
		}
		position++;
    }
}

export function updateProject(newDB){
    DB = newDB;
}

var DB = {
    author: {
        _id: "5ac8e06dac135912cc2314ac",
        username: "alex"
    },
    systemIDs: 2,
    projectItems: [ 
        {
            renderParts : [ 
                {
                    _id : "5e8e414b1ac1a02720c7682a",
                    type : "img",
                    value : {
                        fa : "fa fa-tablet"
                    }
                }, 
                {
                    _id : "5e8e414b1ac1a02720c76829",
                    type : "title",
                    value : {
                        text : "Blockly Task 16"
                    }
                }, 
                {
                    _id : "5e8e414b1ac1a02720c76828",
                    type : "colour",
                    value : {
                        colour : "#DAD9D9"
                    }
                }
            ],
            systemID : "5e8278e38d8bb7792f314fa0_17",
            privileges: {
                author: "...",
                owner: "...",
                shared: {
                    type: "NOT_SHARED | SHARED_PROJECT | SHARED_PERSONAL",
                    members: [
                        "has memberInfo items in case type is SHARED_PERSONAL"
                    ]
                },
                hidden: "based_on_collab_settings",
                readOnly: false
            },
            parent : "jstree_BlocklyTasks",
            orderNO : 1,
            type : "pi-blockly-task"
        }
    ],
    domainElements: [],
    /*collaborationData: {
        members: [
            {
                name: "alex",
                icon: "..."
            }
        ],
        whatMore: "whatMore"
    },*/
    title: "First App",
    description: "This is first application with only start task empy.",
    domainType: "SimpleTasks",
    created: "2019-01-01T00:00:00.000Z",
    lastModified: "2019-01-01T00:00:00.000Z"
};
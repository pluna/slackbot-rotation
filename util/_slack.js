export const token = process.env.SLACK_BOT_TOKEN
export const signingSecret = process.env.SLACK_SIGNING_SECRET

export const slack = {
    userGroups: {},
    createUserGroup: async function (name) {
        console.log("creating usergroup")

        let data = {
            name:name,
            handle:name
        }

        const response = await fetch("https://slack.com/api/usergroups.create", {
            method: "POST",
            headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Authorization': 'Bearer '+token
            },
            body: JSON.stringify(data)
        });
        const userGroup = await response.json();
        console.log(JSON.stringify(userGroup));
        if(!userGroup.ok){
            if(userGroup.error == "name_already_exists")
                throw "Usergroup already exists"
            throw "Error getting usergroups. Error: "+userGroup.error
        }

        return userGroup.usergroup
    },
    setUsersInUserGroup: async function(id, users) {
        console.log('users', users)
        let userIds = new Array()
        users.forEach(element => {
            //userformat: <@U035PFUMC1M|pablo>
            let idPart = element.split("|")[0]
            userIds.push(idPart.substring(2,idPart.length))
        });
        console.log(userIds)
        let data = {
            usergroup: id,
            users: userIds
        }
        const response = await fetch("https://slack.com/api/usergroups.users.update", {
            method: "POST",
            headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Authorization': 'Bearer '+token
            },
            body: JSON.stringify(data)
        });
        const userGroup = await response.json();
        console.log(JSON.stringify(userGroup));
        if(!userGroup.ok){
            throw "Error getting usergroups. Error: "+userGroup.error
        }
        return userGroup.usergroup
    },
    getUserGroup: async function (ugrup) {
        const response = await fetch("https://slack.com/api/usergroups.list", {
            method: "GET",
            headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Authorization': 'Bearer '+token
            },
        });
        const result = await response.json();
        console.log(JSON.stringify(result));
        if(!result.ok){
            throw "Error getting usergroups. Error: "+userGroup.error
        }
        let usergroup = undefined
        let parts = ugrup.split("|")
        let uId = parts[0].substring(2,parts[0].length)
        result.usergroups.forEach(element => {                
            if(element.id == uId){
                usergroup = element
            }
        });
        return usergroup
    }
}
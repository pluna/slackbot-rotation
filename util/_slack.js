export const token = process.env.SLACK_BOT_TOKEN
export const signingSecret = process.env.SLACK_SIGNING_SECRET

export const slack = {
    userGroups: {},
    createUserGroup: async function (name) {
        console.log("creating usergroup")
        let result = undefined
        if(!this.userGroups[name]===undefined){
            result = {ok:false, error:'usergroup already exists'}
        }
        let id = "U00"+name
        this.userGroups[name]={id:id, name:name, users:[]}        
        result = {ok:true, usergroup:this.userGroups[name]}
        if(result.ok !=true) {
            throw "couldn't create the usergroup. Error:"+result.error
        }
        return result
    },
    setUsersInUserGroup: async function(name, users) {
        console.log('setUser')
        if(this.userGroups[name]===undefined){
            return {ok:false, error:"usergroup doesn't exists"}
        }
        let id = "U00"+name
        this.userGroups[name].users = users
        return {ok:true, usergroup:this.userGroups[name]}
    },
    getUserGroup: async function(name){
        if(this.userGroups[name]===undefined){
            return {ok:false, error:"usergroup doesn't exists"}
        }        
        return {ok:true, usergroup:this.userGroups[name]}
    },
    updateUserGroup: async function (name, users){
        let usergroupExists = await this.getUserGroup(name)

        console.log("exists", JSON.stringify(usergroupExists))

        if(!usergroupExists.ok) {
            let usergroup = await slack.createUserGroup(name)
            console.log("usergroup", JSON.stringify(usergroup))
            if(!usergroup.ok)
                throw usergroup.error
        }

        let response = await this.setUsersInUserGroup(name, rotation.users)

        console.log('slack response', JSON.stringify(response))

        if(!response.ok)
            throw response.error
        return response.usergroup
    }
}
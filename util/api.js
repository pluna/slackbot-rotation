export function sayHello (){
    return "hello again"
}

export function tokenizeString(string) {
    const array = string.split(' ').filter((element) => {
        return element !== ''
    })
    console.log('Tokenized version:', array)
    return array
}

export function replyWithError(res, msg) {
    res.send({
      response_type: 'ephemeral',
      text: `${msg}`,
    })
}
import apolloClient from "@/api/graphql/index"
import gql from 'graphql-tag'
import pako from "pako"

function decodeDialogueContent(content) {
    let strData = window.atob(content)
    const charData = strData.split('').map(function (x) {
        return x.charCodeAt(0)
    })
    const binData = new Uint8Array(charData)
    const data = pako.inflate(binData)
    strData = String.fromCharCode.apply(null, new Uint16Array(data))
    strData = decodeURIComponent(strData)
    return strData
}

function encodeDialogueContent(content) {
    const binaryString = pako.gzip(encodeURIComponent(content), {to: 'string'})
    return window.btoa(binaryString)
}

export let createDialogue = function (v) {
    return apolloClient().mutate({
        mutation: gql`mutation ($ownerId: ID!, $newDialogue: InputDialogue) {
            createDialogue(ownerId: $ownerId, dialogue: $newDialogue) {
                id
                name
                owner
                ownerType
                recentlyAuthor
                type
                content
                createdAt
            }
        }`,
        variables: v
    }).then((res) => {
        if (res.data.createDialogue !== undefined) {
            res.data.createDialogue.content = decodeDialogueContent(res.data.createDialogue.content)
        }
        return res
    })
}

export let getAllDialogue = function (v) {
    return apolloClient().query({
        query: gql`query ($ownerType: OwnerType!, $parentPath: String!, $ownerId: ID) {
            getAllDialogues(ownerType: $ownerType, parentPath: $parentPath, ownerId: $ownerId) {
                id
                name
                owner
                ownerType
                recentlyAuthor
                type
                parentPath
                createdAt
            }
        }`,
        variables: v
    })
}

export let getOneDialogue = function (v) {
    return apolloClient().query({
        query: gql`query ($id: ID!) {
            getOneDialogue(id: $id) {
                id
                createdAt
                updatedAt
                name
                owner
                ownerType
                recentlyAuthor
                type
                parentPath
                content
            }
        }`,
        variables: v
    }).then((res) => {
        if (res.data.getOneDialogue !== undefined) {
            res.data.getOneDialogue.content = decodeDialogueContent(res.data.getOneDialogue.content)
        }
        return res
    })
}

export let updateDialogueContent = function (v) {
    if (v.dialogueContent !== undefined) {
        v.dialogueContent = encodeDialogueContent(v.dialogueContent)
    }
    return apolloClient().mutate({
        mutation: gql`mutation ($id: ID!, $dialogueContent: String) {
            updateDialogueContent(id: $id, content: $dialogueContent) {
                id
                createdAt
                updatedAt
                name
                owner
                ownerType
                recentlyAuthor
                type
                parentPath
                content
            }
        }`,
        variables: v
    }).then((res) => {
        if (res.data.updateDialogueContent !== undefined) {
            res.data.updateDialogueContent.content = decodeDialogueContent(res.data.updateDialogueContent.content)
        }
        return res
    })
}

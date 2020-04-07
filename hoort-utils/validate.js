const { ContentError } = require('hoort-errors')

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

module.exports = {
    string(target, name, empty = true) {
        if (typeof target !== 'string') throw new TypeError(`${name} ${target} is not a string`)
        this.type(target, name, String)

        if (empty && !target.trim()) throw new ContentError(`${name} is empty`)
    },

    operation(target, name) {
        if (operation != '+' && operation != '-') throw new ContentError(`${name} ${target} is not a valid operation`)
    },

    email(target) {
        if (!EMAIL_REGEX.test(target)) throw new ContentError(`${target} is not an e-mail`) // TODO custom error?
    },

    type(target, name, type) {
        if (type === String || type === Number || type === Boolean) {
            type = type.name.toLowerCase()

            if (typeof target !== type) throw new TypeError(`${name} ${target} is not a ${type}`)
        } else if (!(target instanceof type)) throw new TypeError(`${name} ${target} is not a ${type.name}`)
    },

    array(target, name) {
        if (!(target instanceof Array)) throw new TypeError(`${name} ${target} is not an array`)
    },

    scheme(target) {

        if (!(target instanceof Array)) throw new TypeError('scheme is not an array')

        if (target.length < 5 || target.length > 20) throw new ContentError('invalid number of rows')

        target.forEach(item => { if (!(item instanceof Array)) throw new TypeError(`scheme element ${item} is not an array`) })

        target.forEach(item => { if (item.length < 3 || item.length > 12) throw new ContentError('invalid number of columns') })

        //target.forEach(item => item.forEach(element => { if (typeof element !== "boolean" || typeof element !== "string" ) throw new TypeError(`${element} is neither a string nor a boolean`) }))
    }
}
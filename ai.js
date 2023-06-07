const SIZE = 100
const MAP = new Int8Array(SIZE * SIZE) // State of the Map
const isFree = ({ x, y }) => MAP[y * SIZE + x] === 0 // 0 = block free
const isOccupied = ({ x, y }) => MAP[y * SIZE + x] === 1 // 1 = block occupied
const isMe = ai => ai.me // is true if this AI is you

// `inBounds` check if our coord (n) is an existing index in our MAP
const inBounds = n => n < SIZE && n >= 0

// `isInBounds` check that properties x and y of our argument are both in bounds
const isInBounds = ({ x, y }) => inBounds(x) && inBounds(y)

// `pickRandom` get a random element from an array
const pickRandom = arr => arr[Math.floor(Math.random() * arr.length)]

// `addToMap` save the new positions into the map
const isAlley = ({ x, y }) => !isFree({ x, y }) || !isInBounds({ x, y })

// this functions will find the best path, so the path that has more empty spaces
const findBFS = ({ ai }) => {
    let arr = []
    let carrent = ai.cardinal
    // if it as a block on the symmetric position it must simulate the symmetric position and see witch path is the best

    if (
        (carrent === 3 || carrent === 0) &&
        !isFree({ x: ai.x - 1, y: ai.y - 1 }) &&
        isFree({ x: ai.x, y: ai.y - 1 }) &&
        isFree({ x: ai.x - 1, y: ai.y })
    ) {
        let xad = ai.x - 1
        let yad = ai.y - 1
        let choose = [
            calDistance(xad + 1, yad, 1, 0),
            calDistance(ai.x, ai.y - 1, 0, 0),
            calDistance(ai.x - 1, ai.y, 3, 0),
            calDistance(xad, yad + 1, 2, 0),
        ]
        let index = choose.indexOf(Math.max(...choose))
        return index === 0 || index === 1 ? ai.coords[0] : ai.coords[3]
    }
    if (
        (carrent === 1 || carrent === 0) &&
        !isFree({ x: ai.x + 1, y: ai.y - 1 }) &&
        isFree({ x: ai.x, y: ai.y - 1 }) &&
        isFree({ x: ai.x + 1, y: ai.y })
    ) {
        let xad = ai.x + 1
        let yad = ai.y - 1
        let choose = [
            calDistance(xad, yad + 1, 2, 0),
            calDistance(ai.x + 1, ai.y, 1, 0),
            calDistance(ai.x, ai.y - 1, 0, 0),
            calDistance(xad - 1, yad, 3, 0),
        ]
        let index = choose.indexOf(Math.max(...choose))
        return index === 0 || index === 1 ? ai.coords[1] : ai.coords[0]
    }
    if (
        (carrent === 2 || carrent === 1) &&
        !isFree({ x: ai.x + 1, y: ai.y + 1 }) &&
        isFree({ x: ai.x, y: ai.y + 1 }) &&
        isFree({ x: ai.x + 1, y: ai.y })
    ) {
        let xad = ai.x + 1
        let yad = ai.y + 1
        let choose = [
            calDistance(xad - 1, yad, 3, 0),
            calDistance(ai.x, ai.y + 1, 2, 0),
            calDistance(ai.x + 1, ai.y, 1, 0),
            calDistance(xad, yad - 1, 0, 0),
        ]
        let index = choose.indexOf(Math.max(...choose))
        return index === 0 || index === 1 ? ai.coords[2] : ai.coords[1]
    }
    if (
        (carrent === 2 || carrent === 3) &&
        !isFree({ x: ai.x - 1, y: ai.y + 1 }) &&
        isFree({ x: ai.x, y: ai.y + 1 }) &&
        isFree({ x: ai.x - 1, y: ai.y })
    ) {
        let xad = ai.x - 1
        let yad = ai.y + 1
        let choose = [
            calDistance(xad + 1, yad, 1, 0),
            calDistance(ai.x, ai.y + 1, 2, 0),
            calDistance(ai.x - 1, ai.y, 3, 0),
            calDistance(xad, yad - 1, 0, 0),
        ]
        let index = choose.indexOf(Math.max(...choose))
        return index === 0 || index === 1 ? ai.coords[2] : ai.coords[3]
    }

    for (const { x, y, cardinal } of ai.coords) {
        // if everything is ok it must continue with the best path
        arr.push(calDistance(x, y, cardinal, 0))
    }
    return ai.coords[arr.indexOf(Math.max(...arr))]
}

// recursion
const calDistance = (x, y, carrent, count) => {
    if (carrent <= 0) {
        if (
            isFree({ x, y }) &&
            isAlley({ x: x + 1, y }) &&
            isAlley({ x, y: y - 1 }) &&
            isAlley({ x: x - 1, y })
        )
            return -1
        return !isFree({ x, y }) || !inBounds(y - 1)
            ? count
            : calDistance(x, y - 1, carrent, count + 1)
    }
    if (carrent === 1) {
        if (
            isFree({ x, y }) &&
            isAlley({ x, y: y + 1 }) &&
            isAlley({ x, y: y - 1 }) &&
            isAlley({ x: x + 1, y })
        )
            return -1
        return !isFree({ x, y }) || !inBounds(x + 1)
            ? count
            : calDistance(x + 1, y, carrent, count + 1)
    }
    if (carrent === 2) {
        if (
            isFree({ x, y }) &&
            isAlley({ x: x - 1, y }) &&
            isAlley({ x, y: y + 1 }) &&
            isAlley({ x: x + 1, y })
        )
            return -1
        return !isFree({ x, y }) || !inBounds(y + 1)
            ? count
            : calDistance(x, y + 1, carrent, count + 1)
    }
    if (carrent === 3) {
        if (
            isFree({ x, y }) &&
            isAlley({ x, y: y - 1 }) &&
            isAlley({ x: x - 1, y }) &&
            isAlley({ x, y: y + 1 })
        )
            return -1
        return !isFree({ x, y }) || !inBounds(x - 1)
            ? count
            : calDistance(x - 1, y, carrent, count + 1)
    }
}

const addToMap = ({ x, y }) => (MAP[y * SIZE + x] = 1)

const graphElem = ({ x, y }) => {
    var obj = {
        coords: { x, y },
        distance: undefined,
        predator: undefined,
    };
    return obj
}

const update = state => {
    state.ais.forEach(addToMap)
    return findBFS(state)
}
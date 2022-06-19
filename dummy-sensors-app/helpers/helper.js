export const getRandom = (min, max) => (Math.random() * (max - min)) + min;
export const getRandomInt = (min, max) => Math.floor(getRandom(min, max));

export default {
    getRandom,
    getRandomInt
};

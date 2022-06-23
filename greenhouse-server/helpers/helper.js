export const getRandom = (min, max) => (Math.random() * (max - min)) + min;
export const getRandomInt = (min, max) => Math.floor(getRandom(min, max));
export const mapBetween = (currentNum, minAllowed, maxAllowed, min, max) => (maxAllowed - minAllowed) * (currentNum- min) / (max - min) + minAllowed;
  
export default {
    getRandom,
    getRandomInt,
    mapBetween
};

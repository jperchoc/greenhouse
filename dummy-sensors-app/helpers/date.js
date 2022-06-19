export const isTimeBefore = (a, b) => {
    const minA = a.getHours() * 60 + a.getMinutes();
    const minB = a.getHours() * 60 + a.getMinutes();
    return minA < minB;
}
export const isTimeAfter = (a, b) => {
    const minA = a.getHours() * 60 + a.getMinutes();
    const minB = a.getHours() * 60 + a.getMinutes();
    return minA > minB;
}

export default {
    isTimeBefore,
    isTimeAfter
}
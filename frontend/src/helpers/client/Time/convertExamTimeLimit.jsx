export const convertTimeLimit = (time) => {
    let minutes = time/60;
    let sec = time - minutes * 60;
    return `${minutes} phút`;
}
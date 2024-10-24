const checkDate = function(givenDate) {
    let rightNowDate = ``;
    if (givenDate) {
        rightNowDate = new Date(givenDate);
    } else {
        rightNowDate = new Date();
    }
    const mm = String(rightNowDate.getMonth() + 1); //January is 0!
    const dd = String(rightNowDate.getDate());
    const yyyy = rightNowDate.getFullYear();
    const mon = new Intl.DateTimeFormat('en-US', { month: 'long'}).format(rightNowDate);
    const fullDateStrMoFirst = `${mon} ${dd}, ${yyyy}`;
    const fullNumDateMoFirst = new Date(`${mm}-${dd}-${yyyy}`);
    const fullNumDateYrFirst = new Date(`${yyyy}-${mm}-${dd}`);
    const unixTimestamp = Math.floor(fullNumDateYrFirst.getTime() / 1000);
    const rightNowHour = rightNowDate.getHours();
    const rightNowMins= String(rightNowDate.getMinutes()).padStart(2, '0');
    const amOrPm = rightNowHour >= 12 ? 'pm' : 'am';
    const convertedRightNowHour = (rightNowHour % 12) || 12;
    const rightNowTime = `${convertedRightNowHour}:${rightNowMins}${amOrPm}`;
    return {
        rightNowDate,
        mm,
        dd,
        yyyy,
        mon,
        fullDateStrMoFirst,
        fullNumDateYrFirst,
        fullNumDateMoFirst,
        unixTimestamp,
        rightNowHour,
        rightNowMins,
        amOrPm,
        convertedRightNowHour,
        rightNowTime
    };
}
export {checkDate};
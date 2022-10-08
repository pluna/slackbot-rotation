export function replyFailed(res, err) {
    console.log('fetch Error:', err);
    res.send({
        response_type: 'ephemeral',
        text: `${err}`,
    });
}

export function replySuccess(res, msg) {
    console.log('Success:', msg);
    res.send({
        response_type: 'in_channel',
        text: msg,
    });
}

export function getNextDayOfTheWeek(dayName, hour = 0, fortnight=false, excludeToday = true, refDate = new Date()) {
    var hourValue =0;
        hourValue = hour.includes("am")? Number(hour.slice(0,-2)):hour;
        hourValue = hourValue.includes("pm")? Number(hourValue.slice(0,-2))+12:hourValue

    console.log(hourValue)

    const dayOfWeek = ["sun","mon","tue","wed","thu","fri","sat"]
                      .indexOf(dayName.slice(0,3).toLowerCase())
    if (dayOfWeek < 0) return;
    const increment = fortnight?14:7
    
    console.log('increment', increment)
    console.log('day', dayOfWeek+increment)
    console.log('refDate',refDate.toISOString())
    
    refDate.setHours(hourValue,0,0,0);
    refDate.setDate(refDate.getDate() + +!!excludeToday + 
                    (dayOfWeek + increment - refDate.getDay() - +!!excludeToday) % increment);
    return refDate;
}
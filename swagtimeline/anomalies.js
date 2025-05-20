const dayjs = require('dayjs');

const series = {
    "2025Q2": {
        "handle": "2025Q2"
        , "name": "+Theta"
    }
    , "2025Q3": {
        "handle": "2025Q3"
        , "name": "+Delta"
    }
    , "2025Q4": {
        "handle": "2025Q4"
        , "name": "Unknown"
    }
}
;

const anomalies = [
    {
        "date": dayjs(new Date('2025-05-17'))
        , "series": series["2025Q2"]
        , "subseries": "1"
        , "sites": "Manila, Providence"
    }
    , {
        "date": dayjs(new Date('2025-06-14'))
        , "series": series["2025Q2"]
        , "subseries": "2"
        , "sites": "Perth, Chemnitz"
    }
    , {
        "date": dayjs(new Date('2025-08-16'))
        , "series": series["2025Q3"]
        , "subseries": "1"
        , "sites": "Malacca, Portland"
    }
    , {
        "date": dayjs(new Date('2025-08-23'))
        , "series": series["2025Q3"]
        , "subseries": "2"
        , "sites": "Gothenburg, Quebec"
    }
    , {
        "date": dayjs(new Date('2025-09-20'))
        , "series": series["2025Q3"]
        , "subseries": "3"
        , "sites": "Denpasar, Cambridge"
    }
    , {
        "date": dayjs(new Date('2025-10-18'))
        , "series": series["2025Q4"]
        , "subseries": "1"
        , "sites": "Valencia, São Paulo"
    }
    , {
        "date": dayjs(new Date('2025-10-25'))
        , "series": series["2025Q4"]
        , "subseries": "2"
        , "sites": "Wellington, Houston"
    }
    , {
        "date": dayjs(new Date('2025-11-15'))
        , "series": series["2025Q4"]
        , "subseries": "3"
        , "sites": "Taoyuan, The Hague"
    }
]
;

module.exports = {
    series: series
    , anomalies: anomalies
}
import axios from 'axios';

const prettyDate2 = (time) => {
    const date = new Date(time);
    return date.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'});
}

const getLabels = (timeArray) => {
    return timeArray.map((time) => {
        return prettyDate2(time);
    })
}

const transformData = () => {
    const rawData = [
        {
            count: 65,
            time: "2015-10-22T19:20:08",
            name: 'Dataset 1'
        },
        {
            count: 15,
            time: "2015-10-22T19:30:08",
            name: 'Dataset 1'
        },
        {
            count: 80,
            time: "2015-10-22T19:40:08",
            name: 'Dataset 1'
        },
        {
            count: 57,
            time: "2015-10-22T19:50:08",
            name: 'Dataset 1'
        },
        {
            count: 40,
            time: "2015-10-22T19:20:08",
            name: 'Dataset 2'
        },
        {
            count: 25,
            time: "2015-10-22T19:30:08",
            name: 'Dataset 2'
        },
        {
            count: 70,
            time: "2015-10-22T19:40:08",
            name: 'Dataset 2'
        },
        {
            count: 90,
            time: "2015-10-22T19:50:08",
            name: 'Dataset 2'
        }
    ]

    const dataMap = {}
    const timeSet = new Set()
    rawData.forEach((data) => {
        if (dataMap[data.name] && dataMap[data.name].data && dataMap[data.name].data.length) {
            dataMap[data.name].data.push(data.count)
        } else {
            dataMap[data.name] = {
                label: data.name,
                data: [data.count]
            }
        }

        timeSet.add(data.time);
    })

    const timeArray = [...timeSet];

    const labels = getLabels(timeArray);

    const datasets = Object.values(dataMap);

    return {
        datasets: datasets,
        labels: labels
    }
}

export const getData = (params) => {
    return axios.get('/stuff')
        .then(response => transformData())
        .catch(error => transformData())

    // return axios.get('/stuff')
    //     .then(response => transformData(response.data))
    //     .catch(error => error)
}
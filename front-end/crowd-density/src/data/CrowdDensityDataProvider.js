import axios from 'axios';

const prettyDate2 = (time) => {
    const date = new Date(time * 1000);
    return date.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'});
}

const getLabels = (timeArray) => {
    return timeArray.map((time) => {
        return prettyDate2(time);
    })
}

const transformData = (rawData) => {
    const dataMap = {
        rumman_macbook: {
            data: [],
            label: "rumman_mackbook"
        },
        micah_asus: {
            data: [],
            label: "micah_asus"
        },
        jacky_pc: {
            data: [],
            label: "jacky_pc"
        }
    }
    const timeSet = new Set()
    rawData.forEach((data) => {
        dataMap["rumman_macbook"].data.push(data.count.rumman_macbook);
        dataMap["micah_asus"].data.push(data.count.micah_asus);
        dataMap["jacky_pc"].data.push(data.count.jacky_pc);
        timeSet.add(data.start_time);
    })

    const timeArray = [...timeSet];

    const labels = getLabels(timeArray);

    const datasets = Object.values(dataMap);
    return {
        datasets: datasets,
        labels: labels
    }
}

const transformMapData = (rawData) => {
    const map = rawData;
    return {
        map: map
    }
}

export const getHeatMap = () => {
    const url = `http://192.168.1.200:8000/data/heatmap`;
    return axios.get(url)
        .then((response) => {
            return transformMapData(response.data)}
        ).catch((error) => {
            console.log(error);
        })
}

export const getData = (params) => {
    let start = "";
    let end = "";
    if (params && params.start) {
        const date = new Date(params.start).getTime() / 1000;
        start = `&start_time=${date}`
    }
    if (params && params.end) {
        const date = new Date(params.end).getTime() / 1000;
        end = `&end_time=${date}`
    }

    const url = `http://192.168.1.200:8000/data/active-clients?interval=60${start}${end}`;
    console.log(url);
    return axios.get(url)
        .then((response) => {
            console.log(response);
            // console.log(response);
            return transformData(response.data)}
        ).catch((error) => {
            console.log(error);
            // transformData(error)
        })

    // return axios.get('/stuff')
    //     .then(response => transformData(response.data))
    //     .catch(error => error)
}
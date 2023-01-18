const csvFilePath = 'src/data/matches.csv';
const csvFilePath1 = 'src/data/deliveries.csv';
import fs from 'fs';
import pkg from 'csvtojson';
const { csv } = pkg;


export function matchesPlayedPerYear() {
    csv()
        .fromFile(csvFilePath)
        .then((jsonObj) => {
            var data1 = JSON.stringify(jsonObj, ['season']);
            var data2 = JSON.parse(data1);
            var matchesPerYear = new Object();
            for (var i = 0; i < data2.length; i++) {
                if (matchesPerYear.hasOwnProperty(data2[i]['season']) == false)
                    matchesPerYear[data2[i]['season']] = 1;
                else
                    matchesPerYear[data2[i]['season']] += 1;

            }

            fs.writeFileSync('src/public/output/matchesPerYear.json', JSON.stringify(matchesPerYear), 'utf-8');
        })
}



export function matchesWonPerTeamPerYear() {
    csv()
        .fromFile(csvFilePath)
        .then((jsonObj) => {
            var data1 = JSON.stringify(jsonObj, ['season', 'winner']);
            var data2 = JSON.parse(data1);
            //console.log(data2);

            let matchesWonPerYear = data2.reduce(function (acc, current) {
                if (acc.hasOwnProperty(current.winner)) {
                    if (acc[current.winner].hasOwnProperty(current.season))
                        acc[current.winner][current.season] = acc[current.winner][current.season] + 1;
                    else
                        acc[current.winner][current.season] = 1;
                } else {
                    acc[current.winner] = {};
                    acc[current.winner][current.season] = 1;
                }
                return acc;
            }, {});
            //console.log(matchesWonPerYear);
            fs.writeFileSync('src/public/output/matchesWonPerYear.json', JSON.stringify(matchesWonPerYear), 'utf-8');
        })
}

export function extraRunsPerTeam() {
    csv()
        .fromFile(csvFilePath1)
        .then((jsonObj) => {
            var data1 = JSON.stringify(jsonObj, ['match_id', 'bowling_team', 'extra_runs']);
            var data2 = JSON.parse(data1);
            //console.log(data2);
            let extraRun2016 = data2.filter(function (data) {
                return (parseInt(data.match_id) >= 577 && parseInt(data.match_id) <= 636);
            }).reduce(function (output, current) {
                let extra = parseInt(current.extra_runs)
                if (output.hasOwnProperty(current.bowling_team))
                    output[current.bowling_team] = output[current.bowling_team] + extra;
                else
                    output[current.bowling_team] = extra;
                return output;
            }, {});

            //console.log(extraRun2016);

            fs.writeFileSync('src/public/output/extraRunsPerTeam2016.json', JSON.stringify(extraRun2016), 'utf-8');

        })
}


export function top10EconomicalBowlers2015() {
    csv()
        .fromFile(csvFilePath1)
        .then((jsonObj) => {
            var data1 = JSON.stringify(jsonObj);
            var data2 = JSON.parse(data1);
            let bowlers = data2.filter(function (data) {
                return (parseInt(data.match_id) >= 518 && parseInt(data.match_id) <= 576);
            }).reduce(function (result, current) {
                let temp = parseInt(current.total_runs)
                if (result.hasOwnProperty(current.bowler)) {
                    result[current.bowler]['runs'] = result[current.bowler]['runs'] + temp;
                    result[current.bowler]['balls'] = result[current.bowler]['balls'] + 1;
                } else {
                    result[current.bowler] = {
                        "runs": temp,
                        "balls": 1
                    }
                }
                return result;
            }, {});
            let keys = Object.keys(bowlers).reduce(function (result, current) {
                result[current] = (bowlers[current].runs * 6 / bowlers[current].balls).toFixed(2);
                return result;
            }, {})
            let economicalBowlers = Object.entries(keys).sort(function (temp1, temp2) {
                return temp2[1] - temp1[1];

            }).slice(0, 10);

            // console.log(economicalBowlers);
            fs.writeFileSync('src/public/output/economicalBowlers2015.json', JSON.stringify(economicalBowlers), 'utf-8');
        })


}




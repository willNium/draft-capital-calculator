const allPicks = require("./currentPicks");
const fs = require('fs');

// {
//     year1: [ franchise1, franchise2... ],
//     year2: [ franchise1, franchise3... ]
// }
const numTeams = 12;

const getRound = (pick) => {
    const round = pick < numTeams ? 1 : pick >= numTeams && pick < numTeams * 2 ? 2 : pick >= numTeams * 2 && pick < numTeams * 3 ? 3 : false;
    if (!round) {
        throw Error(`${pick} is not a valid pick.`)
    }
    return round;
}

const addPickToMap = (draftCapitalMap, franchise, year, pick) => {
    const round = getRound(pick);
    if (!draftCapitalMap[franchise]) {
        draftCapitalMap[franchise] = {
            [year]: {
                [round]: 1
            }
        }
    } else {
        if (!draftCapitalMap[franchise][year]) {
            draftCapitalMap[franchise][year] = { [round]: 1 };
        } else {
            if (!draftCapitalMap[franchise][year][round]) {
                draftCapitalMap[franchise][year][round] = 1;
            } else {
                draftCapitalMap[franchise][year][round] += 1;
            }
        }
    }
    return draftCapitalMap;
}

const calculateDraftCapital = (draftPicks) => {
    const years = Object.keys(draftPicks);

    const draftCapitalMap = {}

    for (let year of years) {
        for (let pick = 0; pick < draftPicks[year].length; pick++) {
            const franchise = draftPicks[year][pick];
            addPickToMap(draftCapitalMap, franchise, year, pick);
        }
    }
    console.log(draftCapitalMap);

    outputReport(draftCapitalMap);
};

const outputReport = (draftCapitalMap) => {
    const roundAsWordMap = {
        '1': 'first',
        '2': 'second',
        '3': 'third'
    };
    const fileName = 'report.txt';
    if (fs.existsSync(fileName)) {
        fs.rmSync(fileName);
        fs.writeFileSync(fileName, 'DRAFT CAPITAL REPORT:\n');
    } else {
        fs.writeFileSync(fileName, 'DRAFT CAPITAL REPORT:\n');
    }

    for (const franchise in draftCapitalMap) {
        let franchiseOutput = `${franchise}\n`;
        let firstRoundPicks = 0;
        let secondRoundPicks = 0;
        let thirdRoundPicks = 0;
        const franchiseDraftCapital = draftCapitalMap[franchise];
        for (const year in franchiseDraftCapital) {
            franchiseOutput += `\n${year}\n`;
            const sortedRoundArray = Object.keys(franchiseDraftCapital[year]).sort();
            console.log(sortedRoundArray)
            for (const round of sortedRoundArray) {
                const roundAsWord = roundAsWordMap[round];
                const numPicks = franchiseDraftCapital[year][round];

                console.log(numPicks)
                if (round === '1') {
                    firstRoundPicks += parseInt(numPicks);
                } else if (round === '2') {
                    secondRoundPicks += parseInt(numPicks);
                } else if (round === '3') {
                    thirdRoundPicks += parseInt(numPicks);
                }
                franchiseOutput += `${numPicks} ${roundAsWord} round picks\n`;
            }
        }

        // console.log(franchiseOutput);
        fs.appendFileSync(fileName, franchiseOutput);

        // totals 
        let totalOutput = `
TOTALS
${firstRoundPicks} first round picks
${secondRoundPicks} second round picks
${thirdRoundPicks} third round picks\n
++++++++++\n
`;
        fs.appendFileSync(fileName, totalOutput);
    }
}

calculateDraftCapital(allPicks);
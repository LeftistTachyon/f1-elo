async function run() {
  const raceNames = new Set<string>();
  for (let year = 1950; year <= 2023; year++) {
    const resp = await fetch(`https://ergast.com/api/f1/${year}.json`);
    const json = await resp.json();
    for (const { raceName } of json.MRData.RaceTable.Races) {
      raceNames.add(raceName);
    }

    console.log("Tabulated", year);
  }

  console.log(raceNames);
}

run();

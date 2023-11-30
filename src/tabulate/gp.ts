async function runGPTabulation() {
  const raceNames = new Set<string>();
  for (let year = 1950; year <= 2023; year++) {
    const resp = await fetch(`https://ergast.com/api/f1/${year}.json`);
    const json = await resp.json();
    for (const { raceName } of json.MRData.RaceTable.Races) {
      raceNames.add(raceName);
    }

    console.log(`Tabulated ${json.MRData.total} races from ${year}`);
    console.log(
      "Wanted:",
      json.MRData.RaceTable.Races.filter(
        (r: { raceName: string }) => r.raceName !== "Indianapolis 500"
      )
        .map((r: { round: number }) => r.round)
        .join("")
    );
  }

  console.log(raceNames);
}

runGPTabulation();

async function runStatusTabulation() {
  const statuses = new Set<string>();
  for (let year = 1950; year <= 2023; year++) {
    const resp1 = await fetch(`https://ergast.com/api/f1/${year}.json`);
    const { Races: races } = (await resp1.json()).MRData.RaceTable;
    // console.log({ races });
    for (const { round } of races.filter(
      (r: { raceName: string }) => r.raceName !== "Indianapolis 500"
    )) {
      const resp2 = await fetch(
        `https://ergast.com/api/f1/${year}/${round}/results.json`
      );
      const { Results: results } = (await resp2.json()).MRData.RaceTable
        .Races[0];
      for (const result of results) {
        statuses.add(result.status);
      }
    }

    console.log("Tabulated", year);
  }

  console.log(JSON.stringify(Array.from(statuses), null, 2));
}

runStatusTabulation();

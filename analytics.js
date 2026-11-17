/* Chambit Menu usage data — edit here before presenting.
   All points MUST be for the SAME daily metric, measured on the given date.
   Example SHAPE ONLY (not real data): {date:'YYYY-MM-DD', value:123}
   Do not copy the old 390 "Total users" screenshot into dailyUsers: its metric
   definition is not established as daily unique users.
   Seven consecutive dates are needed to show a real 7-day average.
   This file is loaded locally; no server, fetch, API or analytics credentials.
*/
window.ANALYTICS = {
  metric: 'Daily users',
  unit: 'users / day',
  dailyUsers: [],
      weeklyAverages: [
      { label: 'Week 07', dates: '10.12–10.16', average: 331 },
      { label: 'Week 08', dates: '10.19–10.23', average: 340 },
      { label: 'Week 09', dates: '10.26–10.30', average: 381 }, 
      { label: 'Week 10', dates: '11.02–11.06', average: 396 },
      { label: 'Week 11', dates: '11.09–11.13', average: 407 }
    ],
  historicalSnapshot: {
    value: 426,
    label: 'Dashboard “Total users” on 10 Nov 2026',
    source: 'Google Analytics'
  }
};

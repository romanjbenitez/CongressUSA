Vue.createApp({
  data() {
    return {
      members: [],
      party: [],
      tableFiltered: [],
      states: [],
      state: "Todos",
      arrayOfGlance: [],
      tableMost: [],
      tableLeast: [],
    };
  },

  created() {
    let chamber = "";
    if (document.URL.includes("senate")) {
      chamber = "senate";
    } else if (document.URL.includes("house")) {
      chamber = "house";
    }
    const API = `https://api.propublica.org/congress/v1/116/${chamber}/members.json`;
    const INIT = {
      method: "GET",
      headers: {
        "X-API-Key": "9QNRPgPiobyjuuWc2aVZlC8Ayt2YGfjRS01nUSHh",
      },
    };

    fetch(API, INIT)
      .then((response) => response.json())
      .then((data) => {
        this.members = data.results[0].members;
        this.tableFiltered = data.results[0].members;
      });
  },
  methods: {
    getLeastAndMost() {
      let members = [...this.members];
      let loyalty = document.URL.includes("loyalty") ? true : false;
      const ArrayMembersPercent = Math.round(members.length * (10 / 100));
      const arrayOfMembersOrd = members.sort((a, b) => {
        if (
          loyalty
            ? a.votes_with_party_pct > b.votes_with_party_pct
            : a.missed_votes > b.missed_votes
        ) {
          return 1;
        }
        if (
          loyalty
            ? a.votes_with_party_pct < b.votes_with_party_pct
            : a.missed_votes < b.missed_votes
        ) {
          return -1;
        }
        return 0;
      });
      const leastEngaged = [];
      const mostEngaged = [];
      for (let i = 1; i < arrayOfMembersOrd.length; i++) {
        if (i < ArrayMembersPercent + 1) {
          if (loyalty) {
            mostEngaged.push(arrayOfMembersOrd[arrayOfMembersOrd.length - i]);
          } else {
            leastEngaged.push(arrayOfMembersOrd[arrayOfMembersOrd.length - i]);
          }
        } else if (
          loyalty
            ? arrayOfMembersOrd[i].votes_with_party_pct ==
              mostEngaged[mostEngaged.length - 1].votes_with_party_pct
            : arrayOfMembersOrd[i].missed_votes ==
              leastEngaged[leastEngaged.length - 1].missed_votes
        ) {
          if (
            loyalty
              ? !mostEngaged.includes(arrayOfMembersOrd[i])
              : !leastEngaged.includes(arrayOfMembersOrd[i])
          ) {
            loyalty
              ? mostEngaged.push(arrayOfMembersOrd[i])
              : leastEngaged.push(arrayOfMembersOrd[i]);
          }
        }
      }
      for (let i = 0; i < arrayOfMembersOrd.length; i++) {
        if (i < ArrayMembersPercent) {
          if (loyalty) {
            leastEngaged.push(arrayOfMembersOrd[i]);
          } else {
            mostEngaged.push(arrayOfMembersOrd[i]);
          }
        } else if (
          loyalty
            ? arrayOfMembersOrd[i].votes_with_party_pct ==
              leastEngaged[leastEngaged.length - 1].votes_with_party_pct
            : arrayOfMembersOrd[i].missed_votes ==
              mostEngaged[mostEngaged.length - 1].missed_votes
        ) {
          if (
            loyalty
              ? !leastEngaged.includes(arrayOfMembersOrd[i])
              : !mostEngaged.includes(arrayOfMembersOrd[i])
          ) {
            loyalty
              ? leastEngaged.push(arrayOfMembersOrd[i])
              : mostEngaged.push(arrayOfMembersOrd[i]);
          }
        }
      }
      this.tableLeast = leastEngaged;
      this.tableMost = mostEngaged;
    },
    getTableGlance() {
      const republicanArray = this.members.filter(
        (member) => member.party === "R"
      );
      const democratArray = this.members.filter(
        (member) => member.party === "D"
      );
      const independetsArray = this.members.filter(
        (member) => member.party === "ID"
      );

      const AllArray = this.members;
      let democratVotes = 0;
      let republicanVotes = 0;
      let independentVotes = 0;
      let allVotes = 0;
      democratArray.forEach((member) => {
        if (member.votes_with_party_pct) {
          democratVotes = Math.round(
            democratVotes + member.votes_with_party_pct
          );
        }
      });
      republicanArray.forEach((member) => {
        if (member.votes_with_party_pct) {
          republicanVotes = Math.round(
            republicanVotes + member.votes_with_party_pct
          );
        }
      });
      independetsArray.forEach((member) => {
        if (member.votes_with_party_pct) {
          independentVotes = Math.round(
            independentVotes + member.votes_with_party_pct
          );
        }
      });
      AllArray.forEach((member) => {
        if (member.votes_with_party_pct) {
          allVotes = Math.round(allVotes + member.votes_with_party_pct);
        }
      });
      let object = {
        democrat: {
          name: "Democrats",
          Reps: democratArray.length,
          VotedWParty: Math.round(democratVotes / democratArray.length),
        },
        republicans: {
          name: "Republicans",
          Reps: republicanArray.length,
          VotedWParty: Math.round(republicanVotes / republicanArray.length),
        },
        Independets: {
          name: "Independents",
          Reps: independetsArray.length,
          VotedWParty:
            independetsArray.length != 0
              ? Math.round(independentVotes / independetsArray.length)
              : 0,
        },
        Total: {
          name: "Total",
          Reps: AllArray.length,
          VotedWParty: Math.round(allVotes / AllArray.length),
        },
      };
      this.arrayOfGlance = object;
    },
    getSelectStates() {
      let members = this.members;
      let states = members.map((member) => member.state);
      let arrayOfStatesWithoutRep = [];
      states.forEach((index) => {
        if (!arrayOfStatesWithoutRep.includes(index)) {
          arrayOfStatesWithoutRep.push(index);
        }
      });
      let ArrayOrdered = arrayOfStatesWithoutRep.sort();
      this.states = ArrayOrdered;
    },
  },
  computed: {
    getTableFilterWithParty() {
      if (this.party.length != 0) {
        let state = this.state;
        let party = this.party;
        let members = this.members;
        let filterParty = members.filter((member) => member.party === party[0]);
        let filterParty2 = members.filter(
          (member) => member.party === party[1]
        );
        let filterParty3 = members.filter(
          (member) => member.party === party[2]
        );
        let list = filterParty.concat(filterParty2, filterParty3);
        if (state != "Todos") {
          filterState = list.filter((member) => member.state === state);
          this.tableFiltered = filterState;
        } else {
          this.tableFiltered = list;
        }
      } else {
        if (this.state != "Todos") {
          filterState = this.members.filter(
            (member) => member.state === this.state
          );
          this.tableFiltered = filterState;
        } else {
          this.tableFiltered = this.members;
        }
      }
    },
  },
}).mount("#app");

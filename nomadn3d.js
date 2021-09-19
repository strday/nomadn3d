  Moralis.initialize("n2mLwLbu7CmikZfQJ46sC36YlFHhkFEWtDrjZMUP");
  Moralis.serverURL = "https://yy2tpdj5bnx9.moralisweb3.com:2053/server";

  async function login() { //alert("login");
    let user = Moralis.User.current();
    if (!user) {
      user = await Moralis.Web3.authenticate();
    }
    console.log("logged in user:", user);
    document.getElementById("btn-j").style.display="none";
    document.getElementById("h2").style.display="none";
    //getStats();
  }

    // sending 0.5 ETH
    //const options = {type: "native", amount: Moralis.Units.ETH("0.5"), receiver: "0x.."}
    //let result = await Moralis.transfer(options)
  // LOG OUT
  async function logOut() { alert("logOut");
    await Moralis.User.logOut();
    document.getElementById("btn-j").style.display="block";
    document.getElementById("h2").style.display="block";
    console.log("logged out");
  }

  // refresh stats
  function getStats() {
    const user = Moralis.User.current();
    if (user) {
      getUserTransactions(user);
    }
    getAverageGasPrices();
  }

  // HISTORICAL TRANSACTIONS
  async function getUserTransactions(user) {
    // create query
    const query = new Moralis.Query("EthTransactions");
    query.equalTo("from_address", user.get("ethAddress"));

    // subscribe to query updates
    const subscription = await query.subscribe();
    handleNewTransaction(subscription);

    // run query
    const results = await query.find();
    console.log("user transactions:", results);
  }

  // REAL-TIME TRANSACTIONS
  async function handleNewTransaction(subscription) {
    // log each new transaction
    subscription.on("create", function (data) {
      console.log("new transaction: ", data);
    });
  }

  // CLOUD FUNCTION
  async function getAverageGasPrices() {
    const results = await Moralis.Cloud.run("getAvgGas");
    console.log("average user gas prices:", results);
    renderGasStats(results);
  }

  function renderGasStats(data) {
    const container = document.getElementById("skrip");
    container.innerHTML = data
      .map(function (row, rank) {
        return `<li>#${rank + 1}: ${Math.round(row.avgGas)} gwei</li>`;
      })
      .join("");
  }

  //get stats on page load
  getStats();

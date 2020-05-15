const TIME_INTERVAL = 5;
let indicator = 0;
let priceList = [];
let allCurrencyObjects = [];
setInterval(() => {
    if(indicator >= TIME_INTERVAL) {
        populateAnalytics(priceList, allCurrencyObjects);
        indicator = 0;
        priceList = [];
        allCurrencyObjects = [];
    }
    let currentCurrencyObject;
    getForexPage().then(res => {
        currentCurrencyObject = filterObject(res);
        allCurrencyObjects.push(currentCurrencyObject);
        priceList.push(currentCurrencyObject['summaryLast']);
        indicator = indicator + 1;
    });
}, 1000);


function populateAnalytics(arr, allCurrencyObjects) {
    let analyticsResult = getAnalytics(arr);
    let labelForCurrentAnalytics = document.createElement('label');
    labelForCurrentAnalytics.innerText = `Price Analytics for ${new Date().toLocaleTimeString()} `
    let spanForCurrentAnalytics = document.createElement('span');
    spanForCurrentAnalytics.innerText =  analyticsResult;
    let spanForCurrentAnalyticsTechSummary = document.createElement('span');
    let analyticsResultObject = allCurrencyObjects.filter(item => item['summaryLast'] === analyticsResult).pop();
    spanForCurrentAnalyticsTechSummary.innerText = ` ${analyticsResultObject['technicalSummary']}`;
    spanForCurrentAnalytics.style.color = analyticsResultObject['technicalSummaryClass'] == 'buy' ? 'green' : (analyticsResultObject['technicalSummaryClass'] == 'blue' ? 'grey' : 'red');
    $('#analytics').append(labelForCurrentAnalytics);
    $('#analytics').append(spanForCurrentAnalytics);
    $('#analytics').append(spanForCurrentAnalyticsTechSummary);
    $('#analytics').append('<hr>');
    window.scrollTo(0,document.body.scrollHeight);
}

function getAnalytics(arr) {
    var map = arr.reduce(function(prev, cur) {
        prev[cur] = (prev[cur] || 0) + 1;
        return prev;
      }, {});
      let max = _.max(map);
      return _.invert(map)[max];
}

function filterObject(response) {
    let currencyObject;
    Object.keys(response).forEach(element => {
        if (response[element].summaryName == 'EUR/USD') {
            currencyObject = {
                ...response[element]
            };
        }
    });
    return currencyObject;
}

function getForexPage() {
    return $.ajax({
         url: "https://cors-anywhere.herokuapp.com/https://uk.investing.com/common/technical_summary/api.php?action=TSB_updatePairs&pairs=1,2,3,5,7,9,10&timeframe=60"
    });
}

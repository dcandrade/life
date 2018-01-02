require('dotenv').load();

const blessed = require('blessed');
const contrib = require('blessed-contrib');

const config = require('./config');
const lib = require('./lib');

const screen = blessed.screen();
const grid = new contrib.grid({rows: 12, cols: 12, screen: screen});

// Hacker News
const hackerNews = grid.set(0, 0, 4, 4, contrib.table, config.hackerNews);

lib.hackerNews.get(function(data) {
  hackerNews.setData({
    headers: ['#', 'Title'],
    data: data
  });
  screen.render();
});

// Overflow News
grid.set(4, 0, 4, 4, blessed.box, {label: 'Overflow News'});

// Twitter Top Trends
const twitterTopTrends = grid.set(8, 0, 4, 2, contrib.log, config.twitterTopTrends);

lib.twitterTopTrends.get()
.then(function(data) {
  data.forEach((tweet) => {twitterTopTrends.log(tweet)});
  screen.render();
})
.catch(function(error) {
  console.log(error);
});

// GitHub Trends
const githubTrends = grid.set(8, 2, 4, 2, contrib.table, config.githubTrends);

lib.githubTrends.get(function(data) {
  githubTrends.setData({
    headers: ['Stars', 'Repository'],
    data: data
  });
  screen.render();
});

// Bitcoin Chart
const bitcoinChart = grid.set(0, 4, 4, 4, contrib.line, config.bitcoinChart);

lib.bitcoinChart.get(function(data) {
  bitcoinChart.setData({
    title: 'Bitcoin (USD)',
    x: data.time,
    y: data.value
  });
  screen.render();
});

// Crypto Prices
const cryptoPrices = grid.set(4, 4, 4, 4, contrib.table, config.cryptoPrices);

lib.cryptoPrices.get(function(data) {
  cryptoPrices.setData({
    headers: ['Coin', 'Price (USD)', 'Change (24H)', 'Change (1H)'],
    data: data
  });
  screen.render();
});

// Crypto News
grid.set(8, 4, 4, 4, blessed.box, {label: 'Crypto News'});

// Google Calendar
grid.set(0, 8, 4, 4, blessed.box, {label: 'Google Calendar'});

// Weather
const weather = grid.set(4, 8, 4, 4, blessed.log, config.weather);
lib.weather
.then(function(data){
  data.forEach((line) => { weather.log(line) });
  screen.render();
})
.catch(function(err) {
  console.log(err);
});

// Alarm
grid.set(8, 8, 4, 2, blessed.box, {label: 'Alarm'});

// Clock
grid.set(8, 10, 4, 2, blessed.box, {label: 'Clock'});

screen.key(['escape', 'q', 'C-c'], function (ch, key) {
  return process.exit(0);
});

screen.render();


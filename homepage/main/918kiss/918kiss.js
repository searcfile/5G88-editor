let hiddenRow = null;
let lastWinRowIndex = -1;
const MAX_FREE_GAME_ROWS = 10;   // maksimum 10 baris free game
let autoFreeGameOn = false;   // ✅ status AUTO (off default)
let autoAddScoreOn = true;
const gameData = {
"IrishLuck": 
{ bets: [1.20, 1.50, 1.80, 2.10, 2.40, 2.70, 3.00, 6.00, 7.50, 15.00],pecahan: {1.20: [50.00, 80.00, 100.00, 150.00],1.50: [80.00, 100.00, 130.00, 180.00],1.80: [50.00, 100.00, 200.00, 300.00],2.10: [50.00, 100.00, 200.00, 300.00],2.40: [50.00, 100.00, 200.00, 300.00],2.70: [50.00, 100.00, 200.00, 300.00],3.00: [50.00, 100.00, 200.00, 300.00],6.00: [50.00, 100.00, 200.00, 300.00],7.50: [80.00, 100.00, 200.00, 400.00],15.00: [100.00, 300.00, 500.00, 750.00]}},
"GoldenTour": 
{ bets: [1.25, 2.50, 5.00, 25.00],pecahan: {1.25: [30.00, 60.00, 100.00, 130.00],2.50: [60.00, 90.00, 110.00, 150.00],5.00: [90.00, 120.00, 150.00, 180.00],25.00: [100.00, 150.00, 200.00, 500.00]}},
"Dolphin": 
{ bets: [1.80, 2.70, 4.50, 9.00, 18.00, 27.00, 36.00],pecahan: {1.80: [30.00, 50.00, 100.00, 130.00],2.70: [50.00, 80.00, 100.00, 150.00],4.50: [80.00, 100.00, 130.00, 180.00],2.50: [100.00, 130.00, 150.00, 200.00],9.00: [130.00, 150.00, 180.00, 220.00],18.00: [150.00, 180.00, 200.00, 200.00],27.00: [180.00, 200.00, 220.00, 300.00],36.00: [200.00, 240.00, 280.00, 500.00]}},
"FortunePanda": 
{ bets: [1.00, 2.50, 5.00, 10.00, 25.00],pecahan: {1.00: [20.00, 40.00, 60.00, 80.00],2.50: [40.00, 60.00, 80.00, 100.00],5.00: [60.00, 80.00, 100.00, 120.00],10.00: [50.00, 100.00, 200.00, 500.00],25.00: [50.00, 100.00, 200.00, 500.00]}},
"FootBall": 
{ bets: [1.00, 1.50, 3.00, 5.00, 15.00],pecahan: {1.00: [30.00, 60.00, 100.00, 130.00],1.50: [60.00, 90.00, 110.00, 150.00],3.00: [90.00, 120.00, 150.00, 180.00],5.00: [120.00, 150.00, 180.00, 210.00],15.00: [100.00, 150.00, 200.00, 500.00]}},
"Laura": 
{ bets: [1.50, 3.00, 7.50, 15.00, 30.00],pecahan: {1.50: [30.00, 50.00, 100.00, 130.00],3.00: [50.00, 80.00, 100.00, 150.00],7.50: [80.00, 100.00, 130.00, 180.00],15.00: [130.00, 150.00, 180.00, 300.00],30.00: [150.00, 180.00, 200.00, 500.00]}},
"Easter": 
{ bets: [1.00, 2.00, 4.00, 10.00, 20.00],pecahan: {1.00: [30.00, 60.00, 100.00, 130.00],2.00: [60.00, 90.00, 110.00, 150.00],4.00: [90.00, 120.00, 150.00, 180.00],10.00: [120.00, 150.00, 180.00, 210.00],20.00: [100.00, 150.00, 200.00, 500.00]}},
"JinQianWa": 
{ bets: [1.20, 2.00, 4.00, 8.00, 12.00, 20.00],pecahan: {1.20: [50.00, 80.00, 100.00, 150.00],2.00: [80.00, 100.00, 130.00, 180.00],4.00: [100.00, 130.00, 150.00, 200.00],8.00: [180.00, 200.00, 220.00, 260.00],12.00: [350.00, 400.00, 450.00, 500.00],20.00: [650.00, 700.00, 750.00, 800.00]}},
"PirateShip": 
{ bets: [1.20, 1.50, 2.10, 3.00, 3.60, 4.50, 6.00, 9.00, 15.00, 18.00, 30.00],pecahan: {1.20: [15.00, 30.00, 45.00, 60.00],1.50: [30.00, 45.00, 60.00, 75.00],2.10: [45.00, 60.00, 75.00, 90.00],3.00: [60.00, 75.00, 90.00, 105.00],3.60: [75.00, 90.00, 105.00, 120.00],4.50: [90.00, 105.00, 120.00, 135.00],6.00: [105.00, 120.00, 135.00, 150.00],9.00: [120.00, 135.00, 150.00, 165.00],15.00: [135.00, 150.00, 165.00, 180.00],18.00: [150.00, 165.00, 180.00, 195.00],30.00: [165.00, 180.00, 195.00, 205.00]}},
"CookiePop": 
{ bets: [1.20, 1.50, 2.10, 3.00, 3.60, 4.50, 6.00, 9.00, 15.00, 18.00, 30.00],pecahan: {1.20: [15.00, 30.00, 45.00, 60.00],1.50: [30.00, 45.00, 60.00, 75.00],2.10: [45.00, 60.00, 75.00, 90.00],3.00: [60.00, 75.00, 90.00, 105.00],3.60: [75.00, 90.00, 105.00, 120.00],4.50: [90.00, 105.00, 120.00, 135.00],6.00: [105.00, 120.00, 135.00, 150.00],9.00: [120.00, 135.00, 150.00, 165.00],15.00: [135.00, 150.00, 165.00, 180.00],18.00: [150.00, 165.00, 180.00, 195.00],30.00: [165.00, 180.00, 195.00, 205.00]}},
"RobinHood": 
{ bets: [1.50, 3.00, 4.50, 9.00, 15.00, 30.00],pecahan: {1.50: [30.00, 50.00, 100.00, 130.00],3.00: [50.00, 80.00, 100.00, 150.00],4.50: [80.00, 100.00, 130.00, 180.00],9.00: [100.00, 130.00, 150.00, 200.00],15.00: [130.00, 150.00, 180.00, 300.00],30.00: [150.00, 180.00, 200.00, 500.00]}},
"Alice": 
{ bets: [1.50, 3.00, 4.50, 9.00, 15.00, 30.00],pecahan: {1.50: [30.00, 50.00, 100.00, 130.00],3.00: [50.00, 80.00, 100.00, 150.00],4.50: [80.00, 100.00, 130.00, 180.00],9.00: [100.00, 130.00, 150.00, 200.00],15.00: [130.00, 150.00, 180.00, 300.00],30.00: [150.00, 180.00, 200.00, 500.00]}},
"Amazon": 
{ bets: [1.80, 4.50, 9.00, 18.00, 27.00],pecahan: {1.80: [30.00, 50.00, 70.00, 90.00],4.50: [40.00, 60.00, 110.00, 160.00],9.00: [60.00, 90.00, 110.00, 210.00],18.00: [90.00, 110.00, 140.00, 310.00],27.00: [110.00, 160.00, 210.00, 550.00]}},
"GodofWealth": 
{ bets: [1.80, 4.50, 9.00, 18.00, 27.00],pecahan: {1.80: [30.00, 50.00, 70.00, 90.00],4.50: [40.00, 60.00, 110.00, 160.00],9.00: [60.00, 90.00, 110.00, 210.00],18.00: [90.00, 110.00, 140.00, 310.00],27.00: [110.00, 160.00, 210.00, 550.00]}},
"ShuiHu": 
{ bets: [1.80, 4.50, 9.00, 18.00, 27.00],pecahan: {1.80: [30.00, 50.00, 70.00, 90.00],4.50: [40.00, 60.00, 110.00, 160.00],9.00: [60.00, 90.00, 110.00, 210.00],18.00: [90.00, 110.00, 140.00, 310.00],27.00: [110.00, 160.00, 210.00, 550.00]}},
"SAFARI Heat": 
{ bets: [1.05, 1.20, 1.35, 1.50, 3.75, 7.50, 15.00],pecahan: {1.05: [30.00, 50.00, 100.00, 130.00],1.20: [50.00, 80.00, 100.00, 150.00],1.35: [80.00, 100.00, 130.00, 180.00],1.50: [100.00, 130.00, 150.00, 200.00],3.75: [130.00, 150.00, 180.00, 220.00],7.50: [150.00, 180.00, 200.00, 250.00],15.00: [180.00, 200.00, 220.00, 300.00]}},
"WolfHunters": 
{ bets: [1.05, 1.20, 1.35, 1.50, 3.75, 7.50, 15.00],pecahan: {1.05: [30.00, 50.00, 100.00, 130.00],1.20: [50.00, 80.00, 100.00, 150.00],1.35: [80.00, 100.00, 130.00, 180.00],1.50: [100.00, 130.00, 150.00, 200.00],3.75: [130.00, 150.00, 180.00, 220.00],7.50: [150.00, 180.00, 200.00, 250.00],15.00: [180.00, 200.00, 220.00, 300.00]}},
"Thai": 
{ bets: [1.05, 1.20, 1.35, 1.50, 3.75, 7.50, 15.00],pecahan: {1.05: [30.00, 50.00, 100.00, 130.00],1.20: [50.00, 80.00, 100.00, 150.00],1.35: [80.00, 100.00, 130.00, 180.00],1.50: [100.00, 130.00, 150.00, 200.00],3.75: [130.00, 150.00, 180.00, 220.00],7.50: [150.00, 180.00, 200.00, 250.00],15.00: [180.00, 200.00, 220.00, 300.00]}},
"PatherMoon": 
{ bets: [1.05, 1.20, 1.35, 1.50, 3.75, 7.50, 15.00],pecahan: {1.05: [30.00, 50.00, 100.00, 130.00],1.20: [50.00, 80.00, 100.00, 150.00],1.35: [80.00, 100.00, 130.00, 180.00],1.50: [100.00, 130.00, 150.00, 200.00],3.75: [130.00, 150.00, 180.00, 220.00],7.50: [150.00, 180.00, 200.00, 250.00],15.00: [180.00, 200.00, 220.00, 300.00]}},
"ZhaoCaiJinBao": 
{ bets: [0.90,2.25, 4.50, 9.00, 45.00],pecahan: {0.90: [20.00, 40.00, 60.00, 80.00],2.25: [30.00, 50.00, 100.00, 150.00],4.50: [50.00, 80.00, 100.00, 200.00],9.00: [80.00, 100.00, 130.00, 300.00],45.00: [100.00, 150.00, 200.00, 500.00]}},
"Silver": 
{ bets: [0.90,2.25, 4.50, 9.00, 45.00],pecahan: {0.90: [20.00, 40.00, 60.00, 80.00],2.25: [30.00, 50.00, 100.00, 150.00],4.50: [50.00, 80.00, 100.00, 200.00],9.00: [80.00, 100.00, 130.00, 300.00],45.00: [100.00, 150.00, 200.00, 500.00]}},
"GreatStars": 
{ bets: [0.90,2.25, 4.50, 9.00, 45.00],pecahan: {0.90: [20.00, 40.00, 60.00, 80.00],2.25: [30.00, 50.00, 100.00, 150.00],4.50: [50.00, 80.00, 100.00, 200.00],9.00: [80.00, 100.00, 130.00, 300.00],45.00: [100.00, 150.00, 200.00, 500.00]}},
"Samurai": 
{ bets: [0.90,2.25, 4.50, 9.00, 45.00],pecahan: {0.90: [20.00, 40.00, 60.00, 80.00],2.25: [30.00, 50.00, 100.00, 150.00],4.50: [50.00, 80.00, 100.00, 200.00],9.00: [80.00, 100.00, 130.00, 300.00],45.00: [100.00, 150.00, 200.00, 500.00]}},
"HighWay": 
{ bets: [0.90,2.25, 4.50, 9.00, 45.00],pecahan: {0.90: [20.00, 40.00, 60.00, 80.00],2.25: [30.00, 50.00, 100.00, 150.00],4.50: [50.00, 80.00, 100.00, 200.00],9.00: [80.00, 100.00, 130.00, 300.00],45.00: [100.00, 150.00, 200.00, 500.00]}},
"Panda": 
{ bets: [1.00, 2.50, 5.00, 12.50, 25.00],pecahan: {1.00: [20.00, 40.00, 60.00, 80.00],2.50: [40.00, 60.00, 80.00, 100.00],5.00: [60.00, 80.00, 100.00, 120.00],12.50: [50.00, 100.00, 200.00, 500.00],25.00: [50.00, 100.00, 200.00, 500.00]}},
"Girls": 
{ bets: [1.00, 2.50, 5.00, 12.50, 25.00],pecahan: {1.00: [20.00, 40.00, 60.00, 80.00],2.50: [30.00, 50.00, 100.00, 150.00],5.00: [50.00, 80.00, 100.00, 200.00],12.50: [80.00, 100.00, 130.00, 300.00],25.00: [100.00, 150.00, 200.00, 500.00]}},
"GoldenSlut":
{ bets: [1.00, 2.50, 5.00, 12.50, 25.00],pecahan: {1.00: [20.00, 40.00, 60.00, 80.00],2.50: [30.00, 50.00, 100.00, 150.00],5.00: [50.00, 80.00, 100.00, 200.00],12.50: [80.00, 100.00, 130.00, 300.00],25.00: [100.00, 150.00, 200.00, 500.00]}},
"Twister": 
{ bets: [1.00, 2.50, 5.00, 12.50, 25.00],pecahan: {1.00: [20.00, 40.00, 60.00, 80.00],2.50: [40.00, 60.00, 80.00, 100.00],5.00: [60.00, 80.00, 100.00, 120.00],12.50: [50.00, 100.00, 200.00, 500.00],25.00: [50.00, 100.00, 200.00, 500.00]}},
"ICELAND": 
{ bets: [1.00, 2.50, 5.00, 12.50, 25.00],pecahan: {1.00: [20.00, 40.00, 60.00, 80.00],2.50: [30.00, 50.00, 100.00, 150.00],5.00: [50.00, 80.00, 100.00, 200.00],12.50: [80.00, 100.00, 130.00, 300.00],25.00: [100.00, 150.00, 200.00, 500.00]}},
"India": 
{ bets: [1.00, 2.50, 5.00, 12.50, 25.00],pecahan: {1.00: [20.00, 40.00, 60.00, 80.00],2.50: [40.00, 60.00, 80.00, 100.00],5.00: [60.00, 80.00, 100.00, 120.00],12.50: [50.00, 100.00, 200.00, 500.00],25.00: [50.00, 100.00, 200.00, 500.00]}},
"EmperorGate": 
{ bets: [1.00, 2.50, 5.00, 12.50, 25.00],pecahan: {1.00: [20.00, 40.00, 60.00, 80.00],2.50: [40.00, 60.00, 80.00, 100.00],5.00: [60.00, 80.00, 100.00, 120.00],12.50: [50.00, 100.00, 200.00, 500.00],25.00: [50.00, 100.00, 200.00, 500.00]}},
"Boxing": 
{ bets: [1.00, 2.50, 5.00, 12.50, 25.00],pecahan: {1.00: [20.00, 40.00, 60.00, 80.00],2.50: [30.00, 50.00, 100.00, 150.00],5.00: [50.00, 80.00, 100.00, 200.00],12.50: [80.00, 100.00, 130.00, 300.00],25.00: [100.00, 150.00, 200.00, 500.00]}},
"JAPAN": 
{ bets: [1.00, 2.50, 5.00, 12.50, 25.00],pecahan: {1.00: [20.00, 40.00, 60.00, 80.00],2.50: [30.00, 50.00, 100.00, 150.00],5.00: [50.00, 80.00, 100.00, 200.00],12.50: [80.00, 100.00, 130.00, 300.00],25.00: [100.00, 150.00, 200.00, 500.00]}},
"WildFox": 
{ bets: [1.00, 2.50, 5.00, 12.50, 25.00],pecahan: {1.00: [20.00, 40.00, 60.00, 80.00],2.50: [40.00, 60.00, 100.00, 150.00],5.00: [60.00, 80.00, 100.00, 200.00],12.50: [50.00, 100.00, 200.00, 500.00],25.00: [50.00, 100.00, 200.00, 500.00]}},
"MoneyFever": 
{ bets: [1.00, 1.25, 1.75, 2.50, 3.00, 3.75, 5.00, 7.50, 12.50, 15.00, 25.00],pecahan: {1.00: [30.00, 50.00, 100.00, 130.00],1.25: [50.00, 80.00, 100.00, 150.00],1.75: [80.00, 100.00, 130.00, 180.00],2.50: [100.00, 130.00, 150.00, 200.00],3.00: [130.00, 150.00, 180.00, 220.00],3.75: [150.00, 180.00, 200.00, 240.00],5.00: [180.00, 200.00, 220.00, 260.00],7.50: [200.00, 240.00, 280.00, 320.00],12.50: [350.00, 400.00, 450.00, 500.00],15.00: [500.00, 550.00, 600.00, 650.00],25.00: [650.00, 700.00, 750.00, 800.00]}},
"SeaWorld": 
{ bets: [1.00, 1.25, 1.75, 2.50, 3.00, 3.75, 5.00, 7.50, 12.50, 15.00, 25.00],pecahan: {1.00: [30.00, 50.00, 100.00, 130.00],1.25: [50.00, 80.00, 100.00, 150.00],1.75: [80.00, 100.00, 130.00, 180.00],2.50: [100.00, 130.00, 150.00, 200.00],3.00: [130.00, 150.00, 180.00, 220.00],3.75: [150.00, 180.00, 200.00, 240.00],5.00: [180.00, 200.00, 220.00, 260.00],7.50: [200.00, 240.00, 280.00, 320.00],12.50: [350.00, 400.00, 450.00, 500.00],15.00: [500.00, 550.00, 600.00, 650.00],25.00: [650.00, 700.00, 750.00, 800.00]}},
"IreLand": 
{ bets: [1.00, 1.25, 1.75, 2.50, 3.00, 3.75, 5.00, 7.50, 12.50, 15.00, 25.00],pecahan: {1.00: [30.00, 50.00, 100.00, 130.00],1.25: [50.00, 80.00, 100.00, 150.00],1.75: [80.00, 100.00, 130.00, 180.00],2.50: [100.00, 130.00, 150.00, 200.00],3.00: [130.00, 150.00, 180.00, 220.00],3.75: [150.00, 180.00, 200.00, 240.00],5.00: [180.00, 200.00, 220.00, 260.00],7.50: [200.00, 240.00, 280.00, 320.00],12.50: [350.00, 400.00, 450.00, 500.00],15.00: [500.00, 550.00, 600.00, 650.00],25.00: [650.00, 700.00, 750.00, 800.00]}},
"GoldenTree": 
{ bets: [1.00, 1.25, 1.75, 2.50, 3.00, 3.75, 5.00, 7.50, 12.50, 15.00, 25.00],pecahan: {1.00: [30.00, 50.00, 100.00, 130.00],1.25: [50.00, 80.00, 100.00, 150.00],1.75: [80.00, 100.00, 130.00, 180.00],2.50: [100.00, 130.00, 150.00, 200.00],3.00: [130.00, 150.00, 180.00, 220.00],3.75: [150.00, 180.00, 200.00, 240.00],5.00: [180.00, 200.00, 220.00, 260.00],7.50: [200.00, 240.00, 280.00, 320.00],12.50: [350.00, 400.00, 450.00, 500.00],15.00: [500.00, 550.00, 600.00, 650.00],25.00: [650.00, 700.00, 750.00, 800.00]}},
"ShiningStars": 
{ bets: [1.00, 1.25, 1.75, 2.50, 3.00, 3.75, 5.00, 7.50, 12.50, 15.00, 25.00],pecahan: {1.00: [30.00, 50.00, 100.00, 130.00],1.25: [50.00, 80.00, 100.00, 150.00],1.75: [80.00, 100.00, 130.00, 180.00],2.50: [100.00, 130.00, 150.00, 200.00],3.00: [130.00, 150.00, 180.00, 220.00],3.75: [150.00, 180.00, 200.00, 240.00],5.00: [180.00, 200.00, 220.00, 260.00],7.50: [200.00, 240.00, 280.00, 320.00],12.50: [350.00, 400.00, 450.00, 500.00],15.00: [500.00, 550.00, 600.00, 650.00],25.00: [650.00, 700.00, 750.00, 800.00]}},
"TopGun": 
{ bets: [1.00, 1.25, 1.75, 2.50, 3.00, 3.75, 5.00, 7.50, 12.50, 15.00, 25.00],pecahan: {1.00: [30.00, 50.00, 100.00, 130.00],1.25: [50.00, 80.00, 100.00, 150.00],1.75: [80.00, 100.00, 130.00, 180.00],2.50: [100.00, 130.00, 150.00, 200.00],3.00: [130.00, 150.00, 180.00, 220.00],3.75: [150.00, 180.00, 200.00, 240.00],5.00: [180.00, 200.00, 220.00, 260.00],7.50: [200.00, 240.00, 280.00, 320.00],12.50: [350.00, 400.00, 450.00, 500.00],15.00: [500.00, 550.00, 600.00, 650.00],25.00: [650.00, 700.00, 750.00, 800.00]}},
"Celebration": 
{ bets: [1.00, 1.25, 1.75, 2.50, 3.00, 3.75, 5.00, 7.50, 12.50, 15.00, 25.00],pecahan: {1.00: [30.00, 50.00, 100.00, 130.00],1.25: [50.00, 80.00, 100.00, 150.00],1.75: [80.00, 100.00, 130.00, 180.00],2.50: [100.00, 130.00, 150.00, 200.00],3.00: [130.00, 150.00, 180.00, 220.00],3.75: [150.00, 180.00, 200.00, 240.00],5.00: [180.00, 200.00, 220.00, 260.00],7.50: [200.00, 240.00, 280.00, 320.00],12.50: [350.00, 400.00, 450.00, 500.00],15.00: [500.00, 550.00, 600.00, 650.00],25.00: [650.00, 700.00, 750.00, 800.00]}},
"Magician":
{ bets: [1.00, 1.25, 1.75, 2.50, 3.00, 3.75, 5.00, 7.50, 12.50, 15.00, 25.00],pecahan: {1.00: [30.00, 50.00, 100.00, 130.00],1.25: [50.00, 80.00, 100.00, 150.00],1.75: [80.00, 100.00, 130.00, 180.00],2.50: [100.00, 130.00, 150.00, 200.00],3.00: [130.00, 150.00, 180.00, 220.00],3.75: [150.00, 180.00, 200.00, 240.00],5.00: [180.00, 200.00, 220.00, 260.00],7.50: [200.00, 240.00, 280.00, 320.00],12.50: [350.00, 400.00, 450.00, 500.00],15.00: [500.00, 550.00, 600.00, 650.00],25.00: [650.00, 700.00, 750.00, 800.00]}},
"StoneAge": 
{ bets: [1.00, 1.25, 1.75, 2.50, 3.00, 3.75, 5.00, 7.50, 12.50, 15.00, 25.00],pecahan: {1.00: [30.00, 50.00, 100.00, 130.00],1.25: [50.00, 80.00, 100.00, 150.00],1.75: [80.00, 100.00, 130.00, 180.00],2.50: [100.00, 130.00, 150.00, 200.00],3.00: [130.00, 150.00, 180.00, 220.00],3.75: [150.00, 180.00, 200.00, 240.00],5.00: [180.00, 200.00, 220.00, 260.00],7.50: [200.00, 240.00, 280.00, 320.00],12.50: [350.00, 400.00, 450.00, 500.00],15.00: [500.00, 550.00, 600.00, 650.00],25.00: [650.00, 700.00, 750.00, 800.00]}},
"TreasureIsland": 
{ bets: [1.00, 1.25, 1.75, 2.50, 3.00, 3.75, 5.00, 7.50, 12.50, 15.00, 25.00],pecahan: {1.00: [30.00, 50.00, 100.00, 130.00],1.25: [50.00, 80.00, 100.00, 150.00],1.75: [80.00, 100.00, 130.00, 180.00],2.50: [100.00, 130.00, 150.00, 200.00],3.00: [130.00, 150.00, 180.00, 220.00],3.75: [150.00, 180.00, 200.00, 240.00],5.00: [180.00, 200.00, 220.00, 260.00],7.50: [200.00, 240.00, 280.00, 320.00],12.50: [350.00, 400.00, 450.00, 500.00],15.00: [500.00, 550.00, 600.00, 650.00],25.00: [650.00, 700.00, 750.00, 800.00]}},
"FairyGarden": 
{ bets: [1.00, 1.25, 1.75, 2.50, 3.00, 3.75, 5.00, 7.50, 12.50, 15.00, 25.00],pecahan: {1.00: [30.00, 50.00, 100.00, 130.00],1.25: [50.00, 80.00, 100.00, 150.00],1.75: [80.00, 100.00, 130.00, 180.00],2.50: [100.00, 130.00, 150.00, 200.00],3.00: [130.00, 150.00, 180.00, 220.00],3.75: [150.00, 180.00, 200.00, 240.00],5.00: [180.00, 200.00, 220.00, 260.00],7.50: [200.00, 240.00, 280.00, 320.00],12.50: [350.00, 400.00, 450.00, 500.00],15.00: [500.00, 550.00, 600.00, 650.00],25.00: [650.00, 700.00, 750.00, 800.00]}},
"FiveDragons":
{ bets: [1.00, 1.25, 1.50, 1.75, 2.00, 2.25, 2.50, 6.25, 12.50, 25.00],pecahan: {1.00: [30.00, 50.00, 100.00, 130.00],1.25: [50.00, 80.00, 100.00, 150.00],1.50: [60.00, 80.00, 100.00, 150.00],1.75: [80.00, 100.00, 130.00, 180.00],2.00: [100.00, 130.00, 150.00, 200.00],2.25: [130.00, 150.00, 180.00, 220.00],2.50: [150.00, 180.00, 200.00, 240.00],6.25: [180.00, 200.00, 220.00, 260.00],12.50: [200.00, 240.00, 280.00, 320.00],25.00: [350.00, 400.00, 450.00, 500.00]}},
"PayDirt": 
{ bets: [1.00, 1.25, 1.50, 1.75, 2.00, 2.25, 2.50, 6.25, 12.50, 25.00],pecahan: {1.00: [30.00, 50.00, 100.00, 130.00],1.25: [50.00, 80.00, 100.00, 150.00],1.50: [60.00, 80.00, 100.00, 150.00],1.75: [80.00, 100.00, 130.00, 180.00],2.00: [100.00, 130.00, 150.00, 200.00],2.25: [130.00, 150.00, 180.00, 220.00],2.50: [150.00, 180.00, 200.00, 240.00],6.25: [180.00, 200.00, 220.00, 260.00],12.50: [200.00, 240.00, 280.00, 320.00],25.00: [350.00, 400.00, 450.00, 500.00]}},
"GoldenLotus": 
{ bets: [1.00, 1.25, 1.50, 1.75, 2.00, 2.25, 2.50, 6.25, 12.50, 25.00],pecahan: {1.00: [20.00, 40.00, 60.00, 80.00],1.25: [40.00, 60.00, 80.00, 100.00],1.50: [60.00, 80.00, 100.00, 120.00],1.75: [80.00, 100.00, 120.00, 140.00],2.00: [100.00, 120.00, 140.00, 160.00],2.25: [120.00, 140.00, 160.00, 180.00],2.50: [140.00, 160.00, 180.00, 200.00],6.25: [220.00, 240.00, 260.00, 280.00],12.50: [240.00, 260.00, 280.00, 300.00],25.00: [260.00, 280.00, 300.00, 500.00]}},
"GreatBlue": 
{ bets: [1.00, 1.25, 1.50, 1.75, 2.00, 2.25, 2.50, 6.25, 12.50, 25.00],pecahan: {1.00: [20.00, 40.00, 60.00, 80.00],1.25: [40.00, 60.00, 80.00, 100.00],1.50: [60.00, 80.00, 100.00, 120.00],1.75: [80.00, 100.00, 120.00, 140.00],2.00: [100.00, 120.00, 140.00, 160.00],2.25: [120.00, 140.00, 160.00, 180.00],2.50: [140.00, 160.00, 180.00, 200.00],6.25: [220.00, 240.00, 260.00, 280.00],12.50: [240.00, 260.00, 280.00, 300.00],25.00: [260.00, 280.00, 300.00, 500.00]}},
"T-REX": 
{ bets: [1.00, 1.25, 1.50, 1.75, 2.00, 2.25, 2.50, 6.25, 12.50, 25.00],pecahan: {1.00: [20.00, 40.00, 60.00, 80.00],1.25: [40.00, 60.00, 80.00, 100.00],1.50: [60.00, 80.00, 100.00, 120.00],1.75: [80.00, 100.00, 120.00, 140.00],2.00: [100.00, 120.00, 140.00, 160.00],2.25: [120.00, 140.00, 160.00, 180.00],2.50: [140.00, 160.00, 180.00, 200.00],6.25: [220.00, 240.00, 260.00, 280.00],12.50: [240.00, 260.00, 280.00, 300.00],25.00: [260.00, 280.00, 300.00, 500.00]}},
"CoyoteCash": 
{ bets: [1.00, 1.25, 1.50, 1.75, 2.00, 2.25, 2.50, 6.25, 12.50, 25.00],pecahan: {1.00: [20.00, 40.00, 60.00, 80.00],1.25: [40.00, 60.00, 80.00, 100.00],1.50: [60.00, 80.00, 100.00, 120.00],1.75: [80.00, 100.00, 120.00, 140.00],2.00: [100.00, 120.00, 140.00, 160.00],2.25: [120.00, 140.00, 160.00, 180.00],2.50: [140.00, 160.00, 180.00, 200.00],6.25: [220.00, 240.00, 260.00, 280.00],12.50: [240.00, 260.00, 280.00, 300.00],25.00: [260.00, 280.00, 300.00, 500.00]}},
"Prosperity": 
{ bets: [1.00, 1.25, 1.50, 1.75, 2.00, 2.25, 2.50, 6.25, 12.50, 25.00],pecahan: {1.00: [20.00, 40.00, 60.00, 80.00],1.25: [40.00, 60.00, 80.00, 100.00],1.50: [60.00, 80.00, 100.00, 120.00],1.75: [80.00, 100.00, 120.00, 140.00],2.00: [100.00, 120.00, 140.00, 160.00],2.25: [120.00, 140.00, 160.00, 180.00],2.50: [140.00, 160.00, 180.00, 200.00],6.25: [220.00, 240.00, 260.00, 280.00],12.50: [240.00, 260.00, 280.00, 300.00],25.00: [260.00, 280.00, 300.00, 500.00]}},
"BonusBears": 
{ bets: [1.00, 1.25, 1.50, 1.75, 2.00, 2.25, 2.50, 6.25, 12.50, 25.00],pecahan: {1.00: [20.00, 40.00, 60.00, 80.00],1.25: [40.00, 60.00, 80.00, 100.00],1.50: [60.00, 80.00, 100.00, 120.00],1.75: [80.00, 100.00, 120.00, 140.00],2.00: [100.00, 120.00, 140.00, 160.00],2.25: [120.00, 140.00, 160.00, 180.00],2.50: [140.00, 160.00, 180.00, 200.00],6.25: [220.00, 240.00, 260.00, 280.00],12.50: [240.00, 260.00, 280.00, 300.00],25.00: [260.00, 280.00, 300.00, 500.00]}},
"SeaCaptain": 
{ bets: [1.00, 1.25, 1.50, 1.75, 2.00, 2.25, 2.50, 6.25, 12.50, 25.00],pecahan: {1.00: [20.00, 40.00, 60.00, 80.00],1.25: [40.00, 60.00, 80.00, 100.00],1.50: [60.00, 80.00, 100.00, 120.00],1.75: [80.00, 100.00, 120.00, 140.00],2.00: [100.00, 120.00, 140.00, 160.00],2.25: [120.00, 140.00, 160.00, 180.00],2.50: [140.00, 160.00, 180.00, 200.00],6.25: [220.00, 240.00, 260.00, 280.00],12.50: [240.00, 260.00, 280.00, 300.00],25.00: [260.00, 280.00, 300.00, 500.00]}},
"Motorcycle": 
{ bets: [1.00, 1.25, 1.50, 1.75, 2.00, 2.25, 2.50, 6.25, 12.50, 25.00],pecahan: {1.00: [20.00, 40.00, 60.00, 80.00],1.25: [40.00, 60.00, 80.00, 100.00],1.50: [60.00, 80.00, 100.00, 120.00],1.75: [80.00, 100.00, 120.00, 140.00],2.00: [100.00, 120.00, 140.00, 160.00],2.25: [120.00, 140.00, 160.00, 180.00],2.50: [140.00, 160.00, 180.00, 200.00],6.25: [220.00, 240.00, 260.00, 280.00],12.50: [240.00, 260.00, 280.00, 300.00],25.00: [260.00, 280.00, 300.00, 500.00]}},
"SteamTower": 
{ bets: [1.00, 2.00, 5.00, 10.00, 20.00],pecahan: {1.00: [30.00, 60.00, 100.00, 130.00],2.00: [60.00, 90.00, 110.00, 150.00],5.00: [90.00, 120.00, 150.00, 180.00],10.00: [120.00, 150.00, 180.00, 210.00],20.00: [100.00, 150.00, 200.00, 500.00]}},
"DragonMaiden": 
{ bets: [1.00, 2.00, 5.00, 10.00, 20.00],pecahan: {1.00: [30.00, 60.00, 100.00, 130.00],2.00: [60.00, 90.00, 110.00, 150.00],5.00: [90.00, 120.00, 150.00, 180.00],10.00: [120.00, 150.00, 180.00, 210.00],20.00: [100.00, 150.00, 200.00, 500.00]}},
"Wealth": 
{ bets: [1.00, 2.00, 5.00, 10.00, 20.00],pecahan: {1.00: [30.00, 60.00, 100.00, 130.00],2.00: [60.00, 90.00, 110.00, 150.00],5.00: [90.00, 120.00, 150.00, 180.00],10.00: [120.00, 150.00, 180.00, 210.00],20.00: [100.00, 150.00, 200.00, 500.00]}},
"Cleopatra":
{ bets: [1.00, 2.00, 5.00, 10.00, 20.00],pecahan: {1.00: [30.00, 60.00, 100.00, 130.00],2.00: [60.00, 90.00, 110.00, 150.00],5.00: [90.00, 120.00, 150.00, 180.00],10.00: [120.00, 150.00, 180.00, 210.00],20.00: [100.00, 150.00, 200.00, 500.00]}},
"FORTUNE": 
{ bets: [1.00, 2.00, 5.00, 10.00, 20.00],pecahan: {1.00: [30.00, 60.00, 100.00, 130.00],2.00: [60.00, 90.00, 110.00, 150.00],5.00: [90.00, 120.00, 150.00, 180.00],10.00: [120.00, 150.00, 180.00, 210.00],20.00: [100.00, 150.00, 200.00, 500.00]}},
"Garden":
{ bets: [1.00, 2.00, 5.00, 10.00, 20.00],pecahan: {1.00: [30.00, 60.00, 100.00, 130.00],2.00: [60.00, 90.00, 110.00, 150.00],5.00: [90.00, 120.00, 150.00, 180.00],10.00: [120.00, 150.00, 180.00, 210.00],20.00: [100.00, 150.00, 200.00, 500.00]}},
"Fame": 
{ bets: [1.00, 2.00, 5.00, 10.00, 20.00],pecahan: {1.00: [30.00, 60.00, 100.00, 130.00],2.00: [60.00, 90.00, 110.00, 150.00],5.00: [90.00, 120.00, 150.00, 180.00],10.00: [120.00, 150.00, 180.00, 210.00],20.00: [100.00, 150.00, 200.00, 500.00]}},
"DolphinReef": 
{ bets: [1.00, 2.00, 5.00, 10.00, 20.00],pecahan: {1.00: [30.00, 60.00, 100.00, 130.00],2.00: [60.00, 90.00, 110.00, 150.00],5.00: [90.00, 120.00, 150.00, 180.00],10.00: [120.00, 150.00, 180.00, 210.00],20.00: [100.00, 150.00, 200.00, 500.00]}},
"Boyking": 
{ bets: [1.00, 2.00, 5.00, 10.00, 20.00],pecahan: {1.00: [30.00, 60.00, 100.00, 130.00],2.00: [60.00, 90.00, 110.00, 150.00],5.00: [90.00, 120.00, 150.00, 180.00],10.00: [120.00, 150.00, 180.00, 210.00],20.00: [100.00, 150.00, 200.00, 500.00]}},
"circus": 
{ bets: [1.00, 2.00, 5.00, 10.00, 20.00],pecahan: {1.00: [30.00, 60.00, 100.00, 130.00],2.00: [60.00, 90.00, 110.00, 150.00],5.00: [90.00, 120.00, 150.00, 180.00],10.00: [120.00, 150.00, 180.00, 210.00],20.00: [100.00, 150.00, 200.00, 500.00]}},
"BigShot": 
{ bets: [1.00, 2.00, 5.00, 10.00, 20.00],pecahan: {1.00: [30.00, 60.00, 100.00, 130.00],2.00: [60.00, 90.00, 110.00, 150.00],5.00: [90.00, 120.00, 150.00, 180.00],10.00: [120.00, 150.00, 180.00, 210.00],20.00: [100.00, 150.00, 200.00, 500.00]}},
"Halloween": 
{ bets: [1.00, 2.00, 5.00, 10.00, 20.00],pecahan: {1.00: [30.00, 60.00, 100.00, 130.00],2.00: [60.00, 90.00, 110.00, 150.00],5.00: [90.00, 120.00, 150.00, 180.00],10.00: [120.00, 150.00, 180.00, 210.00],20.00: [100.00, 150.00, 200.00, 500.00]}},
"Victory": 
{ bets: [1.00, 2.00, 5.00, 10.00, 20.00],pecahan: {1.00: [30.00, 60.00, 100.00, 130.00],2.00: [60.00, 90.00, 110.00, 150.00],5.00: [90.00, 120.00, 150.00, 180.00],10.00: [120.00, 150.00, 180.00, 210.00],20.00: [100.00, 150.00, 200.00, 500.00]}},
"Dragon Gold": 
{ bets: [1.00, 2.00, 5.00, 10.00, 20.00],pecahan: {1.00: [30.00, 60.00, 100.00, 130.00],2.00: [60.00, 90.00, 110.00, 150.00],5.00: [90.00, 120.00, 150.00, 180.00],10.00: [120.00, 150.00, 180.00, 210.00],20.00: [100.00, 150.00, 200.00, 500.00]}},
"Tally Ho": 
{ bets: [1.00, 2.00, 5.00, 10.00, 20.00],pecahan: {1.00: [30.00, 60.00, 100.00, 130.00],2.00: [60.00, 90.00, 110.00, 150.00],5.00: [90.00, 120.00, 150.00, 180.00],10.00: [120.00, 150.00, 180.00, 210.00],20.00: [100.00, 150.00, 200.00, 500.00]}},
"Rally": 
{ bets: [1.00, 2.00, 5.00, 10.00, 20.00],pecahan: {1.00: [30.00, 60.00, 100.00, 130.00],2.00: [60.00, 90.00, 110.00, 150.00],5.00: [90.00, 120.00, 150.00, 180.00],10.00: [120.00, 150.00, 180.00, 210.00],20.00: [100.00, 150.00, 200.00, 500.00]}}
};
function updateAutoAddScoreButtonUI() {
  const btn = document.getElementById("autoAddScoreBtn");
  if (!btn) return;

  if (autoAddScoreOn) {
    btn.textContent = "AUTO ON";
    btn.style.background = "#22c55e";
    btn.style.borderColor = "#22c55e";
  } else {
    btn.textContent = "AUTO OFF";
    btn.style.background = "#555";
    btn.style.borderColor = "#555";
  }
}
  let jackpotInsertedMap = JSON.parse(localStorage.getItem("jackpotInsertedMap")) || {};
function saveCurrentSelectionOnly() {
  const oldData = JSON.parse(localStorage.getItem("gameLogData918kiss") || "{}");

  const game = document.getElementById("gameSelect")?.value || "";
  const bet = document.getElementById("betSelect")?.value || "";
  const pecahan = document.getElementById("pecahanSelect")?.value || "";

  const newData = {
    ...oldData,
    game,
    bet,
    pecahan
  };

  localStorage.setItem("gameLogData918kiss", JSON.stringify(newData));
}
function initCustomSelect(selectId, withSearch = false, searchPlaceholder = "Search...") {
  const native = document.getElementById(selectId);
  if (!native) return null;

  if (native.dataset.csReady === "1") {
    return native._csApi || null;
  }
  native.dataset.csReady = "1";

  // sembunyikan select asli
  native.style.position = "absolute";
  native.style.left = "-9999px";
  native.style.width = "1px";
  native.style.height = "1px";
  native.style.opacity = "0";
  native.style.pointerEvents = "none";

  const wrap = document.createElement("div");
  wrap.className = `cs-wrap cs-wrap-${selectId}`;

  const display = document.createElement("div");
  display.className = "cs-display";
  display.tabIndex = 0;

  const label = document.createElement("span");
  label.className = "cs-label";

  const arrow = document.createElement("i");
  arrow.className = "cs-arrow";

  display.appendChild(label);
  display.appendChild(arrow);

  const list = document.createElement("div");
  list.className = "cs-list";

  let searchInput = null;
  let itemsBox = document.createElement("div");
  itemsBox.className = "cs-items";

  if (withSearch) {
    const searchBox = document.createElement("div");
    searchBox.className = "cs-search";

    searchInput = document.createElement("input");
    searchInput.type = "text";
    searchInput.placeholder = searchPlaceholder;
    searchInput.autocomplete = "off";

    searchBox.appendChild(searchInput);
    list.appendChild(searchBox);
  }

  list.appendChild(itemsBox);

  native.parentNode.insertBefore(wrap, native.nextSibling);
  wrap.appendChild(display);
  wrap.appendChild(list);

  function getPlaceholderText() {
    const first = native.options[0];
    return first ? first.textContent : "-- Choose --";
  }

  function refresh() {
    itemsBox.innerHTML = "";

    const options = Array.from(native.options);
    const selectedOpt = native.options[native.selectedIndex];
    const hasValue =
      selectedOpt &&
      selectedOpt.value !== "" &&
      !selectedOpt.disabled;

    label.textContent = hasValue ? selectedOpt.textContent : getPlaceholderText();
    display.classList.toggle("placeholder", !hasValue);

    options.forEach((opt, index) => {
      const item = document.createElement("div");
      item.className = "cs-item";
      item.textContent = opt.textContent;
      item.dataset.value = opt.value;

      if (opt.disabled && opt.value === "") {
        item.classList.add("disabled");
      }

      if (index === native.selectedIndex && hasValue) {
        item.classList.add("active");
      }

      item.addEventListener("click", () => {
        if (opt.disabled) return;

        native.selectedIndex = index;
        native.value = opt.value;
        native.dispatchEvent(new Event("change", { bubbles: true }));
        close();
        refresh();
      });

      itemsBox.appendChild(item);
    });

    if (searchInput) {
      searchInput.value = "";
      applyFilter("");
    }
  }

  function applyFilter(q) {
    const query = String(q || "").trim().toLowerCase();
    const items = Array.from(itemsBox.querySelectorAll(".cs-item"));

    items.forEach(item => {
      const show = item.textContent.toLowerCase().includes(query);
      item.style.display = show ? "" : "none";
    });
  }

  function open() {
    document.querySelectorAll(".cs-wrap.open").forEach(w => {
      if (w !== wrap) w.classList.remove("open");
    });
    wrap.classList.add("open");

    if (searchInput) {
      searchInput.value = "";
      applyFilter("");
      setTimeout(() => searchInput.focus(), 0);
    }
  }

  function close() {
    wrap.classList.remove("open");
  }

  function toggle() {
    wrap.classList.contains("open") ? close() : open();
  }

  display.addEventListener("click", (e) => {
    e.stopPropagation();
    toggle();
  });

  display.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    } else if (e.key === "Escape") {
      close();
    }
  });

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      applyFilter(e.target.value);
    });

    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });
  }

  document.addEventListener("click", (e) => {
    if (!wrap.contains(e.target)) close();
  });

  native.addEventListener("change", refresh);

  const observer = new MutationObserver(() => refresh());
  observer.observe(native, {
    childList: true,
    subtree: false,
    attributes: true
  });

  refresh();

  const api = { refresh, open, close, wrap, display, list };
  native._csApi = api;
  return api;
}
const gameCS = initCustomSelect("gameSelect", true, "Search game...");
const betCS = initCustomSelect("betSelect", false);
const winCS = initCustomSelect("pecahanSelect", false);
document.getElementById("gameSelect").addEventListener("change", function () {
  const game = this.value;
  const betSelect = document.getElementById("betSelect");
  const pecahanSelect = document.getElementById("pecahanSelect");

  resetSelectToPlaceholder("betSelect", "Select Bet", false);
  resetSelectToPlaceholder("pecahanSelect", "Select Win", false);

  if (betCS) betCS.refresh();
  if (winCS) winCS.refresh();

  if (!game) {
    saveCurrentSelectionOnly();
    return;
  }

  jackpotInsertedMap[game] = false;

  if (gameData[game] && Array.isArray(gameData[game].bets)) {
    gameData[game].bets.forEach(bet => {
      const option = document.createElement("option");
      option.value = String(bet);
      option.textContent = Number(bet).toFixed(2);
      betSelect.appendChild(option);
    });

    // auto pilih bet pertama
    if (gameData[game].bets.length > 0) {
      betSelect.value = String(gameData[game].bets[0]);
    }

    if (betCS) betCS.refresh();

    // trigger supaya pecahan auto keluar
    betSelect.dispatchEvent(new Event("change", { bubbles: true }));
  }

  saveCurrentSelectionOnly();
});
document.getElementById("betSelect").addEventListener("change", function () {
  const game = document.getElementById("gameSelect").value;
  const rawBet = this.value;
  const bet = parseFloat(rawBet);
  const pecahanSelect = document.getElementById("pecahanSelect");

  resetSelectToPlaceholder("pecahanSelect", "Select Win", false);

  if (!game || isNaN(bet)) {
    if (winCS) winCS.refresh();
    saveCurrentSelectionOnly();
    return;
  }

  const pecahanMap = gameData?.[game]?.pecahan || {};
  const pecahanList =
    pecahanMap[rawBet] ??
    pecahanMap[String(bet)] ??
    pecahanMap[bet.toFixed(2)];

  if (Array.isArray(pecahanList)) {
    pecahanList.forEach(p => {
      const option = document.createElement("option");
      option.value = String(p);
      option.textContent = Number(p).toFixed(2);
      pecahanSelect.appendChild(option);
    });

    // auto pilih pecahan pertama
    if (pecahanList.length > 0) {
      pecahanSelect.value = String(pecahanList[0]);
    }
  }

  if (winCS) winCS.refresh();
  saveCurrentSelectionOnly();
});
document.getElementById("pecahanSelect").addEventListener("change", function () {
  if (winCS) winCS.refresh();
  saveCurrentSelectionOnly();
});
 function setNow() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');
  const second = String(now.getSeconds()).padStart(2, '0');

  const globalTime = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  document.getElementById("manualTime").value = globalTime;
  }
function rnd(min, max, dec = 2){
  return parseFloat((Math.random() * (max - min) + min).toFixed(dec));
  }
  let globalTime = null;

function rnd(min, max, dec = 2){
  return parseFloat((Math.random() * (max - min) + min).toFixed(dec));
  }
function formatDateTimeLocal(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const h = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  const s = String(date.getSeconds()).padStart(2, '0');
  return `${y}-${m}-${d} ${h}:${min}:${s}`;
  }
 function deleteCents() {
  const tables = document.querySelectorAll("table");

  tables.forEach(table => {
  const rows = table.querySelectorAll("tr");
  rows.forEach(row => {
  const setScoreCell = row.querySelector(".setscore");
  const beginMoneyCell = row.cells[4]; 
  const endMoneyCell = row.cells[5];   

if (setScoreCell && setScoreCell.textContent.includes("Set score：")) {
  const parts = setScoreCell.textContent.split("Set score：");
  const originalNumber = parseFloat(parts[1]);
if (!isNaN(originalNumber)) {
  const intPart = Math.floor(Math.abs(originalNumber));
  const finalSetScore = `Set score：${originalNumber < 0 ? "-" : ""}${intPart}.00`;
  setScoreCell.textContent = finalSetScore;
  }

if (beginMoneyCell && endMoneyCell) {
  const beginMoney = parseFloat(beginMoneyCell.textContent);
if (!isNaN(beginMoney)) {
  const centsOnly = (beginMoney % 1).toFixed(2);
  endMoneyCell.textContent = centsOnly;
  }
  }
  }
  });
  });
}
function updateAutoFreeGameButtonUI() {
  const autoBtn = document.getElementById('autoFreeGameBtn');
  if (!autoBtn) return;

  if (autoFreeGameOn) {
    autoBtn.textContent = 'AUTO ON';
    autoBtn.style.background = '#22c55e';
    autoBtn.style.borderColor = '#22c55e';
  } else {
    autoBtn.textContent = 'AUTO OFF';
    autoBtn.style.background = '#555';
    autoBtn.style.borderColor = '#555';
  }
}
//  FREE GAME HELPERS
// =====================

// reset semua tanda Free game balik ke bet asal
function resetAllFreeGameMarks() {
  const betCells = document.querySelectorAll('#gameLog tbody tr.log-row td.bet-cell');
  betCells.forEach(cell => {
    const originalBet = cell.dataset.baseBet || cell.dataset.bet;
    if (originalBet !== undefined) {
      cell.textContent = originalBet;   // tulisan balik ke angka asal
      cell.dataset.bet = originalBet;   // nilai bet untuk kira-kira pun balik asal
    }
    cell.style.fontWeight = '';
    cell.style.color = '';
  });
}
// 👉 TAMBAHKAN FUNGSI BARU INI
function recalcBalancesAfterFreeGame() {
  const tbody = document.querySelector("#gameLog tbody");
  if (!tbody) return;

  const rows = Array.from(tbody.querySelectorAll("tr.log-row"));
  if (!rows.length) return;

  // jalan dari bawah (row paling bawah) ke atas (row paling atas)
  for (let i = rows.length - 1; i >= 0; i--) {
    const row = rows[i];

    const win = parseFloat(row.children[3].textContent) || 0;
    const betCell = row.querySelector(".bet-cell");

    let bet = 0;
    if (betCell) {
      // kalau tulisan "Free game" → bet = 0
      if (betCell.textContent.trim().toLowerCase() === "free game") {
        bet = 0;
      } else {
        bet = parseFloat(betCell.dataset.bet || betCell.textContent) || 0;
      }
    }

    let begin;
    if (i === rows.length - 1) {
      // row paling bawah: BeginMoney pakai nilai sedia ada
      begin = parseFloat(row.children[4].textContent) || 0;
    } else {
      // row atas: BeginMoney = EndMoney row di bawahnya
      const below = rows[i + 1];
      begin = parseFloat(below.children[5].textContent) || 0;
      row.children[4].textContent = begin.toFixed(2);
    }

    // Formula umum:
    // - normal     : End = Begin - bet + win
    // - Free game  : bet = 0 → End = Begin + win
    const end = begin - bet + win;
    row.children[5].textContent = end.toFixed(2);
  }

  // Update Set score ikut EndMoney paling atas
  const setScoreRowTop = tbody.querySelector("tr.set-score-row:not(.jackpot)");
  if (setScoreRowTop && rows.length > 0) {
    const topEndMoney = parseFloat(rows[0].children[5].textContent) || 0;
    const scoreCell = setScoreRowTop.children[1];

    scoreCell.textContent = `Set score：${(-Math.abs(topEndMoney)).toFixed(2)}`;
    setScoreRowTop.children[4].textContent = Math.abs(topEndMoney).toFixed(2);
    setScoreRowTop.children[5].textContent = "0.00";
  }
}
// apply free game berdasarkan input
function applyFreeGame() {
  const input = document.getElementById('freeGameInput');
  if (!input) return;

  let count = parseInt(input.value, 10);
  if (isNaN(count) || count < 0) count = 0;
  if (count > MAX_FREE_GAME_ROWS) count = MAX_FREE_GAME_ROWS;

  // Pulihkan dulu semua bet ke asal
  resetAllFreeGameMarks();

  const rows = Array.from(document.querySelectorAll('#gameLog tbody tr.log-row'));
  const fromBottom = rows.slice().reverse(); // mula dari baris paling bawah

  let marked = 0;
  for (const row of fromBottom) {
    if (marked >= count) break;

    const betCell = row.querySelector('td.bet-cell');
    if (!betCell) continue;

    // UI Free game
    betCell.textContent = 'Free game';
    betCell.style.fontWeight = '700';
    betCell.style.color = '#dd4b39';

    // nilai bet untuk kira-kira = 0
    betCell.dataset.bet = '0';

    marked++;
  }

  // Selepas tanda Free game → hitung ulang BeginMoney & EndMoney
 recalcBalancesForLogRowsOnly();
}

// tombol Set Free Game
document.getElementById('setFreeGameBtn').addEventListener('click', function(){
  applyFreeGame();
});
// tombol AUTO Free Game
const autoBtn = document.getElementById('autoFreeGameBtn');
autoBtn.addEventListener('click', () => {
  autoFreeGameOn = !autoFreeGameOn;
  localStorage.setItem('autoFreeGameOn918kiss', autoFreeGameOn ? '1' : '0');
  updateAutoFreeGameButtonUI();
});
// ✅ tombol AUTO AddScore
document.getElementById("autoAddScoreBtn")?.addEventListener("click", () => {
  autoAddScoreOn = !autoAddScoreOn;
  localStorage.setItem("autoAddScoreOn918kiss", autoAddScoreOn ? "1" : "0");
  updateAutoAddScoreButtonUI();
});
function generateLog() {
  const game = document.getElementById("gameSelect").value;
  const bet = parseFloat(document.getElementById("betSelect").value);
  const pecahanSelect = document.getElementById("pecahanSelect");
  const selectedPecahan = parseFloat(pecahanSelect.value);
  const tbody = document.querySelector("#gameLog tbody");
  const manualTimeInput = document.getElementById('manualTime').value;

  let logs = [];

  // --- urus masa base ---
  const manualInput = manualTimeInput.trim();
  let baseTime;

  if (manualInput) {
    const parts = manualInput.includes("T")
      ? manualInput.split("T")
      : manualInput.split(" ");

    if (parts.length === 2) {
      const [datePart, timePartRaw] = parts;
      const [year, month, day] = datePart.split("-").map(Number);
      const timePart = timePartRaw.trim();
      const timeParts = timePart.split(":").map(Number);
      const hour = timeParts[0] || 0;
      const minute = timeParts[1] || 0;
      const second = timeParts[2] || 0;
      baseTime = new Date(year, month - 1, day, hour, minute, second);
    } else {
      baseTime = new Date();
    }
  } else if (globalTime) {
    const parts = globalTime.split(" ");
    if (parts.length === 2) {
      const [datePart, timePart] = parts;
      const [year, month, day] = datePart.split("-").map(Number);
      const [hour, minute, second] = timePart.split(":").map(Number);
      baseTime = new Date(year, month - 1, day, hour, minute, second);
    } else {
      baseTime = new Date();
    }
  } else {
    baseTime = new Date();
  }

  // mundurkan masa supaya row pertama tak sama dengan manualTime
  baseTime.setSeconds(baseTime.getSeconds() - (11 * 4));

  const manualScore = parseFloat(document.getElementById("manualScore").value) || 0;
  let balance = rnd(500, 1000) + manualScore;

  let totalSeconds = 0;
  for (let i = 0; i < 10; i++) {
    const gap = Math.floor(Math.random() * 3) + 3;
    totalSeconds += gap;

    const beginMoney = balance;
    const win = Math.random() > 0.7 ? rnd(0, selectedPecahan) : 0.00;
    const endMoney = parseFloat((beginMoney - bet + win).toFixed(2));
    const formattedTime = formatDateTimeLocal(baseTime);

    logs.unshift({
      game,
      tableID: `<span class="table-id-highlight">0</span>`,
      bet: bet.toFixed(2),
      win: win.toFixed(2),
      beginMoney: beginMoney.toFixed(2),
      endMoney: endMoney.toFixed(2),
      dateTime: formattedTime
    });

    balance = endMoney;
    baseTime.setSeconds(baseTime.getSeconds() + Math.floor(Math.random() * 3 + 3));
  }

  // ========== SET SCORE (baris atas) ==========
  const setScoreMoney = logs[0].endMoney;
  let setScoreTime = new Date(logs[0].dateTime);
  const extraSeconds = [2, 3, 4, 6, 8, 9, 10, 13, 15, 18, 20, 21, 23, 24];
  const randomOffset = extraSeconds[Math.floor(Math.random() * extraSeconds.length)];
  setScoreTime.setSeconds(setScoreTime.getSeconds() + randomOffset);

  let rows = `
    <tr class="set-score-row">
      <td>-</td>
      <td class="setscore">Set score：${(-Math.abs(parseFloat(setScoreMoney))).toFixed(2)}</td>
      <td class="negatif">-</td>
      <td class="negatif">-</td>
      <td>${(Math.abs(parseFloat(setScoreMoney))).toFixed(2)}</td>
      <td>0.00</td>
      <td>${formatDateTimeLocal(setScoreTime)}</td>
    </tr>
  `;

  logs.forEach(log => {
    rows += `
      <tr class="log-row">
        <td>${log.game}</td>
        <td>${log.tableID}</td>
        <td class="bet-cell" data-base-bet="${log.bet}" data-bet="${log.bet}">${log.bet}</td>
        <td class="win-cell" data-original-win="${log.win}">${log.win}</td>
        <td>${log.beginMoney}</td>
        <td>${log.endMoney}</td>
        <td>${log.dateTime}</td>
      </tr>
    `;
  });

  // masukkan semua row ke table
  tbody.innerHTML = rows;

  // ==========================
  //  FREE GAME + AUTO LOGIC
  // ==========================
  const fgInputEl = document.getElementById('freeGameInput');

  if (autoFreeGameOn) {
    // AUTO ON → random 1..MAX_FREE_GAME_ROWS
    const randomCount = Math.floor(Math.random() * MAX_FREE_GAME_ROWS) + 1;
    fgInputEl.value = randomCount;
  }

  // apply ke table (tukar bet jadi "Free game" di baris bawah)
  applyFreeGame();
  applyManualScoreAsTopEndMoneyIfOff();
 
  setTimeout(() => {
    const freeGameCount = parseInt((document.getElementById('freeGameInput').value || '0'), 10) || 0;
    const savedData = {
      game,
      bet,
      pecahan: selectedPecahan,
      manualTime: manualTimeInput,
      manualScore: manualScore,
      freeGame: freeGameCount,
      lastWinRowIndex,manualWinAmount: parseFloat(document.getElementById("manualWinInput")?.value || "0") || 0,
      logs: tbody.innerHTML
    };
    localStorage.setItem("gameLogData918kiss", JSON.stringify(savedData));
  }, 50);
}
function addJackpot() {
  const currentGame = document.getElementById("gameSelect").value;
  const jackpotAmount = parseFloat(document.getElementById("manualJackpot").value);

  if (isNaN(jackpotAmount) || jackpotAmount < 0) {
    return;
  }

  const tbody = document.querySelector("#gameLog tbody");
  if (!tbody) return;

  // ---- 1. Buang jackpot lama kalau ada (macam dulu) ----
  let rows = Array.from(tbody.querySelectorAll("tr.log-row"));
  let jackpotRow = tbody.querySelector("tr.set-score-row.jackpot");

  if (jackpotRow) {
    const prevJackpotText = jackpotRow.children[1].textContent;
    const match = prevJackpotText.match(/JackPot：([\d.]+)/);
    if (match) {
      const oldJackpotValue = parseFloat(match[1]);

      const index = Array.from(tbody.children).indexOf(jackpotRow);
      const prevRow = tbody.children[index - 1];
      const oldWin = parseFloat(prevRow.children[3].textContent);

      const newWin = oldWin - oldJackpotValue;
      prevRow.children[3].textContent = newWin.toFixed(2);

      const betCellPrev = prevRow.children[2];
      const betPrev = parseFloat(betCellPrev.dataset.bet || betCellPrev.textContent);
      const beginMoneyPrev = parseFloat(prevRow.children[4].textContent);
      const newEndPrev = beginMoneyPrev - betPrev + newWin;
      prevRow.children[5].textContent = newEndPrev.toFixed(2);
    }

    jackpotRow.remove();
  }

  if (hiddenRow) {
    tbody.appendChild(hiddenRow);
    hiddenRow = null;
  }

  // ---- 2. Cari pasangan 2 baris NORMAL (bukan Free game) ----
  rows = Array.from(tbody.querySelectorAll("tr.log-row"));

  // Kalau betul-betul tak cukup 2 baris log
  if (rows.length < 2) {
    showToast("Jackpot minimal perlukan 2 baris log.", "error");
    return;
  }

  // Senarai index yang valid untuk jackpot:
  // index i akan guna rows[i-1] (prev) & rows[i] (target)
  const candidateIndices = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const prevRow = rows[i - 1];

    const betCell = row.querySelector(".bet-cell");
    const prevBetCell = prevRow.querySelector(".bet-cell");

    const isFree = betCell && betCell.textContent.trim().toLowerCase() === "free game";
    const isPrevFree = prevBetCell && prevBetCell.textContent.trim().toLowerCase() === "free game";

    // Hanya ambil kalau DUA-DUA bukan free game
    if (!isFree && !isPrevFree) {
      candidateIndices.push(i);
    }
  }

  // Kalau tak ada sepasang baris normal → tak boleh buat jackpot
  if (candidateIndices.length === 0) {
    showToast("Jackpot hanya boleh dibuat di luar Free game.\nSila pastikan ada sekurang-kurangnya 2 baris normal untuk jackpot.", "info");
    return;
  }

  // Pilih salah satu index dari calon di atas
  const randomIndex = candidateIndices[Math.floor(Math.random() * candidateIndices.length)];
  const targetRow = rows[randomIndex];
  const prevRow = rows[randomIndex - 1];

  // ---- 3. Update win & endMoney untuk prevRow (jackpot kena di sini) ----
  const oldWin = parseFloat(prevRow.children[3].textContent);
  const newWin = oldWin + jackpotAmount;
  prevRow.children[3].textContent = newWin.toFixed(2);

  const beginMoney = parseFloat(prevRow.children[4].textContent);
  const betCell = prevRow.children[2];
  const bet = parseFloat(betCell.dataset.bet || betCell.textContent);
  const newEnd = beginMoney - bet + newWin;
  prevRow.children[5].textContent = newEnd.toFixed(2);

  const dateTime = prevRow.children[6].textContent;
  const gameName = prevRow.children[0].textContent;

  // ---- 4. Sisipkan baris Jackpot di antara prevRow & targetRow ----
  const newJackpotRow = document.createElement("tr");
  newJackpotRow.classList.add("set-score-row", "jackpot");
  newJackpotRow.innerHTML = `
    <td>${gameName}</td>
    <td class="setscore">JackPot：${jackpotAmount.toFixed(2)}</td>
    <td class="negatif">-</td>
    <td class="negatif">-</td>
    <td class="negatif">-</td>
    <td class="negatif">-</td>
    <td>${dateTime}</td>
  `;
  targetRow.insertAdjacentElement("beforebegin", newJackpotRow);

  // ---- 5. Trim maksimum 11 baris (1 setscore + 10 log) macam biasa ----
  const allRows = Array.from(tbody.querySelectorAll("tr.log-row"));
  const specialRows = tbody.querySelectorAll("tr.set-score-row");

  while (allRows.length + specialRows.length > 11) {
    const lastRow = allRows.pop();
    if (lastRow) lastRow.remove();
  }

  const updatedRows = Array.from(tbody.querySelectorAll("tr.log-row"));
  for (let i = updatedRows.length - 1; i > 0; i--) {
    const current = updatedRows[i];
    const prev = updatedRows[i - 1];

    const curEnd = parseFloat(current.children[5].textContent);
    const prevBetCell = prev.children[2];
    const prevBet = parseFloat(prevBetCell.dataset.bet || prevBetCell.textContent);
    const prevWin = parseFloat(prev.children[3].textContent);

    prev.children[4].textContent = curEnd.toFixed(2);
    prev.children[5].textContent = (curEnd - prevBet + prevWin).toFixed(2);
  }

  if (updatedRows.length > 0) {
    const topEndMoney = parseFloat(updatedRows[0].children[5].textContent);
    const setScoreRowTop = tbody.querySelector("tr.set-score-row:not(.jackpot)");
    if (setScoreRowTop) {
      const scoreCell = setScoreRowTop.children[1];
      scoreCell.textContent = `Set score：${(-Math.abs(topEndMoney)).toFixed(2)}`;
    }
  }

  jackpotInsertedMap[currentGame] = true;
  localStorage.setItem("jackpotInsertedMap", JSON.stringify(jackpotInsertedMap));

  // Re-apply Free game selepas struktur row berubah
  applyFreeGame();
}
function addManualSetScore() {
  const inputScore = parseFloat(document.getElementById("manualScoreInput").value);
  if (isNaN(inputScore)) return alert("❌ Nilai tidak sah");

  const tbody = document.querySelector("#gameLog tbody");

  const setScoreNegatifRow = Array.from(tbody.querySelectorAll("tr.set-score-row:not(.jackpot)"))
    .find(row => row.children[1].textContent.includes("-"));
  if (!setScoreNegatifRow) return alert("❌ Baris set score negatif tidak ditemukan!");

  const existingSupportRow = Array.from(tbody.querySelectorAll("tr.set-score-row"))
    .find(row =>
      !row.classList.contains("jackpot") &&
      !row.children[1].textContent.includes("-") &&
      row !== setScoreNegatifRow
    );

  const endMoneyNegatif = parseFloat(setScoreNegatifRow.children[5].textContent);
  const beginMoney = endMoneyNegatif;
  const endMoneyBaru = (beginMoney + inputScore).toFixed(2);
  const setScoreDisplay = inputScore.toFixed(2); // Hanya nilai support, tidak tambah pecahan

  // Waktu baru
  const belowTimeText = setScoreNegatifRow.children[6].textContent.trim();
  const belowDate = new Date(belowTimeText.replace(" ", "T"));
  const randomSeconds = Math.floor(Math.random() * 4) + 4;
  const newTime = new Date(belowDate.getTime() + randomSeconds * 1000);
  const formatted = formatDateTimeLocal(newTime);

  if (existingSupportRow) {
    existingSupportRow.children[1].textContent = `Set score：${setScoreDisplay}`;
    existingSupportRow.children[4].textContent = beginMoney.toFixed(2);
    existingSupportRow.children[5].textContent = endMoneyBaru;
    existingSupportRow.children[6].textContent = formatted;
  } else {
    const newRow = document.createElement("tr");
    newRow.classList.add("set-score-row");
    newRow.innerHTML = `
      <td>-</td>
      <td class="setscore">Set score：${setScoreDisplay}</td>
      <td class="negatif">-</td>
      <td class="negatif">-</td>
      <td>${beginMoney.toFixed(2)}</td>
      <td>${endMoneyBaru}</td>
      <td>${formatted}</td>
    `;
    tbody.insertBefore(newRow, setScoreNegatifRow);
  }

  const allRows = Array.from(tbody.querySelectorAll("tr"));
  if (allRows.length > 11) {
    allRows[allRows.length - 1].remove();
  }

  document.getElementById("manualScoreInput").value = "";
}
function updateSelectPlaceholderColor(select) {
  if (!select) return;

  if (!select.value) {
    select.classList.add("placeholder-select");
    select.classList.remove("has-value");
  } else {
    select.classList.remove("placeholder-select");
    select.classList.add("has-value");
  }
}

["gameSelect", "betSelect", "pecahanSelect"].forEach(id => {
  const el = document.getElementById(id);
  if (!el) return;

  updateSelectPlaceholderColor(el);
  el.addEventListener("change", function () {
    updateSelectPlaceholderColor(el);
  });
});
function resetSelectToPlaceholder(selectId, placeholderText, disable = false) {
  const select = document.getElementById(selectId);
  if (!select) return;

  select.innerHTML = `<option value="" disabled selected hidden>${placeholderText}</option>`;
  select.value = "";
  select.disabled = disable;
}
function resetLog() {
  localStorage.removeItem("gameLogData918kiss");
  localStorage.removeItem("jackpotInsertedMap");
  jackpotInsertedMap = {};

  const gameSelect = document.getElementById("gameSelect");
  const tbody = document.querySelector("#gameLog tbody");

  // reset game select + refresh custom select label
  if (gameSelect) {
    gameSelect.selectedIndex = 0;
    gameSelect.value = "";
    gameSelect.dispatchEvent(new Event("change", { bubbles: true }));
  }

  // reset dropdown lain ke placeholder
  resetSelectToPlaceholder("betSelect", "Select Bet", false);
  resetSelectToPlaceholder("pecahanSelect", "Select Win", false);
  if (gameCS) gameCS.refresh();
  if (betCS) betCS.refresh();
  if (winCS) winCS.refresh();
  // reset semua input
  const idsToClear = [
    "manualTime",
    "manualScore",
    "manualJackpot",
    "manualScoreInput",
    "manualWinInput",
    "freeGameInput"
  ];

  idsToClear.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });

  // kosongkan table
  if (tbody) tbody.innerHTML = "";

  // reset AUTO Free Game
  localStorage.removeItem("autoFreeGameOn918kiss");
  autoFreeGameOn = false;
  updateAutoFreeGameButtonUI();

  // reset AUTO AddScore
  localStorage.removeItem("autoAddScoreOn918kiss");
  autoAddScoreOn = true;
  updateAutoAddScoreButtonUI();

  // reset state lain
  lastWinRowIndex = null;
  manualWinAmount = 0;
}

window.addEventListener("DOMContentLoaded", () => {
  const savedAuto = localStorage.getItem('autoFreeGameOn918kiss');
  autoFreeGameOn = (savedAuto === '1');
  updateAutoFreeGameButtonUI();

  const savedAutoAdd = localStorage.getItem("autoAddScoreOn918kiss");
  autoAddScoreOn = (savedAutoAdd !== "0");
  updateAutoAddScoreButtonUI();

  const saved = localStorage.getItem("gameLogData918kiss");
  if (!saved) return;

  const data = JSON.parse(saved);

  if (typeof data.lastWinRowIndex === "number") lastWinRowIndex = data.lastWinRowIndex;

  if (typeof data.manualWinAmount === "number") {
    const winInput = document.getElementById("manualWinInput");
    if (winInput) winInput.value = Number(data.manualWinAmount) > 0 ? data.manualWinAmount : "";
  }

  document.getElementById("gameSelect").value = data.game || "";
  document.getElementById("manualTime").value = data.manualTime || "";
  document.getElementById("manualScore").value = Number(data.manualScore) > 0 ? data.manualScore : "";

  if (typeof data.freeGame !== "undefined") {
    document.getElementById("freeGameInput").value = Number(data.freeGame) > 0 ? data.freeGame : "";
  }

  // restore game dulu
  document.getElementById("gameSelect").dispatchEvent(new Event("change", { bubbles: true }));
  if (gameCS) gameCS.refresh();

  setTimeout(() => {
    const betSelect = document.getElementById("betSelect");
    if (data.bet !== undefined && data.bet !== "") {
      betSelect.value = String(data.bet);
      betSelect.dispatchEvent(new Event("change", { bubbles: true }));
    }
    if (betCS) betCS.refresh();

    setTimeout(() => {
      const pecahanSelect = document.getElementById("pecahanSelect");
      if (data.pecahan !== undefined && data.pecahan !== "") {
        pecahanSelect.value = String(data.pecahan);
      }
      if (winCS) winCS.refresh();

      saveCurrentSelectionOnly();
    }, 80);
  }, 80);

  document.querySelector("#gameLog tbody").innerHTML = data.logs || "";
  applyFreeGame();
});
function showToast(message, type = "success") {
  const icons = {
    success: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M7 12l3 3 7-7" stroke-linecap="round" stroke-linejoin="round"></path>
      </svg>`,
    error: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M9 9l6 6M15 9l-6 6" stroke-linecap="round"></path>
      </svg>`,
    info: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M12 8h.01M11 11h2v5h-2" stroke-linecap="round"></path>
      </svg>`
  };

  const el = document.createElement("div");
  el.className = `toast ${type}`;            // << Kelas tentukan warna ikon
  el.setAttribute("role", "status");
  el.setAttribute("aria-live", "polite");

  el.innerHTML = `
    <span class="icon">${icons[type] || icons.success}</span>
    <span class="msg" style="margin-left:6px;">${message}</span>
    <span class="close" aria-label="Close" title="Close">&times;</span>
  `;

  document.body.appendChild(el);
  requestAnimationFrame(() => el.classList.add("show"));

  el.querySelector(".close").addEventListener("click", () => {
    el.classList.remove("show");
    setTimeout(() => el.remove(), 350);
  });

  setTimeout(() => {
    el.classList.remove("show");
    setTimeout(() => el.remove(), 350);
  }, 3500);
}

function recalcBalancesForLogRowsOnly() {
  const tbody = document.querySelector("#gameLog tbody");
  if (!tbody) return;

  const rows = Array.from(tbody.querySelectorAll("tr.log-row"));
  if (!rows.length) return;

  // dari bawah ke atas: Begin row atas ikut End row bawah
  for (let i = rows.length - 1; i >= 0; i--) {
    const row = rows[i];

    const betCell = row.querySelector(".bet-cell");
    const isFree = betCell && betCell.textContent.trim().toLowerCase() === "free game";

    const bet = isFree ? 0 : (parseFloat(betCell?.dataset.bet || betCell?.textContent) || 0);
    const win = parseFloat(row.children[3].textContent) || 0;

    let begin;
    if (i === rows.length - 1) {
      begin = parseFloat(row.children[4].textContent) || 0;
    } else {
      begin = parseFloat(rows[i + 1].children[5].textContent) || 0;
      row.children[4].textContent = begin.toFixed(2);
    }

    const end = begin - bet + win;
    row.children[5].textContent = end.toFixed(2);
  }

  // update Set score negatif ikut EndMoney baris log paling atas
  const setScoreRowTop = tbody.querySelector("tr.set-score-row:not(.jackpot)");
  if (setScoreRowTop && rows.length > 0) {
    const topEndMoney = parseFloat(rows[0].children[5].textContent) || 0;
    setScoreRowTop.children[1].textContent = `Set score：${(-Math.abs(topEndMoney)).toFixed(2)}`;
    setScoreRowTop.children[4].textContent = Math.abs(topEndMoney).toFixed(2);
    setScoreRowTop.children[5].textContent = "0.00";
  }
}

function applyManualScoreAsTopEndMoneyIfOff() {
  if (autoAddScoreOn) return; // AUTO ON = guna cara biasa

  const desired = parseFloat(document.getElementById("manualScore")?.value || "0");
  if (!isFinite(desired)) return;

  const tbody = document.querySelector("#gameLog tbody");
  if (!tbody) return;

  const rows = Array.from(tbody.querySelectorAll("tr.log-row"));
  if (!rows.length) return;

  const topEnd = parseFloat(rows[0].children[5].textContent) || 0;
  const delta = desired - topEnd;

  // shift semua begin/end (randomness masih sama, cuma shift balance)
  for (const r of rows) {
    const b = parseFloat(r.children[4].textContent) || 0;
    const e = parseFloat(r.children[5].textContent) || 0;
    r.children[4].textContent = (b + delta).toFixed(2);
    r.children[5].textContent = (e + delta).toFixed(2);
  }

  // update Set score row ikut top end
  const setScoreRowTop = tbody.querySelector("tr.set-score-row:not(.jackpot)");
if (setScoreRowTop) {
  const newTopEnd = parseFloat(rows[0].children[5].textContent) || 0;
  setScoreRowTop.children[1].textContent =
    `Set score：${(-Math.abs(newTopEnd)).toFixed(2)}`;
  const desired2 = parseFloat(document.getElementById("manualScore")?.value || "0");
  setScoreRowTop.children[4].textContent = (isFinite(desired2) ? desired2 : 0).toFixed(2);
  setScoreRowTop.children[5].textContent = "0.00";
 }
}
function setRandomWin() {
  const amount = parseFloat(document.getElementById("manualWinInput").value);
  if (isNaN(amount) || amount < 0) {
    showToast("This amount not valid!", "error");
    return;
  }

  const tbody = document.querySelector("#gameLog tbody");
  if (!tbody) return;

  const rows = Array.from(tbody.querySelectorAll("tr.log-row"));
  if (rows.length !== 10) {
    showToast("Please click change make new!", "info");
    return;
  }

  // ✅ candidates: semua row (kalau kau nak exclude free game, boleh tambah check kat sini)
  const candidates = rows.map((_, idx) => idx);
  if (!candidates.length) {
    showToast("Rows not availabe!", "info");
    return;
  }

  // ✅ 1) Restore win row lama balik ke asal (contoh 200.00)
  if (lastWinRowIndex >= 0 && rows[lastWinRowIndex]) {
    const prevRow = rows[lastWinRowIndex];
    const prevWinCell = prevRow.querySelector(".win-cell");
    if (prevWinCell) {
      const original = parseFloat(prevWinCell.dataset.originalWin || "0") || 0;
      prevWinCell.textContent = original.toFixed(2);
    } else {
      // fallback kalau win-cell tak jumpa
      prevRow.children[3].textContent = "0.00";
    }
  }

  // ✅ 2) Pick row baru (elak pick sama kalau boleh)
  let pick = candidates[Math.floor(Math.random() * candidates.length)];
  if (candidates.length > 1 && pick === lastWinRowIndex) {
    pick = candidates[(candidates.indexOf(pick) + 1) % candidates.length];
  }

  // ✅ 3) Set win amount di row baru (contoh 1000.00)
  const winCell = rows[pick].querySelector(".win-cell");
  if (winCell) {
    winCell.textContent = amount.toFixed(2);
  } else {
    rows[pick].children[3].textContent = amount.toFixed(2);
  }

  lastWinRowIndex = pick;

  // ✅ 4) Recalc balance
  recalcBalancesForLogRowsOnly();

  // ✅ 5) Save ke localStorage
  setTimeout(() => {
    const saved = localStorage.getItem("gameLogData918kiss");
    if (!saved) return;
    try {
      const data = JSON.parse(saved);
      data.logs = tbody.innerHTML;
      data.lastWinRowIndex = lastWinRowIndex;
      data.manualWinAmount = amount;
      localStorage.setItem("gameLogData918kiss", JSON.stringify(data));
    } catch (e) {}
  }, 50);

  showToast(`Win ${amount.toFixed(2)} Has change other rows`, "success");
}
function copyGameLogImage() {
  const gameLogTable = document.getElementById("gameLog");
  if (!gameLogTable) {
    showToast("Table #gameLog tidak ditemui", "error");
    return;
  }

  gameLogTable.classList.add("screenshot-mode");

  html2canvas(gameLogTable, { scale: 2, useCORS: true }).then(async (canvas) => {
    gameLogTable.classList.remove("screenshot-mode");

    try {
      // Cuba copy PNG terus ke clipboard
      if (!navigator.clipboard || !window.ClipboardItem) throw new Error("Clipboard API tidak tersedia");

      await new Promise((resolve, reject) => {
        canvas.toBlob(async (blob) => {
          if (!blob) return reject(new Error("Gagal buat blob"));
          try {
            await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
            resolve();
          } catch (err) { reject(err); }
        }, "image/png");
      });

      showToast("Image copied to clipboard", "success");
      return;

    } catch (err) {
      // Fallback: hantar base64 ke parent
      const dataURL = canvas.toDataURL("image/png");
      window.parent.postMessage(
        { action: "copy-image-base64", base64: dataURL },
        "https://5g88-main.vercel.app/"
      );
      showToast("Image sent to parent (fallback)", "info");
      // (Opsional) console.error(err);
    }
  });
}
document.addEventListener("keydown", function(e) {
  if (e.ctrlKey && e.key.toLowerCase() === "c") {
    e.preventDefault();
    copyGameLogImage();
  }
});
document.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", () => {
      btn.classList.remove("clicked");   // reset animasi
      void btn.offsetWidth;              // trick restart animasi
      btn.classList.add("clicked");
    });
  });
(function () {
  const THEME_KEY = "siteTheme";

  function applyChildTheme(theme) {
    document.body.classList.remove("light-theme", "dark-theme");
    document.body.classList.add(theme === "light" ? "light-theme" : "dark-theme");
  }

  applyChildTheme(localStorage.getItem(THEME_KEY) === "dark" ? "dark" : "light");

  window.addEventListener("message", function (e) {
    const allowedOrigins = [
      "https://5g88-main.vercel.app",
      "https://searcfile.github.io"
    ];
    if (!allowedOrigins.includes(e.origin)) return;

    const data = e.data || {};
    if (data.type === "theme-change") {
      const theme = data.theme === "dark" ? "dark" : "light";
      localStorage.setItem(THEME_KEY, theme);
      applyChildTheme(theme);
    }
  });
})();

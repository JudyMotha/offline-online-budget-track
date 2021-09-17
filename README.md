# offline-online-budget-track
* The main concept is  about storing expense transactions online -offline ;The mongo DB here is budget and its table is  transactions.When you add and subract funds with app online the entries move into mongo DB ;When you go offline(SW) and make transactions they take the place in indexedDB storage  and not Atlas MongoDB;Once you uncheck offline mode and make an online transaction all recent offline and online transactions moved in Atlas Mongo DB .The offline and online transactions are captured in  cache too
* Challenges -including local host  ,Heroku deployment,Service workerissues  where Stackoverflow and other google search /forums helped.
* Thanks to my tutor Alexis San Javier for helping me with HW especially when GHcode changes  would not get get deployed to Heroku;Helping me with concepts of multiple times deleting cache and  various storages/dropping collections  ,unregistering  service worker to make deployment/HW work.A Big Learning for me here
* Budget icons have a  warning message .Instead of 2 cache files -sometimes the heroku shows one consolidated holding the transactions together (toggle). Still under work

* Deployed GH https://github.com/JudyMotha/offline-online-budget-track
* DEployed Heroku link  https://secure-garden-58881.herokuapp.com/
<img src="./BTRacker.gif">

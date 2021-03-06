# Cмарт контракт для приема пожертвований в виде нативной валюты (ETH, BNB,MATIC...)

### Функции контракта
- Прием пожертвований;
- Функция вывода любой суммы на любой адрес. Функция может быть вызвана только владельцем контракта;
- Функция возврата списока всех пользователей когда либо вносивших пожертвование;
- Функция позволяющая получить общую сумму всех пожертвований для определённого адреса.


### Юнит тесты  в Donation.js (npx hardhat test)
- Проверка, что контракт задеплоен;
- Проверка, что контракт создан владельцем;
- Проверка функции позволяющей получить общую сумму всех пожертвований для определённого адреса;
- Проверка функции, которая возвращает список всех пользователей когда либо вносивших пожертвование;
- Проверка, что только владелец может вывести денежные средства;
- Проверка, что баланс контракта равен сумме взносов.

### Сформированные tasks для сети rinkeby:
- Внести пожертвование:
```
npx hardhat dDonation --address <Contract address> --network rinkeby
```
- Вывести деньги на определенный адрес в определенном количестве:
```
npx hardhat dWithdraw --address <Contract address> --dest <user address destination> --money <0.001ETH> --network rinkeby

```
- Получить список пожертвователей:
```
 npx hardhat dGetUsers --address <Contract address>  --network rinkeby
```
- Получить сумму пожертвователей для заданного пользователя:
```
npx hardhat dGetBalance --address <Contract address> --user <Address user> --network rinkeby
```


+ Контракт в сети Rinkeby: https://rinkeby.etherscan.io/address/0x19D9378f39800F2382Cc009340523EEec8AA1dd5
+ Пример отработки test и tasks: http://prntscr.com/26m1hxc



const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

describe.only("Checking donation contract", function () {
  let donation;

  let owner;
  let addr1;
  let addr2;
  let addrs;
  // создаём экземпляры контракта
  beforeEach(async () => {
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    const Donation = await ethers.getContractFactory("Donation");
    donation = await Donation.deploy();
    await donation.deployed();
  });

  describe("Deployment", function () {

    // проверка, что контракт задеплоен
    it('Check! a contract is deployed', () => { 
      //console.log("contract address = '%s'", donation.address);
      assert(donation.address);
    });

    // проверка, что контракт создан овнером
    it("Check! contract creater is an owner", async function () {
      expect(await donation.Owner()).to.equal(owner.address);
    });
  });

  describe("Get functions", function () {
    it("getBelance(_donor)", async function () {
      //- В контракте имеется view функция позволяющая получить общую сумму всех пожертвований для определённого адреса
      tx_donation = {
        to: donation.address,
        value: ethers.utils.parseEther("1.25")
      }

      await owner.sendTransaction(tx_donation)
      await addr1.sendTransaction(tx_donation)

      // Проверяем количество пожертвований овнером для пользователя addr1
      expect(await donation.connect(owner).getBelance(addr1.address)).to.equal(await ethers.utils.parseEther("1.25"));

      // Проверяем количество пожертвований НЕ ОВНЕРОМ
      expect(await donation.connect(addr1).getBelance(owner.address)).to.equal(await ethers.utils.parseEther("1.25"));
    });

    it("getAllDonors()", async function () {
    // - В контракте имеется view функция, которая возвращает список всех пользователей когда либо вносивших пожертвование. В списке не должно быть повторяющихся элементов
      tx_donation = {
        to: donation.address,
        value: ethers.utils.parseEther("1.25")
      }

      await owner.sendTransaction(tx_donation)
      await addr1.sendTransaction(tx_donation)
      await addr2.sendTransaction(tx_donation)

      // повторные взносы чтобы убедиться что нет дублей пользователей
      await addr1.sendTransaction(tx_donation)
      await owner.sendTransaction(tx_donation)


      // три пользователя внесли пожертвования ?
      expect(await donation.connect(addr1).getAllDonors()).to.have.lengthOf(3);

      // Пользователи owner addr1 и addr2 ?
      expect(await donation.connect(addr1).getAllDonors()).to.deep.equal([
        owner.address,
        addr1.address,
        addr2.address
      ]);

    });
  });
  describe("Transactions", function () {
    // баланс контракта равен пожертвованиям?
    it("Check! balance of contract is equal donations", async function () {
      
      tx_donation = {
        to: donation.address,
        value: ethers.utils.parseEther("1.25")
      }

      await owner.sendTransaction(tx_donation)
      await addr1.sendTransaction(tx_donation)
      await addr2.sendTransaction(tx_donation)
      await addr2.sendTransaction(tx_donation)
    

    //  console.log("contract='%s'; donations summ='%s'",await ethers.provider.getBalance(donation.address),await ethers.utils.parseEther("5.0"));
      
      expect(await ethers.provider.getBalance(donation.address)).to.equal(await ethers.utils.parseEther("5.0"));
    });

    // проверка, что только овнер может вывести средства на любой адрес
    it("Checking that only owner can withdraw donations", async function () {

      tx_donation = {
        to: donation.address,
        value: ethers.utils.parseEther("0.1")
      }

      await owner.sendTransaction(tx_donation)
      await addr1.sendTransaction(tx_donation)

      // выводим овнером из контрака 0.1 -> addr1
      await donation.connect(owner).withdrawDonation(ethers.utils.parseEther("0.1"),addr1.address);

      // Теперь в контракте должно быть 0.1
      expect(await ethers.provider.getBalance(donation.address)).to.equal(await ethers.utils.parseEther("0.1"));

      // Попытаемся вывести больше чем возможно. Должно вернуться "Not enough money ("
      await expect(
        donation.connect(owner).withdrawDonation(ethers.utils.parseEther("1.00"),addr1.address
        )).to.be.revertedWith("Not enough money (");

      // Попытаемся с addr1 вызвать функцию вывода. Должно вернуться "Permission denied"
      await expect(
        donation.connect(addr1).withdrawDonation(ethers.utils.parseEther("0.1"),addr1.address
        )).to.be.revertedWith("Permission denied");
    });
  });

});
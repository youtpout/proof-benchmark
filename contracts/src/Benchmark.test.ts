import { AccountUpdate, CircuitString, Field, Mina, PrivateKey, PublicKey, UInt64 } from 'o1js';
import { Benchmark } from './Benchmark';
import { ComputerInfo, ComputerProof, computerProof } from './ComputerProof';

/*
 * This file specifies how to test the `Add` example smart contract. It is safe to delete this file and replace
 * with your own tests.
 *
 * See https://docs.minaprotocol.com/zkapps for more info.
 */

const proofsEnabled = true;

describe('Benchmark', () => {
  let deployerAccount: Mina.TestPublicKey,
    deployerKey: PrivateKey,
    senderAccount: Mina.TestPublicKey,
    senderKey: PrivateKey,
    zkAppAddress: PublicKey,
    zkAppPrivateKey: PrivateKey,
    zkApp: Benchmark;

  beforeAll(async () => {
    if (proofsEnabled) {
      await computerProof.compile();
      //await Benchmark.compile();
    }
  });

  beforeEach(async () => {
    const Local = await Mina.LocalBlockchain({ proofsEnabled });
    Mina.setActiveInstance(Local);
    [deployerAccount, senderAccount] = Local.testAccounts;
    deployerKey = deployerAccount.key;
    senderKey = senderAccount.key;

    zkAppPrivateKey = PrivateKey.random();
    zkAppAddress = zkAppPrivateKey.toPublicKey();
    zkApp = new Benchmark(zkAppAddress);

    //await localDeploy();
  });

  async function localDeploy() {
    const txn = await Mina.transaction(deployerAccount, async () => {
      AccountUpdate.fundNewAccount(deployerAccount);
      await zkApp.deploy();
    });
    await txn.prove();
    // this tx needs .sign(), because `deploy()` adds an account update that requires signature authorization
    await txn.sign([deployerKey, zkAppPrivateKey]).send();
  }

  it('create benchmark', async () => {
    const time = Date.now();
    const computerInfo = new ComputerInfo(CircuitString.fromString("Macbook pro M1"),
      CircuitString.fromString("M1 8 core"),
      CircuitString.fromString("Macos"),
      CircuitString.fromString("Safari"),
      UInt64.from(8));
    const proof = await computerProof.bench(computerInfo);
    const timeEnd = Date.now();
    const dif = UInt64.from(timeEnd - time);
    const pProof = new ComputerProof(proof.proof);
    console.log(dif.toBigInt());

    // const txn = await Mina.transaction(senderAccount, async () => {
    //   await zkApp.addBenchmark(proof.proof, dif);
    // });
    // await txn.prove();
    // await txn.sign([senderKey]).send();
  });


});

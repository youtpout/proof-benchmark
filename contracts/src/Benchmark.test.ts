import { AccountUpdate, CircuitString, Field, Mina, PrivateKey, PublicKey, UInt64, Cache } from 'o1js';
import { Add } from './Add';

/*
 * This file specifies how to test the `Add` example smart contract. It is safe to delete this file and replace
 * with your own tests.
 *
 * See https://docs.minaprotocol.com/zkapps for more info.
 */

const proofsEnabled = true;

describe('Benchmark', () => {

  beforeAll(async () => {
    if (proofsEnabled) {
      const cache = Cache.FileSystem("cache");
      await Add.compile({ cache });
    }
  });


  it('add benchmark', async () => {
    console.time("add");
    const { proof: proof0 } = await Add.init(Field(0));
    const { proof: proof1 } = await Add.addNumber(Field(4), proof0, Field(4));
    const { proof: proof2 } = await Add.add(Field(4), proof1, proof0);
    console.timeEnd("add");
  });



});
